const fs = require('fs');
const path = require('path');

const backendDir = 'd:/Bright Media WORK/siddiqui-backend/server';

console.log('[1/5] Deploying webhookRoutes.js...');
const webhookRoutesSrc = path.resolve(__dirname, '../api/_lib/webhookRoutes.js');
const webhookRoutesDest = path.join(backendDir, 'routes/webhookRoutes.js');
fs.copyFileSync(webhookRoutesSrc, webhookRoutesDest);
console.log('webhookRoutes.js deployed.');

console.log('[2/5] Updating server.js...');
const serverJsPath = path.join(backendDir, 'server.js');
let serverJs = fs.readFileSync(serverJsPath, 'utf8');

if (!serverJs.includes('webhookRoutes')) {
  serverJs = serverJs.replace(
    'const askSidRoutes = require("./routes/askSidRoutes");',
    'const askSidRoutes = require("./routes/askSidRoutes");\nconst webhookRoutes = require("./routes/webhookRoutes");'
  );
  serverJs = serverJs.replace(
    'app.use("/api/ask-sid", askSidRoutes);',
    'app.use("/api/ask-sid", askSidRoutes);\napp.use("/api/webhooks", webhookRoutes);'
  );
}

if (!serverJs.includes('/api/webhooks/stripe')) {
  serverJs = serverJs.replace(
    'req.originalUrl === "/api/payment/stripe/webhook"',
    'req.originalUrl === "/api/payment/stripe/webhook" ||\n    req.originalUrl === "/api/webhooks/stripe"'
  );
}
fs.writeFileSync(serverJsPath, serverJs, 'utf8');
console.log('server.js updated.');

console.log('[3/5] Updating paymentRoutes.js...');
const paymentRoutesPath = path.join(backendDir, 'routes/paymentRoutes.js');
const newPaymentRoutesCode = `const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  getOrderStatus,
  downloadProductFile,
  readOnlineBook,
  requestReplacementLink,
  stripeWebhook,
} = require("../controllers/paymentController");
const { validateDiscount } = require("../controllers/discountController");
const { getCustomerOrders, checkOwnership } = require("../controllers/cartController");
const { createPayPalOrder, capturePayPalOrder, paypalWebhook } = require("../controllers/paypalController");
const { payhipWebhook, claimPayhipPurchase, confirmPayhipClaim } = require("../controllers/payhipController");

// Digital Products Catalog
router.get("/products", getProducts);
router.get("/products/:id", getProductById);
router.get("/ebooks", getProducts); // Backward compatibility

// PayPal Checkout (Orders v2 API)
router.post("/paypal/create-order", createPayPalOrder);
router.post("/paypal/capture-order", capturePayPalOrder);
router.post("/paypal/webhook", paypalWebhook);
router.post("/webhooks/paypal", paypalWebhook);

// Payhip Webhook & Secure Account Linking
router.post("/payhip/webhook", payhipWebhook);
router.post("/webhooks/payhip", payhipWebhook);
router.post("/claim-payhip-purchase", claimPayhipPurchase);
router.post("/confirm-payhip-claim", confirmPayhipClaim);

// Unified Checkout Endpoints (Routes to PayPal Orders v2 with server-side validation)
router.post("/create-order", createPayPalOrder);
router.post("/capture-order", capturePayPalOrder);
router.post("/create-checkout", createPayPalOrder);
router.post("/create-cart-checkout", createPayPalOrder);

// Discount Code Validation
router.post("/validate-discount", validateDiscount);

// Customer Order History & Ownership Verification
router.get("/my-orders", getCustomerOrders);
router.get("/check-ownership", checkOwnership);

// Order Status & Confirmation (Unified for PayPal, Payhip, Stripe, and tokens)
router.get("/order-status/:identifier", getOrderStatus);

// Protected Online Reader Endpoint (in-browser view, no download)
router.get("/read/:token", readOnlineBook);
router.get("/read", readOnlineBook);

// Secure Download Endpoint (Digital Companion Edition with valid license)
router.get("/download/:token", downloadProductFile);
router.get("/download", downloadProductFile);
router.get("/ebooks/download", downloadProductFile);
router.get("/ebooks/download/:token", downloadProductFile);

// Replacement Link Request
router.post("/request-replacement", requestReplacementLink);

// Historical Stripe Webhook (preserved for backward compatibility)
router.post("/webhook", express.raw({ type: "application/json" }), stripeWebhook);
router.post("/stripe/webhook", express.raw({ type: "application/json" }), stripeWebhook);

module.exports = router;
`;
fs.writeFileSync(paymentRoutesPath, newPaymentRoutesCode, 'utf8');
console.log('paymentRoutes.js updated.');

console.log('[4/5] Updating paymentController.js findOrderByIdentifier...');
const paymentCtrlPath = path.join(backendDir, 'controllers/paymentController.js');
let paymentCtrl = fs.readFileSync(paymentCtrlPath, 'utf8');

const targetOldFind = `async function findOrderByIdentifier(identifier) {
  if (!identifier) return null;
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);

  let order = null;

  // 1. Try finding by stripe_session_id
  if (identifier.startsWith("cs_")) {
    try {
      const { data, error } = await supabase.from("orders").select("*").eq("stripe_session_id", identifier).maybeSingle();
      if (!error && data) order = data;
    } catch (e) {}
  }

  // 2. Try finding by UUID id
  if (!order && isUUID) {
    try {
      const { data, error } = await supabase.from("orders").select("*").eq("id", identifier).maybeSingle();
      if (!error && data) order = data;
    } catch (e) {}
  }

  // 3. Try finding by download_token in Supabase if column exists
  if (!order) {
    try {
      const { data, error } = await supabase.from("orders").select("*").eq("download_token", identifier).maybeSingle();
      if (!error && data) order = data;
    } catch (e) {}
  }

  // 4. Try finding in persistent orderStore
  const meta = findOrderMetadataByToken(identifier);
  if (meta) {
    if (!order && meta.orderId) {
      try {
        const { data, error } = await supabase.from("orders").select("*").eq("id", meta.orderId).maybeSingle();
        if (!error && data) order = data;
      } catch (e) {}
    }
  }

  // Merge and return
  if (order) {
    const orderMeta = getOrderMetadata(order.id) || {};
    return {
      ...order,
      order_number: order.order_number || orderMeta.order_number || \`ORD-\${order.id ? order.id.substring(0, 8).toUpperCase() : 'UNKNOWN'}\`,
      product_id: order.product_id || orderMeta.product_id || null,
      email: order.email || orderMeta.email || null,
      customer_name: order.customer_name || orderMeta.customer_name || null,
      download_token: order.download_token || orderMeta.download_token || order.stripe_session_id || order.id,
      download_count: Number(order.download_count !== undefined ? order.download_count : (orderMeta.download_count || 0)),
      download_limit: Number(order.download_limit || orderMeta.download_limit || 3),
      download_expires_at: order.download_expires_at || orderMeta.download_expires_at || null,
    };
  }

  if (meta) {
    return {
      id: meta.orderId,
      book_name: meta.productName || "Digital Publication",
      amount: meta.amount || 49.00,
      currency: meta.currency || "AED",
      status: meta.status || "paid",
      ...meta,
    };
  }

  return null;
}`;

const newFindCode = `async function findOrderByIdentifier(identifier) {
  if (!identifier) return null;
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);

  let order = null;

  // 1. Try finding by stripe_session_id
  if (identifier.startsWith("cs_")) {
    try {
      const { data, error } = await supabase.from("orders").select("*").eq("stripe_session_id", identifier).maybeSingle();
      if (!error && data) order = data;
    } catch (e) {}
  }

  // 2. Try finding by UUID id
  if (!order && isUUID) {
    try {
      const { data, error } = await supabase.from("orders").select("*").eq("id", identifier).maybeSingle();
      if (!error && data) order = data;
    } catch (e) {}
  }

  // 3. Try finding by paypal_order_id or paypal_capture_id
  if (!order) {
    try {
      const { data, error } = await supabase.from("orders").select("*").or(\`paypal_order_id.eq.\${identifier},paypal_capture_id.eq.\${identifier}\`).maybeSingle();
      if (!error && data) order = data;
    } catch (e) {}
  }

  // 4. Try finding by payhip_transaction_id
  if (!order) {
    try {
      const { data, error } = await supabase.from("orders").select("*").eq("payhip_transaction_id", identifier).maybeSingle();
      if (!error && data) order = data;
    } catch (e) {}
  }

  // 5. Try finding by order_number
  if (!order && String(identifier).startsWith("ORD-")) {
    try {
      const { data, error } = await supabase.from("orders").select("*").eq("order_number", identifier).maybeSingle();
      if (!error && data) order = data;
    } catch (e) {}
  }

  // 6. Try finding by download_token in Supabase if column exists
  if (!order) {
    try {
      const { data, error } = await supabase.from("orders").select("*").eq("download_token", identifier).maybeSingle();
      if (!error && data) order = data;
    } catch (e) {}
  }

  // 7. Try finding in persistent orderStore
  const meta = findOrderMetadataByToken(identifier);
  if (meta) {
    if (!order && meta.orderId) {
      try {
        const { data, error } = await supabase.from("orders").select("*").eq("id", meta.orderId).maybeSingle();
        if (!error && data) order = data;
      } catch (e) {}
    }
  }

  // Merge and return
  if (order) {
    const orderMeta = getOrderMetadata(order.id) || {};
    return {
      ...order,
      order_number: order.order_number || orderMeta.order_number || \`ORD-\${order.id ? order.id.substring(0, 8).toUpperCase() : 'UNKNOWN'}\`,
      product_id: order.product_id || orderMeta.product_id || null,
      email: order.email || orderMeta.email || null,
      customer_name: order.customer_name || orderMeta.customer_name || null,
      payment_provider: order.payment_provider || orderMeta.payment_provider || (order.stripe_session_id ? 'stripe' : order.paypal_order_id ? 'paypal' : 'payhip'),
      access_tier: order.access_tier || orderMeta.access_tier || (Number(order.amount) < 30 ? 'online' : 'companion'),
      download_token: order.download_token || orderMeta.download_token || order.stripe_session_id || order.id,
      download_count: Number(order.download_count !== undefined ? order.download_count : (orderMeta.download_count || 0)),
      download_limit: Number(order.download_limit !== undefined ? order.download_limit : (orderMeta.download_limit !== undefined ? orderMeta.download_limit : 3)),
      download_expires_at: order.download_expires_at || orderMeta.download_expires_at || null,
    };
  }

  if (meta) {
    return {
      id: meta.orderId,
      book_name: meta.productName || meta.book_name || "Digital Publication",
      amount: meta.amount || 49.00,
      currency: meta.currency || "USD",
      status: meta.status || "paid",
      payment_provider: meta.payment_provider || "paypal",
      access_tier: meta.access_tier || (Number(meta.amount) < 30 ? "online" : "companion"),
      ...meta,
    };
  }

  return null;
}`;

if (paymentCtrl.includes('// 1. Try finding by stripe_session_id')) {
  paymentCtrl = paymentCtrl.replace(targetOldFind, newFindCode);
  fs.writeFileSync(paymentCtrlPath, paymentCtrl, 'utf8');
  console.log('paymentController.js findOrderByIdentifier updated.');
} else {
  console.log('paymentController already has updated findOrderByIdentifier.');
}

console.log('[5/5] Updating cartController.js getCustomerOrders to include provider & accessTier...');
const cartCtrlPath = path.join(backendDir, 'controllers/cartController.js');
let cartCtrl = fs.readFileSync(cartCtrlPath, 'utf8');

if (!cartCtrl.includes('payment_provider: order.payment_provider')) {
  cartCtrl = cartCtrl.replace(
    'stripe_session_id: order.stripe_session_id || null,',
    `payment_provider: order.payment_provider || meta.payment_provider || (order.stripe_session_id ? "stripe" : order.paypal_order_id ? "paypal" : "payhip"),\n        access_tier: order.access_tier || meta.access_tier || (Number(order.amount) < 30 ? "online" : "companion"),\n        paypal_order_id: order.paypal_order_id || meta.paypal_order_id || null,\n        payhip_transaction_id: order.payhip_transaction_id || meta.payhip_transaction_id || null,\n        stripe_session_id: order.stripe_session_id || null,`
  );
  fs.writeFileSync(cartCtrlPath, cartCtrl, 'utf8');
  console.log('cartController.js getCustomerOrders updated.');
}

console.log('Full backend updates deployed successfully!');
