const fs = require('fs');
const path = require('path');

const backendDir = 'd:/Bright Media WORK/siddiqui-backend/server';
const apiLibDir = 'd:/Bright Media WORK/Siddiui.digital-main/Siddiui.digital-main/api/_lib';

// 1. Update orderStore.js to export getOrdersByEmail
function patchOrderStore(storeFilePath) {
  if (!fs.existsSync(storeFilePath)) return;
  let code = fs.readFileSync(storeFilePath, 'utf8');
  if (!code.includes('getOrdersByEmail')) {
    const fnCode = `
function getOrdersByEmail(email) {
  if (!email) return [];
  const store = readStore();
  const lower = String(email).trim().toLowerCase();
  return Object.values(store).filter(
    (o) => o.email && String(o.email).trim().toLowerCase() === lower
  );
}
`;
    code = code.replace('module.exports = {', fnCode + '\nmodule.exports = {');
    code = code.replace('saveOrderMetadata,', 'saveOrderMetadata,\n  getOrdersByEmail,');
    fs.writeFileSync(storeFilePath, code, 'utf8');
    console.log(`Updated getOrdersByEmail in ${storeFilePath}`);
  }
}

patchOrderStore(path.join(backendDir, 'utils/orderStore.js'));
if (fs.existsSync(apiLibDir)) {
  patchOrderStore(path.join(apiLibDir, 'orderStore.js'));
}

// 2. Update cartController.js to use getOrdersByEmail
function patchCartController(cartFilePath) {
  if (!fs.existsSync(cartFilePath)) return;
  let code = fs.readFileSync(cartFilePath, 'utf8');

  // Ensure getOrdersByEmail is imported
  if (!code.includes('getOrdersByEmail')) {
    code = code.replace(
      'const { saveOrderMetadata, getOrderMetadata } = require("../utils/orderStore");',
      'const { saveOrderMetadata, getOrderMetadata, getOrdersByEmail } = require("../utils/orderStore");'
    );
  }

  // Update checkOwnership to merge store orders
  const targetCheckOwnership = `    const { data: orders, error } = await supabase
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

    (orders || []).forEach((o) => {`;

  const replacementCheckOwnership = `    const { data: orders, error } = await supabase
      .from("orders")
      .select("*")
      .ilike("email", email)
      .in("status", ["paid", "successful"])
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("[checkOwnership] Supabase query notice:", error.message);
    }

    // Merge in orders from metadata store for full resilience
    const metaOrders = typeof getOrdersByEmail === "function" ? getOrdersByEmail(email) : [];
    const combinedOrders = [...(orders || []), ...metaOrders];

    let ownsOnline = false;
    let ownsCompanion = false;
    let highestEdition = null;

    combinedOrders.forEach((o) => {`;

  if (code.includes(targetCheckOwnership)) {
    code = code.replace(targetCheckOwnership, replacementCheckOwnership);
    fs.writeFileSync(cartFilePath, code, 'utf8');
    console.log(`Updated checkOwnership in ${cartFilePath}`);
  } else {
    console.log(`targetCheckOwnership pattern not matched in ${cartFilePath}`);
  }
}

patchCartController(path.join(backendDir, 'controllers/cartController.js'));
if (fs.existsSync(apiLibDir)) {
  patchCartController(path.join(apiLibDir, 'cartController.js'));
}

console.log('Cart controller patch complete.');
