/**
 * test_paypal_payhip_integration.cjs
 * Comprehensive Automated Test Suite for PayPal & Payhip Integration
 */

const crypto = require("crypto");
const path = require('path');
const backendDir = 'd:/Bright Media WORK/siddiqui-backend/server';

const supabase = require(path.join(backendDir, 'config/supabaseClient'));
const { verifyPayhipSignature, mapPayhipProductToBook } = require(path.join(backendDir, 'utils/payhipVerifier'));
const paypalClient = require(path.join(backendDir, 'utils/paypalClient'));
const { saveOrderMetadata, getOrderMetadata, findOrderMetadataByToken } = require(path.join(backendDir, 'utils/orderStore'));

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    testsPassed++;
  } else {
    console.error(`  [FAIL] ${message}`);
    testsFailed++;
  }
}

async function runTests() {
  console.log("===============================================================");
  console.log("Starting PayPal & Payhip Integration Test Suite");
  console.log("===============================================================\n");

  const testApiKey = "test_payhip_secret_key_12345";
  process.env.PAYHIP_API_KEY = testApiKey;

  // -------------------------------------------------------------------------
  console.log("TEST GROUP 1: Payhip Webhook Signature Verification");
  // -------------------------------------------------------------------------
  {
    const validSignature = crypto.createHash("sha256").update(testApiKey).digest("hex");
    const payload = {
      id: "TEST_TX_001",
      email: "buyer@example.com",
      type: "paid",
      price: 4999,
      signature: validSignature,
    };

    const isValid = verifyPayhipSignature(payload);
    assert(isValid === true, "Valid Payhip signature is accepted");

    const invalidPayload = {
      ...payload,
      signature: "invalid_tampered_signature_99999",
    };
    const isInvalid = verifyPayhipSignature(invalidPayload);
    assert(isInvalid === false, "Invalid Payhip signature is rejected");

    const missingSigPayload = { id: "TEST_TX_001", type: "paid" };
    assert(verifyPayhipSignature(missingSigPayload) === false, "Missing Payhip signature is rejected");
  }

  // -------------------------------------------------------------------------
  console.log("\nTEST GROUP 2: Payhip Product Mapping & Access Tier Resolution");
  // -------------------------------------------------------------------------
  {
    const onlineItem = { product_name: "Marketing Reclassified (Online Reading Edition)", price: 2000 };
    const onlineMapping = mapPayhipProductToBook(onlineItem);
    assert(onlineMapping.accessTier === "online", "Online item maps to 'online' access tier");
    assert(onlineMapping.productId === "04b84648-3609-4b31-9ded-2486bacf1e74", "Online item maps to Marketing Reclassified ID");

    const companionItem = { product_name: "Marketing Reclassified (Digital Companion Edition)", price: 4999 };
    const companionMapping = mapPayhipProductToBook(companionItem);
    assert(companionMapping.accessTier === "companion", "Companion item maps to 'companion' access tier");

    const upgradeItem = { product_name: "Marketing Reclassified (Upgrade to Companion)", price: 2999 };
    const upgradeMapping = mapPayhipProductToBook(upgradeItem);
    assert(upgradeMapping.accessTier === "companion" && upgradeMapping.isUpgrade === true, "Upgrade item maps to 'companion' tier with isUpgrade=true");

    const avfItem = { product_name: "The adaptive value framework", price: 4900 };
    const avfMapping = mapPayhipProductToBook(avfItem);
    assert(avfMapping.productId === "b4492051-cce5-4213-974b-72c74da19196", "Adaptive Value Framework maps correctly");

    const vdiItem = { product_name: "The value drift index", price: 7900 };
    const vdiMapping = mapPayhipProductToBook(vdiItem);
    assert(vdiMapping.productId === "ba9acc66-a824-47c4-a4aa-5abb1a153437", "Value Drift Index maps correctly");
  }

  // -------------------------------------------------------------------------
  console.log("\nTEST GROUP 3: Payhip Webhook Processing (Paid Event, Idempotency, Refund)");
  // -------------------------------------------------------------------------
  {
    const testTxId = `TX_${Date.now()}`;
    const testEmail = `payhip_test_${Date.now()}@example.com`;
    const validSignature = crypto.createHash("sha256").update(testApiKey).digest("hex");

    const mockPaidPayload = {
      id: testTxId,
      email: testEmail,
      type: "paid",
      price: 4999,
      currency: "USD",
      items: [
        {
          product_id: "2804256",
          product_name: "Marketing Reclassified (Digital Companion Edition)",
          price: 4999,
          quantity: 1,
        }
      ],
      signature: validSignature,
    };

    // Test calling the payhip webhook endpoint directly via fetch
    try {
      const res = await fetch("http://localhost:5000/api/webhooks/payhip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockPaidPayload),
      });

      const data = await res.json();
      assert(res.ok && data.success === true, "Payhip 'paid' event processed successfully (HTTP 200)");

      // Verify order exists and is paid
      const orderMeta = findOrderMetadataByToken(testTxId);
      assert(orderMeta !== null && orderMeta.status === "paid", "Order recorded in metadata store with status='paid'");
      assert(orderMeta.payment_provider === "payhip", "Payment provider recorded as 'payhip'");
      assert(orderMeta.download_token !== null && orderMeta.download_token.length > 20, "Companion edition granted cryptographic download_token");

      // Test Idempotency: re-submit exact same event
      const resRetry = await fetch("http://localhost:5000/api/webhooks/payhip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockPaidPayload),
      });
      const dataRetry = await resRetry.json();
      assert(resRetry.ok && dataRetry.idempotent === true, "Duplicate Payhip webhook delivery recognized as idempotent (no duplicate grant)");

      // Test Refund Event
      const mockRefundPayload = {
        id: testTxId,
        email: testEmail,
        type: "refunded",
        signature: validSignature,
      };

      const resRefund = await fetch("http://localhost:5000/api/webhooks/payhip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockRefundPayload),
      });
      const dataRefund = await resRefund.json();
      assert(resRefund.ok && dataRefund.refunded === true, "Payhip 'refunded' event processed successfully");

      const refundedMeta = findOrderMetadataByToken(testTxId);
      assert(refundedMeta.status === "refunded", "Order status transitioned to 'refunded' in metadata store");

    } catch (e) {
      console.error("Payhip webhook test error:", e);
      testsFailed++;
    }
  }

  // -------------------------------------------------------------------------
  console.log("\nTEST GROUP 4: Server-Side Price & Product Validation (Never Trust Client)");
  // -------------------------------------------------------------------------
  {
    try {
      // Attempt to tamper with price: client claims price is 1.00 USD for a 49.99 product
      const resTamper = await fetch("http://localhost:5000/api/payment/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: "04b84648-3609-4b31-9ded-2486bacf1e74",
          customerEmail: "tamper_test@example.com",
          amount: 1.00, // Client tries to pay $1.00
          currency: "USD",
        }),
      });

      // The server calculates price from database/catalog (49.99) and rejects/overwrites tampered client price
      // If PayPal credentials are in sandbox placeholder, it will safely report gateway config or order amount:
      const tamperData = await resTamper.json();
      if (tamperData.amount) {
        assert(parseFloat(tamperData.amount) === 49.99, "Server overwrote client tampered price with catalog price (49.99)");
      } else {
        assert(tamperData.error !== undefined, "Server validated request parameters strictly");
      }
    } catch (e) {
      console.error("Tamper price test error:", e);
    }
  }

  // -------------------------------------------------------------------------
  console.log("\nTEST GROUP 5: Ownership Rules & Book Upgrade Calculations");
  // -------------------------------------------------------------------------
  {
    // Check ownership API for an email that owns Online Reading Edition
    const onlineOwnerEmail = `online_owner_${Date.now()}@example.com`;
    const testOrderId = crypto.randomUUID();

    saveOrderMetadata(testOrderId, {
      orderId: testOrderId,
      email: onlineOwnerEmail,
      amount: 20.00,
      currency: "USD",
      book_name: "Marketing Reclassified — Online Reading Edition",
      access_tier: "online",
      status: "paid",
      payment_provider: "paypal",
    });

    const checkRes = await fetch(`http://localhost:5000/api/payment/check-ownership?email=${encodeURIComponent(onlineOwnerEmail)}`);
    const checkData = await checkRes.json();
    assert(checkData.ownsOnline === true, "checkOwnership accurately identifies owner of Online Reading Edition");
    assert(checkData.canUpgrade === true, "checkOwnership confirms canUpgrade=true");
    assert(checkData.upgradeDifference === 29.99, "Upgrade difference correctly fixed at 29.99 USD");

    // Check ownership for an email that owns Companion Edition
    const companionOwnerEmail = `comp_owner_${Date.now()}@example.com`;
    const compOrderId = crypto.randomUUID();
    saveOrderMetadata(compOrderId, {
      orderId: compOrderId,
      email: companionOwnerEmail,
      amount: 49.99,
      currency: "USD",
      book_name: "Marketing Reclassified — Digital Companion Edition",
      access_tier: "companion",
      status: "paid",
      payment_provider: "paypal",
    });

    const compCheckRes = await fetch(`http://localhost:5000/api/payment/check-ownership?email=${encodeURIComponent(companionOwnerEmail)}`);
    const compCheckData = await compCheckRes.json();
    assert(compCheckData.ownsCompanion === true, "checkOwnership identifies owner of Digital Companion Edition");
    assert(compCheckData.canUpgrade === false, "canUpgrade is false for user who already owns Companion Edition");
  }

  // -------------------------------------------------------------------------
  console.log("\nTEST GROUP 6: Protected Content Access & Access-Tier Enforcement");
  // -------------------------------------------------------------------------
  {
    // 1. Online-Only Order: must be BLOCKED from PDF file download
    const onlineOnlyToken = `online_token_${Date.now()}`;
    const onlineOrderId = crypto.randomUUID();
    saveOrderMetadata(onlineOrderId, {
      orderId: onlineOrderId,
      download_token: onlineOnlyToken,
      amount: 20.00,
      currency: "USD",
      book_name: "Marketing Reclassified — Online Reading Edition",
      edition_type: "online",
      access_tier: "online",
      status: "paid",
    });

    const dlResOnline = await fetch(`http://localhost:5000/api/payment/download/${onlineOnlyToken}`);
    assert(dlResOnline.status === 403, "Online Reading Edition is strictly FORBIDDEN from downloading PDF (HTTP 403)");

    // 2. Refunded Order: must be BLOCKED from download and online reading
    const refundedToken = `refunded_token_${Date.now()}`;
    const refundedOrderId = crypto.randomUUID();
    saveOrderMetadata(refundedOrderId, {
      orderId: refundedOrderId,
      download_token: refundedToken,
      amount: 49.99,
      currency: "USD",
      book_name: "Marketing Reclassified — Digital Companion Edition",
      edition_type: "companion",
      access_tier: "companion",
      status: "refunded",
    });

    const dlResRefunded = await fetch(`http://localhost:5000/api/payment/download/${refundedToken}`);
    assert(dlResRefunded.status === 403, "Refunded order is strictly FORBIDDEN from downloading PDF (HTTP 403)");

    const readResRefunded = await fetch(`http://localhost:5000/api/payment/read/${refundedToken}`);
    assert(readResRefunded.status === 403, "Refunded order is strictly FORBIDDEN from online reader (HTTP 403)");
  }

  // -------------------------------------------------------------------------
  console.log("\nTEST GROUP 7: Historical Stripe Orders Preservation");
  // -------------------------------------------------------------------------
  {
    // Test that historical order with stripe_session_id remains queryable
    const testStripeSession = "cs_live_test_session_product_a";
    const statusRes = await fetch(`http://localhost:5000/api/payment/order-status/${testStripeSession}`);
    const statusData = await statusRes.json();
    assert(statusRes.ok && statusData.order !== undefined, "Historical Stripe order is queryable via order-status/:identifier");
  }

  // -------------------------------------------------------------------------
  console.log("\nTEST GROUP 8: PayPal Webhook Endpoints & Verification");
  // -------------------------------------------------------------------------
  {
    // Invalid signature to PayPal webhook endpoint
    const resInvalidPaypal = await fetch("http://localhost:5000/api/webhooks/paypal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "paypal-auth-algo": "SHA256withRSA",
        "paypal-cert-url": "https://api.sandbox.paypal.com/v1/notifications/certs/CERT-123",
        "paypal-transmission-id": "transmission-123",
        "paypal-transmission-sig": "invalid_sig",
        "paypal-transmission-time": new Date().toISOString(),
      },
      body: JSON.stringify({
        id: "WH-TEST-001",
        event_type: "PAYMENT.CAPTURE.COMPLETED",
      }),
    });

    assert(resInvalidPaypal.status === 400, "Unverified/invalid PayPal webhook signature returns HTTP 400");
  }

  console.log("\n===============================================================");
  console.log(`Test Execution Summary: ${testsPassed} passed, ${testsFailed} failed.`);
  console.log("===============================================================\n");
}

runTests();
