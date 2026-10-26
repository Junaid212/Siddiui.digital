import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cneariiepqywvjpmznqn.supabase.co';
const SUPABASE_SERVICE_ROLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNuZWFyaWllcHF5d3ZqcG16bnFuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjQyMDMxNSwiZXhwIjoyMDg3OTk2MzE1fQ.lKho4GyKZ7HpFWBtpj5H6PypdFk-eFCXLPZ_HMALBCE';
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

async function testInsert() {
  const testPayload = {
    id: 'a0000000-0000-0000-0000-000000000001',
    user_id: null,
    email: 'test.comp@example.com',
    customer_name: 'QA Companion Reader',
    product_id: '04b84648-3609-4b31-9ded-2486bacf1e74',
    order_number: 'ORD-TEST-1',
    book_name: 'Marketing Reclassified — Digital Companion Edition',
    amount: Math.round(49.99), // 50
    currency: 'USD',
    status: 'paid',
    payment_provider: 'payhip',
    payhip_transaction_id: 'test_comp_tx_1',
    provider_transaction_id: 'test_comp_tx_1',
    access_tier: 'companion',
    is_upgrade: false,
    download_token: 'abc123token',
    download_expires_at: new Date(Date.now() + 72*3600*1000).toISOString(),
    download_count: 0,
    download_limit: 3,
    webhook_event_id: 'test_comp_tx_1',
    raw_metadata: { exact_amount: '49.99', test: true }
  };

  console.log('Inserting test companion order with rounded integer amount...');
  const { data, error } = await supabase.from('orders').insert([testPayload]).select();
  console.log('Error:', error);
  console.log('Data:', data ? data[0]?.id : null);

  if (!error) {
    await supabase.from('orders').delete().eq('id', testPayload.id);
    console.log('Deleted test order.');
  }
}

testInsert().catch(console.error);
