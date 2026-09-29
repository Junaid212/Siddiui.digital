/**
 * patch-backend.mjs — Run this from the siddiqui-backend/server directory
 * to install the cart checkout, discount validation, and customer orders endpoints.
 *
 * Usage:
 *   cd "d:\Bright Media WORK\siddiqui-backend\server"
 *   node ../../Siddiui.digital-main/Siddiui.digital-main/patch-backend.mjs
 *
 * What it does:
 *   1. Creates controllers/discountController.js
 *   2. Creates controllers/cartController.js
 *   3. Updates routes/paymentRoutes.js (adds new routes, preserves existing ones)
 */

import { writeFileSync, readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Detect if running from the backend directory
const cwd = process.cwd();
const controllersDir = join(cwd, "controllers");
const routesDir = join(cwd, "routes");

if (!existsSync(controllersDir)) {
  console.error("❌ Not running from backend server directory. Please cd into siddiqui-backend/server first.");
  process.exit(1);
}

/* ════════════════════════════════════════════════════════
   1. discountController.js
   ════════════════════════════════════════════════════════ */
const discountController = `/**
 * discountController.js — Discount/Coupon Code Management
 *
 * Supabase table SQL (run once in Supabase SQL editor):
 *   CREATE TABLE IF NOT EXISTS discount_codes (
 *     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *     code TEXT UNIQUE NOT NULL,
 *     type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed')),
 *     value NUMERIC NOT NULL,
 *     description TEXT,
 *     min_order_amount NUMERIC DEFAULT 0,
 *     max_uses INT,
 *     uses_count INT DEFAULT 0,
 *     active BOOLEAN DEFAULT TRUE,
 *     expires_at TIMESTAMPTZ,
 *     created_at TIMESTAMPTZ DEFAULT NOW()
 *   );
 */
const supabase = require("../config/supabaseClient");
require("dotenv").config();

const STATIC_DISCOUNT_CODES = [
  { code: "LAUNCH20",  type: "percentage", value: 20,  description: "20% off — Launch offer",  min_order_amount: 0,   active: true },
  { code: "WELCOME10", type: "percentage", value: 10,  description: "10% welcome discount",     min_order_amount: 0,   active: true },
  { code: "FLAT50",    type: "fixed",      value: 50,  description: "AED 50 off",               min_order_amount: 100, active: true },
  { code: "READER15",  type: "percentage", value: 15,  description: "15% reader discount",      min_order_amount: 0,   active: true },
  { code: "BOOKS25",   type: "percentage", value: 25,  description: "25% off all publications", min_order_amount: 0,   active: true },
];

exports.validateDiscount = async (req, res) => {
  const code = (req.body.code || "").trim().toUpperCase();
  const subtotal = Number(req.body.subtotal) || 0;
  if (!code) return res.status(400).json({ valid: false, error: "Discount code is required." });
  try {
    let discount = null;
    try {
      const { data, error } = await supabase.from("discount_codes").select("*").ilike("code", code).maybeSingle();
      if (!error && data) discount = data;
    } catch (dbErr) { console.warn("[validateDiscount] DB lookup skipped:", dbErr.message); }
    if (!discount) discount = STATIC_DISCOUNT_CODES.find(d => d.code.toUpperCase() === code.toUpperCase());
    if (!discount) return res.status(404).json({ valid: false, error: "This discount code doesn't exist or has expired." });
    if (discount.active === false) return res.status(400).json({ valid: false, error: "This discount code is no longer active." });
    if (discount.expires_at && new Date() > new Date(discount.expires_at)) return res.status(400).json({ valid: false, error: "This discount code has expired." });
    if (discount.max_uses && Number(discount.uses_count || 0) >= Number(discount.max_uses)) return res.status(400).json({ valid: false, error: "This discount code has reached its usage limit." });
    if (discount.min_order_amount && subtotal < Number(discount.min_order_amount)) return res.status(400).json({ valid: false, error: \`Minimum order of \${discount.min_order_amount} required for this code.\` });
    let discountAmount = 0;
    if (discount.type === "percentage") discountAmount = Math.min(subtotal, (subtotal * Number(discount.value)) / 100);
    else if (discount.type === "fixed") discountAmount = Math.min(subtotal, Number(discount.value));
    return res.json({ valid: true, discount: { code: discount.code, type: discount.type, value: Number(discount.value), description: discount.description || \`\${discount.value}\${discount.type === "percentage" ? "%" : " AED"} off\`, discountAmount: Math.round(discountAmount * 100) / 100 } });
  } catch (err) {
    console.error("[validateDiscount] Error:", err);
    return res.status(500).json({ valid: false, error: "Failed to validate discount code." });
  }
};
`;

/* ════════════════════════════════════════════════════════
   2. cartController.js
   ════════════════════════════════════════════════════════ */
const cartController = `/**
 * cartController.js — Multi-item Cart Checkout + Customer Orders
 */
const Stripe = require("stripe");
const crypto = require("crypto");
const supabase = require("../config/supabaseClient");
const { saveOrderMetadata, getOrderMetadata } = require("../utils/orderStore");
require("dotenv").config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";
const stripe = new Stripe(stripeSecretKey);

async function executeWithSchemaFallback(operationFn, payload) {
  let currentPayload = { ...payload };
  while (true) {
    const res = await operationFn(currentPayload);
    if (!res.error) return res;
    const match = res.error.message?.match(/Could not find the '([^']+)' column/i) ||
      res.error.message?.match(/column ['""]?([a-zA-Z0-9_]+)['""]? does not exist/i);
    if (match && match[1] && Object.prototype.hasOwnProperty.call(currentPayload, match[1])) {
      delete currentPayload[match[1]];
      if (Object.keys(currentPayload).length === 0) return res;
      continue;
    }
    return res;
  }
}

exports.createCartCheckout = async (req, res) => {
  const { customerName = "Valued Customer", customerEmail, customerPhone, userId = null, lineItems = [], discountCode, discountAmount = 0, currency = "AED" } = req.body;
  if (!customerEmail || !customerEmail.trim()) return res.status(400).json({ error: "Customer email is required." });
  if (!lineItems || lineItems.length === 0) return res.status(400).json({ error: "At least one item is required in the cart." });
  if (!stripeSecretKey || stripeSecretKey.includes("placeholder") || stripeSecretKey.includes("your")) return res.status(500).json({ error: "Payment gateway is not configured. Contact support at info@siddiqui.digital." });
  try {
    const clientUrl = process.env.CLIENT_URL || "https://siddiqui.digital";
    const orderNumber = \`ORD-\${Date.now().toString(36).toUpperCase()}-\${crypto.randomBytes(3).toString("hex").toUpperCase()}\`;
    const orderId = crypto.randomUUID();
    const currencyStr = currency.toLowerCase();
    const stripeLineItems = lineItems.map(item => ({ price_data: { currency: (item.currency || currency).toLowerCase(), product_data: { name: item.title || "Digital Publication", description: item.accessLabel || (item.accessType === "online" ? "Online Reading Access" : "Downloadable PDF Edition") }, unit_amount: Math.round(Number(item.price) * 100) }, quantity: Math.max(1, Number(item.quantity) || 1) }));
    const sessionConfig = {
      payment_method_types: ["card"],
      customer_email: customerEmail.trim(),
      line_items: stripeLineItems,
      mode: "payment",
      metadata: { orderId, orderNumber, customerName: customerName.trim() || "Valued Customer", customerEmail: customerEmail.trim(), cartItemCount: String(lineItems.length), productIds: lineItems.map(i => i.productId).join(","), discountCode: discountCode || "", discountAmount: String(discountAmount) },
      success_url: \`\${clientUrl}/order-success?session_id={CHECKOUT_SESSION_ID}&order_id=\${orderId}\`,
      cancel_url: \`\${clientUrl}/publications\`,
    };
    if (discountCode && discountAmount > 0) {
      try {
        const coupon = await stripe.coupons.create({ amount_off: Math.round(discountAmount * 100), currency: currencyStr, name: \`Code: \${discountCode}\`, max_redemptions: 1, redeem_by: Math.floor(Date.now() / 1000) + 3600 });
        sessionConfig.discounts = [{ coupon: coupon.id }];
      } catch (couponErr) { console.warn("[createCartCheckout] Coupon creation failed (non-fatal):", couponErr.message); }
    }
    let session;
    try { session = await stripe.checkout.sessions.create(sessionConfig); }
    catch (stripeErr) { return res.status(500).json({ error: \`Stripe Checkout error: \${stripeErr.message}\` }); }
    const productSummary = lineItems.map(i => i.title).join(", ");
    const totalAmount = lineItems.reduce((sum, i) => sum + Number(i.price) * (i.quantity || 1), 0) - discountAmount;
    const orderRecord = {
      id: orderId, user_id: userId, email: customerEmail.trim(),
      customer_name: customerName.trim() || "Valued Customer",
      book_name: lineItems.length === 1 ? lineItems[0].title : \`\${lineItems.length} items: \${productSummary.substring(0, 120)}\`,
      product_id: lineItems.length === 1 ? lineItems[0].productId : null,
      order_number: orderNumber, stripe_session_id: session.id,
      amount: Math.max(0, totalAmount), currency: currency.toUpperCase(), status: "pending",
      download_limit: 3, download_expires_at: new Date(Date.now() + 72 * 3600 * 1000).toISOString(),
    };
    saveOrderMetadata(orderId, { ...orderRecord, orderId, lineItems: JSON.stringify(lineItems), discountCode: discountCode || null, discountAmount });
    await executeWithSchemaFallback(payload => supabase.from("orders").insert([payload]), orderRecord);
    return res.json({ url: session.url, sessionId: session.id, orderNumber, orderId });
  } catch (err) {
    console.error("[createCartCheckout] Error:", err);
    return res.status(500).json({ error: err.message || "Failed to create cart checkout session." });
  }
};

exports.getCustomerOrders = async (req, res) => {
  const email = (req.query.email || "").trim();
  if (!email) return res.status(400).json({ error: "Email address is required." });
  const emailRe = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  if (!emailRe.test(email)) return res.status(400).json({ error: "Invalid email address." });
  try {
    const { data: orders, error } = await supabase.from("orders").select("*").ilike("email", email).order("created_at", { ascending: false });
    if (error) { console.error("[getCustomerOrders] Error:", error.message); return res.status(500).json({ error: "Failed to retrieve order history." }); }
    const enriched = (orders || []).map(order => {
      const meta = getOrderMetadata(order.id) || {};
      return { id: order.id, order_number: order.order_number || meta.orderNumber || \`ORD-\${order.id?.substring(0, 8).toUpperCase()}\`, book_name: order.book_name || meta.productName || "Digital Publication", product_id: order.product_id || null, amount: Number(order.amount) || 0, currency: order.currency || "AED", status: order.status || "pending", email: order.email || email, stripe_session_id: order.stripe_session_id || null, download_token: order.download_token || order.stripe_session_id || order.id, download_count: Number(order.download_count) || 0, download_limit: Number(order.download_limit) || 3, download_expires_at: order.download_expires_at || null, created_at: order.created_at || null };
    });
    return res.json({ orders: enriched, count: enriched.length });
  } catch (err) {
    console.error("[getCustomerOrders] Error:", err);
    return res.status(500).json({ error: "Failed to load order history." });
  }
};
`;

/* ════════════════════════════════════════════════════════
   3. paymentRoutes.js (updated)
   ════════════════════════════════════════════════════════ */
const paymentRoutes = `const express = require("express");
const router = express.Router();
const { getProducts, getProductById, createCheckoutSession, getOrderStatus, downloadProductFile, requestReplacementLink, stripeWebhook } = require("../controllers/paymentController");
const { validateDiscount } = require("../controllers/discountController");
const { createCartCheckout, getCustomerOrders } = require("../controllers/cartController");

// Digital Products Catalog
router.get("/products", getProducts);
router.get("/products/:id", getProductById);
router.get("/ebooks", getProducts);

// Single-product Checkout (legacy)
router.post("/create-checkout", createCheckoutSession);

// Multi-item Cart Checkout (new)
router.post("/create-cart-checkout", createCartCheckout);

// Discount Code Validation
router.post("/validate-discount", validateDiscount);

// Customer Order History
router.get("/my-orders", getCustomerOrders);

// Order Status
router.get("/order-status/:identifier", getOrderStatus);

// Secure Downloads
router.get("/download/:token", downloadProductFile);
router.get("/download", downloadProductFile);
router.get("/ebooks/download", downloadProductFile);
router.get("/ebooks/download/:token", downloadProductFile);

// Replacement Link
router.post("/request-replacement", requestReplacementLink);

// Stripe Webhook
router.post("/webhook", express.raw({ type: "application/json" }), stripeWebhook);
router.post("/stripe/webhook", express.raw({ type: "application/json" }), stripeWebhook);

module.exports = router;
`;

// Write files
try {
  writeFileSync(join(controllersDir, "discountController.js"), discountController, "utf8");
  console.log("✅ Created: controllers/discountController.js");

  writeFileSync(join(controllersDir, "cartController.js"), cartController, "utf8");
  console.log("✅ Created: controllers/cartController.js");

  writeFileSync(join(routesDir, "paymentRoutes.js"), paymentRoutes, "utf8");
  console.log("✅ Updated: routes/paymentRoutes.js");

  console.log("\n🎉 Backend patch complete!");
  console.log("   Restart siddiqui-backend server (npm run dev) to activate the new endpoints:");
  console.log("   • POST /api/payment/create-cart-checkout  — Multi-item checkout");
  console.log("   • POST /api/payment/validate-discount     — Discount code validation");
  console.log("   • GET  /api/payment/my-orders?email=...   — Customer order history");
  console.log("\n   Optional: Create the discount_codes table in Supabase (SQL in discountController.js)");
} catch (err) {
  console.error("❌ Error writing files:", err.message);
  process.exit(1);
}
