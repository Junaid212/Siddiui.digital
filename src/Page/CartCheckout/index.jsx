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
import { useOfferStatus } from "../../Components/OfferBanner/useOffer";
import { rememberCheckout, openPayhipTab } from "../../utils/checkoutMemory";
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
  const [showMobileSummary, setShowMobileSummary] = useState(false);
  const offerState = useOfferStatus();
  const [codeCopied, setCodeCopied] = useState(false);

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
        options: {
          redirectTo: window.location.href,
          scopes: "openid email profile",
        },
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

  /* ── Launch offer discount: only while it is genuinely valid ───────────────────────────── */
  // The offer is stored in the cart (browser storage) when the buyer clicks the offer button. It must not outlive the offer,
  // apply to anything else than the single Digital Companion edition, or stack with the upgrade price.
  const launchDiscount = !!discountData && discountData.source === "launch-offer";
  const singleCompanion = items.length === 1 && (Number(items[0].price) >= 40 || items[0].accessType === "companion");
  useEffect(() => {
    if (!launchDiscount || !offerState.loaded) return;
    const cta = offerState.offer && offerState.offer.cta;
    const valid = !!cta && cta.enabled && singleCompanion && !canUpgradeInCart && !blockedReason &&
      String(cta.couponCode || "").toUpperCase() === String(discountCode || "").toUpperCase();
    if (!valid) {
      clearDiscount();
      setDiscountInput("");
      return;
    }
    // follow the administrator's latest prices
    const value = Math.max(0, Math.round((Number(cta.originalPrice) - Number(cta.offerPrice)) * 100) / 100);
    if (Number(discountData.value) !== value) setDiscountData({ ...discountData, value });
  }, [launchDiscount, offerState, singleCompanion, canUpgradeInCart, blockedReason, discountCode, discountData]);
  const launchCta = launchDiscount && offerState.offer && offerState.offer.cta && offerState.offer.cta.enabled ? offerState.offer.cta : null;

  /* ── Form ───────────────────────────────────────── */
  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    // The name is optional: Payhip collects the buyer's details itself and nothing here depends on it.
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

  /* ── Payhip URL Resolver ───────────────────────── */
  const resolveItemPayhipUrl = (item, isUpgrade = false, email = "") => {
    let url = "";
    if (isUpgrade && item?.upgradePayhipUrl) url = item.upgradePayhipUrl;
    if (!url && item?.payhipCheckoutUrl) url = item.payhipCheckoutUrl;
    if (!url && item?.payhipProductId) url = `https://payhip.com/b/${item.payhipProductId.trim()}`;

    if (!url) {
      const isOnline = item?.accessType === "online" || (Number(item?.price) < 30 && !isUpgrade);
      if (isUpgrade) {
        url = import.meta.env.VITE_PAYHIP_UPGRADE_URL || (import.meta.env.VITE_PAYHIP_UPGRADE_PRODUCT_ID ? `https://payhip.com/b/${import.meta.env.VITE_PAYHIP_UPGRADE_PRODUCT_ID}` : "");
      } else if (isOnline) {
        url = import.meta.env.VITE_PAYHIP_ONLINE_URL || (import.meta.env.VITE_PAYHIP_ONLINE_PRODUCT_ID ? `https://payhip.com/b/${import.meta.env.VITE_PAYHIP_ONLINE_PRODUCT_ID}` : "");
      } else {
        url = import.meta.env.VITE_PAYHIP_COMPANION_URL || (import.meta.env.VITE_PAYHIP_COMPANION_PRODUCT_ID ? `https://payhip.com/b/${import.meta.env.VITE_PAYHIP_COMPANION_PRODUCT_ID}` : "");
      }
    }

    // Launch offer: the buyer has seen the offer price on this page; send the code along to Payhip.
    if (launchCta && !isUpgrade && singleCompanion) {
      try {
        const u = new URL(launchCta.checkoutUrl || url);
        if (discountCode && !u.searchParams.has("coupon")) u.searchParams.set("coupon", discountCode);
        url = u.toString();
      } catch (_) { /* keep the normal link */ }
    }

    if (url && email) {
      const sep = url.includes("?") ? "&" : "?";
      url = `${url}${sep}email=${encodeURIComponent(email.trim())}`;
    }
    return url;
  };

  // If Payhip does not apply the offer code by itself, the buyer can paste it: put it on the clipboard.
  const copyLaunchCode = () => {
    try { if (launchCta && discountCode && navigator.clipboard) navigator.clipboard.writeText(discountCode).catch(() => {}); } catch (_) { /* ignore */ }
  };

  const handlePayhipItemCheckout = (item, isUpgrade) => {
    if (!agreedLegal) {
      setErrors(prev => ({ ...prev, legal: "You must tick the checkbox to agree to the Terms of Use, Refund Policy and Privacy Policy before paying." }));
      return;
    }
    const email = (user?.email || formData.email || "").trim();
    const url = resolveItemPayhipUrl(item, isUpgrade, email);
    if (url) {
      copyLaunchCode();
      rememberCheckout({ email, title: item.title, edition: item.accessType, payhipUrl: url });
      if (openPayhipTab(url)) {
        navigate("/thank-you?waiting=1");
      } else {
        window.location.href = url;
      }
    } else {
      setCheckoutError(`Payhip checkout for "${item.title}" is pending configuration. Please complete checkout directly on the publication page.`);
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
      // Never fail silently: say what is wrong next to the button and bring the first problem into view.
      setCheckoutError(`Please fix this before continuing: ${Object.values(errs)[0]}`);
      setTimeout(() => {
        const el = document.querySelector(".checkout-form-input.error, .checkout-legal-error");
        if (el && el.scrollIntoView) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
      return;
    }

    setCheckoutLoading(true);
    setCheckoutError("");

    // Identify if all cart items are book publications
    const allBooks = items.every(i => i.accessType === "online" || i.accessType === "companion" || i.accessType === "download" || Number(i.price) > 0);

    // If client requested Payhip for books:
    if (allBooks) {
      if (items.length === 1) {
        const item = items[0];
        const isCompanion = Number(item.price) >= 40 ||
          item.accessType === "companion" ||
          String(item.title).toLowerCase().includes("companion");
        const isUpgrade = canUpgradeInCart && isCompanion;
        const payhipUrl = resolveItemPayhipUrl(item, isUpgrade, formData.email.trim());

        if (payhipUrl) {
          copyLaunchCode();
          rememberCheckout({ email: formData.email.trim(), title: item.title, edition: item.accessType, payhipUrl });
          if (openPayhipTab(payhipUrl)) {
            setCheckoutLoading(false);
            navigate("/thank-you?waiting=1");
          } else {
            window.location.href = payhipUrl;
          }
          return;
        }
      } else {
        setCheckoutLoading(false);
        setCheckoutError("Payhip processes book checkouts individually per edition. Please click 'Buy with Payhip' next to your preferred edition in your cart below.");
        return;
      }
    }

    try {
      // Payhip is the only checkout in use. If this item has no Payhip link, say so clearly (no other provider is tried).
      throw new Error("Checkout for this item is not available right now. Please contact us and we will help you complete your purchase.");
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
              <div className="checkout-empty-icon">🛒</div>
              <h2>Your cart is empty</h2>
              <p>Add some publications to your cart before checking out.</p>
              <Link
                to="/publications"
                className="checkout-empty-btn"
                id="checkout-browse-btn"
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
            <h1><i className="fa-solid fa-lock" />Secure Checkout</h1>
            <p>Review your order, verify your delivery email, and complete your purchase securely.</p>
          </div>

          {/* Mobile Collapsible Order Summary Banner (visible on screens <= 900px) */}
          <div className="checkout-mobile-summary-banner">
            <button
              type="button"
              className="checkout-mobile-summary-toggle"
              onClick={() => setShowMobileSummary(prev => !prev)}
              aria-expanded={showMobileSummary}
              aria-controls="checkout-mobile-summary-dropdown"
              id="checkout-mobile-summary-toggle-btn"
            >
              <span className="checkout-mobile-summary-toggle-left">
                <i className="fa-solid fa-bag-shopping" />
                <span>{showMobileSummary ? "Hide order summary" : "Show order summary"}</span>
                <i className={`fa-solid fa-chevron-${showMobileSummary ? "up" : "down"} checkout-mobile-chevron`} />
              </span>
              <span className="checkout-mobile-summary-toggle-price">
                {fmt(effectiveTotal)}
              </span>
            </button>

            {showMobileSummary && (
              <motion.div
                id="checkout-mobile-summary-dropdown"
                className="checkout-mobile-summary-dropdown"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="checkout-mobile-items-list">
                  {items.map(item => {
                    const isComp = Number(item.price) >= 40 ||
                      item.accessType === "companion" ||
                      String(item.title).toLowerCase().includes("companion");
                    const price = (canUpgradeInCart && isComp) ? 29.99 : item.price;
                    return (
                      <div className="checkout-mobile-item-row" key={item.id}>
                        {item.coverImage ? (
                          <img src={item.coverImage} alt={item.title} className="checkout-mobile-item-thumb" />
                        ) : (
                          <div className="checkout-mobile-item-thumb fallback">
                            <i className="fa-solid fa-book" />
                          </div>
                        )}
                        <div className="checkout-mobile-item-details">
                          <span className="checkout-mobile-item-title">
                            {item.title}
                            {canUpgradeInCart && isComp && <span className="checkout-mobile-upgrade-tag"> (Upgrade)</span>}
                          </span>
                          <span className="checkout-mobile-item-edition">
                            {isComp ? "Digital Companion Edition" : "Online Reading Edition"}
                          </span>
                        </div>
                        <span className="checkout-mobile-item-price">{fmt(price)}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="checkout-mobile-summary-totals">
                  <div className="checkout-mobile-summary-subtotal-row">
                    <span>Subtotal</span>
                    <span>{fmt(effectiveSubtotal)}</span>
                  </div>
                  {canUpgradeInCart && (
                    <div className="checkout-mobile-summary-subtotal-row discount">
                      <span>Owner Upgrade Discount</span>
                      <span>− {fmt(20.00)}</span>
                    </div>
                  )}
                  {discountAmount > 0 && (
                    <div className="checkout-mobile-summary-subtotal-row discount">
                      <span>Coupon Discount ({discountCode})</span>
                      <span>− {fmt(discountAmount)}</span>
                    </div>
                  )}
                  <div className="checkout-mobile-summary-subtotal-row">
                    <span>Digital Delivery</span>
                    <span style={{ color: "#059669", fontWeight: 600 }}>FREE</span>
                  </div>
                  <div className="checkout-mobile-summary-subtotal-row total">
                    <span>Total Due</span>
                    <span className="checkout-mobile-summary-total-num">{fmt(effectiveTotal)}</span>
                  </div>
                </div>
              </motion.div>
            )}
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
                      <div className="checkout-auth-divider">
                        <span>or fill in manually</span>
                      </div>
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
                      <label className="checkout-form-label" htmlFor="checkout-name">Full Name (optional)</label>
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
                      {errors.name && <span className="checkout-field-error"><i className="fa-solid fa-circle-exclamation" />{errors.name}</span>}
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
                      {errors.email && <span className="checkout-field-error"><i className="fa-solid fa-circle-exclamation" />{errors.email}</span>}
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
                      {errors.confirmEmail && <span className="checkout-field-error"><i className="fa-solid fa-circle-exclamation" />{errors.confirmEmail}</span>}
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
                          onPayhip={handlePayhipItemCheckout}
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
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.08 }}
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
                        <span className="checkout-summary-item-name">
                          {item.title} {canUpgradeInCart && isComp && <small style={{ color: "#c80808" }}>(Upgrade)</small>}
                        </span>
                        <span className="checkout-summary-item-price">{fmt(price)}</span>
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
                      Please double-check for typos. Reader login and download access will be linked to this address, so enter this same email on the Payhip page.
                    </div>
                  </div>

                  {launchCta && (
                    <div className="checkout-offer-note" data-testid="launch-offer-note">
                      <strong>Launch offer applied:</strong> code <b>{discountCode}</b> — you pay {fmt(effectiveTotal)}.
                      {launchCta.autoApply
                        ? <> The code is sent to Payhip for you, so the price there matches.</>
                        : (
                          <>
                            {" "}<b>Next step on Payhip:</b> paste <b>{discountCode}</b> into the <b>Coupon code</b> box and press <b>Apply</b> — the total there
                            then shows {fmt(effectiveTotal)}.
                            {" "}<button type="button" className="checkout-offer-copy" data-testid="copy-offer-code"
                              onClick={() => { copyLaunchCode(); setCodeCopied(true); }}>
                              {codeCopied ? "Copied ✓" : "Copy code"}
                            </button>
                            {" "}We also copy it for you when you continue.
                          </>
                        )}
                    </div>
                  )}

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
                  {checkoutError && (
                    <div className="checkout-legal-error" role="alert" data-testid="checkout-error-near-button" style={{ marginBottom: 10 }}>
                      <i className="fa-solid fa-circle-exclamation" /> {checkoutError}
                    </div>
                  )}
                  <button
                    type="submit"
                    className="checkout-submit-btn"
                    disabled={checkoutLoading || items.length === 0 || !!blockedReason}
                    id="checkout-submit-btn"
                  >
                    {checkoutLoading ? (
                      <><span className="checkout-spinner" /> Connecting…</>
                    ) : blockedReason ? (
                      <><i className="fa-solid fa-ban" /> Already Owned</>
                    ) : items.every(i => i.accessType === "online" || i.accessType === "companion" || i.accessType === "download") ? (
                      <><i className="fa-solid fa-bolt" style={{ marginRight: 8 }} /> Proceed to Payhip Checkout ({fmt(effectiveTotal)})</>
                    ) : (
                      <><i className="fa-solid fa-lock" style={{ marginRight: 8 }} /> Continue to secure checkout ({fmt(effectiveTotal)})</>
                    )}
                  </button>

                  <div className="checkout-trust-row">
                    <span><i className="fa-solid fa-lock" />SSL Secured</span>
                    <span><i className="fa-solid fa-shield-halved" />Secure checkout via Payhip</span>
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
function CheckoutItem({ item, price, isUpgrade, fmt, onPayhip }) {
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
            <span className="checkout-item-upgrade-tag">
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
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
        <div className="checkout-item-price">{fmt(price ?? item.price)}</div>
        {onPayhip && (
          <button
            type="button"
            onClick={() => onPayhip(item, isUpgrade)}
            style={{
              background: '#10b981',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              padding: '4px 8px',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            <i className="fa-solid fa-bolt" /> Payhip
          </button>
        )}
      </div>
    </div>
  );
}
