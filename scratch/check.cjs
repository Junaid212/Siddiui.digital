const http = require('http');

http.get('http://localhost:5000/api/payment/check-ownership?email=test@example.com', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => console.log('Check ownership test:', data));
});
