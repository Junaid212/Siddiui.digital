const fs = require('fs');
const nodemonConfig = {
  "watch": ["server.js", "controllers/", "routes/", "utils/", "config/"],
  "ignore": ["data/*", "data/**", "*.json", "recent_bookings.*", "test_*"]
};
fs.writeFileSync('d:/Bright Media WORK/siddiqui-backend/server/nodemon.json', JSON.stringify(nodemonConfig, null, 2), 'utf8');
console.log('Created nodemon.json in backend');
