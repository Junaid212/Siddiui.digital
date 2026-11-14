// Remembers, in this browser only, that the buyer just left for Payhip (who, what, when), so the thank-you page they come back to
// can recognise the order. Nothing here is sent anywhere.
const KEY = "siddiqui_last_checkout";
const MAX_AGE_MS = 6 * 60 * 60 * 1000;

export function rememberCheckout(info) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...info, at: Date.now() }));
  } catch (_) { /* storage blocked: the thank-you page still works without it */ }
}

export function readCheckout() {
  try {
    const o = JSON.parse(localStorage.getItem(KEY) || "null");
    if (o && typeof o === "object" && Date.now() - Number(o.at) < MAX_AGE_MS) return o;
  } catch (_) { /* ignore */ }
  return null;
}

export function forgetCheckout() {
  try { localStorage.removeItem(KEY); } catch (_) { /* ignore */ }
}

// Opens Payhip in a NEW tab (called straight from the buyer's click, so browsers allow it). Returns false if a pop-up blocker
// stopped it: the caller then goes to Payhip in this tab instead.
export function openPayhipTab(url) {
  try {
    const w = window.open(url, "_blank");
    if (w) {
      try { w.opener = null; } catch (_) { /* ignore */ }
      return true;
    }
  } catch (_) { /* blocked */ }
  return false;
}
