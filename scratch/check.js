const http = require('http');

http.get('http://localhost:5000/api/health', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Backend response:', data));
}).on('error', err => console.error('Backend err:', err.message));

http.get('http://localhost:5001/api/public/products', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Admin products:', data.substring(0, 300)));
}).on('error', err => console.error('Admin err:', err.message));
