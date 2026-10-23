/**
 * payhipVerifier.js — Payhip Webhook Signature Verification & Product Mapper
 *
 * Implements Payhip's official webhook verification:
 * - Signature is SHA-256 of the Payhip API key: hash('sha256', apiKey)
 * - Safe constant-time comparison to prevent timing attacks
 * - Mapping of Payhip product IDs, product keys, and payloads to internal book models & access tiers
 */

const crypto = require("crypto");
require("dotenv").config();

// Primary book IDs in the system
const DEFAULT_BOOK_ID = "04b84648-3609-4b31-9ded-2486bacf1e74"; // Marketing Reclassified
const ADAPTIVE_VALUE_BOOK_ID = "b4492051-cce5-4213-974b-72c74da19196";
const VALUE_DRIFT_BOOK_ID = "ba9acc66-a824-47c4-a4aa-5abb1a153437";

/**
 * Verify Payhip webhook payload authenticity
 * @param {Object} payload - Parsed JSON body received from Payhip
 * @param {Object} [headers] - Optional headers for additional checks
 */
function verifyPayhipSignature(payload, headers = {}) {
  const apiKey = (process.env.PAYHIP_API_KEY || "").trim();

  if (!apiKey || apiKey.includes("placeholder")) {
    console.warn("[Payhip Webhook] PAYHIP_API_KEY is not configured in server environment.");
    return false;
  }

  // Payhip transmits the signature in payload.signature (or x-payhip-signature header if present)
  const incomingSig = (payload && payload.signature) || headers["x-payhip-signature"] || headers["signature"];
  if (!incomingSig || typeof incomingSig !== "string") {
    console.warn("[Payhip Webhook] Missing signature in incoming payload.");
    return false;
  }

  const expectedSig = crypto.createHash("sha256").update(apiKey).digest("hex");

  try {
    const incomingBuf = Buffer.from(incomingSig, "utf8");
    const expectedBuf = Buffer.from(expectedSig, "utf8");
    if (incomingBuf.length !== expectedBuf.length) {
      return false;
    }
    return crypto.timingSafeEqual(incomingBuf, expectedBuf);
  } catch (err) {
    console.error("[Payhip Webhook] Signature comparison error:", err.message);
    return false;
  }
}

/**
 * Maps a Payhip item or transaction to internal website publication & access tier
 * @param {Object} item - Item object from Payhip items array (or full payload if single)
 * @param {Object} [fullPayload] - Full Payhip webhook payload
 */
function mapPayhipProductToBook(item = {}, fullPayload = {}) {
  // Check for custom JSON mapping in environment variable
  if (process.env.PAYHIP_MAPPING_JSON) {
    try {
      const customMap = JSON.parse(process.env.PAYHIP_MAPPING_JSON);
      const key = item.product_id || item.product_key;
      if (key && customMap[key]) {
        return {
          productId: customMap[key].productId || DEFAULT_BOOK_ID,
          accessTier: customMap[key].accessTier || "companion",
          editionType: customMap[key].accessTier || "companion",
          title: customMap[key].title || item.product_name || "Digital Publication",
          isUpgrade: Boolean(customMap[key].isUpgrade),
        };
      }
    } catch (e) {
      console.warn("[Payhip] Custom mapping JSON parse error:", e.message);
    }
  }

  const prodId = String(item.product_id || "").trim();
  const prodKey = String(item.product_key || "").trim();
  const name = String(item.product_name || fullPayload.product_name || "").toLowerCase();
  const priceCents = Number(item.price || fullPayload.price || 0);

  // Check specific environment overrides for product IDs
  const envOnlineId = String(process.env.PAYHIP_ONLINE_PRODUCT_ID || "").trim();
  const envCompanionId = String(process.env.PAYHIP_COMPANION_PRODUCT_ID || "").trim();
  const envUpgradeId = String(process.env.PAYHIP_UPGRADE_PRODUCT_ID || "").trim();

  if (envOnlineId && (prodId === envOnlineId || prodKey === envOnlineId)) {
    return {
      productId: DEFAULT_BOOK_ID,
      accessTier: "online",
      editionType: "online",
      title: "Marketing Reclassified — Online Reading Edition",
      isUpgrade: false,
    };
  }

  if (envCompanionId && (prodId === envCompanionId || prodKey === envCompanionId)) {
    return {
      productId: DEFAULT_BOOK_ID,
      accessTier: "companion",
      editionType: "companion",
      title: "Marketing Reclassified — Digital Companion Edition",
      isUpgrade: false,
    };
  }

  if (envUpgradeId && (prodId === envUpgradeId || prodKey === envUpgradeId)) {
    return {
      productId: DEFAULT_BOOK_ID,
      accessTier: "companion",
      editionType: "companion",
      title: "Marketing Reclassified — Digital Companion Edition (Upgrade)",
      isUpgrade: true,
    };
  }

  // 1. Adaptive Value Framework
  if (name.includes("adaptive value") || prodId === "b4492051-cce5-4213-974b-72c74da19196" || prodKey === "avf") {
    return {
      productId: ADAPTIVE_VALUE_BOOK_ID,
      accessTier: "companion",
      editionType: "companion",
      title: "The adaptive value framework",
      isUpgrade: false,
    };
  }

  // 2. Value Drift Index
  if (name.includes("value drift") || prodId === "ba9acc66-a824-47c4-a4aa-5abb1a153437" || prodKey === "vdi") {
    return {
      productId: VALUE_DRIFT_BOOK_ID,
      accessTier: "companion",
      editionType: "companion",
      title: "The value drift index",
      isUpgrade: false,
    };
  }

  // 3. Marketing Reclassified Editions
  // Online Reading Edition ($20.00 / 2000 cents)
  if (
    name.includes("online") ||
    item.access_type === "online" ||
    (priceCents >= 1800 && priceCents <= 2500 && !name.includes("companion"))
  ) {
    return {
      productId: DEFAULT_BOOK_ID,
      accessTier: "online",
      editionType: "online",
      title: "Marketing Reclassified — Online Reading Edition",
      isUpgrade: false,
    };
  }

  // Upgrade to Digital Companion Edition ($29.99 / ~2999 cents)
  if (
    name.includes("upgrade") ||
    item.used_upgrade_discount ||
    (priceCents >= 2700 && priceCents <= 3200 && name.includes("companion"))
  ) {
    return {
      productId: DEFAULT_BOOK_ID,
      accessTier: "companion",
      editionType: "companion",
      title: "Marketing Reclassified — Digital Companion Edition (Upgrade)",
      isUpgrade: true,
    };
  }

  // Default to Digital Companion Edition (Full download & online reader)
  return {
    productId: DEFAULT_BOOK_ID,
    accessTier: "companion",
    editionType: "companion",
    title: item.product_name || "Marketing Reclassified — Digital Companion Edition",
    isUpgrade: false,
  };
}

module.exports = {
  verifyPayhipSignature,
  mapPayhipProductToBook,
  DEFAULT_BOOK_ID,
  ADAPTIVE_VALUE_BOOK_ID,
  VALUE_DRIFT_BOOK_ID,
};
