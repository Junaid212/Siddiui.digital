const supabase = require('../_lib/supabase');
const { executeWithSchemaFallback } = require('../_lib/products');
const crypto = require('crypto');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email, orderNumber } = req.body || {};
  if (!email || !email.trim()) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  try {
    let query = supabase.from('orders').select('*').ilike('email', email.trim());
    if (orderNumber && orderNumber.trim()) {
      const cleanNum = orderNumber.trim();
      query = query.or(`order_number.ilike.%${cleanNum}%,stripe_session_id.ilike.%${cleanNum}%,id.ilike.%${cleanNum}%`);
    }

    const { data: orders, error } = await query;
    if (error || !orders || orders.length === 0) {
      return res.status(404).json({ error: 'No matching orders found for this email address.' });
    }

    const paidOrder = orders.find(o => o.status === 'paid' || o.status === 'successful');
    if (!paidOrder) {
      return res.status(400).json({ error: 'No active paid orders found.' });
    }

    const newExpiresAt = new Date(Date.now() + 72 * 3600 * 1000).toISOString();
    const newDownloadToken = crypto.randomBytes(32).toString('hex');

    await executeWithSchemaFallback(
      (payload) => supabase.from('orders').update(payload).eq('id', paidOrder.id),
      {
        download_token: newDownloadToken,
        download_expires_at: newExpiresAt,
        download_count: Math.min(paidOrder.download_count || 0, 2),
      }
    );

    return res.json({
      success: true,
      message: 'A replacement download link has been refreshed for your account.'
    });
  } catch (err) {
    console.error('[request-replacement] Error:', err);
    return res.status(500).json({ error: 'Failed to process replacement request.' });
  }
};
