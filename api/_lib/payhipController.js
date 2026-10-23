/**
 * payhipController.js — Payhip Webhook Handler & Account Linking
 *
 * Implements Payhip's official webhook specification:
 * - Signature verification: SHA-256 of PAYHIP_API_KEY compared to payload.signature
 * - Handles 'paid' events: grants access, creates/links user account, streams confirmation
 * - Handles 'refunded' events: revokes access immediately
 * - Idempotent processing ensures retries do not create duplicate records
 * - Secure account claim workflow for users whose Payhip email differs from their website account
 */

const crypto = require("crypto");
const supabase = require("../config/supabaseClient");
const { verifyPayhipSignature, mapPayhipProductToBook } = require("../utils/payhipVerifier");
const { sendOrderConfirmationEmail, sendEmail } = require("../utils/orderEmail");
const { ensureCustomerAccount } = require("../utils/customerAuth");
const { saveOrderMetadata, getOrderMetadata, findOrderMetadataByToken } = require("../utils/orderStore");
require("dotenv").config();

// In-memory store for pending account claim verification codes (15-minute TTL)
const pendingClaims = new Map();

// Helper to execute DB operations safely against schema cache limitations
async function executeWithSchemaFallback(operationFn, payload) {
  let currentPayload = { ...payload };
  while (true) {
    const res = await operationFn(currentPayload);
    if (!res.error) return res;

    const match = res.error.message?.match(/Could not find the '([^']+)' column/i) ||
                  res.error.message?.match(/column ['"]?([a-zA-Z0-9_]+)['"]? of ['"]?orders['"]? does not exist/i) ||
                  res.error.message?.match(/column ['"]?([a-zA-Z0-9_]+)['"]? does not exist/i) ||
                  res.error.message?.match(/Could not find the column '([^']+)'/i);

    if (match && match[1] && Object.prototype.hasOwnProperty.call(currentPayload, match[1])) {
      const badCol = match[1];
      console.warn(`[Payhip] Column '${badCol}' missing in orders schema, omitting and retrying.`);
      delete currentPayload[badCol];
      if (Object.keys(currentPayload).length === 0) return res;
      continue;
    }
    return res;
  }
}

/**
 * POST /api/webhooks/payhip
 * Official Payhip Webhook Endpoint (paid and refunded)
 */
exports.payhipWebhook = async (req, res) => {
  const payload = req.body;

  if (!payload || typeof payload !== "object") {
    return res.status(400).json({ error: "Invalid payload body." });
  }

  // 1. Signature Verification
  const isValid = verifyPayhipSignature(payload, req.headers);
  if (!isValid) {
    console.warn("[payhipWebhook] Webhook signature verification failed.");
    return res.status(400).json({ error: "Invalid webhook signature." });
  }

  const eventType = payload.type;
  const transactionId = String(payload.id || "").trim();
  const buyerEmail = (payload.email || "").trim().toLowerCase();

  console.log(`[payhipWebhook] Verified Payhip event: '${eventType}' (Transaction: ${transactionId})`);

  try {
    // 2. Handle 'paid' event
    if (eventType === "paid") {
      if (!transactionId) {
        return res.status(400).json({ error: "Missing Payhip transaction id." });
      }

      // Idempotency check: see if an order with this payhip_transaction_id already exists and is paid
      const { data: existingDbOrders } = await supabase
        .from("orders")
        .select("*")
        .eq("payhip_transaction_id", transactionId);

      const isAlreadyPaid = (existingDbOrders || []).some(o => o.status === "paid" || o.status === "successful");
      const existingMeta = findOrderMetadataByToken(transactionId);

      if (isAlreadyPaid || (existingMeta && existingMeta.status === "paid")) {
        console.log(`[payhipWebhook] Transaction ${transactionId} already processed. Skipping duplicate.`);
        return res.json({ received: true, idempotent: true });
      }

      const items = Array.isArray(payload.items) && payload.items.length > 0
        ? payload.items
        : [{
            product_id: payload.product_id,
            product_name: payload.product_name || "Marketing Reclassified",
            price: payload.price,
            quantity: 1,
          }];

      const rawPriceCents = Number(payload.price) || 0;
      const currency = (payload.currency || "USD").toUpperCase();
      const totalAmount = (rawPriceCents / 100).toFixed(2);

      // Process items and grant entitlements
      for (const item of items) {
        const mapping = mapPayhipProductToBook(item, payload);
        const orderId = crypto.randomUUID();
        const orderNumber = `ORD-PAYHIP-${transactionId}-${crypto.randomBytes(2).toString("hex").toUpperCase()}`;

        const isOnline = mapping.accessTier === "online";
        const downloadToken = isOnline ? null : crypto.randomBytes(32).toString("hex");
        const expiryHours = 72;
        const expiresAt = isOnline ? null : new Date(Date.now() + expiryHours * 3600 * 1000).toISOString();

        // Ensure user account exists
        let customerUser = null;
        if (buyerEmail) {
          try {
            customerUser = await ensureCustomerAccount({
              email: buyerEmail,
              name: item.customer_name || "Valued Reader",
              editionType: mapping.editionType,
            });
          } catch (accErr) {
            console.warn("[payhipWebhook] ensureCustomerAccount:", accErr.message);
          }
        }

        const orderRecord = {
          id: orderId,
          user_id: customerUser?.id || null,
          email: buyerEmail,
          customer_name: item.customer_name || "Valued Reader",
          product_id: mapping.productId,
          order_number: orderNumber,
          book_name: mapping.title,
          amount: parseFloat(totalAmount),
          currency,
          status: "paid",
          payment_provider: "payhip",
          payhip_transaction_id: transactionId,
          provider_transaction_id: transactionId,
          access_tier: mapping.accessTier,
          is_upgrade: mapping.isUpgrade,
          download_token: downloadToken,
          download_expires_at: expiresAt,
          download_count: 0,
          download_limit: isOnline ? 0 : 3,
          webhook_event_id: transactionId,
          raw_metadata: {
            payhip_payload: {
              id: payload.id,
              ip_address: payload.ip_address,
              payment_type: payload.payment_type,
              items: payload.items,
            }
          }
        };

        saveOrderMetadata(orderId, {
          ...orderRecord,
          orderId,
          payhip_transaction_id: transactionId,
        });

        await executeWithSchemaFallback(
          (dbPayload) => supabase.from("orders").insert([dbPayload]),
          orderRecord
        );

        // Send order confirmation and reader / download access email
        const clientUrl = process.env.CLIENT_URL || "https://siddiqui.digital";
        const downloadUrl = isOnline
          ? `${clientUrl}/my-orders`
          : `${clientUrl}/order-success?provider=payhip&token=${downloadToken}&order_id=${orderId}`;

        if (buyerEmail) {
          sendOrderConfirmationEmail({
            to: buyerEmail,
            customerName: item.customer_name || "Valued Reader",
            orderNumber,
            productName: mapping.title,
            amount: totalAmount,
            currency,
            downloadUrl,
            editionType: mapping.editionType,
            expiryHours,
            downloadLimit: isOnline ? 0 : 3,
          }).catch(emailErr => console.warn("[payhipWebhook] Email delivery notice:", emailErr.message));
        }

        console.log(`[payhipWebhook] Unlocked book '${mapping.title}' for ${buyerEmail} (Order: ${orderNumber})`);
      }

      return res.json({ received: true, success: true });
    }

    // 3. Handle 'refunded' event
    if (eventType === "refunded") {
      if (!transactionId) {
        return res.status(400).json({ error: "Missing Payhip transaction id for refund." });
      }

      console.log(`[payhipWebhook] Processing refund for Payhip transaction: ${transactionId}`);

      const refundPayload = {
        status: "refunded",
        refund_status: "refunded",
        refund_date: new Date().toISOString(),
      };

      // Revoke in Supabase
      await executeWithSchemaFallback(
        (payload) => supabase.from("orders").update(payload).eq("payhip_transaction_id", transactionId),
        refundPayload
      );

      // Revoke in orderStore
      const existingMeta = findOrderMetadataByToken(transactionId);
      if (existingMeta?.orderId) {
        saveOrderMetadata(existingMeta.orderId, {
          ...refundPayload,
          status: "refunded",
        });
      }

      return res.json({ received: true, refunded: true });
    }

    // Unhandled event type (e.g. subscription.created, etc.)
    return res.json({ received: true, unhandled: true });

  } catch (error) {
    console.error("[payhipWebhook] Processing error:", error);
    return res.status(500).json({ error: "Internal webhook processing error." });
  }
};

/**
 * POST /api/payment/claim-payhip-purchase
 * Initiates secure account linking when the Payhip email differs from the website account
 */
exports.claimPayhipPurchase = async (req, res) => {
  const { payhipTransactionId, purchaseEmail, websiteAccountEmail } = req.body;

  if (!payhipTransactionId || !purchaseEmail || !websiteAccountEmail) {
    return res.status(400).json({
      error: "Payhip transaction ID, purchase email, and website account email are required.",
    });
  }

  const cleanTxId = payhipTransactionId.trim();
  const cleanPurchaseEmail = purchaseEmail.trim().toLowerCase();
  const cleanTargetEmail = websiteAccountEmail.trim().toLowerCase();

  try {
    // 1. Verify that order exists for this Payhip transaction & purchase email
    const { data: matchingOrders } = await supabase
      .from("orders")
      .select("*")
      .eq("payhip_transaction_id", cleanTxId)
      .ilike("email", cleanPurchaseEmail);

    const paidOrder = (matchingOrders || []).find(o => o.status === "paid" || o.status === "successful");

    if (!paidOrder) {
      return res.status(404).json({
        error: "No verified paid purchase was found matching this transaction ID and purchase email.",
      });
    }

    // 2. Generate a secure 6-digit confirmation code (15-min validity)
    const claimCode = crypto.randomInt(100000, 999999).toString();
    const claimKey = `${cleanTxId}:${cleanTargetEmail}`;

    pendingClaims.set(claimKey, {
      code: claimCode,
      orderId: paidOrder.id,
      purchaseEmail: cleanPurchaseEmail,
      targetEmail: cleanTargetEmail,
      expiresAt: Date.now() + 15 * 60 * 1000,
    });

    // 3. Send security verification email to the ORIGINAL purchase email
    try {
      if (typeof sendEmail === "function") {
        await sendEmail({
          to: cleanPurchaseEmail,
          subject: "Confirm Linking Your Digital Book Purchase — Siddiqui Digital",
          text: `A request was made to link your Payhip purchase (${paidOrder.book_name}) to the website account ${cleanTargetEmail}.\n\nYour 6-digit confirmation code is: ${claimCode}\n\nThis code expires in 15 minutes. If you did not make this request, please ignore this email.`,
          html: `<p>A request was made to link your Payhip purchase (<strong>${paidOrder.book_name}</strong>) to the website account <strong>${cleanTargetEmail}</strong>.</p><p style="font-size:24px; font-weight:bold; letter-spacing:4px; color:#c80808;">${claimCode}</p><p>This verification code expires in 15 minutes. If you did not request this, you can safely ignore this message.</p>`,
        });
      }
    } catch (emailErr) {
      console.warn("[claimPayhipPurchase] Security email notice:", emailErr.message);
    }

    return res.json({
      success: true,
      message: `A verification code has been sent to ${cleanPurchaseEmail}. Please enter the code to complete account linking.`,
    });

  } catch (err) {
    console.error("[claimPayhipPurchase] Error:", err);
    return res.status(500).json({ error: "Failed to initiate purchase linking." });
  }
};

/**
 * POST /api/payment/confirm-payhip-claim
 * Completes secure account linking upon verification of the 6-digit code
 */
exports.confirmPayhipClaim = async (req, res) => {
  const { payhipTransactionId, websiteAccountEmail, code, targetUserId } = req.body;

  if (!payhipTransactionId || !websiteAccountEmail || !code) {
    return res.status(400).json({ error: "Transaction ID, target account email, and code are required." });
  }

  const cleanTxId = payhipTransactionId.trim();
  const cleanTargetEmail = websiteAccountEmail.trim().toLowerCase();
  const cleanCode = code.trim();
  const claimKey = `${cleanTxId}:${cleanTargetEmail}`;

  const claim = pendingClaims.get(claimKey);

  if (!claim) {
    return res.status(400).json({ error: "No pending claim request found. Please request a new verification code." });
  }

  if (Date.now() > claim.expiresAt) {
    pendingClaims.delete(claimKey);
    return res.status(400).json({ error: "Verification code has expired. Please request a new one." });
  }

  if (claim.code !== cleanCode) {
    return res.status(400).json({ error: "Invalid verification code. Please check and try again." });
  }

  try {
    // Resolve target user in Supabase
    let resolvedUserId = targetUserId || null;
    if (!resolvedUserId) {
      try {
        const userObj = await ensureCustomerAccount({
          email: cleanTargetEmail,
          name: "Valued Reader",
          editionType: "companion",
        });
        if (userObj) resolvedUserId = userObj.id;
      } catch (e) {}
    }

    // Link the order to the target account
    const updatePayload = {
      user_id: resolvedUserId,
      email: cleanTargetEmail,
    };

    await executeWithSchemaFallback(
      (payload) => supabase.from("orders").update(payload).eq("id", claim.orderId),
      updatePayload
    );

    saveOrderMetadata(claim.orderId, {
      ...updatePayload,
      claimedFrom: claim.purchaseEmail,
      claimedAt: new Date().toISOString(),
    });

    pendingClaims.delete(claimKey);

    return res.json({
      success: true,
      message: "Purchase has been successfully linked to your account! Your book is now available in My Orders.",
    });

  } catch (err) {
    console.error("[confirmPayhipClaim] Error:", err);
    return res.status(500).json({ error: "Failed to confirm account claim." });
  }
};
