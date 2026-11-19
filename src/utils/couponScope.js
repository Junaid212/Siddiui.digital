// couponScope.js - which cart items a coupon applies to ("Applies to" set in the admin). Same rules as the servers.
// applies_to: [] / missing = every product; otherwise a list of keys: "companion" | "online" | "other" | "product:<uuid>".

/** The scope key of a cart item (accessType: online | companion | upgrade | anything else). */
export function itemScopeKey(item) {
  const t = String((item && (item.accessType || item.access_type || item.edition)) || "").toLowerCase();
  if (t === "companion" || t === "upgrade") return "companion";
  if (t === "online") return "online";
  return "other";
}

export function couponAppliesToItem(appliesTo, item) {
  if (!Array.isArray(appliesTo) || appliesTo.length === 0) return true;
  const pid = String((item && (item.productId || item.product_id)) || "").toLowerCase();
  return appliesTo.includes(itemScopeKey(item)) || (!!pid && appliesTo.includes(`product:${pid}`));
}

/** The part of the cart a coupon may reduce: the whole subtotal for an ordinary coupon, only the covered items for a restricted one. */
export function eligibleSubtotal(items, appliesTo) {
  return (Array.isArray(items) ? items : []).reduce(
    (sum, i) => sum + (couponAppliesToItem(appliesTo, i) ? (Number(i.price) || 0) * (Number(i.quantity) || 1) : 0),
    0
  );
}

/** What the server needs to judge a restricted coupon. */
export function cartItemsForCoupon(items) {
  return (Array.isArray(items) ? items : []).map((i) => ({ productId: i.productId, accessType: i.accessType }));
}
