const path = require('path');
const backendDir = 'd:/Bright Media WORK/siddiqui-backend/server';
const supabase = require(path.join(backendDir, 'config/supabaseClient'));

async function inspectSchema() {
  try {
    const { data, error } = await supabase.from('orders').select('*').limit(1);
    if (error) {
      console.error('Error selecting orders:', error.message);
    } else {
      console.log('Sample order row keys:', data.length > 0 ? Object.keys(data[0]) : 'orders table is empty');
      if (data.length > 0) {
        console.log('Sample row:', data[0]);
      }
    }
    
    // Check ebooks
    const { data: ebooks, error: ebErr } = await supabase.from('ebooks').select('*').limit(5);
    if (ebErr) {
      console.error('Error selecting ebooks:', ebErr.message);
    } else {
      console.log('Ebooks found:', ebooks.map(b => ({ id: b.id, title: b.title, price: b.price, sku: b.sku })));
    }
  } catch (e) {
    console.error('Inspect error:', e);
  }
}

inspectSchema();
