const supabase = require('../../_lib/supabase');
const { getProductById, resolveProductFilePath, DEFAULT_PRODUCTS, findOrderByIdentifier } = require('../../_lib/products');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { identifier } = req.query;

  if (!identifier || identifier === 'undefined' || identifier === 'null') {
    return res.status(400).json({ error: 'Invalid order identifier.' });
  }

  try {
    const order = await findOrderByIdentifier(identifier);

    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    const isExpired = order.download_expires_at ? new Date() > new Date(order.download_expires_at) : false;
    const isLimitReached = (Number(order.download_count) || 0) >= (Number(order.download_limit) || 3);
    const isRefunded = order.status === 'refunded';
    const isPaid = order.status === 'paid' || order.status === 'successful';

    let hasFile = false;
    let productTitle = order.book_name || 'Digital Publication';

    if (order.product_id) {
      const prod = await getProductById(order.product_id);
      if (prod) {
        productTitle = prod.title || productTitle;
        hasFile = !!resolveProductFilePath(prod);
      }
    } else {
      const fallback = DEFAULT_PRODUCTS.find(p => p.title?.toLowerCase() === (order.book_name || '').toLowerCase());
      hasFile = !!resolveProductFilePath(fallback);
    }

    return res.json({
      order: {
        id: order.id,
        order_number: order.order_number || `ORD-${order.id ? order.id.substring(0, 8).toUpperCase() : 'UNKNOWN'}`,
        book_name: productTitle,
        product_id: order.product_id || null,
        amount: Number(order.amount) || 0,
        currency: order.currency || 'AED',
        status: order.status,
        email: order.email || null,
        download_token: order.download_token || order.stripe_session_id || order.id,
        download_count: Number(order.download_count) || 0,
        download_limit: Number(order.download_limit) || 3,
        download_expires_at: order.download_expires_at || null,
        isExpired,
        isLimitReached,
        isRefunded,
        isPaid,
        hasFile,
        created_at: order.created_at || new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('[order-status] Error:', error);
    return res.status(500).json({ error: 'Failed to query order status.' });
  }
};
