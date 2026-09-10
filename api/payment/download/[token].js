const supabase = require('../../_lib/supabase');
const { getProductById, resolveProductFilePath, executeWithSchemaFallback, findOrderByIdentifier } = require('../../_lib/products');
const { saveOrderMetadata } = require('../../_lib/orderStore');

module.exports = async function handler(req, res) {
  const token = req.query.token || req.query.order_id || req.query.session_id;

  if (!token || token === 'undefined' || token === 'null') {
    return res.status(400).json({ error: 'Download token is required.' });
  }

  try {
    const order = await findOrderByIdentifier(token);

    if (!order) {
      return res.status(404).json({
        error: 'Invalid download link. Please check your order confirmation or request a replacement.'
      });
    }

    if (order.status === 'refunded') {
      return res.status(403).json({ error: 'This order has been refunded. Digital download access is revoked.' });
    }

    if (order.status !== 'paid' && order.status !== 'successful') {
      return res.status(403).json({ error: 'Payment verification pending. Please complete payment before downloading.' });
    }

    if (order.download_expires_at && new Date() > new Date(order.download_expires_at)) {
      return res.status(410).json({ error: 'This download link has expired (72-hour window). Please request a replacement link.' });
    }

    const currentCount = Number(order.download_count || 0);
    const limit = Number(order.download_limit || 3);
    if (currentCount >= limit) {
      return res.status(403).json({ error: `Maximum download limit reached (${currentCount} of ${limit} downloads used).` });
    }

    let product = null;
    if (order.product_id) {
      product = await getProductById(order.product_id);
    }
    if (!product && order.book_name) {
      const { data: byName } = await supabase.from('ebooks').select('*').ilike('title', `%${order.book_name}%`).maybeSingle();
      product = byName;
    }

    const specificFilePath = resolveProductFilePath(product);
    if (!specificFilePath) {
      return res.status(404).json({
        error: `No PDF publication file is currently attached to "${product?.title || order.book_name || 'this product'}". Please contact support at info@siddiqui.digital.`
      });
    }

    const candidateBuckets = ['digital-products', 'product-covers', 'blogs'];
    let fileBuffer = null;

    for (const bucketName of candidateBuckets) {
      const cleanPath = specificFilePath.startsWith(`${bucketName}/`) ? specificFilePath.replace(`${bucketName}/`, '') : specificFilePath;
      const { data: fileData, error: fileErr } = await supabase.storage.from(bucketName).download(cleanPath);
      if (fileData && !fileErr) {
        const arrayBuffer = await fileData.arrayBuffer();
        fileBuffer = Buffer.from(arrayBuffer);
        break;
      }
    }

    if (!fileBuffer) {
      return res.status(404).json({
        error: `The publication file for "${product?.title || order.book_name}" could not be retrieved from storage. Please contact info@siddiqui.digital.`
      });
    }

    if (order.id) {
      saveOrderMetadata(order.id, { download_count: currentCount + 1 });
      await executeWithSchemaFallback(
        (payload) => supabase.from('orders').update(payload).eq('id', order.id),
        { download_count: currentCount + 1 }
      );
    }

    const safeTitle = (product?.title || order.book_name || 'Digital-Publication')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .replace(/_+/g, '_');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}.pdf"`);
    res.setHeader('Content-Length', fileBuffer.length);
    return res.end(fileBuffer);
  } catch (err) {
    console.error('[download] Error:', err);
    return res.status(500).json({ error: 'Failed to download protected file.' });
  }
};
