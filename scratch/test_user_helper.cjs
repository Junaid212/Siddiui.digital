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

async function findOrCreateUser(email, name) {
  // 1. Try to find existing
  const { data: listData } = await supabase.auth.admin.listUsers();
  const existing = listData?.users?.find(u => u.email?.toLowerCase() === email.toLowerCase());
  if (existing) {
    console.log('User already exists:', existing.id, existing.email);
    return existing;
  }
  // 2. Otherwise create
  const { data: newUser, error } = await supabase.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: { full_name: name },
  });
  if (error) {
    console.error('Create user error:', error.message);
    return null;
  }
  console.log('Created new user:', newUser.user.id);
  return newUser.user;
}

findOrCreateUser('testadmin@example.com', 'Test Admin');
