import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cneariiepqywvjpmznqn.supabase.co';
const SUPABASE_SERVICE_ROLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNuZWFyaWllcHF5d3ZqcG16bnFuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjQyMDMxNSwiZXhwIjoyMDg3OTk2MzE1fQ.lKho4GyKZ7HpFWBtpj5H6PypdFk-eFCXLPZ_HMALBCE';
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

async function testStatus() {
  const statuses = ['paid', 'completed', 'successful', 'pending', 'refunded', 'failed', 'cancelled', 'expired'];
  for (const s of statuses) {
    const res = await supabase.from('orders').insert([{
      id: 'c0000000-0000-0000-0000-00000000000' + statuses.indexOf(s),
      book_name: 'Status Test',
      amount: 50,
      status: s
    }]).select();

    if (res.error) {
      console.log(`status '${s}': REJECTED -> ${res.error.message}`);
    } else {
      console.log(`status '${s}': ALLOWED ✅`);
      await supabase.from('orders').delete().eq('id', 'c0000000-0000-0000-0000-00000000000' + statuses.indexOf(s));
    }
  }
}

testStatus().catch(console.error);
