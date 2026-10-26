import fs from 'fs';
import path from 'path';

const backendPath = 'd:/Bright Media WORK/siddiqui-backend/server/package.json';
const adminPath = 'd:/Bright Media WORK/siddique-admin/server/package.json';

console.log('Testing access from Node process:');
console.log('Backend exists:', fs.existsSync(backendPath));
console.log('Admin exists:', fs.existsSync(adminPath));
if (fs.existsSync(backendPath)) {
  const pkg = JSON.parse(fs.readFileSync(backendPath, 'utf8'));
  console.log('Backend package name:', pkg.name, 'version:', pkg.version);
}
if (fs.existsSync(adminPath)) {
  const pkg = JSON.parse(fs.readFileSync(adminPath, 'utf8'));
  console.log('Admin package name:', pkg.name, 'version:', pkg.version);
}
