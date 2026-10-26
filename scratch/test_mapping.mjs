import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const { resolvePayhipProductMapping, mapPayhipProductToBook } = require('d:/Bright Media WORK/siddiqui-backend/server/utils/payhipVerifier.js');

async function test() {
  const item = {
    product_name: 'Marketing Reclassified — Digital Companion Edition',
    price: 4999,
    access_type: 'companion'
  };
  const payload = {
    type: 'paid',
    id: 'test_123',
    email: 'test@example.com',
    price: 4999,
    items: [item]
  };

  console.log('Testing sync mapping:');
  console.log(mapPayhipProductToBook(item, payload));

  console.log('Testing async mapping:');
  const res = await resolvePayhipProductMapping(item, payload);
  console.log(res);
}

test().catch(console.error);
