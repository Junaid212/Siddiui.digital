/**
 * MyOrders/index.jsx — Customer Account & Order History
 * Supports Supabase session login OR guest lookup by email.
 */
import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../supabaseClient";
import { api } from "../../api";
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

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");
  const [downloadingId, setDownloadingId] = useState(null);
  const [readingOrder, setReadingOrder] = useState(null);
  const [readerUrl, setReaderUrl] = useState("");
  const [entitlement, setEntitlement] = useState(null); // the customer's current access (Ask SID has its own end date)
  const [renewingId, setRenewingId] = useState(null);
  const [ordersNotice, setOrdersNotice] = useState("");

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
        options: {
          redirectTo: window.location.href,
          scopes: "openid email profile",
        },
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setOrders([]);
  };

  /* ── Load orders (authenticated) ───────────────── */
  const loadUserOrders = useCallback(async (email) => {
    if (!email) return;
    setOrdersLoading(true);
    setOrdersError("");
    try {
      // The server returns the SIGNED-IN customer's orders from the session (the helper adds nothing to the URL;
      // only a previous backend version makes it repeat the request once with the user's own address).
      const { ok, data } = await api.listMyOrders(email);
      if (ok) {
        setOrders(Array.isArray(data.orders) ? data.orders : []);
        setEntitlement(data.entitlement || null);
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

  /* ── Download ────────────────────────────────────── */
  // Resolves a URL for the file or the reader of one order.
  //  - Current backend: a short-lived link issued for this signed-in customer (nothing reusable is listed).
  //  - Previous backend (no such endpoint): falls back to the credential that backend still lists.
  const resolveFileUrl = async (order, purpose) => {
    const link = await api.createAccessLink(order.id, purpose);
    if (link.ok) return `${API_BASE}${link.path}`;
    const endpointMissing = link.status === 404 && !link.error; // an older server answers with its generic 404, not JSON
    if (endpointMissing || link.status === 405) {
      const legacy = order.download_token || order.paypal_order_id || order.payhip_transaction_id || order.stripe_session_id || order.id;
      return legacy ? `${API_BASE}/payment/${purpose === "read" ? "read" : "download"}/${legacy}` : null;
    }
    setOrdersError(link.error || "That file is not available right now. Please try again.");
    return null;
  };

  // file: "book" downloads the book PDF (second file of the Digital Companion); otherwise the Companion Pack, exactly as before.
  const handleDownload = async (order, file) => {
    const busyKey = file === "book" ? `${order.id}:book` : order.id;
    setDownloadingId(busyKey);
    try {
      const base = await resolveFileUrl(order, "download");
      if (!base) return;
      const url = file === "book" ? `${base}${base.includes("?") ? "&" : "?"}file=book` : base;
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // Refresh orders after download to show updated count
      setTimeout(() => {
        if (user?.email) loadUserOrders(user.email);
      }, 2000);
    } catch (err) {
      console.error("Download error:", err);
    } finally {
      setTimeout(() => setDownloadingId(null), 3000);
    }
  };

  // "Request new download link": after the 72 hours, or once a file has had its 3 downloads, the buyer can ask for a fresh window
  // (72 hours, 3 new downloads of each file). The server allows it 3 times per order and only for the buyer's own order.
  const handleRenew = async (order) => {
    setRenewingId(order.id);
    setOrdersError("");
    setOrdersNotice("");
    try {
      const r = await api.renewDownload(order.id);
      if (!r.ok) { setOrdersError(r.error); return; }
      setOrdersNotice(`Your download links are renewed: ${formatDate(r.downloadExpiresAt)}, 3 downloads per file.${typeof r.renewalsLeft === "number" ? ` You can renew ${r.renewalsLeft} more time${r.renewalsLeft === 1 ? "" : "s"} for this order.` : ""}`);
      if (user?.email) await loadUserOrders(user.email);
    } finally {
      setRenewingId(null);
    }
  };

  const openReader = async (order) => {
    // Preferred: the chapter reader (content managed in the admin dashboard). If it has no published book yet, or the
    // server is a previous version without it, the original in-page PDF reader is used exactly as before.
    try {
      const books = await api.readerBooks();
      if (books.ok && Array.isArray(books.data.books) && books.data.books.length > 0) {
        navigate("/read");
        return;
      }
    } catch { /* fall back to the PDF reader */ }
    // A Digital Companion order must never open its Companion PDF as a "reader": without a published book it is simply not ready.
    if (!(Number(order.amount) < 30)) { setOrdersError("Online reading is being prepared. Please check back shortly."); return; }
    const url = await resolveFileUrl(order, "read");
    if (!url) return;
    setReaderUrl(url);
    setReadingOrder(order);
  };

  const closeReader = () => {
    setReadingOrder(null);
    setReaderUrl("");
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
    const upgradeUrl = import.meta.env.VITE_PAYHIP_UPGRADE_URL ||
      (import.meta.env.VITE_PAYHIP_UPGRADE_PRODUCT_ID ? `https://payhip.com/b/${import.meta.env.VITE_PAYHIP_UPGRADE_PRODUCT_ID}` : "");
    const email = (user?.email || "").trim();

    if (upgradeUrl) {
      const sep = upgradeUrl.includes("?") ? "&" : "?";
      window.location.href = `${upgradeUrl}${sep}email=${encodeURIComponent(email)}`;
      return;
    }

    // Direct to publications page editions anchor
    const slug = order?.slug || "marketing-reclassified";
    window.location.href = `/publications/${slug}#editions`;
  };

  /* ── Render ─────────────────────────────────────── */
  const isAuthenticated = !!user;

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
                  : "Sign in to view your order history"}
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
              <p>First time here? Sign in with Google or your email, and your account is created automatically. If you bought the book, use the same email you used at checkout.</p>

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
                  <i className="fa-solid fa-envelope" style={{ marginRight: 6 }} /> Or use your email: we send you a sign-in link, no password needed →
                </Link>
              </div>

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
              {ordersNotice && (
                <div className="my-orders-notice" role="status" data-testid="orders-notice">
                  <i className="fa-solid fa-circle-check" />
                  {ordersNotice}
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
                      // Downloads and Ask SID have separate dates: the files are available for 72 hours (3 downloads per file), Ask SID for the customer's own period.
                      const dlLimit = Number(order.download_limit) || 3;
                      const windowOver = !!order.download_expires_at && new Date(order.download_expires_at) < new Date();
                      const askSidEnd = entitlement && entitlement.edition === "companion" ? entitlement.askSidExpiresAt : null;
                      const askSidOver = askSidEnd ? new Date(askSidEnd) < new Date() : false;
                      const isPaidOrder = order.status === "paid" || order.status === "successful";
                      const canRenew = isPaidOrder && !isOnlineOrder && order.needs_download_renewal === true;
                      const renewalsLeft = typeof order.download_renewals_left === "number" ? order.download_renewals_left : 3;

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
                                  {order.book_pdf_available ? ` (Companion Pack) · ${order.book_download_count || 0} / ${order.download_limit || 3} (Book PDF)` : ""}
                                </span>
                              )}
                              {!isOnlineOrder && order.download_expires_at && (
                                <span className="my-order-meta-item" data-testid="downloads-until">
                                  <i className="fa-solid fa-clock" />
                                  {windowOver
                                    ? `Download links ended ${formatDate(order.download_expires_at)}`
                                    : `Downloads available until ${formatDate(order.download_expires_at)} (${dlLimit} per file)`}
                                </span>
                              )}
                              {isCompanionOrder && askSidEnd && (
                                <span className="my-order-meta-item" data-testid="asksid-until">
                                  <i className="fa-solid fa-wand-magic-sparkles" />
                                  {askSidOver ? `Ask SID access ended ${formatDate(askSidEnd)}` : `Ask SID until ${formatDate(askSidEnd)}`}
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
                                      {downloadingId === order.id ? "Downloading…" : order.book_pdf_available ? "Download Companion Pack" : "Download PDF"}
                                    </button>
                                  )}

                                  {!isOnlineOrder && order.book_pdf_available && (
                                    <button
                                      className="my-order-download-btn"
                                      onClick={() => handleDownload(order, "book")}
                                      disabled={downloadingId === `${order.id}:book`}
                                      id={`download-book-btn-${order.id}`}
                                      aria-label="Download the book PDF"
                                    >
                                      <i className="fa-solid fa-book" />
                                      {downloadingId === `${order.id}:book` ? "Downloading…" : "Download Book PDF"}
                                    </button>
                                  )}

                                  {(isOnlineOrder || isCompanionOrder) && (
                                    <button
                                      type="button"
                                      className="my-order-view-btn"
                                      style={{ borderColor: "#c80808", color: "#c80808", background: "none", cursor: "pointer" }}
                                      onClick={() => openReader(order)}
                                      id={`read-btn-${order.id}`}
                                    >
                                      <i className="fa-solid fa-book-open" /> Read Online
                                    </button>
                                  )}

                                  {isCompanionOrder && (
                                    <Link
                                      to="/ask-sid"
                                      className="my-order-view-btn"
                                      style={{ borderColor: "#c80808", color: "#c80808" }}
                                      id={`asksid-btn-${order.id}`}
                                    >
                                      <i className="fa-solid fa-wand-magic-sparkles" /> Ask SID
                                    </Link>
                                  )}

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
                                    to={`/order-success?provider=${order.payment_provider || (order.paypal_order_id ? "paypal" : order.payhip_transaction_id ? "payhip" : "stripe")}&order_id=${order.paypal_order_id || order.payhip_transaction_id || order.stripe_session_id || order.id}`}
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
                              {canRenew && renewalsLeft > 0 && (
                                <button
                                  type="button"
                                  className="my-order-download-btn"
                                  onClick={() => handleRenew(order)}
                                  disabled={renewingId === order.id}
                                  id={`renew-btn-${order.id}`}
                                  data-testid="renew-download"
                                >
                                  <i className="fa-solid fa-rotate" />
                                  {renewingId === order.id ? "Renewing…" : "Request new download link"}
                                </button>
                              )}
                            </div>

                            {isPaidOrder && !isOnlineOrder && (
                              <div className="my-order-dl-info" data-testid="download-info">
                                <i className="fa-solid fa-circle-info" />
                                {canRenew && renewalsLeft > 0
                                  ? `Your download links have ended (72 hours, or 3 downloads of a file). Request new links: each time gives 72 hours and 3 downloads per file (${renewalsLeft} ${renewalsLeft === 1 ? "renewal" : "renewals"} left for this order).`
                                  : canRenew
                                    ? "All 3 renewals for this order have been used. Please contact info@siddiqui.digital and we will help."
                                    : "Each file can be downloaded 3 times within 72 hours. After that, a “Request new download link” button appears here (up to 3 times per order)."}
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
                  Protected In-Browser Edition · Authorized Reader: {user?.email}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: "0.75rem", background: "rgba(16,185,129,0.15)", color: "#10b981", padding: "4px 8px", borderRadius: 4, fontWeight: 600 }}>
                <i className="fa-solid fa-shield-halved" style={{ marginRight: 4 }} /> Protected Reader
              </span>
              <button
                type="button"
                onClick={closeReader}
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
              src={readerUrl}
              title="Protected Online Book Reader"
              style={{ width: "100%", height: "100%", border: "none" }}
            />
          </div>
        </div>
      )}
    </>
  );
}
