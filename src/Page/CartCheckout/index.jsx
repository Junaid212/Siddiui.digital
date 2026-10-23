/**
 * CartCheckoutPage.jsx — Combined multi-item checkout page.
 * Supports: all cart items in one Stripe session, discount codes,
 * customer info, email verification, ownership checks & upgrade discount,
 * mandatory legal agreement, and delivery messaging tailored by edition.
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

  const [formData, setFormData] = useState({ name: "", email: "", confirmEmail: "", phone: "" });
  const [sendUpdates, setSendUpdates] = useState(false);
  const [agreedLegal, setAgreedLegal] = useState(false);
  const [errors, setErrors] = useState({});

  const [discountInput, setDiscountInput] = useState(discountCode || "");
  const [discountLoading, setDiscountLoading] = useState(false);
  const [discountError, setDiscountError] = useState("");

  const [ownershipInfo, setOwnershipInfo] = useState(null);
  const [checkingOwnership, setCheckingOwnership] = useState(false);

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
          confirmEmail: session.user.email || prev.confirmEmail,
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
          confirmEmail: session.user.email || prev.confirmEmail,
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

  /* ── Check Ownership based on Email ─────────────── */
  const activeEmail = (user?.email || formData.email || "").trim().toLowerCase();
  useEffect(() => {
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!activeEmail || !emailRe.test(activeEmail)) {
      setOwnershipInfo(null);
      return;
    }

    let isMounted = true;
    setCheckingOwnership(true);
    api.checkOwnership(activeEmail)
      .then(info => {
        if (isMounted) {
          setOwnershipInfo(info);
        }
      })
      .catch(() => {
        if (isMounted) setOwnershipInfo(null);
      })
      .finally(() => {
        if (isMounted) setCheckingOwnership(false);
      });

    return () => { isMounted = false; };
  }, [activeEmail]);

  /* ── Edition Detection & Ownership Rules ────────── */
  const hasCompanionInCart = items.some(item =>
    Number(item.price) >= 40 ||
    item.accessType === "companion" ||
    item.accessType === "download" ||
    String(item.title).toLowerCase().includes("companion")
  );

  const hasOnlineInCart = items.some(item =>
    item.accessType === "online" ||
    (Number(item.price) < 40 && !item.isUpgrade) ||
    String(item.title).toLowerCase().includes("online")
  );

  // Blocking logic:
  // 1. Owns $49.99 edition -> blocks buying either edition
  // 2. Owns $20 edition -> blocks buying $20 edition
  let blockedReason = null;
  let canUpgradeInCart = false;

  if (ownershipInfo) {
    if (ownershipInfo.ownsCompanion) {
      if (hasCompanionInCart || hasOnlineInCart) {
        blockedReason = "You already own the Digital Companion Edition ($49.99), which includes full access to read online and all downloads.";
      }
    } else if (ownershipInfo.ownsOnline) {
      if (hasOnlineInCart) {
        blockedReason = "You already own the Online Reading Edition ($20).";
      } else if (hasCompanionInCart) {
        canUpgradeInCart = true;
      }
    }
  }

  // Delivery copy dynamically tailored by edition:
  // $20: "You will receive access to read online."
  // $49.99: "You will receive online access and your download links."
  const deliveryMessage = hasCompanionInCart
    ? "You will receive online access and your download links."
    : "You will receive access to read online.";

  // Upgrade difference calculation ($49.99 - $20 = $29.99)
  const upgradeDiscountAmount = canUpgradeInCart ? 20.00 : 0;
  const effectiveSubtotal = Math.max(0, subtotal - upgradeDiscountAmount);
  const effectiveTotal = Math.max(0, total - upgradeDiscountAmount);

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
    const cleanEmail = formData.email.trim();
    if (!cleanEmail) {
      errs.email = "Email address is required";
    } else if (!emailRe.test(cleanEmail)) {
      errs.email = "Please enter a valid email address";
    }

    const cleanConfirm = formData.confirmEmail.trim();
    if (!cleanConfirm) {
      errs.confirmEmail = "Please confirm your email address to avoid typos";
    } else if (cleanConfirm.toLowerCase() !== cleanEmail.toLowerCase()) {
      errs.confirmEmail = "Email addresses do not match. Please verify carefully.";
    }

    if (!agreedLegal) {
      errs.legal = "You must tick the checkbox to agree to the Terms of Use, Refund Policy and Privacy Policy before paying.";
    }

    return errs;
  };

  /* ── Discount ───────────────────────────────────── */
  const handleApplyDiscount = async () => {
    const code = discountInput.trim().toUpperCase();
    if (!code) return;
    setDiscountLoading(true);
    setDiscountError("");
    try {
      const data = await api.validateDiscount(code, effectiveSubtotal);
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

    if (blockedReason) {
      setCheckoutError("Cannot proceed with this purchase because you already own this book edition.");
      return;
    }

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setCheckoutLoading(true);
    setCheckoutError("");

    try {
      // Build line items, adjusting price for upgrade if applicable
      const lineItems = items.map(item => {
        const isCompanion = Number(item.price) >= 40 ||
          item.accessType === "companion" ||
          String(item.title).toLowerCase().includes("companion");

        let itemPrice = Number(item.price);
        let itemTitle = item.title;
        let accessLabel = item.accessLabel;

        if (canUpgradeInCart && isCompanion) {
          itemPrice = 29.99;
          itemTitle = `${item.title} (Upgrade from Online Edition)`;
          accessLabel = "Upgrade to Digital Companion Edition";
        }

        return {
          productId: item.productId,
          title: itemTitle,
          accessType: item.accessType || (isCompanion ? "companion" : "online"),
          accessLabel,
          price: itemPrice,
          currency: item.currency || currency,
          quantity: item.quantity || 1,
        };
      });

      const res = await fetch(`${API_BASE}/payment/paypal/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.name.trim(),
          customerEmail: formData.email.trim(),
          customerPhone: formData.phone.trim() || null,
          userId: user?.id || null,
          marketingOptIn: sendUpdates,
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
        throw new Error(result.error || "Failed to create PayPal checkout session.");
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
            <p>Review your order, verify your delivery email, and complete your purchase securely.</p>
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

                    <div className="checkout-form-group">
                      <label className="checkout-form-label" htmlFor="checkout-confirm-email">Confirm Email Address *</label>
                      <input
                        id="checkout-confirm-email"
                        name="confirmEmail"
                        type="email"
                        className={`checkout-form-input ${errors.confirmEmail ? "error" : ""}`}
                        value={formData.confirmEmail}
                        onChange={handleInput}
                        placeholder="Re-enter your email"
                        autoComplete="email"
                      />
                      {errors.confirmEmail && <span style={{ fontSize: "0.75rem", color: "#dc2626" }}>{errors.confirmEmail}</span>}
                    </div>

                    <div className="checkout-form-group">
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

                    {/* Mailing List Checkbox */}
                    <div className="checkout-form-group full-width" style={{ marginTop: 4 }}>
                      <label className="checkout-optin-checkbox">
                        <input
                          type="checkbox"
                          id="checkout-send-updates"
                          checked={sendUpdates}
                          onChange={(e) => setSendUpdates(e.target.checked)}
                        />
                        <span>Send me updates and new articles</span>
                      </label>
                    </div>
                  </div>

                  {/* Delivery Note Tailored by Edition */}
                  <div className="checkout-delivery-note">
                    <i className="fa-solid fa-circle-info" />
                    <span>{deliveryMessage}</span>
                  </div>
                </motion.div>

                {/* Ownership Blocking Banner */}
                {blockedReason && (
                  <motion.div
                    className="checkout-ownership-blocked-card"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="checkout-blocked-header">
                      <i className="fa-solid fa-circle-exclamation" />
                      <h3>You already own this edition</h3>
                    </div>
                    <p>{blockedReason}</p>
                    <Link to="/my-orders" className="checkout-my-books-btn">
                      <i className="fa-solid fa-book-open" /> Go to My Books
                    </Link>
                  </motion.div>
                )}

                {/* Upgrade Available Banner */}
                {canUpgradeInCart && !blockedReason && (
                  <motion.div
                    className="checkout-upgrade-banner"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="checkout-upgrade-badge">
                      <i className="fa-solid fa-bolt" /> UPGRADE DISCOUNT APPLIED · SAVE $20.00
                    </div>
                    <p>
                      Because you already own the <strong>Online Reading Edition ($20)</strong>, you are only charged the difference: <strong>USD 29.99</strong> for the full Digital Companion Edition and downloads.
                    </p>
                  </motion.div>
                )}

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
                    {items.map(item => {
                      const isComp = Number(item.price) >= 40 ||
                        item.accessType === "companion" ||
                        String(item.title).toLowerCase().includes("companion");
                      const displayPrice = (canUpgradeInCart && isComp) ? 29.99 : item.price;
                      return (
                        <CheckoutItem
                          key={item.id}
                          item={item}
                          price={displayPrice}
                          isUpgrade={canUpgradeInCart && isComp}
                          fmt={fmt}
                        />
                      );
                    })}
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
                  {items.map(item => {
                    const isComp = Number(item.price) >= 40 ||
                      item.accessType === "companion" ||
                      String(item.title).toLowerCase().includes("companion");
                    const price = (canUpgradeInCart && isComp) ? 29.99 : item.price;
                    return (
                      <div className="checkout-summary-row" key={item.id}>
                        <span style={{ maxWidth: "60%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {item.title} {canUpgradeInCart && isComp && <small style={{ color: "#c80808" }}>(Upgrade)</small>}
                        </span>
                        <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{fmt(price)}</span>
                      </div>
                    );
                  })}

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
                    <span style={{ fontWeight: 600 }}>{fmt(effectiveSubtotal)}</span>
                  </div>

                  {canUpgradeInCart && (
                    <div className="checkout-summary-row discount">
                      <span><i className="fa-solid fa-bolt" style={{ marginRight: 4 }} />Owner Upgrade Discount</span>
                      <span>− {fmt(20.00)}</span>
                    </div>
                  )}

                  {discountAmount > 0 && (
                    <div className="checkout-summary-row discount">
                      <span><i className="fa-solid fa-tag" style={{ marginRight: 4 }} />Coupon Discount</span>
                      <span>− {fmt(discountAmount)}</span>
                    </div>
                  )}

                  <div className="checkout-summary-row">
                    <span>Digital Delivery</span>
                    <span style={{ color: "#059669", fontWeight: 600 }}>FREE</span>
                  </div>

                  <div className="checkout-summary-total">
                    <span>Total</span>
                    <span style={{ color: "#c80808" }}>{fmt(effectiveTotal)}</span>
                  </div>

                  {/* Clear Email Confirmation Box */}
                  <div className="checkout-email-confirm-box">
                    <div className="checkout-email-confirm-label">
                      <i className="fa-solid fa-envelope" /> Access will be granted to:
                    </div>
                    <div className="checkout-email-confirm-value">
                      {formData.email.trim() || "(Enter email on left)"}
                    </div>
                    <div className="checkout-email-confirm-sub">
                      Please double-check for typos. Reader login and download access will be linked to this address.
                    </div>
                  </div>

                  {/* Mandatory Legal Agreement Checkbox */}
                  <div className="checkout-legal-group">
                    <label className={`checkout-legal-checkbox-label ${errors.legal ? "error" : ""}`}>
                      <input
                        type="checkbox"
                        id="checkout-agree-legal"
                        checked={agreedLegal}
                        onChange={(e) => {
                          setAgreedLegal(e.target.checked);
                          if (errors.legal) setErrors(prev => ({ ...prev, legal: "" }));
                        }}
                      />
                      <span>
                        I agree to the{" "}
                        <Link to="/terms-of-use" target="_blank" rel="noopener noreferrer">Terms of Use</Link>,{" "}
                        <Link to="/refund-policy" target="_blank" rel="noopener noreferrer">Refund Policy</Link> and{" "}
                        <Link to="/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</Link>
                      </span>
                    </label>
                    {errors.legal && (
                      <div className="checkout-legal-error" role="alert">
                        <i className="fa-solid fa-circle-exclamation" /> {errors.legal}
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="checkout-submit-btn"
                    disabled={checkoutLoading || items.length === 0 || !!blockedReason}
                    id="checkout-submit-btn"
                  >
                    {checkoutLoading ? (
                      <><span className="checkout-spinner" /> Connecting to PayPal…</>
                    ) : blockedReason ? (
                      <><i className="fa-solid fa-ban" /> Already Owned</>
                    ) : (
                      <><i className="fa-brands fa-paypal" style={{ marginRight: 8 }} /> Pay {fmt(effectiveTotal)} with PayPal</>
                    )}
                  </button>

                  <div className="checkout-trust-row">
                    <span><i className="fa-solid fa-lock" />SSL Secured</span>
                    <span><i className="fa-brands fa-paypal" />Powered by PayPal</span>
                    <span><i className="fa-solid fa-bolt" />Instant Delivery</span>
                  </div>
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
function CheckoutItem({ item, price, isUpgrade, fmt }) {
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
        <div className="checkout-item-title">
          {item.title}
          {isUpgrade && (
            <span style={{ marginLeft: 8, fontSize: "0.72rem", color: "#c80808", fontWeight: 700 }}>
              (Upgrade)
            </span>
          )}
        </div>
        <div className="checkout-item-type">
          <i
            className={item.accessType === "online" && !isUpgrade ? "fa-solid fa-globe" : "fa-solid fa-download"}
            style={{ color: "#c80808", fontSize: "0.65rem" }}
          />
          {isUpgrade
            ? "Upgrade to Digital Companion Edition"
            : item.accessLabel || (item.accessType === "online" ? "Online Access" : "Digital Companion Edition")}
        </div>
      </div>
      <div className="checkout-item-price">{fmt(price ?? item.price)}</div>
    </div>
  );
}
