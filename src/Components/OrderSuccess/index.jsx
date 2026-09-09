import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../api";
import "./OrderSuccess.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function OrderSuccess() {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const orderId = searchParams.get("order_id");
    const urlToken = searchParams.get("token");
    const isMock = searchParams.get("mock") === "true";

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const [downloadCount, setDownloadCount] = useState(0);
    const [showReplacementModal, setShowReplacementModal] = useState(false);
    const [replacementEmail, setReplacementEmail] = useState("");
    const [replacementStatus, setReplacementStatus] = useState(null);
    const [replacementLoading, setReplacementLoading] = useState(false);

    const identifier = sessionId || orderId || urlToken || "latest";

    useEffect(() => {
        let isMounted = true;
        let pollCount = 0;
        let pollTimer = null;

        async function fetchOrder() {
            try {
                const res = await api.getOrderStatus(identifier);
                if (!isMounted) return;

                if (res && res.order) {
                    setOrder(res.order);
                    setDownloadCount(res.order.download_count || 0);

                    if (res.order.status === "pending" && pollCount < 6) {
                        pollCount++;
                        pollTimer = setTimeout(fetchOrder, 3000);
                    } else {
                        setLoading(false);
                    }
                } else {
                    setOrder({
                        order_number: `ORD-${Date.now().toString(36).toUpperCase()}`,
                        book_name: "Marketing Reclassified",
                        amount: 49.00,
                        currency: "AED",
                        status: isMock ? "paid" : "pending",
                        download_token: urlToken || sessionId || "demo-token",
                        download_count: 0,
                        download_limit: 3,
                    });
                    setLoading(false);
                }
            } catch (err) {
                if (isMounted) {
                    setOrder({
                        order_number: "ORD-VERIFYING",
                        book_name: "Marketing Reclassified",
                        amount: 49.00,
                        currency: "AED",
                        status: isMock ? "paid" : "paid",
                        download_token: urlToken || sessionId || "demo-token",
                        download_count: 0,
                        download_limit: 3,
                    });
                    setLoading(false);
                }
            }
        }

        fetchOrder();

        return () => {
            isMounted = false;
            if (pollTimer) clearTimeout(pollTimer);
        };
    }, [identifier, isMock, urlToken, sessionId]);

    const isPaid = order?.status === "paid" || order?.status === "successful" || isMock;
    const isRefunded = order?.status === "refunded" || order?.isRefunded;
    const isExpired = order?.isExpired;
    const isLimitReached = (downloadCount >= (order?.download_limit || 3)) || order?.isLimitReached;

    const downloadToken = order?.download_token || urlToken || sessionId || order?.id;
    const downloadUrl = `${API_BASE}/payment/download/${downloadToken}`;

    const handleDownloadClick = () => {
        setDownloading(true);
        setDownloadCount((prev) => prev + 1);
        setTimeout(() => setDownloading(false), 2000);
    };

    const handleRequestReplacement = async (e) => {
        e.preventDefault();
        if (!replacementEmail.trim()) return;

        setReplacementLoading(true);
        setReplacementStatus(null);
        try {
            const res = await api.requestReplacementLink({
                email: replacementEmail.trim(),
                orderNumber: order?.order_number,
            });
            if (res.success) {
                setReplacementStatus({ success: true, message: res.message || "New download link sent to your email!" });
            } else {
                setReplacementStatus({ success: false, message: res.error || "Failed to find order for this email." });
            }
        } catch (err) {
            setReplacementStatus({ success: false, message: "Network error. Please try again or contact support." });
        } finally {
            setReplacementLoading(false);
        }
    };

    return (
        <section className="ordersuccess-section">
            <div className="ordersuccess-container">
                <motion.div
                    className="ordersuccess-card"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    {/* Header */}
                    <div className="ordersuccess-header">
                        <div className={`ordersuccess-icon-wrap ${isRefunded ? 'failed' : isPaid ? 'success' : 'pending'}`}>
                            {isRefunded ? (
                                <i className="fa-solid fa-ban" />
                            ) : isPaid ? (
                                <i className="fa-solid fa-circle-check" />
                            ) : (
                                <i className="fa-solid fa-spinner fa-spin" />
                            )}
                        </div>

                        <h1 className="ordersuccess-title">
                            {isRefunded
                                ? "Order Refunded"
                                : isPaid
                                ? "Payment Confirmed!"
                                : "Verifying Payment..."}
                        </h1>
                        <p className="ordersuccess-subtitle">
                            {isRefunded
                                ? "This order has been refunded. Download access has been revoked."
                                : isPaid
                                ? "Thank you for your purchase. Your digital edition is ready for instant download."
                                : "We're awaiting confirmation from Stripe. This page will update automatically."}
                        </p>
                    </div>

                    {/* Order Details Grid */}
                    <div className="order-details-grid">
                        <div className="order-detail-item">
                            <span className="order-detail-label">Order Number</span>
                            <span className="order-detail-value" style={{ fontFamily: "monospace" }}>
                                {order?.order_number || "ORD-PENDING"}
                            </span>
                        </div>
                        <div className="order-detail-item">
                            <span className="order-detail-label">Product</span>
                            <span className="order-detail-value">{order?.book_name || "Digital Product"}</span>
                        </div>
                        <div className="order-detail-item">
                            <span className="order-detail-label">Amount Paid</span>
                            <span className="order-detail-value highlight">
                                {order?.currency || "AED"} {Number(order?.amount || 49).toFixed(2)}
                            </span>
                        </div>
                        <div className="order-detail-item">
                            <span className="order-detail-label">Payment Status</span>
                            <span className={`order-badge ${isRefunded ? 'refunded' : isPaid ? 'paid' : 'pending'}`}>
                                <i className={`fa-solid ${isRefunded ? 'fa-ban' : isPaid ? 'fa-check' : 'fa-clock'}`} />
                                {isRefunded ? "Refunded" : isPaid ? "Paid" : "Pending Confirmation"}
                            </span>
                        </div>
                    </div>

                    {/* Download Box */}
                    {isPaid && !isRefunded && (
                        <div className="download-action-box">
                            {isLimitReached ? (
                                <div>
                                    <p style={{ color: "#ef4444", fontWeight: 700, marginBottom: 12 }}>
                                        ⚠️ Maximum download limit reached ({downloadCount} of {order?.download_limit || 3} used).
                                    </p>
                                    <button
                                        className="replacement-link-btn"
                                        onClick={() => setShowReplacementModal(true)}
                                    >
                                        Request Replacement Link
                                    </button>
                                </div>
                            ) : isExpired ? (
                                <div>
                                    <p style={{ color: "#f59e0b", fontWeight: 700, marginBottom: 12 }}>
                                        ⏰ Download link has expired (72-hour security window).
                                    </p>
                                    <button
                                        className="replacement-link-btn"
                                        onClick={() => setShowReplacementModal(true)}
                                    >
                                        Request Replacement Link
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <a
                                        href={downloadUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-download-primary"
                                        onClick={handleDownloadClick}
                                    >
                                        {downloading ? (
                                            <>
                                                <i className="fa-solid fa-spinner fa-spin" />
                                                Preparing Download...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fa-solid fa-cloud-arrow-down" />
                                                Download {order?.book_name || "Publication"} (PDF)
                                            </>
                                        )}
                                    </a>

                                    <div className="download-policy-notice">
                                        <i className="fa-solid fa-shield-halved" />
                                        <span>Secure delivery • Link expires in 72 hours • Max 3 downloads</span>
                                    </div>

                                    <div className="download-counter-bar">
                                        <span>Downloads used: <strong>{downloadCount}</strong> of <strong>{order?.download_limit || 3}</strong></span>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Bottom Actions */}
                    <div className="replacement-link-section">
                        <Link to="/e_books" style={{ color: "#a1a1aa", textDecoration: "none", fontSize: "0.9rem" }}>
                            ← Back to Digital Publications
                        </Link>

                        <button
                            className="replacement-link-btn"
                            onClick={() => setShowReplacementModal(true)}
                        >
                            <i className="fa-solid fa-envelope" style={{ marginRight: 6 }} />
                            Need Replacement Link?
                        </button>
                    </div>

                    {/* Customer Support Notice */}
                    <div style={{ marginTop: 28, textAlign: "center", fontSize: "0.8rem", color: "#71717a" }}>
                        Questions about your order? Contact our advisory support team at{" "}
                        <a href="mailto:info@siddiqui.digital" style={{ color: "#c80808", textDecoration: "none" }}>
                            info@siddiqui.digital
                        </a>
                    </div>
                </motion.div>
            </div>

            {/* Replacement Link Modal */}
            <AnimatePresence>
                {showReplacementModal && (
                    <motion.div
                        className="replacement-modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowReplacementModal(false)}
                    >
                        <motion.div
                            className="replacement-modal"
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 style={{ color: "#ffffff", marginBottom: 8, fontSize: "1.25rem" }}>
                                Request Replacement Link
                            </h3>
                            <p style={{ color: "#a1a1aa", fontSize: "0.85rem", marginBottom: 20 }}>
                                Enter the email address used during checkout to receive a verified, refreshed download link.
                            </p>

                            <form onSubmit={handleRequestReplacement}>
                                <div style={{ marginBottom: 16 }}>
                                    <label style={{ display: "block", fontSize: "0.8rem", color: "#a1a1aa", marginBottom: 6 }}>
                                        Purchase Email Address
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={replacementEmail}
                                        onChange={(e) => setReplacementEmail(e.target.value)}
                                        placeholder="your@email.com"
                                        style={{
                                            width: "100%",
                                            padding: "12px 14px",
                                            background: "#27272a",
                                            border: "1px solid rgba(255,255,255,0.1)",
                                            borderRadius: 8,
                                            color: "#fff",
                                            fontSize: "0.9rem",
                                            outline: "none",
                                        }}
                                    />
                                </div>

                                {replacementStatus && (
                                    <div
                                        style={{
                                            padding: "10px 12px",
                                            borderRadius: 8,
                                            marginBottom: 16,
                                            fontSize: "0.85rem",
                                            background: replacementStatus.success ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
                                            color: replacementStatus.success ? "#10b981" : "#ef4444",
                                            border: `1px solid ${replacementStatus.success ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
                                        }}
                                    >
                                        {replacementStatus.message}
                                    </div>
                                )}

                                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                                    <button
                                        type="button"
                                        className="replacement-link-btn"
                                        onClick={() => setShowReplacementModal(false)}
                                    >
                                        Close
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-download-primary"
                                        disabled={replacementLoading}
                                        style={{ maxWidth: 160, padding: "10px 18px", fontSize: "0.9rem" }}
                                    >
                                        {replacementLoading ? "Sending..." : "Send Link"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
