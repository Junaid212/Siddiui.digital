const path = require('path');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

// Read backend .env
const fs = require('fs');
const envPath = 'd:/Bright Media WORK/siddiqui-backend/server/.env';
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const supabase = createClient(envConfig.SUPABASE_URL, envConfig.SUPABASE_SERVICE_ROLE || envConfig.SUPABASE_SERVICE_ROLE_KEY);

async function testAdmin() {
  try {
    const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 5 });
    if (error) {
      console.error('Admin error:', error.message);
    } else {
      console.log('Admin auth connected! Total users:', data.users.length);
      data.users.forEach(u => console.log('User:', u.email, 'providers:', u.app_metadata?.providers, 'identities:', u.identities?.map(i => i.provider)));
    }
  } catch (e) {
    console.error('Exception:', e.message);
  }
}

testAdmin();
