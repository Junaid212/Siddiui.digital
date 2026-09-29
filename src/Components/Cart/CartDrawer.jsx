/**
 * CartDrawer.jsx — Slide-out Shopping Cart Drawer
 * Features: multi-item list, discount codes, totals, checkout navigation.
 */
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import { api } from "../../api";
import "./CartDrawer.css";

const isLocalhost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
const API_BASE = isLocalhost ? "http://localhost:5000/api" : "/api";

export default function CartDrawer() {
  const {
    items, isOpen, itemCount, subtotal, discountAmount, total, currency,
    discountCode, discountData,
    removeItem, closeCart, openCart,
    setDiscountCode, setDiscountData, clearDiscount,
  } = useCart();
  const navigate = useNavigate();

  const [codeInput, setCodeInput] = useState(discountCode || "");
  const [discountLoading, setDiscountLoading] = useState(false);
  const [discountError, setDiscountError] = useState("");

  // Sync input when discount code changes externally
  useEffect(() => {
    setCodeInput(discountCode || "");
  }, [discountCode]);

  /* ── Apply Discount ─────────────────────────────── */
  const handleApplyDiscount = async () => {
    const code = codeInput.trim().toUpperCase();
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

  const handleRemoveDiscount = () => {
    clearDiscount();
    setCodeInput("");
    setDiscountError("");
  };

  /* ── Checkout ───────────────────────────────────── */
  const handleCheckout = () => {
    closeCart();
    navigate("/cart/checkout");
  };

  /* ── Format currency ────────────────────────────── */
  const fmt = (amount) => `${currency} ${Number(amount).toFixed(2)}`;

  /* ── Render ─────────────────────────────────────── */
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="cart-overlay" onClick={closeCart} aria-hidden="true" />

      {/* Drawer Panel */}
      <aside
        className="cart-drawer"
        role="dialog"
        aria-label="Shopping cart"
        aria-modal="true"
        id="cart-drawer"
      >
        {/* Header */}
        <div className="cart-header">
          <div className="cart-header-left">
            <div className="cart-header-icon">
              <i className="fa-solid fa-bag-shopping" />
            </div>
            <div>
              <h2 className="cart-title">
                Your Cart
                {itemCount > 0 && (
                  <span className="cart-count-badge">{itemCount}</span>
                )}
              </h2>
            </div>
          </div>
          <button
            className="cart-close-btn"
            onClick={closeCart}
            aria-label="Close cart"
            id="cart-close-btn"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon">
              <i className="fa-solid fa-bag-shopping" />
            </div>
            <h3>Your cart is empty</h3>
            <p>Browse our publications and digital products to get started.</p>
            <Link to="/publications" className="cart-shop-btn" onClick={closeCart} id="cart-browse-btn">
              <i className="fa-solid fa-book-open" />
              Browse Publications
            </Link>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="cart-items" role="list">
              {items.map((item) => (
                <CartItem key={item.id} item={item} onRemove={removeItem} fmt={fmt} />
              ))}
            </div>

            {/* Discount Code */}
            <div className="cart-discount-section">
              {discountData ? (
                <div className="cart-discount-active">
                  <i className="fa-solid fa-tag" />
                  <span>
                    {discountCode} — {discountData.description || `${discountData.value}${discountData.type === "percentage" ? "%" : ` ${currency}`} off`}
                  </span>
                  <button
                    className="cart-discount-active-remove"
                    onClick={handleRemoveDiscount}
                    title="Remove discount"
                    aria-label="Remove discount code"
                  >
                    <i className="fa-solid fa-xmark" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="cart-discount-form">
                    <input
                      type="text"
                      className="cart-discount-input"
                      placeholder="Discount code"
                      value={codeInput}
                      onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === "Enter" && handleApplyDiscount()}
                      maxLength={30}
                      id="cart-discount-input"
                      aria-label="Discount code"
                    />
                    <button
                      className="cart-discount-apply-btn"
                      onClick={handleApplyDiscount}
                      disabled={discountLoading || !codeInput.trim()}
                      id="cart-discount-apply-btn"
                    >
                      {discountLoading ? <span className="cart-spinner" /> : "Apply"}
                    </button>
                  </div>
                  {discountError && (
                    <div className="cart-discount-error" role="alert">
                      <i className="fa-solid fa-circle-exclamation" />
                      {discountError}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Totals */}
            <div className="cart-totals" aria-label="Order totals">
              <div className="cart-total-row subtotal">
                <span>Subtotal</span>
                <span>{fmt(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="cart-total-row discount">
                  <span><i className="fa-solid fa-tag" style={{ marginRight: 4 }} />Discount</span>
                  <span>− {fmt(discountAmount)}</span>
                </div>
              )}
              <div className="cart-total-row">
                <span style={{ fontSize: "0.78rem" }}>Tax / VAT</span>
                <span style={{ fontSize: "0.78rem" }}>Calculated at checkout</span>
              </div>
              <div className="cart-total-row grand-total">
                <span>Total</span>
                <span>{fmt(total)}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="cart-footer">
              <button
                className="cart-checkout-btn"
                onClick={handleCheckout}
                id="cart-checkout-btn"
                disabled={items.length === 0}
              >
                <i className="fa-solid fa-lock" />
                Secure Checkout — {fmt(total)}
              </button>
              <button
                className="cart-continue-btn"
                onClick={closeCart}
                id="cart-continue-shopping-btn"
              >
                <i className="fa-solid fa-arrow-left" />
                Continue Shopping
              </button>
              <div className="cart-trust">
                <span><i className="fa-solid fa-lock" />Stripe Secured</span>
                <span><i className="fa-solid fa-bolt" />Instant Delivery</span>
                <span><i className="fa-solid fa-shield-halved" />Protected</span>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

/* ── Single Cart Item ──────────────────────────────────────────── */
function CartItem({ item, onRemove, fmt }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="cart-item" role="listitem">
      {imgError || !item.coverImage ? (
        <div className="cart-item-cover-fallback">
          <i className="fa-solid fa-book" />
        </div>
      ) : (
        <img
          src={item.coverImage}
          alt={item.title}
          className="cart-item-cover"
          onError={() => setImgError(true)}
          loading="lazy"
        />
      )}
      <div className="cart-item-info">
        <div className="cart-item-title">{item.title}</div>
        <div className="cart-item-access">
          <i className={item.accessType === "online" ? "fa-solid fa-globe" : "fa-solid fa-download"} />
          {item.accessLabel || (item.accessType === "online" ? "Online Access" : "Downloadable Edition")}
        </div>
        <div className="cart-item-price">{fmt(item.price)}</div>
      </div>
      <button
        className="cart-item-remove"
        onClick={() => onRemove(item.id)}
        title="Remove item"
        aria-label={`Remove ${item.title} from cart`}
        id={`cart-remove-${item.id}`}
      >
        <i className="fa-solid fa-trash-can" />
      </button>
    </div>
  );
}
