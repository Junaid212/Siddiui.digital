const fs = require('fs');
const path = require('path');

const srcPayhip = path.resolve(__dirname, '../api/_lib/payhipVerifier.js');
const destPayhip = path.resolve('d:/Bright Media WORK/siddiqui-backend/server/utils/payhipVerifier.js');

fs.copyFileSync(srcPayhip, destPayhip);
console.log('Successfully deployed payhipVerifier.js to', destPayhip);
