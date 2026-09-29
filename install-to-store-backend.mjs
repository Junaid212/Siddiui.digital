import fs from 'fs';
import path from 'path';

const srcBase = 'd:/Bright Media WORK/Siddiui.digital-main/Siddiui.digital-main/dist/backend-files';
const targetBase = 'd:/Bright Media WORK/siddiqui-backend/server';

const files = [
  { src: 'discountController.js', dst: 'controllers/discountController.js' },
  { src: 'cartController.js', dst: 'controllers/cartController.js' },
  { src: 'paymentRoutes.js', dst: 'routes/paymentRoutes.js' },
];

for (const f of files) {
  const s = path.join(srcBase, f.src);
  const d = path.join(targetBase, f.dst);
  fs.mkdirSync(path.dirname(d), { recursive: true });
  fs.copyFileSync(s, d);
  console.log(`Copied ${f.src} -> ${d} (${fs.statSync(d).size} bytes)`);
}
console.log('ALL BACKEND FILES INSTALLED SUCCESSFULLY TO siddiqui-backend/server');
