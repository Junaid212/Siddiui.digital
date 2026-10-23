const crypto = require("crypto");
const path = require("path");

const backendDir = "d:/Bright Media WORK/siddiqui-backend/server";
const { payhipWebhook } = require(path.join(backendDir, "controllers/payhipController.js"));

async function simulate() {
  process.env.PAYHIP_API_KEY = "test_payhip_secret_key_12345";
  const apiKey = process.env.PAYHIP_API_KEY;
  const signature = crypto.createHash("sha256").update(apiKey).digest("hex");

  const testTxId = `TX_${Date.now()}`;
  const payload = {
    id: testTxId,
    email: "test_reader@example.com",
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
    signature,
  };

  const req = {
    body: payload,
    headers: {},
  };

  const res = {
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(obj) {
      console.log(`[SIMULATE RES] Status: ${this.statusCode || 200}`, JSON.stringify(obj, null, 2));
      return this;
    }
  };

  console.log("Calling payhipWebhook directly...");
  try {
    await payhipWebhook(req, res);
    console.log("payhipWebhook completed without throwing!");
  } catch (err) {
    console.error("payhipWebhook THREW AN ERROR:", err);
  }
}

simulate();
