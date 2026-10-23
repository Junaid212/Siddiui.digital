const fs = require('fs');

const envPath = 'd:/Bright Media WORK/siddiqui-backend/server/.env';
let envContent = fs.readFileSync(envPath, 'utf8');

envContent = envContent.replace(
  /PAYHIP_API_KEY=.*/,
  'PAYHIP_API_KEY=test_payhip_secret_key_12345'
);

fs.writeFileSync(envPath, envContent, 'utf8');
console.log('Set PAYHIP_API_KEY in backend .env to test_payhip_secret_key_12345');
