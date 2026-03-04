import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../supabaseClient";
import books from "../../Data/books";
import "./BuyBookCheckout.css";

export default function BuyBookCheckout() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [paymentProcessing, setPaymentProcessing] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", cardNumber: "", expiry: "", cvc: "" });

    const book = books.find((b) => b.id === parseInt(id));

    // Listen for auth state changes (handles redirect after Google sign-in)
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Pre-fill email from Google account
    useEffect(() => {
        if (user) {
            setFormData((prev) => ({
                ...prev,
                name: user.user_metadata?.full_name || prev.name,
                email: user.email || prev.email,
            }));
        }
    }, [user]);

    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: window.location.href,
                },
            });
            if (error) {
                console.error("Google sign-in error:", error.message);
                alert("Sign-in failed. Please try again.");
            }
        } catch (err) {
            console.error("Unexpected error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        if (!user) return;
        setPaymentProcessing(true);
        // Simulate payment processing (replace with real Stripe integration)
        setTimeout(() => {
            setPaymentProcessing(false);
            alert("Payment successful! Thank you for your purchase.");
        }, 2500);
    };

    if (!book) {
        return (
            <div className="buybook-page" style={{ textAlign: "center", paddingTop: "120px" }}>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
                    <h2>Book not found</h2>
                    <p style={{ opacity: 0.6, marginTop: 12 }}>The book you're looking for doesn't exist.</p>
                    <button
                        onClick={() => navigate("/e_books")}
                        style={{ marginTop: 24, padding: "12px 28px", borderRadius: 12, border: "none", background: "#ef4444", color: "#fff", fontWeight: 700, cursor: "pointer" }}
                    >
                        Browse Books
                    </button>
                </motion.div>
            </div>
        );
    }

    const isSignedIn = !!user;

    return (
        <div className="buybook-page">
            <div className="buybook-container">
                {/* ===== LEFT SIDE: Book Details ===== */}
                <motion.div
                    className="buybook-left"
                    initial={{ opacity: 0, x: -60 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                >
                    <div className="buybook-image-wrapper">
                        <img src={book.image} alt={book.title} />
                        <div className="buybook-image-overlay" />
                    </div>

                    <div className="buybook-info">
                        <motion.h1
                            className="buybook-title"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                        >
                            {book.title}
                        </motion.h1>
                        <motion.p
                            className="buybook-description"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                        >
                            {book.description}
                        </motion.p>
                        <motion.div
                            className="buybook-price-tag"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5, duration: 0.4, type: "spring" }}
                        >
                            <i className="fa-solid fa-tag" />
                            {book.price}
                        </motion.div>
                    </div>
                </motion.div>

                {/* ===== RIGHT SIDE: Auth + Payment ===== */}
                <motion.div
                    className="buybook-right"
                    initial={{ opacity: 0, x: 60 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
                >
                    {/* Step Indicators */}
                    <div className="buybook-steps">
                        <div className={`buybook-step ${isSignedIn ? "completed" : "active"}`}>
                            <span className="buybook-step-number">
                                {isSignedIn ? <i className="fa-solid fa-check" /> : "1"}
                            </span>
                            <span className="buybook-step-label">Sign In</span>
                        </div>
                        <div className={`buybook-step-connector ${isSignedIn ? "active" : ""}`} />
                        <div className={`buybook-step ${isSignedIn ? "active" : "inactive"}`}>
                            <span className="buybook-step-number">2</span>
                            <span className="buybook-step-label">Payment</span>
                        </div>
                    </div>

                    {/* ---- Auth Section ---- */}
                    <motion.div
                        className="buybook-auth-card glass-light"
                        layout
                        transition={{ duration: 0.4 }}
                    >
                        <div className="buybook-auth-header">
                            <i className="fa-solid fa-user-shield" />
                            <div>
                                <h3>{isSignedIn ? "Signed In" : "Sign In to Continue"}</h3>
                                <p>{isSignedIn ? "You're authenticated" : "Sign in with your Google account to proceed"}</p>
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            {!isSignedIn ? (
                                <motion.div
                                    key="signin-btn"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <button
                                        className="buybook-google-btn"
                                        onClick={handleGoogleSignIn}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <span className="spinner" />
                                        ) : (
                                            <>
                                                <img
                                                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                                    alt="Google"
                                                />
                                                Sign in with Google
                                            </>
                                        )}
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="user-card"
                                    className="buybook-user-card"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <img
                                        className="buybook-user-avatar"
                                        src={user.user_metadata?.avatar_url || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.email)}
                                        alt="avatar"
                                    />
                                    <div className="buybook-user-info">
                                        <p className="buybook-user-name">{user.user_metadata?.full_name || "User"}</p>
                                        <p className="buybook-user-email">{user.email}</p>
                                    </div>
                                    <div className="buybook-user-check">
                                        <i className="fa-solid fa-check" />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* ---- Divider ---- */}
                    <div className="buybook-divider">Then</div>

                    {/* ---- Payment Section ---- */}
                    <motion.div
                        className={`buybook-payment-card glass-light ${isSignedIn ? "enabled" : "disabled"}`}
                        animate={{
                            opacity: isSignedIn ? 1 : 0.45,
                            scale: isSignedIn ? 1 : 0.98,
                        }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Lock overlay when not signed in */}
                        {!isSignedIn && (
                            <div className="buybook-payment-lock-overlay">
                                <i className="fa-solid fa-lock" />
                                <p>Sign in first to unlock payment</p>
                            </div>
                        )}

                        <div className="buybook-payment-header">
                            <i className="fa-solid fa-credit-card" />
                            <h3>Payment Details</h3>
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
                                <label className="buybook-form-label">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="buybook-form-input"
                                    placeholder="your@email.com"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="buybook-form-group">
                                <label className="buybook-form-label">Card Number</label>
                                <input
                                    type="text"
                                    name="cardNumber"
                                    className="buybook-form-input"
                                    placeholder="1234 5678 9012 3456"
                                    value={formData.cardNumber}
                                    onChange={handleInputChange}
                                    maxLength={19}
                                    required
                                />
                            </div>

                            <div className="buybook-form-row">
                                <div className="buybook-form-group">
                                    <label className="buybook-form-label">Expiry Date</label>
                                    <input
                                        type="text"
                                        name="expiry"
                                        className="buybook-form-input"
                                        placeholder="MM/YY"
                                        value={formData.expiry}
                                        onChange={handleInputChange}
                                        maxLength={5}
                                        required
                                    />
                                </div>
                                <div className="buybook-form-group">
                                    <label className="buybook-form-label">CVC</label>
                                    <input
                                        type="text"
                                        name="cvc"
                                        className="buybook-form-input"
                                        placeholder="123"
                                        value={formData.cvc}
                                        onChange={handleInputChange}
                                        maxLength={4}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="buybook-pay-btn"
                                disabled={paymentProcessing || !isSignedIn}
                            >
                                {paymentProcessing ? (
                                    <>
                                        <span className="spinner" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <i className="fa-solid fa-lock" />
                                        Pay {book.price}
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="buybook-secure-note">
                            <i className="fa-solid fa-shield-halved" />
                            <span>Secured with 256-bit SSL encryption</span>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
