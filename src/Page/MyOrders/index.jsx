/**
 * MyOrders/index.jsx — Customer Account & Order History
 * Supports Supabase session login OR guest lookup by email.
 */
import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../supabaseClient";
import HeadTitle from "../../Components/Head/HeadTitle";
import BannerInnerSection from "../../Components/Banner/inner";
import { useCart } from "../../Components/Cart/CartContext";
import "./MyOrders.css";

const isLocalhost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
const API_BASE = isLocalhost ? "http://localhost:5000/api" : "/api";

function formatDate(dateStr) {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-AE", {
      year: "numeric", month: "short", day: "numeric",
    });
  } catch { return dateStr; }
}

function StatusBadge({ status }) {
  const s = (status || "pending").toLowerCase();
  const icons = { paid: "fa-check-circle", successful: "fa-check-circle", pending: "fa-clock", refunded: "fa-rotate-left", failed: "fa-xmark-circle", expired: "fa-ban" };
  return (
    <span className={`my-order-status ${s}`}>
      <i className={`fa-solid ${icons[s] || "fa-circle"}`} />
      {s.charAt(0).toUpperCase() + s.slice(1)}
    </span>
  );
}

export default function MyOrdersPage() {
  const { addItem, openCart } = useCart();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [guestEmail, setGuestEmail] = useState("");
  const [lookupEmail, setLookupEmail] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState("");

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");
  const [downloadingId, setDownloadingId] = useState(null);
  const [readingOrder, setReadingOrder] = useState(null);

  /* ── Auth ───────────────────────────────────────── */
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setOrders([]);
    setLookupEmail("");
  };

  /* ── Load orders (authenticated) ───────────────── */
  const loadUserOrders = useCallback(async (email) => {
    if (!email) return;
    setOrdersLoading(true);
    setOrdersError("");
    try {
      const res = await fetch(`${API_BASE}/payment/my-orders?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (res.ok) {
        setOrders(Array.isArray(data.orders) ? data.orders : []);
      } else {
        setOrdersError(data.error || "Failed to load orders.");
      }
    } catch {
      setOrdersError("Unable to load orders. Please try again.");
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.email) {
      loadUserOrders(user.email);
    }
  }, [user, loadUserOrders]);

  /* ── Guest email lookup ─────────────────────────── */
  const handleGuestLookup = async (e) => {
    e.preventDefault();
    if (!guestEmail.trim()) return;
    setLookupLoading(true);
    setLookupError("");
    try {
      const res = await fetch(`${API_BASE}/payment/my-orders?email=${encodeURIComponent(guestEmail.trim())}`);
      const data = await res.json();
      if (res.ok) {
        setLookupEmail(guestEmail.trim());
        setOrders(Array.isArray(data.orders) ? data.orders : []);
      } else {
        setLookupError(data.error || "No orders found for this email.");
      }
    } catch {
      setLookupError("Unable to search. Please try again.");
    } finally {
      setLookupLoading(false);
    }
  };

  /* ── Download ────────────────────────────────────── */
  const handleDownload = async (order) => {
    const token = order.download_token || order.stripe_session_id || order.id;
    if (!token) return;
    setDownloadingId(order.id);
    try {
      const link = document.createElement("a");
      link.href = `${API_BASE}/payment/download/${token}`;
      link.setAttribute("download", "");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // Refresh orders after download to show updated count
      setTimeout(() => {
        if (user?.email) loadUserOrders(user.email);
        else if (lookupEmail) loadUserOrders(lookupEmail);
      }, 2000);
    } catch (err) {
      console.error("Download error:", err);
    } finally {
      setTimeout(() => setDownloadingId(null), 3000);
    }
  };

  /* ── Ownership & Upgrades ───────────────────────── */
  const paidOrders = orders.filter((o) => o.status === "paid" || o.status === "successful");
  const ownsOnlineEdition = paidOrders.some(
    (o) =>
      (Number(o.amount) >= 18 && Number(o.amount) <= 25) ||
      String(o.book_name).toLowerCase().includes("online")
  );
  const ownsCompanionEdition = paidOrders.some(
    (o) =>
      Number(o.amount) >= 40 ||
      String(o.book_name).toLowerCase().includes("companion") ||
      String(o.book_name).toLowerCase().includes("upgrade")
  );
  const canUpgrade = ownsOnlineEdition && !ownsCompanionEdition;

  const handleUpgrade = (order) => {
    addItem({
      productId: order?.product_id || "04b84648-3609-4b31-9ded-2486bacf1e74",
      title: order?.book_name?.replace(/—.*/, "").trim() || "Marketing Reclassified",
      price: 29.99,
      currency: "USD",
      accessType: "companion",
      accessLabel: "Upgrade to Digital Companion Edition",
      isUpgrade: true,
      originalOwnedEdition: "online",
    });
    openCart();
  };

  /* ── Render ─────────────────────────────────────── */
  const isAuthenticated = !!user || !!lookupEmail;

  return (
    <>
      <HeadTitle title="My Orders | Siddiqui.Digital" />
      <BannerInnerSection title="My Orders" currentPage="Order History" />
      <div className="my-orders-page">
        <div className="my-orders-container">

          {/* Header */}
          <div className="my-orders-header">
            <div>
              <h1 className="my-orders-title">
                <i className="fa-solid fa-bag-shopping" style={{ color: "#c80808", marginRight: 12 }} />
                My Orders
              </h1>
              <p className="my-orders-subtitle">
                {user
                  ? `Signed in as ${user.email}`
                  : lookupEmail
                  ? `Showing orders for ${lookupEmail}`
                  : "Sign in or enter your email to view order history"}
              </p>
            </div>
            {user && (
              <button
                onClick={handleSignOut}
                style={{ fontSize: "0.8rem", color: "var(--text-secondary)", background: "none", border: "1px solid var(--border-color)", borderRadius: 8, padding: "8px 14px", cursor: "pointer" }}
                id="my-orders-signout-btn"
              >
                <i className="fa-solid fa-right-from-bracket" style={{ marginRight: 6 }} />
                Sign Out
              </button>
            )}
          </div>

          {/* Auth Wall */}
          {!isAuthenticated && (
            <motion.div
              className="my-orders-auth-wall"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="my-orders-auth-icon">
                <i className="fa-solid fa-lock" />
              </div>
              <h2>Access Your Orders</h2>
              <p>Sign in with Google to view your full order history, or enter the email you used at checkout.</p>

              <button
                className="my-orders-google-btn"
                onClick={handleGoogleSignIn}
                disabled={authLoading}
                id="my-orders-google-btn"
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  width={18}
                  height={18}
                />
                {authLoading ? "Signing in…" : "Continue with Google"}
              </button>

              <div style={{ marginTop: 12, textAlign: "center" }}>
                <Link to="/login" style={{ fontSize: "0.85rem", color: "#c80808", fontWeight: 600, textDecoration: "none" }}>
                  <i className="fa-solid fa-envelope" style={{ marginRight: 6 }} /> Or Sign In with Email &amp; Password →
                </Link>
              </div>

              <div className="my-orders-divider-text">or look up by email</div>

              <form onSubmit={handleGuestLookup}>
                <div className="my-orders-lookup-form">
                  <input
                    type="email"
                    className="my-orders-lookup-input"
                    placeholder="your@email.com"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    required
                    id="my-orders-email-input"
                    aria-label="Email address for order lookup"
                  />
                  <button
                    type="submit"
                    className="my-orders-lookup-btn"
                    disabled={lookupLoading || !guestEmail.trim()}
                    id="my-orders-lookup-btn"
                  >
                    {lookupLoading ? "…" : "Find Orders"}
                  </button>
                </div>
                {lookupError && (
                  <div className="my-orders-error" style={{ marginTop: 10 }} role="alert">
                    <i className="fa-solid fa-circle-exclamation" />
                    {lookupError}
                  </div>
                )}
              </form>
            </motion.div>
          )}

          {/* Orders */}
          {isAuthenticated && (
            <>
              {ordersError && (
                <div className="my-orders-error" role="alert">
                  <i className="fa-solid fa-circle-exclamation" />
                  {ordersError}
                </div>
              )}

              {ordersLoading && (
                <div className="my-orders-loading">
                  <div className="my-orders-spinner" />
                  Loading your orders…
                </div>
              )}

              {!ordersLoading && orders.length === 0 && (
                <div className="my-orders-empty">
                  <div style={{ fontSize: "3rem", marginBottom: 16 }}>📦</div>
                  <h3>No orders found</h3>
                  <p>No digital purchases were found for this account. Once you make a purchase, your orders will appear here.</p>
                  <Link
                    to="/publications"
                    className="my-order-download-btn"
                    style={{ display: "inline-flex", width: "auto", textDecoration: "none" }}
                  >
                    <i className="fa-solid fa-book-open" />
                    Browse Publications
                  </Link>
                </div>
              )}

              {!ordersLoading && orders.length > 0 && (
                <AnimatePresence>
                  {/* Upgrade Available Banner */}
                  {canUpgrade && (
                    <motion.div
                      className="my-orders-upgrade-banner"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        background: "linear-gradient(135deg, #18181b 0%, #27272a 100%)",
                        border: "1px solid #c80808",
                        borderRadius: 12,
                        padding: "16px 20px",
                        marginBottom: 20,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 14,
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 260 }}>
                        <div style={{ color: "#ef4444", fontWeight: 700, fontSize: "0.9rem", display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                          <i className="fa-solid fa-arrow-up" /> Upgrade Available · Pay Only the Difference
                        </div>
                        <p style={{ margin: 0, fontSize: "0.84rem", color: "#d4d4d8", lineHeight: 1.5 }}>
                          You own the <strong>Online Reading Edition ($20)</strong>. Upgrade to the <strong>Digital Companion Edition ($49.99)</strong> with personal PDF download and full Companion Pack for only <strong>USD 29.99</strong>.
                        </p>
                      </div>
                      <button
                        type="button"
                        className="my-order-upgrade-btn"
                        onClick={() => handleUpgrade(paidOrders.find(o => (Number(o.amount) >= 18 && Number(o.amount) <= 25) || String(o.book_name).toLowerCase().includes("online")))}
                        id="my-orders-upgrade-banner-btn"
                      >
                        <i className="fa-solid fa-bolt" /> Upgrade Now · $29.99
                      </button>
                    </motion.div>
                  )}

                  <div className="my-orders-list">
                    {orders.map((order, i) => {
                      const amt = Number(order.amount || 0);
                      const name = String(order.book_name || "").toLowerCase();
                      const isOnlineOrder = (amt >= 18 && amt <= 25) || name.includes("online");
                      const isCompanionOrder = amt >= 40 || name.includes("companion") || name.includes("upgrade");

                      return (
                        <motion.div
                          key={order.id}
                          className="my-order-card"
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: i * 0.06 }}
                        >
                          <div className="my-order-header">
                            <div>
                              <div className="my-order-number">
                                {order.order_number || `ORD-${order.id?.substring(0, 8).toUpperCase()}`}
                              </div>
                              <div className="my-order-date">{formatDate(order.created_at)}</div>
                            </div>
                            <StatusBadge status={order.status} />
                          </div>

                          <div className="my-order-body">
                            <div className="my-order-product">
                              {order.book_name || order.ebook_title || "Digital Publication"}
                            </div>

                            <div className="my-order-meta">
                              <span className="my-order-meta-item">
                                <i className="fa-solid fa-tag" />
                                {order.currency} {Number(order.amount || 0).toFixed(2)}
                              </span>
                              {isOnlineOrder && (
                                <span className="my-order-meta-item" style={{ color: "#3b82f6" }}>
                                  <i className="fa-solid fa-globe" /> Online Reading Access
                                </span>
                              )}
                              {!isOnlineOrder && order.download_count !== undefined && (
                                <span className="my-order-meta-item">
                                  <i className="fa-solid fa-download" />
                                  {order.download_count || 0} / {order.download_limit || 3} downloads used
                                </span>
                              )}
                              {!isOnlineOrder && order.download_expires_at && (
                                <span className="my-order-meta-item">
                                  <i className="fa-solid fa-clock" />
                                  Expires {formatDate(order.download_expires_at)}
                                </span>
                              )}
                            </div>

                            <div className="my-order-actions">
                              {(order.status === "paid" || order.status === "successful") && (
                                <>
                                  {!isOnlineOrder && (
                                    <button
                                      className="my-order-download-btn"
                                      onClick={() => handleDownload(order)}
                                      disabled={downloadingId === order.id}
                                      id={`download-btn-${order.id}`}
                                      aria-label={`Download ${order.book_name}`}
                                    >
                                      <i className="fa-solid fa-download" />
                                      {downloadingId === order.id ? "Downloading…" : "Download PDF"}
                                    </button>
                                  )}

                                  <button
                                    type="button"
                                    className="my-order-view-btn"
                                    style={{ borderColor: "#c80808", color: "#c80808", background: "none", cursor: "pointer" }}
                                    onClick={() => setReadingOrder(order)}
                                    id={`read-btn-${order.id}`}
                                  >
                                    <i className="fa-solid fa-book-open" /> Read Online
                                  </button>

                                  {isOnlineOrder && canUpgrade && (
                                    <button
                                      type="button"
                                      className="my-order-upgrade-btn"
                                      onClick={() => handleUpgrade(order)}
                                      id={`upgrade-btn-${order.id}`}
                                    >
                                      <i className="fa-solid fa-arrow-up" /> Upgrade ($29.99)
                                    </button>
                                  )}

                                  <Link
                                    to={`/order-success?session_id=${order.stripe_session_id || order.id}`}
                                    className="my-order-view-btn"
                                    id={`view-btn-${order.id}`}
                                  >
                                    <i className="fa-solid fa-eye" /> View Details
                                  </Link>
                                </>
                              )}
                              {order.status === "pending" && (
                                <span className="my-order-view-btn" style={{ cursor: "default", opacity: 0.7 }}>
                                  <i className="fa-solid fa-clock" />
                                  Awaiting payment
                                </span>
                              )}
                              {(order.status === "expired" || (order.download_count >= order.download_limit)) && !isOnlineOrder && (
                                <Link
                                  to="/order-success"
                                  className="my-order-view-btn"
                                  style={{ borderColor: "#c80808", color: "#c80808" }}
                                >
                                  <i className="fa-solid fa-rotate" />
                                  Request Replacement
                                </Link>
                              )}
                            </div>

                            {(order.status === "paid" || order.status === "successful") &&
                              !isOnlineOrder &&
                              Number(order.download_count) >= Number(order.download_limit) && (
                              <div className="my-order-dl-info">
                                <i className="fa-solid fa-circle-info" />
                                Download limit reached. Request a replacement link from the order detail page.
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </AnimatePresence>
              )}
            </>
          )}
        </div>
      </div>

      {/* In-Browser Protected Online Reader Modal */}
      {readingOrder && (
        <div
          className="reader-modal-backdrop"
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.88)",
            backdropFilter: "blur(6px)",
            zIndex: 99999,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              padding: "12px 24px",
              background: "#18181b",
              borderBottom: "1px solid #27272a",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              color: "#fff",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <i className="fa-solid fa-book-open-reader" style={{ color: "#c80808", fontSize: "1.2rem" }} />
              <div>
                <h3 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700, color: "#fff" }}>
                  {readingOrder.book_name || "Marketing Reclassified — Online Reader"}
                </h3>
                <p style={{ margin: 0, fontSize: "0.75rem", color: "#a1a1aa" }}>
                  Protected In-Browser Edition · Authorized Reader: {user?.email || lookupEmail}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: "0.75rem", background: "rgba(16,185,129,0.15)", color: "#10b981", padding: "4px 8px", borderRadius: 4, fontWeight: 600 }}>
                <i className="fa-solid fa-shield-halved" style={{ marginRight: 4 }} /> Protected Reader
              </span>
              <button
                type="button"
                onClick={() => setReadingOrder(null)}
                style={{
                  background: "#27272a",
                  border: "1px solid #3f3f46",
                  color: "#fff",
                  borderRadius: 6,
                  padding: "6px 14px",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
                id="close-reader-btn"
              >
                <i className="fa-solid fa-xmark" style={{ marginRight: 6 }} /> Close Reader
              </button>
            </div>
          </div>
          <div style={{ flex: 1, position: "relative", background: "#09090b" }}>
            <iframe
              src={`${API_BASE}/payment/read/${readingOrder.download_token || readingOrder.stripe_session_id || readingOrder.id}#toolbar=0&navpanes=0`}
              title="Protected Online Book Reader"
              style={{ width: "100%", height: "100%", border: "none" }}
            />
          </div>
        </div>
      )}
    </>
  );
}
