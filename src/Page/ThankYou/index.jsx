/**
 * ThankYou/index.jsx - the page that thanks the buyer and confirms the order. Two ways to arrive:
 *   1. /thank-you?waiting=1  - the buyer clicked "continue to Payhip": Payhip opened in a NEW TAB and this tab stays here, shows
 *      "complete your payment on Payhip" and flips to the thank-you by itself when the order arrives. (Needs nothing from Payhip.)
 *   2. /thank-you            - Payhip's "redirect after purchase" sends the buyer here (if the shop owner has set that up).
 * Payhip tells our server about a payment a few seconds after checkout, so the page looks for the order and then links to My Library.
 */
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { api } from "../../api";
import { useCart } from "../../Components/Cart/CartContext";
import HeadTitle from "../../Components/Head/HeadTitle";
import BannerInnerSection from "../../Components/Banner/inner";
import { readCheckout, forgetCheckout } from "../../utils/checkoutMemory";
import "../../Components/OrderSuccess/OrderSuccess.css";
import "./ThankYou.css";

// (window.__TY_* only lets the automated browser test run quickly; real visitors always get the timings below)
const FAST_MS = (typeof window !== "undefined" && Number(window.__TY_POLL_MS)) || 0;
const FAST_TRIES = (typeof window !== "undefined" && Number(window.__TY_POLL_TRIES)) || 0;
// arrived from Payhip's redirect: the payment is done, so just a short wait for the order to reach us
const AFTER_PAYMENT = { everyMs: 4000, tries: 24 }; // about 96 seconds
// waiting for the buyer to pay in the other tab: every 5 s for 2 minutes, then every 15 s, up to 30 minutes in all
const WHILE_PAYING = { fastTries: 24, everyMs: 5000, slowEveryMs: 15000, tries: 24 + 108 };

function isPaid(o) {
  const s = String(o?.status || "").toLowerCase();
  return s === "paid" || s === "successful";
}

export default function ThankYouPage() {
  const { clearCart } = useCart();
  const [searchParams] = useSearchParams();
  const [memory] = useState(() => readCheckout());
  const waitingForPayment = searchParams.get("waiting") === "1" && !!memory;
  const [user, setUser] = useState(undefined); // undefined = still reading the session
  const [order, setOrder] = useState(null);
  const [giveUp, setGiveUp] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    // keep noindex: this is a private confirmation page
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => { document.head.removeChild(meta); };
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null)).catch(() => setUser(null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  // Look for the new order (signed-in buyers only: the server only ever shows a customer their own orders).
  useEffect(() => {
    if (!user?.email || order) return undefined;
    let alive = true;
    let tries = 0;
    let timer = null;
    // orders created shortly before the checkout started do not count (10 minutes of clock tolerance)
    const since = (memory?.at || Date.now() - 6 * 60 * 60 * 1000) - 10 * 60 * 1000;
    const maxTries = FAST_TRIES || (waitingForPayment ? WHILE_PAYING.tries : AFTER_PAYMENT.tries);
    const delay = (n) => FAST_MS || (waitingForPayment ? (n <= WHILE_PAYING.fastTries ? WHILE_PAYING.everyMs : WHILE_PAYING.slowEveryMs) : AFTER_PAYMENT.everyMs);

    const check = async () => {
      tries += 1;
      let found = null;
      try {
        const r = await api.listMyOrders(user.email);
        const list = r && r.ok && Array.isArray(r.data?.orders) ? r.data.orders : [];
        found = list
          .filter((o) => isPaid(o) && new Date(o.created_at || o.paid_at || 0).getTime() >= since)
          .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))[0] || null;
      } catch (_) { /* try again */ }
      if (!alive) return;
      if (found) {
        setOrder(found);
      } else if (tries >= maxTries) {
        setGiveUp(true);
      } else {
        timer = setTimeout(check, delay(tries));
      }
    };
    check();
    return () => { alive = false; if (timer) clearTimeout(timer); };
  }, [user, memory, order, waitingForPayment]);

  // The buyer has paid: the cart (and its offer discount) must not be left behind, and the tab title tells them to look.
  useEffect(() => {
    if (!order) return;
    clearCart();
    forgetCheckout();
    document.title = "✓ Order confirmed | Siddiqui.Digital";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

  // Arrived from Payhip's redirect without the order being looked up (e.g. signed out): the payment is done, so clear the cart too.
  useEffect(() => {
    if (!waitingForPayment && memory) clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signIn = async () => {
    setAuthLoading(true);
    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.href, scopes: "openid email profile" },
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const productName = order?.book_name || order?.ebook_title || memory?.title || "Marketing Reclassified";
  const buyerEmail = memory?.email || user?.email || "";
  const paying = waitingForPayment && !order; // the buyer has not paid yet (as far as we know)

  const signedOutBox = (
    <div className="thankyou-status wait" data-testid="thank-you-signin" role="status">
      <strong>{paying ? "Sign in so we can confirm your order" : "Next: sign in to see your book"}</strong>
      <span>
        Sign in with the same email you use at checkout{buyerEmail ? <> (<b>{buyerEmail}</b>)</> : null}. Your purchase then appears in My
        Library, and your access details are sent to that email.
      </span>
      <div className="thankyou-actions">
        <button type="button" className="thankyou-btn primary" onClick={signIn} disabled={authLoading} data-testid="thank-you-signin-btn">
          {authLoading ? "Opening…" : "Sign in with Google"}
        </button>
        <Link to="/my-library" className="thankyou-btn">Go to My Library</Link>
      </div>
    </div>
  );

  return (
    <>
      <HeadTitle title={paying ? "Complete your payment | Siddiqui.Digital" : "Thank you | Siddiqui.Digital"} />
      <BannerInnerSection title={paying ? "Almost There" : "Thank You"} currentPage={paying ? "Complete Payment" : "Order Confirmation"} />
      <section className="ordersuccess-section">
        <div className="ordersuccess-container">
          <div className="ordersuccess-card thankyou-card" data-testid="thank-you">
            <div className="ordersuccess-header" style={{ textAlign: "center" }}>
              <div className={`thankyou-check ${paying ? "paying" : ""}`} aria-hidden="true">{paying ? "…" : "✓"}</div>
              {paying ? (
                <>
                  <h1 className="thankyou-title" data-testid="paying-title">Complete your payment on Payhip</h1>
                  <p className="thankyou-lead">
                    Payhip opened in a new tab to take your payment for <strong>{productName}</strong>. Pay there, then come back to this tab:
                    it confirms your order by itself.
                  </p>
                </>
              ) : (
                <>
                  <h1 className="thankyou-title">Thank you for your purchase!</h1>
                  <p className="thankyou-lead">
                    We are grateful you chose <strong>{productName}</strong>. Your payment was handled securely by Payhip.
                  </p>
                </>
              )}
            </div>

            {/* ── Order status ── */}
            {order ? (
              <div className="thankyou-status ok" data-testid="thank-you-confirmed" role="status">
                <strong>Your order is confirmed ✓</strong>
                <span>
                  {order.order_number ? <>Order <b>{order.order_number}</b> · </> : null}{productName}
                </span>
                <span>It is now in your library. Your access details are also on their way to your email.</span>
                <div className="thankyou-actions">
                  <Link to="/my-library" className="thankyou-btn primary" data-testid="go-library">Go to My Library</Link>
                  <Link to="/" className="thankyou-btn">Back to the website</Link>
                </div>
              </div>
            ) : user === null ? (
              signedOutBox
            ) : giveUp ? (
              paying ? (
                <div className="thankyou-status wait" data-testid="thank-you-slow" role="status">
                  <strong>We have not seen your payment yet</strong>
                  <span>
                    If you finished paying on Payhip, your purchase will appear in My Library within a few minutes and your access details
                    will arrive by email{buyerEmail ? <> at <b>{buyerEmail}</b></> : null}. If you did not pay, you can start again.
                  </span>
                  <div className="thankyou-actions">
                    <Link to="/my-library" className="thankyou-btn primary" data-testid="go-library">Go to My Library</Link>
                    <Link to="/publications/marketing-reclassified" className="thankyou-btn">Back to the book</Link>
                  </div>
                </div>
              ) : (
                <div className="thankyou-status wait" data-testid="thank-you-slow" role="status">
                  <strong>Your payment is being processed</strong>
                  <span>
                    Sometimes confirmation takes a few minutes. You do not need to do anything: your purchase will appear in My Library and
                    your access details will arrive by email{buyerEmail ? <> at <b>{buyerEmail}</b></> : null}.
                  </span>
                  <div className="thankyou-actions">
                    <Link to="/my-library" className="thankyou-btn primary" data-testid="go-library">Go to My Library</Link>
                    <Link to="/contact" className="thankyou-btn">Need help? Contact us</Link>
                  </div>
                </div>
              )
            ) : paying ? (
              <div className="thankyou-status wait" data-testid="thank-you-paying" role="status" aria-live="polite">
                <strong><span className="thankyou-spinner" aria-hidden="true" /> Waiting for your payment…</strong>
                <span>Keep this tab open. As soon as Payhip confirms your payment, you will see your order here.{buyerEmail ? <> On Payhip, use the same email (<b>{buyerEmail}</b>) so your purchase appears in your library.</> : null}</span>
                <div className="thankyou-actions">
                  {memory?.payhipUrl ? (
                    <a href={memory.payhipUrl} target="_blank" rel="noopener noreferrer" className="thankyou-btn primary" data-testid="reopen-payhip">
                      Payhip did not open? Open it again
                    </a>
                  ) : null}
                  <Link to="/publications/marketing-reclassified" className="thankyou-btn">Changed your mind? Back to the book</Link>
                </div>
              </div>
            ) : (
              <div className="thankyou-status wait" data-testid="thank-you-checking" role="status" aria-live="polite">
                <strong><span className="thankyou-spinner" aria-hidden="true" /> Confirming your order…</strong>
                <span>This usually takes a few seconds. Please keep this page open.</span>
              </div>
            )}

            <ol className="thankyou-steps">
              <li>{paying ? "Pay on Payhip (the tab that just opened)." : "Payhip confirms your payment to us."}</li>
              <li>Your purchase is added to <b>My Library</b>.</li>
              <li>You receive an email with your access details.</li>
            </ol>
          </div>
        </div>
      </section>
    </>
  );
}
