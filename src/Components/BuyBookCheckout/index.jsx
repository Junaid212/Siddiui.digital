import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../supabaseClient";
import { api } from "../../api";
import "./BuyBookCheckout.css";

// Fallback catalog if API products are loading or offline
const FALLBACK_PRODUCTS = [
    {
        id: "cff3798b-88bb-41af-8e2a-bc5f7a2a4239",
        sku: "EBOOK-001",
        title: "Marketing Reclassified",
        author: "Qutub Siddiqui",
        price: "AED 49.00",
        priceNum: 49.00,
        currency: "AED",
        format: "Digital Edition (PDF)",
        description: "The definitive strategic playbook for modern digital marketing and high-performance brand leadership. Learn actionable frameworks, behavioral psychology, and sustainable growth engines to scale with clarity.",
        image: "/assets/images/img/30.webp",
        download_limit: 3,
        download_expiry_hours: 72,
    },
    {
        id: "prod_002_sid_philosophy",
        sku: "WORKBOOK-002",
        title: "SID Philosophy Workbook",
        author: "Qutub Siddiqui",
        price: "AED 79.00",
        priceNum: 79.00,
        currency: "AED",
        format: "Interactive Workbook (PDF)",
        description: "A step-by-step diagnostic and execution workbook to align your organization around purpose, positioning, and profit using the proprietary SID executive framework.",
        image: "/assets/images/img/31.webp",
        download_limit: 3,
        download_expiry_hours: 72,
    },
    {
        id: "prod_003_research_report",
        sku: "REPORT-003",
        title: "Executive Research Report",
        author: "Qutub Siddiqui",
        price: "AED 99.00",
        priceNum: 99.00,
        currency: "AED",
        format: "Research Publication (PDF)",
        description: "Comprehensive analytical report covering emerging industry dynamics, digital marketing intelligence, and executive growth paradigms.",
        image: "/assets/images/img/32.webp",
        download_limit: 3,
        download_expiry_hours: 72,
    }
];

export default function BuyBookCheckout() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [product, setProduct] = useState(null);
    const [loadingProduct, setLoadingProduct] = useState(true);
    const [paymentProcessing, setPaymentProcessing] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "" });
    const [authLoading, setAuthLoading] = useState(false);

    // Resolve Product: checks database/API first, then falls back to catalog
    useEffect(() => {
        let isMounted = true;
        async function loadProduct() {
            try {
                const res = await api.getProducts();
                if (res && res.products && res.products.length > 0) {
                    const matched = res.products.find(
                        (p) => String(p.id) === String(id) ||
                               String(p.sku) === String(id) ||
                               (id === "1" && p.title.toLowerCase().includes("marketing"))
                    ) || res.products[0];

                    if (isMounted) {
                        setProduct({
                            ...matched,
                            priceNum: Number(matched.price) || 49.00,
                            currency: matched.currency || "AED",
                            format: matched.format || "Digital Edition (PDF)",
                            image: matched.cover_image || matched.image || "/assets/images/img/30.webp",
                        });
                        setLoadingProduct(false);
                        return;
                    }
                }
            } catch (err) {
                console.warn("Could not fetch remote products, using local catalog:", err);
            }

            // Fallback resolution
            const fallback = FALLBACK_PRODUCTS.find(
                (p) => String(p.id) === String(id) ||
                       String(p.sku) === String(id) ||
                       (id === "1" || id === "ebook-1")
            ) || FALLBACK_PRODUCTS[0];

            if (isMounted) {
                setProduct(fallback);
                setLoadingProduct(false);
            }
        }

        loadProduct();
        return () => { isMounted = false; };
    }, [id]);

    // Check user session
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Pre-fill user profile if logged in
    useEffect(() => {
        if (user) {
            setFormData((prev) => ({
                name: user.user_metadata?.full_name || prev.name,
                email: user.email || prev.email,
            }));
        }
    }, [user]);

    const handleGoogleSignIn = async () => {
        setAuthLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: { redirectTo: window.location.href },
            });
            if (error) console.error("Google sign-in error:", error.message);
        } catch (err) {
            console.error("Unexpected error:", err);
        } finally {
            setAuthLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        if (!product || !formData.email.trim()) return;

        setPaymentProcessing(true);
        try {
            // CRITICAL: Send only product identifier and customer details.
            // Never send client-side prices or fake card info.
            const result = await api.createCheckout({
                productId: String(product.id),
                bookName: product.title,
                customerName: formData.name.trim() || "Valued Customer",
                customerEmail: formData.email.trim(),
                userId: user?.id || null,
            });

            if (result && result.url) {
                // Redirect immediately to Stripe Hosted Checkout
                window.location.href = result.url;
            } else {
                alert("Failed to create secure checkout session. Please try again or contact support.");
                setPaymentProcessing(false);
            }
        } catch (err) {
            console.error("Payment session creation error:", err);
            alert("Unable to reach checkout service. Please verify your connection.");
            setPaymentProcessing(false);
        }
    };

    if (loadingProduct) {
        return (
            <div className="buybook-page" style={{ textAlign: "center", paddingTop: "140px", minHeight: "60vh" }}>
                <div className="spinner" style={{ width: 40, height: 40, margin: "0 auto 16px" }} />
                <p style={{ color: "#a1a1aa" }}>Loading digital publication details...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="buybook-page" style={{ textAlign: "center", paddingTop: "140px" }}>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
                    <h2>Product Not Found</h2>
                    <p style={{ opacity: 0.6, marginTop: 12 }}>The digital publication you requested does not exist.</p>
                    <button
                        onClick={() => navigate("/e_books")}
                        style={{ marginTop: 24, padding: "12px 28px", borderRadius: 12, border: "none", background: "#c80808", color: "#fff", fontWeight: 700, cursor: "pointer" }}
                    >
                        Browse All Publications
                    </button>
                </motion.div>
            </div>
        );
    }

    const formattedPrice = `${product.currency || "AED"} ${Number(product.priceNum || product.price || 49).toFixed(2)}`;

    return (
        <div className="buybook-page">
            <div className="buybook-container">
                {/* ===== LEFT SIDE: Product Details ===== */}
                <motion.div
                    className="buybook-left"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <div className="buybook-image-wrapper">
                        <img src={product.image} alt={product.title} />
                        <div className="buybook-image-overlay" />
                    </div>

                    <div className="buybook-info">
                        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
                            <span style={{
                                background: "rgba(200, 8, 8, 0.15)",
                                border: "1px solid rgba(200, 8, 8, 0.3)",
                                color: "#ef4444",
                                padding: "4px 12px",
                                borderRadius: 20,
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                textTransform: "uppercase"
                            }}>
                                {product.format || "Digital Edition"}
                            </span>
                            <span style={{ fontSize: "0.85rem", color: "#a1a1aa" }}>
                                By {product.author || "Qutub Siddiqui"}
                            </span>
                        </div>

                        <motion.h1
                            className="buybook-title"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.4 }}
                        >
                            {product.title}
                        </motion.h1>

                        <motion.p
                            className="buybook-description"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.4 }}
                        >
                            {product.description}
                        </motion.p>

                        <div className="buybook-price-tag">
                            <i className="fa-solid fa-tag" />
                            {formattedPrice}
                        </div>

                        {/* Digital Delivery Feature List */}
                        <div style={{
                            marginTop: 24,
                            background: "rgba(255, 255, 255, 0.03)",
                            border: "1px solid rgba(255, 255, 255, 0.08)",
                            borderRadius: 14,
                            padding: "16px 20px"
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, fontSize: "0.9rem", color: "#d4d4d8" }}>
                                <i className="fa-solid fa-bolt" style={{ color: "#10b981" }} />
                                <span>Instant digital delivery via secure download</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, fontSize: "0.9rem", color: "#d4d4d8" }}>
                                <i className="fa-solid fa-shield-halved" style={{ color: "#c80808" }} />
                                <span>Protected format (PDF compatible with all devices)</span>
                            </div>
                            {/* <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.9rem", color: "#d4d4d8" }}>
                                <i className="fa-solid fa-envelope-circle-check" style={{ color: "#3b82f6" }} />
                                <span>Purchase confirmation & backup download link sent to email</span>
                            </div> */}
                        </div>
                    </div>
                </motion.div>

                {/* ===== RIGHT SIDE: Customer Information & Stripe Checkout ===== */}
                <motion.div
                    className="buybook-right"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                >
                    {/* Fast Google Auth optional prompt */}
                    {!user && (
                        <div style={{
                            background: "rgba(39, 39, 42, 0.6)",
                            border: "1px solid rgba(255, 255, 255, 0.08)",
                            borderRadius: 16,
                            padding: "18px 24px",
                            marginBottom: 20,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: 12
                        }}>
                            <div>
                                <p style={{ margin: 0, fontWeight: 600, color: "#fff", fontSize: "0.9rem" }}>
                                    Have a Google Account?
                                </p>
                                <p style={{ margin: 0, fontSize: "0.8rem", color: "#a1a1aa" }}>
                                    One-click sign in to autofill your purchase email
                                </p>
                            </div>
                            <button
                                type="button"
                                className="buybook-google-btn"
                                onClick={handleGoogleSignIn}
                                disabled={authLoading}
                                style={{ margin: 0, padding: "8px 16px", fontSize: "0.85rem", width: "auto" }}
                            >
                                <img
                                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                    alt="Google"
                                    style={{ width: 16, height: 16 }}
                                />
                                Autofill with Google
                            </button>
                        </div>
                    )}

                    {/* Order Summary & Customer Details */}
                    <div className="buybook-payment-card glass-light enabled" style={{ padding: 32 }}>
                        <div className="buybook-payment-header">
                            <i className="fa-solid fa-bag-shopping" style={{ color: "#c80808" }} />
                            <h3>Order & Customer Details</h3>
                        </div>

                        <form onSubmit={handlePayment}>
                            <div className="buybook-form-group">
                                <label className="buybook-form-label">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="buybook-form-input"
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="buybook-form-group">
                                <label className="buybook-form-label">
                                    Delivery Email Address <span style={{ color: "#ef4444" }}>*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    className="buybook-form-input"
                                    placeholder="your@email.com"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                                <span style={{ fontSize: "0.75rem", color: "#71717a", marginTop: 4, display: "block" }}>
                                    Your secure download link will be delivered to this email address.
                                </span>
                            </div>

                            {/* Summary Table */}
                            <div style={{
                                background: "rgba(0,0,0,0.25)",
                                border: "1px solid rgba(255,255,255,0.06)",
                                borderRadius: 12,
                                padding: "16px 20px",
                                margin: "24px 0"
                            }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: "0.9rem", color: "#a1a1aa" }}>
                                    <span>Item</span>
                                    <span style={{ color: "#fff", fontWeight: 600 }}>{product.title}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: "0.9rem", color: "#a1a1aa" }}>
                                    <span>Delivery Method</span>
                                    <span style={{ color: "#10b981", fontWeight: 600 }}>Instant Digital (Free)</span>
                                </div>
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    paddingTop: 12,
                                    borderTop: "1px solid rgba(255,255,255,0.1)",
                                    fontSize: "1.1rem",
                                    fontWeight: 700,
                                    color: "#fff"
                                }}>
                                    <span>Total Due</span>
                                    <span style={{ color: "#10b981" }}>{formattedPrice}</span>
                                </div>
                            </div>

                            {/* Primary Stripe Button */}
                            <button
                                type="submit"
                                className="buybook-pay-btn"
                                disabled={paymentProcessing}
                                style={{
                                    background: "linear-gradient(135deg, #c80808 0%, #990000 100%)",
                                    boxShadow: "0 10px 25px -5px rgba(200, 8, 8, 0.45)",
                                }}
                            >
                                {paymentProcessing ? (
                                    <>
                                        <span className="spinner" />
                                        Connecting to Stripe...
                                    </>
                                ) : (
                                    <>
                                        <i className="fa-solid fa-lock" />
                                        Pay {formattedPrice} with Stripe
                                    </>
                                )}
                            </button>
                        </form>

                        {/* <div className="buybook-secure-note" style={{ marginTop: 20 }}>
                            <i className="fa-brands fa-stripe" style={{ fontSize: "1.8rem", color: "#635bff" }} />
                            <span>Powered by Stripe • 256-bit SSL encrypted • Card details handled safely by Stripe</span>
                        </div> */}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
