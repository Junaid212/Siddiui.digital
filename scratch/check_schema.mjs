import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cneariiepqywvjpmznqn.supabase.co';
const SUPABASE_SERVICE_ROLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNuZWFyaWllcHF5d3ZqcG16bnFuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjQyMDMxNSwiZXhwIjoyMDg3OTk2MzE1fQ.lKho4GyKZ7HpFWBtpj5H6PypdFk-eFCXLPZ_HMALBCE';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

async function inspectSchema() {
  console.log('--- Inspecting Supabase Live Schema ---');

  // Check orders table
  console.log('\nChecking orders table...');
  const orderColumns = [
    'id', 'user_id', 'email', 'product_id', 'book_name', 'amount', 'currency', 'status',
    'created_at', 'updated_at', 'download_token', 'download_count', 'download_limit', 'download_expires_at',
    'stripe_session_id', 'payment_provider', 'provider_order_id', 'provider_transaction_id',
    'paypal_order_id', 'paypal_capture_id', 'payhip_transaction_id',
    'access_tier', 'is_upgrade', 'webhook_event_id', 'raw_metadata'
  ];

  for (const col of orderColumns) {
    const { error } = await supabase.from('orders').select(col).limit(1);
    if (error) {
      console.log(`  ❌ orders.${col}: MISSING or Error -> ${error.message} (${error.code})`);
    } else {
      console.log(`  ✅ orders.${col}: EXISTS`);
    }
  }

  // Check ebooks table
  console.log('\nChecking ebooks table...');
  const ebookColumns = [
    'id', 'title', 'sku', 'slug', 'price', 'currency', 'format',
    'cover_image', 'file_path', 'active', 'download_limit', 'download_expiry_hours',
    'description', 'author', 'product_type', 'who_its_for', 'faq', 'access_options',
    'related_frameworks', 'payhip_product_id', 'payhip_checkout_url', 'editions'
  ];

  for (const col of ebookColumns) {
    const { error } = await supabase.from('ebooks').select(col).limit(1);
    if (error) {
      console.log(`  ❌ ebooks.${col}: MISSING or Error -> ${error.message} (${error.code})`);
    } else {
      console.log(`  ✅ ebooks.${col}: EXISTS`);
    }
  }

  // Check sample product row in ebooks
  const { data: ebooks, error: ebErr } = await supabase.from('ebooks').select('*').eq('slug', 'marketing-reclassified');
  if (ebErr) {
    console.error('Error fetching ebooks:', ebErr);
  } else {
    console.log(`\nMarketing Reclassified record:`);
    console.log(JSON.stringify(ebooks[0], null, 2));
  }

  // Check sample order row in orders
  const { data: orders, error: ordErr } = await supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(3);
  if (ordErr) {
    console.error('Error fetching orders:', ordErr);
  } else {
    console.log(`\nFound ${orders.length} orders in database:`);
    orders.forEach(o => {
      console.log(`  - [${o.id}] email: ${o.email} | book: ${o.book_name} | amount: ${o.amount}`);
      console.log('    All keys:', Object.keys(o).join(', '));
    });
  }
}

inspectSchema().catch(console.error);
