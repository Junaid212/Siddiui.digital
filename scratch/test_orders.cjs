const http = require('http');

http.get('http://localhost:5000/api/payment/my-orders?email=test@example.com', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('My orders test:', data));
}).on('error', err => console.error(err));
