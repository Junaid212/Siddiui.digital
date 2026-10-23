const fs = require('fs');
const path = require('path');

const envPath = 'd:/Bright Media WORK/siddiqui-backend/server/.env';
let envContent = fs.readFileSync(envPath, 'utf8');

const keysToAdd = [
  '# PayPal Configuration (Sandbox for development, live for production)',
  'PAYPAL_MODE=sandbox',
  'PAYPAL_CLIENT_ID=sandbox_client_id_placeholder',
  'PAYPAL_CLIENT_SECRET=sandbox_client_secret_placeholder',
  'PAYPAL_WEBHOOK_ID=sandbox_webhook_id_placeholder',
  '',
  '# Payhip Webhook Configuration',
  'PAYHIP_API_KEY=payhip_api_key_placeholder',
  'PAYHIP_ONLINE_PRODUCT_ID=',
  'PAYHIP_COMPANION_PRODUCT_ID=',
  'PAYHIP_UPGRADE_PRODUCT_ID=',
  ''
];

let updated = false;
for (const line of keysToAdd) {
  const key = line.split('=')[0];
  if (key && !key.startsWith('#') && !envContent.includes(key + '=')) {
    envContent += '\n' + line;
    updated = true;
  }
}

if (updated) {
  fs.writeFileSync(envPath, envContent, 'utf8');
  console.log('Appended PayPal and Payhip placeholders to backend .env');
} else {
  console.log('Backend .env already contains PayPal/Payhip keys');
}
