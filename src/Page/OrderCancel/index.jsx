import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import BannerInnerSection from "../../Components/Banner/inner";
import HeadTitle from "../../Components/Head/HeadTitle";

export default function OrderCancelPage() {
    const [searchParams] = useSearchParams();
    const productId = searchParams.get("product_id") || "1";

    return (
        <>
            <HeadTitle title="Checkout Cancelled | Siddiqui.Digital" />
            <BannerInnerSection title="Checkout Cancelled" currentPage="Checkout" />
            <section style={{
                minHeight: "60vh",
                padding: "100px 20px 80px",
                background: "radial-gradient(circle at 50% 20%, rgba(200, 8, 8, 0.05) 0%, rgba(10, 10, 12, 1) 70%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center"
            }}>
                <div style={{ maxWidth: 560, width: "100%" }}>
                    <motion.div
                        style={{
                            background: "rgba(24, 24, 27, 0.85)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            borderRadius: 20,
                            padding: 40,
                            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)"
                        }}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div style={{
                            width: 64,
                            height: 64,
                            borderRadius: "50%",
                            background: "rgba(239, 68, 68, 0.15)",
                            color: "#ef4444",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 20px",
                            fontSize: 28
                        }}>
                            <i className="fa-solid fa-arrow-left" />
                        </div>
                        <h1 style={{ color: "#ffffff", fontSize: "1.75rem", fontWeight: 800, marginBottom: 12 }}>
                            Checkout Was Cancelled
                        </h1>
                        <p style={{ color: "#a1a1aa", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: 28 }}>
                            Your payment session was cancelled and you have not been charged. If you have questions about payment options or need assistance, feel free to contact us.
                        </p>
                        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                            <Link
                                to={`/buy-book/${productId}`}
                                style={{
                                    background: "linear-gradient(135deg, #c80808 0%, #990000 100%)",
                                    color: "#fff",
                                    padding: "12px 28px",
                                    borderRadius: 10,
                                    textDecoration: "none",
                                    fontWeight: 700,
                                    fontSize: "0.95rem"
                                }}
                            >
                                Try Again
                            </Link>
                            <Link
                                to="/e_books"
                                style={{
                                    background: "transparent",
                                    border: "1px solid rgba(255, 255, 255, 0.15)",
                                    color: "#d4d4d8",
                                    padding: "12px 24px",
                                    borderRadius: 10,
                                    textDecoration: "none",
                                    fontWeight: 600,
                                    fontSize: "0.95rem"
                                }}
                            >
                                Browse Publications
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </>
    );
}
