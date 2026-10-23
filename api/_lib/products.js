const supabase = require('./supabase');
const { getOrderMetadata, findOrderMetadataByToken, saveOrderMetadata } = require('./orderStore');

const DEFAULT_PRODUCTS = [
  {
    id: "04b84648-3609-4b31-9ded-2486bacf1e74",
    sku: "EBOOK-001",
    title: "Marketing Reclassified",
    author: "M. Q. Siddiqui",
    product_type: "ebook",
    short_description: "From transaction to human progress. The definitive strategic playbook for modern digital marketing.",
    description: "From transaction to human progress. Marketing Reclassified breaks down cutting-edge marketing frameworks, behavioral psychology, and sustainable growth engines.",
    price: 99.00,
    currency: "AED",
    format: "PDF",
    cover_image: "https://cneariiepqywvjpmznqn.supabase.co/storage/v1/object/public/product-covers/1788934311298-book1.webp",
    file_path: "ebooks/marketing-reclassified.pdf",
    active: true,
    download_limit: 3,
    download_expiry_hours: 72,
  },
  {
    id: "b4492051-cce5-4213-974b-72c74da19196",
    sku: "EBOOK-002",
    title: "The adaptive value framework",
    author: "M. Q. Siddiqui",
    product_type: "ebook",
    short_description: "A practical approach to creating sustainable value in a changing world.",
    description: "A practical approach to creating sustainable value in a changing world.",
    price: 49.00,
    currency: "AED",
    format: "PDF",
    cover_image: "https://cneariiepqywvjpmznqn.supabase.co/storage/v1/object/public/product-covers/1788934505865-book3.webp",
    file_path: null,
    active: true,
    download_limit: 3,
    download_expiry_hours: 72,
  },
  {
    id: "ba9acc66-a824-47c4-a4aa-5abb1a153437",
    sku: "EBOOK-003",
    title: "The value drift index",
    author: "M. Q. Siddiqui",
    product_type: "ebook",
    short_description: "Practical tool for measuring managing and preventing value drift.",
    description: "Practical tool for measuring managing and preventing value drift.",
    price: 79.00,
    currency: "AED",
    format: "PDF",
    cover_image: "https://cneariiepqywvjpmznqn.supabase.co/storage/v1/object/public/product-covers/1788934420360-book2.webp",
    file_path: null,
    active: true,
    download_limit: 3,
    download_expiry_hours: 72,
  }
];

function resolveProductFilePath(product) {
  if (!product) return null;
  const prodId = String(product.id || "");
  if (product.file_path) return product.file_path;
  if (prodId === "04b84648-3609-4b31-9ded-2486bacf1e74" || product.title?.toLowerCase().includes("marketing reclassified")) {
    return "ebooks/marketing-reclassified.pdf";
  }
  return null;
}

async function getProductById(id) {
  try {
    const { data } = await supabase.from('ebooks').select('*').eq('id', id).maybeSingle();
    if (data) {
      return {
        ...data,
        price: Number(data.price) || 49.00,
        currency: data.currency || 'AED',
        file_path: resolveProductFilePath(data),
      };
    }
  } catch (e) {}

  const fallback = DEFAULT_PRODUCTS.find(p => p.id === id || String(p.sku) === id);
  return fallback || null;
}

async function executeWithSchemaFallback(operationFn, payload) {
  let currentPayload = { ...payload };
  while (true) {
    const res = await operationFn(currentPayload);
    if (!res.error) return res;

    const match = res.error.message?.match(/Could not find the '([^']+)' column/i) ||
                  res.error.message?.match(/column ['"]?([a-zA-Z0-9_]+)['"]? of ['"]?orders['"]? does not exist/i) ||
                  res.error.message?.match(/column ['"]?([a-zA-Z0-9_]+)['"]? does not exist/i);

    if (match && match[1] && currentPayload.hasOwnProperty(match[1])) {
      delete currentPayload[match[1]];
      if (Object.keys(currentPayload).length === 0) return res;
      continue;
    }
    return res;
  }
}

async function findOrderByIdentifier(identifier) {
  if (!identifier) return null;
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);

  let order = null;

  // 1. Try finding by stripe_session_id
  if (identifier.startsWith("cs_")) {
    try {
      const { data } = await supabase.from("orders").select("*").eq("stripe_session_id", identifier).maybeSingle();
      if (data) order = data;
    } catch (e) {}
  }

  // 2. Try finding by UUID id
  if (!order && isUUID) {
    try {
      const { data } = await supabase.from("orders").select("*").eq("id", identifier).maybeSingle();
      if (data) order = data;
    } catch (e) {}
  }

  // 3. Try finding by paypal_order_id or paypal_capture_id
  if (!order) {
    try {
      const { data } = await supabase.from("orders").select("*").or(`paypal_order_id.eq.${identifier},paypal_capture_id.eq.${identifier}`).maybeSingle();
      if (data) order = data;
    } catch (e) {}
  }

  // 4. Try finding by payhip_transaction_id
  if (!order) {
    try {
      const { data } = await supabase.from("orders").select("*").eq("payhip_transaction_id", identifier).maybeSingle();
      if (data) order = data;
    } catch (e) {}
  }

  // 5. Try finding by order_number
  if (!order && String(identifier).startsWith("ORD-")) {
    try {
      const { data } = await supabase.from("orders").select("*").eq("order_number", identifier).maybeSingle();
      if (data) order = data;
    } catch (e) {}
  }

  // 6. Try finding by download_token in Supabase if column exists
  if (!order) {
    try {
      const { data } = await supabase.from("orders").select("*").eq("download_token", identifier).maybeSingle();
      if (data) order = data;
    } catch (e) {}
  }

  // 7. Try finding in persistent orderStore
  const meta = findOrderMetadataByToken(identifier);
  if (meta && !order && meta.orderId) {
    try {
      const { data } = await supabase.from("orders").select("*").eq("id", meta.orderId).maybeSingle();
      if (data) order = data;
    } catch (e) {}
  }

  // Merge and return
  if (order) {
    const orderMeta = getOrderMetadata(order.id) || {};
    return {
      ...order,
      order_number: order.order_number || orderMeta.order_number || `ORD-${order.id ? order.id.substring(0, 8).toUpperCase() : 'UNKNOWN'}`,
      product_id: order.product_id || orderMeta.product_id || null,
      email: order.email || orderMeta.email || null,
      customer_name: order.customer_name || orderMeta.customer_name || null,
      payment_provider: order.payment_provider || orderMeta.payment_provider || (order.stripe_session_id ? 'stripe' : order.paypal_order_id ? 'paypal' : 'payhip'),
      access_tier: order.access_tier || orderMeta.access_tier || (Number(order.amount) < 30 ? 'online' : 'companion'),
      download_token: order.download_token || orderMeta.download_token || order.stripe_session_id || order.id,
      download_count: Number(order.download_count !== undefined ? order.download_count : (orderMeta.download_count || 0)),
      download_limit: Number(order.download_limit !== undefined ? order.download_limit : (orderMeta.download_limit !== undefined ? orderMeta.download_limit : 3)),
      download_expires_at: order.download_expires_at || orderMeta.download_expires_at || null,
    };
  }

  if (meta) {
    return {
      id: meta.orderId,
      book_name: meta.productName || meta.book_name || "Digital Publication",
      amount: meta.amount || 49.00,
      currency: meta.currency || "USD",
      status: meta.status || "paid",
      payment_provider: meta.payment_provider || "paypal",
      access_tier: meta.access_tier || (Number(meta.amount) < 30 ? "online" : "companion"),
      ...meta,
    };
  }

  return null;
}

module.exports = {
  DEFAULT_PRODUCTS,
  resolveProductFilePath,
  getProductById,
  executeWithSchemaFallback,
  findOrderByIdentifier,
};
