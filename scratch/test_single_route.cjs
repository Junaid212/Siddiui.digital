const http = require('http');

fetch('http://localhost:5000/api/health')
  .then(r => r.json())
  .then(d => console.log('Backend health:', d))
  .catch(e => console.error('Health error:', e.message));

fetch('http://localhost:5000/api/webhooks/payhip', { method: 'POST' })
  .then(r => r.text())
  .then(t => console.log('Payhip webhook response:', t))
  .catch(e => console.error('Webhook error:', e.message));
