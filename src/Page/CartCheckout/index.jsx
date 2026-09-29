/**
 * CartCheckoutPage.jsx — Combined multi-item checkout page.
 * Supports: all cart items in one Stripe session, discount codes,
 * customer info (pre-filled for Supabase users), order summary.
 */
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "../../supabaseClient";
import { useCart } from "../../Components/Cart/CartContext";
import HeadTitle from "../../Components/Head/HeadTitle";
import { api } from "../../api";
import "./CartCheckout.css";

const isLocalhost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
const API_BASE = isLocalhost ? "http://localhost:5000/api" : "/api";

export default function CartCheckoutPage() {
  const { items, subtotal, discountAmount, discountData, discountCode, total, currency,
    setDiscountCode, setDiscountData, clearDiscount, clearCart } = useCart();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState({});

  const [discountInput, setDiscountInput] = useState(discountCode || "");
  const [discountLoading, setDiscountLoading] = useState(false);
  const [discountError, setDiscountError] = useState("");

  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  /* ── Auth ───────────────────────────────────────── */
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setFormData(prev => ({
          name: session.user.user_metadata?.full_name || prev.name,
          email: session.user.email || prev.email,
          phone: prev.phone,
        }));
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setFormData(prev => ({
          name: session.user.user_metadata?.full_name || prev.name,
          email: session.user.email || prev.email,
          phone: prev.phone,
        }));
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    setAuthLoading(true);
    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.href },
      });
    } finally {
      setAuthLoading(false);
    }
  };

  /* ── Form ───────────────────────────────────────── */
  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Full name is required";
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) errs.email = "Email address is required";
    else if (!emailRe.test(formData.email.trim())) errs.email = "Please enter a valid email";
    return errs;
  };

  /* ── Discount ───────────────────────────────────── */
  const handleApplyDiscount = async () => {
    const code = discountInput.trim().toUpperCase();
    if (!code) return;
    setDiscountLoading(true);
    setDiscountError("");
    try {
      const data = await api.validateDiscount(code, subtotal);
      if (data && data.valid && data.discount) {
        setDiscountCode(code);
        setDiscountData(data.discount);
      } else {
        setDiscountError(data?.error || "Invalid or expired coupon code.");
      }
    } catch {
      setDiscountError("Unable to verify coupon code. Please try again.");
    } finally {
      setDiscountLoading(false);
    }
  };

  /* ── Checkout ───────────────────────────────────── */
  const handleCheckout = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setCheckoutLoading(true);
    setCheckoutError("");

    try {
      const lineItems = items.map(item => ({
        productId: item.productId,
        title: item.title,
        accessType: item.accessType || "download",
        accessLabel: item.accessLabel,
        price: Number(item.price),
        currency: item.currency || currency,
        quantity: item.quantity || 1,
      }));

      const res = await fetch(`${API_BASE}/payment/create-cart-checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.name.trim(),
          customerEmail: formData.email.trim(),
          customerPhone: formData.phone.trim() || null,
          userId: user?.id || null,
          lineItems,
          discountCode: discountData ? discountCode : null,
          discountAmount: discountAmount || 0,
          currency,
        }),
      });

      const result = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(result.error || `Checkout failed (${res.status})`);
      }

      if (result && result.url) {
        window.location.href = result.url;
      } else {
        throw new Error(result.error || "Failed to create checkout session.");
      }
    } catch (err) {
      console.error("Cart checkout error:", err);
      setCheckoutError(err.message || "Unable to start checkout. Please try again.");
      setCheckoutLoading(false);
    }
  };

  /* ── Format ─────────────────────────────────────── */
  const fmt = (amount) => `${currency} ${Number(amount).toFixed(2)}`;

  /* ── Empty cart ─────────────────────────────────── */
  if (items.length === 0) {
    return (
      <>
        <HeadTitle title="Checkout | Siddiqui.Digital" />
        <div className="checkout-page">
          <div className="checkout-container">
            <div className="checkout-empty">
              <div style={{ fontSize: "4rem", marginBottom: "16px" }}>🛒</div>
              <h2>Your cart is empty</h2>
              <p>Add some publications to your cart before checking out.</p>
              <Link
                to="/publications"
                className="cart-checkout-btn"
                style={{ width: "auto", textDecoration: "none", padding: "12px 28px", fontSize: "0.9rem" }}
              >
                <i className="fa-solid fa-book-open" />
                Browse Publications
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <HeadTitle title="Secure Checkout | Siddiqui.Digital" />
      <div className="checkout-page">
        <div className="checkout-container">

          {/* Breadcrumb */}
          <nav className="checkout-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span className="checkout-breadcrumb-sep">/</span>
            <Link to="/publications">Publications</Link>
            <span className="checkout-breadcrumb-sep">/</span>
            <span className="checkout-breadcrumb-current">Checkout</span>
          </nav>

          <div className="checkout-heading">
            <h1><i className="fa-solid fa-lock" style={{ color: "#c80808", marginRight: 12, fontSize: "0.85em" }} />Secure Checkout</h1>
            <p>Review your order and enter your details to complete purchase via Stripe.</p>
          </div>

          <form onSubmit={handleCheckout} noValidate>
            <div className="checkout-grid">

              {/* ── Left Column ─────────────────── */}
              <div>
                {/* Customer Info Card */}
                <motion.div
                  className="checkout-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <h2 className="checkout-card-title">
                    <i className="fa-solid fa-user" />
                    Customer Information
                  </h2>

                  {/* Social Sign-in */}
                  {!user && (
                    <div className="checkout-auth-row">
                      <button
                        type="button"
                        className="checkout-google-btn"
                        onClick={handleGoogleSignIn}
                        disabled={authLoading}
                        id="checkout-google-btn"
                      >
                        <img
                          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                          alt="Google"
                          width={16}
                          height={16}
                        />
                        {authLoading ? "Signing in..." : "Sign in with Google"}
                      </button>
                      <span className="checkout-auth-divider">or fill in manually</span>
                    </div>
                  )}

                  {user && (
                    <div className="checkout-auth-row" style={{ marginBottom: 16 }}>
                      <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 6 }}>
                        <i className="fa-solid fa-circle-check" style={{ color: "#059669" }} />
                        Signed in as <strong style={{ color: "var(--text-primary)" }}>{user.email}</strong>
                      </span>
                    </div>
                  )}

                  <div className="checkout-form-grid">
                    <div className="checkout-form-group">
                      <label className="checkout-form-label" htmlFor="checkout-name">Full Name *</label>
                      <input
                        id="checkout-name"
                        name="name"
                        type="text"
                        className={`checkout-form-input ${errors.name ? "error" : ""}`}
                        value={formData.name}
                        onChange={handleInput}
                        placeholder="Your full name"
                        autoComplete="name"
                      />
                      {errors.name && <span style={{ fontSize: "0.75rem", color: "#dc2626" }}>{errors.name}</span>}
                    </div>

                    <div className="checkout-form-group">
                      <label className="checkout-form-label" htmlFor="checkout-email">Email Address *</label>
                      <input
                        id="checkout-email"
                        name="email"
                        type="email"
                        className={`checkout-form-input ${errors.email ? "error" : ""}`}
                        value={formData.email}
                        onChange={handleInput}
                        placeholder="you@example.com"
                        autoComplete="email"
                      />
                      {errors.email && <span style={{ fontSize: "0.75rem", color: "#dc2626" }}>{errors.email}</span>}
                    </div>

                    <div className="checkout-form-group full-width">
                      <label className="checkout-form-label" htmlFor="checkout-phone">Phone (optional)</label>
                      <input
                        id="checkout-phone"
                        name="phone"
                        type="tel"
                        className="checkout-form-input"
                        value={formData.phone}
                        onChange={handleInput}
                        placeholder="+971 50 000 0000"
                        autoComplete="tel"
                      />
                    </div>
                  </div>

                  <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: 12, marginBottom: 0, lineHeight: 1.5 }}>
                    <i className="fa-solid fa-circle-info" style={{ marginRight: 4, color: "#c80808" }} />
                    Your digital download links will be sent to the email address above after payment is confirmed.
                  </p>
                </motion.div>

                {/* Order Items Card */}
                <motion.div
                  className="checkout-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.08 }}
                >
                  <h2 className="checkout-card-title">
                    <i className="fa-solid fa-bag-shopping" />
                    Order Items ({items.length})
                  </h2>
                  <div className="checkout-items-list">
                    {items.map(item => (
                      <CheckoutItem key={item.id} item={item} fmt={fmt} />
                    ))}
                  </div>
                </motion.div>

                {/* Error */}
                {checkoutError && (
                  <div className="checkout-error-msg" role="alert">
                    <i className="fa-solid fa-circle-exclamation" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>{checkoutError}</span>
                  </div>
                )}
              </div>

              {/* ── Right Column — Summary ───────── */}
              <motion.div
                className="checkout-summary"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.12 }}
              >
                <div className="checkout-card">
                  <h2 className="checkout-summary-title">
                    <i className="fa-solid fa-receipt" style={{ color: "#c80808", marginRight: 8 }} />
                    Order Summary
                  </h2>

                  {/* Items mini-list */}
                  {items.map(item => (
                    <div className="checkout-summary-row" key={item.id}>
                      <span style={{ maxWidth: "60%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.title}
                      </span>
                      <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{fmt(item.price)}</span>
                    </div>
                  ))}

                  <div className="checkout-section-divider" />

                  {/* Discount Code */}
                  {discountData ? (
                    <div className="checkout-discount-active">
                      <i className="fa-solid fa-tag" />
                      <span>{discountCode} — {discountData.description || `Discount applied`}</span>
                      <button
                        type="button"
                        onClick={() => { clearDiscount(); setDiscountInput(""); setDiscountError(""); }}
                        aria-label="Remove discount"
                      >
                        <i className="fa-solid fa-xmark" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="checkout-discount-form">
                        <input
                          type="text"
                          className="checkout-discount-input"
                          placeholder="Discount code"
                          value={discountInput}
                          onChange={(e) => setDiscountInput(e.target.value.toUpperCase())}
                          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleApplyDiscount())}
                          maxLength={30}
                          id="checkout-discount-input"
                          aria-label="Discount code"
                        />
                        <button
                          type="button"
                          className="checkout-discount-apply"
                          onClick={handleApplyDiscount}
                          disabled={discountLoading || !discountInput.trim()}
                          id="checkout-discount-apply-btn"
                        >
                          {discountLoading ? <span className="checkout-spinner" /> : "Apply"}
                        </button>
                      </div>
                      {discountError && (
                        <div className="checkout-discount-error" role="alert">
                          <i className="fa-solid fa-circle-exclamation" />{discountError}
                        </div>
                      )}
                    </>
                  )}

                  <div className="checkout-section-divider" />

                  {/* Totals */}
                  <div className="checkout-summary-row subtotal" style={{ color: "var(--text-primary)" }}>
                    <span>Subtotal</span>
                    <span style={{ fontWeight: 600 }}>{fmt(subtotal)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="checkout-summary-row discount">
                      <span><i className="fa-solid fa-tag" style={{ marginRight: 4 }} />Discount</span>
                      <span>− {fmt(discountAmount)}</span>
                    </div>
                  )}

                  <div className="checkout-summary-row">
                    <span>Digital Delivery</span>
                    <span style={{ color: "#059669", fontWeight: 600 }}>FREE</span>
                  </div>

                  <div className="checkout-summary-total">
                    <span>Total</span>
                    <span style={{ color: "#c80808" }}>{fmt(total)}</span>
                  </div>

                  <button
                    type="submit"
                    className="checkout-submit-btn"
                    disabled={checkoutLoading || items.length === 0}
                    id="checkout-submit-btn"
                  >
                    {checkoutLoading ? (
                      <><span className="checkout-spinner" /> Connecting to Stripe…</>
                    ) : (
                      <><i className="fa-solid fa-lock" /> Pay {fmt(total)} Securely</>
                    )}
                  </button>

                  <div className="checkout-trust-row">
                    <span><i className="fa-solid fa-lock" />SSL Secured</span>
                    <span><i className="fa-brands fa-stripe" />Powered by Stripe</span>
                    <span><i className="fa-solid fa-bolt" />Instant Delivery</span>
                  </div>

                  <p style={{ fontSize: "0.72rem", color: "var(--text-secondary)", textAlign: "center", marginTop: 12, lineHeight: 1.5 }}>
                    By completing purchase you agree to our terms. All products are non-refundable digital goods delivered instantly.
                  </p>
                </div>
              </motion.div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

/* ── Item row in order list ──────────────────────────────────── */
function CheckoutItem({ item, fmt }) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <div className="checkout-item">
      {imgErr || !item.coverImage ? (
        <div className="checkout-item-cover-fallback">
          <i className="fa-solid fa-book" />
        </div>
      ) : (
        <img
          src={item.coverImage}
          alt={item.title}
          className="checkout-item-cover"
          onError={() => setImgErr(true)}
          loading="lazy"
        />
      )}
      <div className="checkout-item-info">
        <div className="checkout-item-title">{item.title}</div>
        <div className="checkout-item-type">
          <i className={item.accessType === "online" ? "fa-solid fa-globe" : "fa-solid fa-download"} style={{ color: "#c80808", fontSize: "0.65rem" }} />
          {item.accessLabel || (item.accessType === "online" ? "Online Access" : "Downloadable Edition")}
        </div>
      </div>
      <div className="checkout-item-price">{fmt(item.price)}</div>
    </div>
  );
}
