const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const envPath = 'd:/Bright Media WORK/siddiqui-backend/server/.env';
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    env[parts[0].trim()] = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
  }
});

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE || env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  console.log('Testing Supabase Admin Auth...');
  const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 5 });
  if (error) {
    console.error('listUsers error:', error.message);
  } else {
    console.log('Users found:', data.users.length);
    data.users.forEach(u => {
      console.log('User:', u.email, 'providers:', u.app_metadata?.providers || u.app_metadata?.provider);
    });
  }
}

run();
