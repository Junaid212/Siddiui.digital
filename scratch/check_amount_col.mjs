import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cneariiepqywvjpmznqn.supabase.co';
const SUPABASE_SERVICE_ROLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNuZWFyaWllcHF5d3ZqcG16bnFuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjQyMDMxNSwiZXhwIjoyMDg3OTk2MzE1fQ.lKho4GyKZ7HpFWBtpj5H6PypdFk-eFCXLPZ_HMALBCE';
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

async function testAmount() {
  // Test with Math.round(49.99) vs 50 vs 49.99
  const test1 = await supabase.from('orders').insert([{
    id: 'b0000000-0000-0000-0000-000000000001',
    book_name: 'Test Int',
    amount: 50,
    status: 'test'
  }]).select();
  console.log('Integer 50 insert:', test1.error ? test1.error.message : 'SUCCESS');
  if (!test1.error) await supabase.from('orders').delete().eq('id', 'b0000000-0000-0000-0000-000000000001');

  const test2 = await supabase.from('orders').insert([{
    id: 'b0000000-0000-0000-0000-000000000002',
    book_name: 'Test Float',
    amount: 49.99,
    status: 'test'
  }]).select();
  console.log('Float 49.99 insert:', test2.error ? test2.error.message : 'SUCCESS');
  if (!test2.error) await supabase.from('orders').delete().eq('id', 'b0000000-0000-0000-0000-000000000002');
}

testAmount().catch(console.error);
