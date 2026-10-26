import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const BACKEND_URL = 'http://localhost:5000';
const SUPABASE_URL = 'https://cneariiepqywvjpmznqn.supabase.co';
const SUPABASE_SERVICE_ROLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNuZWFyaWllcHF5d3ZqcG16bnFuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjQyMDMxNSwiZXhwIjoyMDg3OTk2MzE1fQ.lKho4GyKZ7HpFWBtpj5H6PypdFk-eFCXLPZ_HMALBCE';
const PAYHIP_API_KEY = '20fc74d4446102aea1032b949db9dfc80e7aabf1';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

function generatePayhipSignature(apiKey) {
  return crypto.createHash('sha256').update(apiKey).digest('hex');
}

async function runTestSuite() {
  console.log('====================================================');
  console.log('🧪 SIDDIQUI.DIGITAL PAYHIP & ACCESS TEST SUITE');
  console.log('====================================================\n');

  const validSignature = generatePayhipSignature(PAYHIP_API_KEY);
  const invalidSignature = generatePayhipSignature('wrong-fake-key');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  // --- Test 1: Invalid Signature Rejection ---
  console.log('Test 1: Signature Verification Security');
  try {
    const res = await fetch(`${BACKEND_URL}/api/webhooks/payhip`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'paid',
        id: 'test_tx_fake_' + Date.now(),
        signature: invalidSignature,
        email: 'attacker@example.com',
        price: 2000
      })
    });
    assert(res.status === 400, `Rejected invalid signature with HTTP ${res.status}`);
  } catch (e) {
    assert(false, `Test 1 request failed: ${e.message}`);
  }

  // --- Test 2: Fabricated Redirect does not grant access ---
  console.log('\nTest 2: Fabricated Redirect / Token Access');
  try {
    const res = await fetch(`${BACKEND_URL}/api/payment/order-status/fabricated-token-${Date.now()}`);
    assert(res.status === 404, `Fabricated token rejected by order-status API with HTTP ${res.status}`);
  } catch (e) {
    assert(false, `Test 2 request failed: ${e.message}`);
  }

  // --- Test 3: Online Reading Edition Webhook Processing ($20) ---
  console.log('\nTest 3: Online Reading Edition ($20) Purchase Webhook');
  const onlineTxId = 'test_payhip_online_' + Date.now();
  const testBuyerEmail = 'qa.reader.' + Date.now() + '@example.com';

  try {
    const res = await fetch(`${BACKEND_URL}/api/webhooks/payhip`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'paid',
        id: onlineTxId,
        signature: validSignature,
        email: testBuyerEmail,
        currency: 'USD',
        price: 2000, // $20.00 in cents
        product_name: 'Marketing Reclassified — Online Reading Edition',
        items: [{
          product_name: 'Marketing Reclassified — Online Reading Edition',
          price: 2000,
          customer_name: 'QA Online Reader',
          access_type: 'online'
        }]
      })
    });

    const json = await res.json();
    assert(res.status === 200 && json.success === true, `Webhook accepted paid event for Online Edition`);

    // Verify record in Supabase
    const { data: orders } = await supabase.from('orders').select('*').eq('payhip_transaction_id', onlineTxId);
    assert(orders && orders.length === 1, `Order record created in Supabase with payhip_transaction_id: ${onlineTxId}`);
    const onlineOrder = orders ? orders[0] : null;

    if (onlineOrder) {
      assert(onlineOrder.access_tier === 'online', `access_tier correctly set to 'online'`);
      assert(onlineOrder.payment_provider === 'payhip', `payment_provider correctly set to 'payhip'`);
      assert(!onlineOrder.download_token, `download_token is null for Online Reading Edition`);
      assert(Number(onlineOrder.download_limit) === 0, `download_limit is 0 for Online Reading Edition`);

      // Test Online Reader Access
      const readRes = await fetch(`${BACKEND_URL}/api/payment/read/${onlineOrder.id}`);
      assert(readRes.status === 200, `Online reader streams book for authorized online reader (HTTP ${readRes.status})`);
      const contentType = readRes.headers.get('content-type');
      assert(contentType && contentType.includes('application/pdf'), `Reader returns PDF stream (content-type: ${contentType})`);

      // Test Download Access (Must be blocked with 403 Forbidden!)
      const dlRes = await fetch(`${BACKEND_URL}/api/payment/download/${onlineOrder.id}`);
      assert(dlRes.status === 403, `PDF download forbidden for Online Reading Edition (HTTP ${dlRes.status})`);
    }
  } catch (e) {
    assert(false, `Test 3 failed: ${e.message}`);
  }

  // --- Test 4: Idempotency of Webhook ---
  console.log('\nTest 4: Webhook Idempotency Check (Duplicate Prevention)');
  try {
    const dupRes = await fetch(`${BACKEND_URL}/api/webhooks/payhip`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'paid',
        id: onlineTxId, // same transaction ID
        signature: validSignature,
        email: testBuyerEmail,
        currency: 'USD',
        price: 2000,
        items: [{ product_name: 'Marketing Reclassified — Online Reading Edition', price: 2000 }]
      })
    });
    const dupJson = await dupRes.json();
    assert(dupRes.status === 200 && dupJson.idempotent === true, `Duplicate webhook recognized as idempotent`);

    const { data: countOrders } = await supabase.from('orders').select('id').eq('payhip_transaction_id', onlineTxId);
    assert(countOrders && countOrders.length === 1, `No duplicate order created in database (count: ${countOrders?.length})`);
  } catch (e) {
    assert(false, `Test 4 failed: ${e.message}`);
  }

  // --- Test 5: Digital Companion Edition Purchase Webhook ($49.99) ---
  console.log('\nTest 5: Digital Companion Edition ($49.99) Purchase Webhook');
  const compTxId = 'test_payhip_comp_' + Date.now();
  const testCompEmail = 'qa.companion.' + Date.now() + '@example.com';

  try {
    const res = await fetch(`${BACKEND_URL}/api/webhooks/payhip`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'paid',
        id: compTxId,
        signature: validSignature,
        email: testCompEmail,
        currency: 'USD',
        price: 4999, // $49.99
        product_name: 'Marketing Reclassified — Digital Companion Edition',
        items: [{
          product_name: 'Marketing Reclassified — Digital Companion Edition',
          price: 4999,
          customer_name: 'QA Companion Reader',
          access_type: 'companion'
        }]
      })
    });

    const json = await res.json();
    assert(res.status === 200 && json.success === true, `Webhook accepted paid event for Digital Companion Edition`);

    const { data: compOrders } = await supabase.from('orders').select('*').eq('payhip_transaction_id', compTxId);
    assert(compOrders && compOrders.length === 1, `Order record created for Companion Edition`);
    const compOrder = compOrders ? compOrders[0] : null;

    if (compOrder) {
      assert(compOrder.access_tier === 'companion', `access_tier correctly set to 'companion'`);
      assert(!!compOrder.download_token, `download_token generated for Companion Edition`);
      assert(Number(compOrder.download_limit) === 3, `download_limit is 3 for Companion Edition`);

      // Test Online Reader for Companion
      const readRes = await fetch(`${BACKEND_URL}/api/payment/read/${compOrder.id}`);
      assert(readRes.status === 200, `Online reader accessible to Companion purchaser (HTTP ${readRes.status})`);

      // Test Download Endpoint for Companion
      const dlRes = await fetch(`${BACKEND_URL}/api/payment/download/${compOrder.download_token}`);
      assert(dlRes.status === 200, `Companion download endpoint successfully streams PDF (HTTP ${dlRes.status})`);
      const dlType = dlRes.headers.get('content-type');
      assert(dlType && (dlType.includes('application/pdf') || dlType.includes('application/octet-stream')), `File content streamed with valid mime type (${dlType})`);
    }
  } catch (e) {
    assert(false, `Test 5 failed: ${e.message}`);
  }

  // --- Test 6: Upgrade Purchase Webhook ($29.99) ---
  console.log('\nTest 6: Upgrade ($29.99) Purchase Webhook');
  const upTxId = 'test_payhip_upgrade_' + Date.now();

  try {
    const res = await fetch(`${BACKEND_URL}/api/webhooks/payhip`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'paid',
        id: upTxId,
        signature: validSignature,
        email: testBuyerEmail,
        currency: 'USD',
        price: 2999, // $29.99
        product_name: 'Marketing Reclassified — Digital Companion Edition (Upgrade)',
        items: [{
          product_name: 'Marketing Reclassified — Digital Companion Edition (Upgrade)',
          price: 2999,
          customer_name: 'QA Upgraded Reader'
        }]
      })
    });

    const json = await res.json();
    assert(res.status === 200 && json.success === true, `Webhook accepted paid event for Upgrade`);

    const { data: upOrders } = await supabase.from('orders').select('*').eq('payhip_transaction_id', upTxId);
    assert(upOrders && upOrders.length === 1, `Upgrade order record created`);
    const upOrder = upOrders ? upOrders[0] : null;

    if (upOrder) {
      assert(upOrder.access_tier === 'companion', `Upgrade order grants 'companion' access tier`);
      assert(upOrder.is_upgrade === true, `is_upgrade flag set to true`);
      assert(!!upOrder.download_token, `download_token granted upon upgrade`);

      // Check download
      const dlRes = await fetch(`${BACKEND_URL}/api/payment/download/${upOrder.download_token}`);
      assert(dlRes.status === 200, `Upgraded customer can download companion file (HTTP ${dlRes.status})`);
    }
  } catch (e) {
    assert(false, `Test 6 failed: ${e.message}`);
  }

  // --- Test 7: Refund Webhook and Entitlement Revocation ---
  console.log('\nTest 7: Refund Webhook & Immediate Revocation');
  try {
    const refRes = await fetch(`${BACKEND_URL}/api/webhooks/payhip`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'refunded',
        id: compTxId,
        signature: validSignature,
        email: testCompEmail
      })
    });
    const refJson = await refRes.json();
    assert(refRes.status === 200 && refJson.refunded === true, `Webhook processed refunded event`);

    // Verify order in Supabase
    const { data: refundedOrders } = await supabase.from('orders').select('*').eq('payhip_transaction_id', compTxId);
    const refundedOrder = refundedOrders ? refundedOrders[0] : null;
    assert(refundedOrder && refundedOrder.status === 'refunded', `Order status updated to 'refunded'`);

    // Verify download is revoked
    const dlRevoked = await fetch(`${BACKEND_URL}/api/payment/download/${refundedOrder?.download_token}`);
    assert(dlRevoked.status === 403, `Download access revoked after refund (HTTP ${dlRevoked.status})`);

    // Verify reader is revoked
    const readRevoked = await fetch(`${BACKEND_URL}/api/payment/read/${refundedOrder?.id}`);
    assert(readRevoked.status === 403, `Online reader access revoked after refund (HTTP ${readRevoked.status})`);
  } catch (e) {
    assert(false, `Test 7 failed: ${e.message}`);
  }

  // --- Clean up test orders ---
  console.log('\nCleaning up test orders from Supabase...');
  await supabase.from('orders').delete().in('payhip_transaction_id', [onlineTxId, compTxId, upTxId]);
  console.log('Test orders cleaned up.');

  console.log('\n====================================================');
  console.log(`📊 TEST SUITE SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) process.exit(1);
}

runTestSuite().catch(err => {
  console.error('Test suite error:', err);
  process.exit(1);
});
