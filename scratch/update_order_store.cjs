const fs = require('fs');
const path = require('path');

const targetPath = 'd:/Bright Media WORK/siddiqui-backend/server/utils/orderStore.js';
const apiLibPath = 'd:/Bright Media WORK/Siddiui.digital-main/Siddiui.digital-main/api/_lib/orderStore.js';
const legacyStorePath = 'd:/Bright Media WORK/siddiqui-backend/server/data/orders_metadata.json';
const newStorePath = 'd:/Bright Media WORK/siddiqui-backend/orders_metadata.json';

// 1. Copy legacy store to new location outside server watch directory if it exists
if (fs.existsSync(legacyStorePath)) {
  fs.copyFileSync(legacyStorePath, newStorePath);
  console.log('Seeded newStorePath from legacy data/orders_metadata.json');
}

const newOrderStoreCode = `const fs = require('fs');
const path = require('path');

// Store file outside server directory so file updates do not trigger nodemon watch reloads
const STORE_PATH = process.env.ORDERS_METADATA_PATH ||
  path.join(__dirname, '../../orders_metadata.json');
const LEGACY_PATH = path.join(__dirname, '../data/orders_metadata.json');

function ensureDir() {
  const dir = path.dirname(STORE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readStore() {
  try {
    ensureDir();
    if (fs.existsSync(STORE_PATH)) {
      return JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'));
    }
    // Fallback to legacy path if new store doesn't exist yet
    if (fs.existsSync(LEGACY_PATH)) {
      const data = JSON.parse(fs.readFileSync(LEGACY_PATH, 'utf8'));
      fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf8');
      return data;
    }
  } catch (err) {
    console.error('[orderStore] Read error:', err.message);
  }
  return {};
}

function writeStore(data) {
  try {
    ensureDir();
    fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('[orderStore] Write error:', err.message);
  }
}

function saveOrderMetadata(orderId, meta) {
  if (!orderId) return;
  const store = readStore();
  store[String(orderId)] = {
    ...(store[String(orderId)] || {}),
    ...meta,
    updatedAt: new Date().toISOString()
  };
  writeStore(store);
}

function getOrderMetadata(orderId) {
  if (!orderId) return null;
  const store = readStore();
  return store[String(orderId)] || null;
}

function findOrderMetadataByToken(token) {
  if (!token) return null;
  const store = readStore();
  const lowerToken = String(token).toLowerCase();
  for (const [orderId, meta] of Object.entries(store)) {
    if (
      meta.download_token === token ||
      meta.stripe_session_id === token ||
      meta.paypal_order_id === token ||
      meta.paypal_capture_id === token ||
      meta.payhip_transaction_id === token ||
      meta.order_number === token ||
      orderId === token ||
      String(meta.order_number || "").toLowerCase() === lowerToken
    ) {
      return { orderId, ...meta };
    }
  }
  return null;
}

module.exports = {
  saveOrderMetadata,
  getOrderMetadata,
  findOrderMetadataByToken,
};
`;

fs.writeFileSync(targetPath, newOrderStoreCode, 'utf8');
console.log('Updated backend orderStore.js');

if (fs.existsSync(path.dirname(apiLibPath))) {
  fs.writeFileSync(apiLibPath, newOrderStoreCode, 'utf8');
  console.log('Updated api/_lib/orderStore.js');
}
