const fs = require('fs');
const path = require('path');

const backendDir = 'd:/Bright Media WORK/siddiqui-backend/server';

console.log('Updating cartController.js, paymentController.js, and paymentRoutes.js...');

// 1. Helper to find or link user in Supabase
const customerAuthPath = path.join(backendDir, 'utils/customerAuth.js');
const customerAuthCode = `const supabase = require("../config/supabaseClient");
const { sendSetPasswordEmail } = require("./orderEmail");

/**
 * Ensures one customer account exists per email address (One person, one account).
 * If user signed in with Google, links to their Google account.
 * If user bought manually and has no account, creates a Supabase Auth account and sends set-password email.
 */
async function ensureCustomerAccount({ email, name, editionType }) {
  if (!email) return null;
  const cleanEmail = email.trim().toLowerCase();
  const clientUrl = process.env.CLIENT_URL || "https://siddiqui.digital";

  try {
    const { data: listData, error: listErr } = await supabase.auth.admin.listUsers();
    if (listErr) {
      console.warn("[ensureCustomerAccount] listUsers error:", listErr.message);
    }

    const existingUser = listData?.users?.find((u) => u.email?.toLowerCase() === cleanEmail);

    if (existingUser) {
      console.log("[ensureCustomerAccount] Existing account found for " + cleanEmail + " (ID: " + existingUser.id + ")");
      return existingUser;
    }

    console.log("[ensureCustomerAccount] Creating new reader account for manual buyer " + cleanEmail + "...");
    const { data: createData, error: createErr } = await supabase.auth.admin.createUser({
      email: cleanEmail,
      email_confirm: true,
      user_metadata: { full_name: name || "Valued Reader" },
    });

    if (createErr || !createData?.user) {
      console.warn("[ensureCustomerAccount] Could not create user:", createErr?.message);
      return null;
    }

    const newUser = createData.user;

    try {
      const { data: linkData, error: linkErr } = await supabase.auth.admin.generateLink({
        type: "recovery",
        email: cleanEmail,
        options: { redirectTo: clientUrl + "/reset-password" },
      });

      if (!linkErr && linkData?.properties?.action_link) {
        await sendSetPasswordEmail({
          to: cleanEmail,
          customerName: name,
          setPasswordLink: linkData.properties.action_link,
          editionType,
        });
      }
    } catch (e) {
      console.warn("[ensureCustomerAccount] Failed to send set-password link:", e.message);
    }

    return newUser;
  } catch (err) {
    console.error("[ensureCustomerAccount] Unexpected error:", err);
    return null;
  }
}

module.exports = {
  ensureCustomerAccount,
};
`;
fs.writeFileSync(customerAuthPath, customerAuthCode, 'utf8');
console.log('Created customerAuth.js');

// 2. Update cartController.js
const cartCtrlPath = path.join(backendDir, 'controllers/cartController.js');
let cartCtrl = fs.readFileSync(cartCtrlPath, 'utf8');

if (!cartCtrl.includes('customerAuth')) {
  cartCtrl = cartCtrl.replace(
    'const { sendOrderConfirmationEmail } = require("../utils/orderEmail");',
    'const { sendOrderConfirmationEmail } = require("../utils/orderEmail");\nconst { ensureCustomerAccount } = require("../utils/customerAuth");'
  );
}

if (!cartCtrl.includes('exports.checkOwnership =')) {
  cartCtrl += `

/**
 * GET /api/payment/check-ownership?email=...
 * Checks what book edition a customer already owns to enforce access & upgrade rules:
 * - Owns $20 edition: can upgrade to $49.99 edition for $29.99
 * - Owns $49.99 edition: block $20 and $49.99 purchases with "You already own this edition"
 * - Owns same edition: block purchase with "You already own this edition"
 */
exports.checkOwnership = async (req, res) => {
  const email = (req.query.email || "").trim().toLowerCase();

  if (!email) {
    return res.status(400).json({ error: "Email address is required." });
  }

  try {
    const { data: orders, error } = await supabase
      .from("orders")
      .select("*")
      .ilike("email", email)
      .in("status", ["paid", "successful"])
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[checkOwnership] Supabase error:", error);
      return res.status(500).json({ error: "Failed to verify ownership." });
    }

    let ownsOnline = false;
    let ownsCompanion = false;
    let highestEdition = null;

    (orders || []).forEach((o) => {
      const amt = Number(o.amount) || 0;
      const name = (o.book_name || "").toLowerCase();

      // Digital Companion or Upgrade
      if (amt >= 40 || name.includes("companion") || name.includes("49.99") || name.includes("upgrade")) {
        ownsCompanion = true;
      }
      // Online reading edition
      if ((amt >= 18 && amt <= 25) || name.includes("online reading") || name.includes("20")) {
        ownsOnline = true;
      }
    });

    if (ownsCompanion) {
      highestEdition = "companion";
    } else if (ownsOnline) {
      highestEdition = "online";
    }

    return res.json({
      owned: !!highestEdition,
      edition: highestEdition,
      ownsOnline,
      ownsCompanion,
      canUpgrade: ownsOnline && !ownsCompanion,
      upgradeDifference: 29.99,
      orders: orders || [],
    });
  } catch (err) {
    console.error("[checkOwnership] Error:", err);
    return res.status(500).json({ error: "Failed to check ownership status." });
  }
};
`;
}

// In createCartCheckout, accept marketingOptIn
cartCtrl = cartCtrl.replace(
  'const {\n    customerName = "Valued Customer",\n    customerEmail,\n    customerPhone,\n    userId = null,\n    lineItems = [],\n    discountCode,\n    discountAmount = 0,\n    currency = "AED",\n  } = req.body;',
  'const {\n    customerName = "Valued Customer",\n    customerEmail,\n    customerPhone,\n    userId = null,\n    lineItems = [],\n    discountCode,\n    discountAmount = 0,\n    currency = "AED",\n    marketingOptIn = false,\n  } = req.body;'
);

// Determine edition type & link account
if (!cartCtrl.includes('hasCompanionEdition')) {
  cartCtrl = cartCtrl.replace(
    'const currencyStr = currency.toLowerCase();',
    'const currencyStr = currency.toLowerCase();\n    const hasCompanionEdition = lineItems.some(i => (Number(i.price) >= 40) || String(i.title).toLowerCase().includes("companion") || i.accessType === "companion");\n    const editionType = hasCompanionEdition ? "companion" : "online";'
  );

  cartCtrl = cartCtrl.replace(
    'const orderId = crypto.randomUUID();',
    'const orderId = crypto.randomUUID();\n    let resolvedUserId = userId;\n    try {\n      const userObj = await ensureCustomerAccount({ email: customerEmail, name: customerName, editionType });\n      if (userObj && !resolvedUserId) resolvedUserId = userObj.id;\n    } catch (e) {\n      console.warn("[createCartCheckout] ensureCustomerAccount notice:", e.message);\n    }'
  );

  cartCtrl = cartCtrl.replace('user_id: userId,', 'user_id: resolvedUserId,');
}

fs.writeFileSync(cartCtrlPath, cartCtrl, 'utf8');
console.log('Updated cartController.js');

// 3. Update paymentRoutes.js
const paymentRoutesPath = path.join(backendDir, 'routes/paymentRoutes.js');
let paymentRoutes = fs.readFileSync(paymentRoutesPath, 'utf8');
if (!paymentRoutes.includes('checkOwnership')) {
  paymentRoutes = paymentRoutes.replace(
    'const { createCartCheckout, getCustomerOrders } = require("../controllers/cartController");',
    'const { createCartCheckout, getCustomerOrders, checkOwnership } = require("../controllers/cartController");'
  );
  paymentRoutes = paymentRoutes.replace(
    '// Customer Order History\nrouter.get("/my-orders", getCustomerOrders);',
    '// Customer Order History & Ownership Verification\nrouter.get("/my-orders", getCustomerOrders);\nrouter.get("/check-ownership", checkOwnership);'
  );
  fs.writeFileSync(paymentRoutesPath, paymentRoutes, 'utf8');
  console.log('Updated paymentRoutes.js');
}

// 4. Update webhook in paymentController.js for editionType delivery message
const paymentCtrlPath = path.join(backendDir, 'controllers/paymentController.js');
let paymentCtrl = fs.readFileSync(paymentCtrlPath, 'utf8');

if (!paymentCtrl.includes('ensureCustomerAccount')) {
  paymentCtrl = paymentCtrl.replace(
    'const { sendOrderConfirmationEmail } = require("../utils/orderEmail");',
    'const { sendOrderConfirmationEmail } = require("../utils/orderEmail");\nconst { ensureCustomerAccount } = require("../utils/customerAuth");'
  );
}

if (!paymentCtrl.includes('detectedEdition')) {
  paymentCtrl = paymentCtrl.replace(
    'const amount = session.amount_total ? (session.amount_total / 100).toFixed(2) : "49.00";',
    'const amount = session.amount_total ? (session.amount_total / 100).toFixed(2) : "49.00";\n    const detectedEdition = (Number(amount) >= 40 || String(productName).toLowerCase().includes("companion") || metadata.accessType === "companion") ? "companion" : "online";\n    try {\n      if (customerEmail) {\n        await ensureCustomerAccount({ email: customerEmail, name: customerName, editionType: detectedEdition });\n      }\n    } catch (e) {\n      console.warn("[stripeWebhook] ensureCustomerAccount:", e.message);\n    }'
  );

  paymentCtrl = paymentCtrl.replace(
    'await sendOrderConfirmationEmail({\n          to: customerEmail,\n          customerName,\n          orderNumber: metadata.orderNumber || (existingOrder?.order_number || `ORD-${sessionId.substring(0, 8).toUpperCase()}`),\n          productName,\n          amount,\n          currency,\n          downloadUrl,\n          expiryHours,\n          downloadLimit: 3,\n        });',
    'await sendOrderConfirmationEmail({\n          to: customerEmail,\n          customerName,\n          orderNumber: metadata.orderNumber || (existingOrder?.order_number || `ORD-${sessionId.substring(0, 8).toUpperCase()}`),\n          productName,\n          amount,\n          currency,\n          downloadUrl,\n          editionType: detectedEdition,\n          expiryHours,\n          downloadLimit: 3,\n        });'
  );
  fs.writeFileSync(paymentCtrlPath, paymentCtrl, 'utf8');
  console.log('Updated paymentController.js webhook handler');
}

console.log('Backend payment updates completed successfully.');
