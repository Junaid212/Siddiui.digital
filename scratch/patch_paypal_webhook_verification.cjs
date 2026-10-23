const fs = require('fs');
const path = require('path');

const backendDir = 'd:/Bright Media WORK/siddiqui-backend/server';
const apiLibDir = 'd:/Bright Media WORK/Siddiui.digital-main/Siddiui.digital-main/api/_lib';

function patch(filePath) {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');

  const startIdx = code.indexOf('async function verifyWebhookSignature(');
  const endIdx = code.indexOf('module.exports = {', startIdx);

  if (startIdx !== -1 && endIdx !== -1) {
    const newFn = `async function verifyWebhookSignature(headers, rawBody) {
  try {
    const webhookId = (process.env.PAYPAL_WEBHOOK_ID || "").trim();

    const authAlgo = headers["paypal-auth-algo"] || headers["PAYPAL-AUTH-ALGO"];
    const certUrl = headers["paypal-cert-url"] || headers["PAYPAL-CERT-URL"];
    const transmissionId = headers["paypal-transmission-id"] || headers["PAYPAL-TRANSMISSION-ID"];
    const transmissionSig = headers["paypal-transmission-sig"] || headers["PAYPAL-TRANSMISSION-SIG"];
    const transmissionTime = headers["paypal-transmission-time"] || headers["PAYPAL-TRANSMISSION-TIME"];

    if (!authAlgo || !certUrl || !transmissionId || !transmissionSig || !transmissionTime) {
      console.warn("[PayPal Webhook] Missing required PayPal signature headers.");
      return false;
    }

    if (!webhookId || webhookId.includes("placeholder")) {
      console.warn("[PayPal Webhook] PAYPAL_WEBHOOK_ID is not configured in server environment.");
      return false;
    }

    const token = await getAccessToken();
    const baseUrl = getPayPalBaseUrl();

    const webhookEvent = typeof rawBody === "string" ? JSON.parse(rawBody) : rawBody;

    const verificationPayload = {
      auth_algo: authAlgo,
      cert_url: certUrl,
      transmission_id: transmissionId,
      transmission_sig: transmissionSig,
      transmission_time: transmissionTime,
      webhook_id: webhookId,
      webhook_event: webhookEvent,
    };

    const response = await fetch(\`\${baseUrl}/v1/notifications/verify-webhook-signature\`, {
      method: "POST",
      headers: {
        "Authorization": \`Bearer \${token}\`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(verificationPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[PayPal Webhook] Verification API request failed:", response.status, errorText);
      return false;
    }

    const result = await response.json();
    return result.verification_status === "SUCCESS";
  } catch (err) {
    console.warn("[PayPal Webhook] Signature verification caught error:", err.message);
    return false;
  }
}

`;
    code = code.slice(0, startIdx) + newFn + code.slice(endIdx);
    fs.writeFileSync(filePath, code, 'utf8');
    console.log(`Successfully patched ${filePath}`);
  } else {
    console.warn(`Could not locate function boundaries in ${filePath}`);
  }
}

patch(path.join(backendDir, 'utils/paypalClient.js'));
if (fs.existsSync(apiLibDir)) {
  patch(path.join(apiLibDir, 'paypalClient.js'));
}
