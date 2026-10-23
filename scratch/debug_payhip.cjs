const crypto = require('crypto');

async function test() {
  const apiKey = 'test_payhip_secret_key_12345';
  const signature = crypto.createHash('sha256').update(apiKey).digest('hex');
  const txId = 'test_tx_new_' + Date.now();
  const payload = {
    id: txId,
    email: 'new_buyer_' + Date.now() + '@example.com',
    type: 'paid',
    price: 4999,
    currency: 'USD',
    items: [
      {
        product_id: '2804256',
        product_name: 'Marketing Reclassified (Digital Companion Edition)',
        price: 4999,
        quantity: 1
      }
    ],
    signature
  };

  console.log('Sending payload for txId:', txId);
  const startTime = Date.now();
  try {
    const r = await fetch('http://localhost:5000/api/webhooks/payhip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    console.log(`Response received in ${Date.now() - startTime}ms`);
    console.log('Status:', r.status);
    const text = await r.text();
    console.log('Body:', text);
  } catch (err) {
    console.error(`Failed after ${Date.now() - startTime}ms:`, err);
  }
}

test();
