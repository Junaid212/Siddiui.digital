const path = require('path');
const backendDir = 'd:/Bright Media WORK/siddiqui-backend/server';
const supabase = require(path.join(backendDir, 'config/supabaseClient'));

async function testSql() {
  const { data, error } = await supabase.rpc('exec_sql', { query: 'SELECT 1;' });
  console.log('rpc exec_sql:', { data, error: error?.message });
}

testSql();
