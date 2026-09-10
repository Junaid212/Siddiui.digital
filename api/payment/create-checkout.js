const stripe = require('../_lib/stripe');
const supabase = require('../_lib/supabase');
const { getProductById, executeWithSchemaFallback } = require('../_lib/products');
const crypto = require('crypto');

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { productId, id, customerEmail, email, customerName, name, userId } = req.body || {};
  const resolvedId = productId || id;
  const resolvedEmail = (customerEmail || email || '').trim();
  const resolvedName = (customerName || name || '').trim() || 'Valued Customer';

  if (!resolvedId) {
    return res.status(400).json({ error: 'Product ID is required to initiate checkout.' });
  }

  if (!resolvedEmail) {
    return res.status(400).json({ error: 'Customer email is required for secure delivery.' });
  }

  try {
    const product = await getProductById(resolvedId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found in catalog.' });
    }

    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('placeholder')) {
      return res.status(500).json({
        error: 'Stripe is not configured in server environment variables. Please contact support.'
      });
    }

    const priceNum = Number(product.price);
    const currencyStr = (product.currency || 'AED').toLowerCase();
    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    const orderId = crypto.randomUUID();

    const host = req.headers.host ? `https://${req.headers.host}` : (process.env.CLIENT_URL || 'https://siddiqui.digital');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: resolvedEmail,
      line_items: [
        {
          price_data: {
            currency: currencyStr,
            product_data: {
              name: product.title,
              description: 'Official Digital Publication (PDF Edition) — Instant Delivery',
              images: product.cover_image && product.cover_image.startsWith('http') ? [product.cover_image] : undefined,
            },
            unit_amount: Math.round(priceNum * 100),
          },
          quantity: 1,
        }
      ],
      mode: 'payment',
      metadata: {
        orderId,
        orderNumber,
        productId: String(product.id),
        productName: product.title,
        customerName: resolvedName,
        customerEmail: resolvedEmail,
      },
      success_url: `${host}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${host}/order-cancel?product_id=${product.id}`,
    });

    const orderRecord = {
      id: orderId,
      user_id: userId || null,
      email: resolvedEmail,
      customer_name: resolvedName,
      product_id: product.id,
      order_number: orderNumber,
      stripe_session_id: session.id,
      book_name: product.title,
      amount: priceNum,
      currency: (product.currency || 'AED').toUpperCase(),
      status: 'pending',
      download_limit: product.download_limit || 3,
      download_expires_at: new Date(Date.now() + (product.download_expiry_hours || 72) * 3600 * 1000).toISOString(),
    };

    await executeWithSchemaFallback(
      (payload) => supabase.from('orders').insert([payload]),
      orderRecord
    );

    return res.json({
      url: session.url,
      sessionId: session.id,
      orderNumber,
      orderId,
    });
  } catch (error) {
    console.error('[create-checkout] Error:', error);
    return res.status(500).json({ error: error.message || 'Failed to create checkout session' });
  }
};
