const fs = require('fs');
const path = require('path');

const backendDir = 'd:/Bright Media WORK/siddiqui-backend/server';

const paypalSrc = path.resolve(__dirname, '../api/_lib/paypalController.js');
const paypalDest = path.join(backendDir, 'controllers/paypalController.js');
fs.copyFileSync(paypalSrc, paypalDest);
console.log('Deployed paypalController.js to', paypalDest);

const payhipSrc = path.resolve(__dirname, '../api/_lib/payhipController.js');
const payhipDest = path.join(backendDir, 'controllers/payhipController.js');
fs.copyFileSync(payhipSrc, payhipDest);
console.log('Deployed payhipController.js to', payhipDest);

const orderStoreSrc = path.resolve(__dirname, '../api/_lib/orderStore.js');
const orderStoreDest = path.join(backendDir, 'utils/orderStore.js');
fs.copyFileSync(orderStoreSrc, orderStoreDest);
console.log('Deployed orderStore.js to', orderStoreDest);
