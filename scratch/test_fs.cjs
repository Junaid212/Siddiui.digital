const fs = require('fs');
const testFile = 'd:/Bright Media WORK/siddiqui-backend/server/test_write.tmp';
try {
  fs.writeFileSync(testFile, 'ok');
  console.log('Node fs write success!');
  fs.unlinkSync(testFile);
  console.log('Node fs delete success!');
} catch (e) {
  console.error('Node fs write failed:', e.message);
}
