// Run this script once with: node copy-framework-images.js
const fs = require('fs');
const path = require('path');

const src = 'C:/Users/Lenovo/.gemini/antigravity-ide/brain/761ca760-9f4e-4f8b-9fba-748eb89bbf3f/';
const dst = path.join(__dirname, 'public/assets/images/img/');

try {
  fs.copyFileSync(src + 'framework_purpose_profit_1781261842000.png', dst + 'framework_a.png');
  fs.copyFileSync(src + 'framework_avf_1781261853104.png', dst + 'framework_b.png');
  fs.copyFileSync(src + 'framework_vdi_1781261862507.png', dst + 'framework_c.png');
  console.log('✅ Framework images copied successfully!');
} catch (e) {
  console.error('Error:', e.message);
}
