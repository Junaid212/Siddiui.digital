const stripe = require('../_lib/stripe');
const supabase = require('../_lib/supabase');
const { executeWithSchemaFallback } = require('../_lib/products');
const crypto = require('crypto');

module.exports.config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    console.error('[stripe/webhook] Missing stripe-signature or STRIPE_WEBHOOK_SECRET');
    return res.status(400).send('Webhook Error: Missing signature or secret');
  }

  let event;
  try {
    const rawBody = await buffer(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error('[stripe/webhook] Signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(`[stripe/webhook] Verified Stripe event: ${event.type}`);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    if (session.payment_status !== 'paid') {
      console.warn(`[stripe/webhook] Session ${session.id} payment_status is ${session.payment_status}. Skipping.`);
      return res.json({ received: true, note: 'Payment not completed' });
    }

    const sessionId = session.id;
    const paymentIntentId = session.payment_intent || null;
    const metadata = session.metadata || {};
    const orderId = metadata.orderId || null;
    const customerEmail = session.customer_details?.email || metadata.customerEmail || session.customer_email;
    const customerName = metadata.customerName || session.customer_details?.name || "Valued Customer";

    // Lookup order
    let existingOrder = null;
    if (orderId) {
      const { data } = await supabase.from('orders').select('*').eq('id', orderId).maybeSingle();
      existingOrder = data;
    }
    if (!existingOrder && sessionId) {
      const { data } = await supabase.from('orders').select('*').eq('stripe_session_id', sessionId).maybeSingle();
      existingOrder = data;
    }

    // Idempotency
    if (existingOrder && (existingOrder.status === 'paid' || existingOrder.status === 'successful')) {
      return res.json({ received: true, idempotent: true });
    }

    const downloadToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 72 * 3600 * 1000).toISOString();

    const updatePayload = {
      status: 'paid',
      email: customerEmail || existingOrder?.email,
      customer_name: customerName,
      stripe_payment_intent_id: paymentIntentId,
      download_token: downloadToken,
      download_expires_at: expiresAt,
      download_count: 0,
      download_limit: 3,
    };

    if (existingOrder?.id) {
      await executeWithSchemaFallback(
        (payload) => supabase.from('orders').update(payload).eq('id', existingOrder.id),
        updatePayload
      );
    } else {
      await executeWithSchemaFallback(
        (payload) => supabase.from('orders').update(payload).eq('stripe_session_id', sessionId),
        updatePayload
      );
    }

    console.log(`[stripe/webhook] Order ${sessionId} marked as PAID.`);
  }

  if (event.type === 'checkout.session.expired') {
    await executeWithSchemaFallback(
      (payload) => supabase.from('orders').update(payload).eq('stripe_session_id', event.data.object.id),
      { status: 'expired' }
    );
  }

  if (event.type === 'payment_intent.payment_failed') {
    await executeWithSchemaFallback(
      (payload) => supabase.from('orders').update(payload).eq('stripe_session_id', event.data.object.id),
      { status: 'failed' }
    );
  }

  if (event.type === 'charge.refunded' || event.type === 'payment_intent.refunded') {
    const piId = event.data.object.payment_intent || event.data.object.id;
    await executeWithSchemaFallback(
      (payload) => supabase.from('orders').update(payload).or(`stripe_payment_intent_id.eq.${piId},stripe_session_id.eq.${piId}`),
      { status: 'refunded', refund_status: 'refunded', refund_date: new Date().toISOString() }
    );
  }

  return res.json({ received: true });
};
