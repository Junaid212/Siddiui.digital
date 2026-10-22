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
  const { data, error } = await supabase.auth.admin.generateLink({
    type: 'recovery',
    email: 'testadmin@example.com',
    options: { redirectTo: 'http://localhost:5173/reset-password' }
  });
  if (error) {
    console.error('generateLink error:', error.message);
  } else {
    console.log('generateLink success! Action link:', data.properties?.action_link);
  }
}

run();
