import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../supabaseClient";
import { api } from "../../api";
import { useCart } from "../Cart/CartContext";
import "./BuyBookCheckout.css";

/* ============================================================
   Helpers
   ============================================================ */
function safeArr(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val.filter(Boolean);
  if (typeof val === "string") {
    const trimmed = val.trim();
    if (!trimmed) return [];
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
    } catch {
      // not json
    }
    if (trimmed.includes(";") || trimmed.includes("\n")) {
      const delim = trimmed.includes(";") ? ";" : "\n";
      return trimmed.split(delim).map((s) => s.trim()).filter(Boolean);
    }
    return [trimmed];
  }
  return [];
}

function hasContent(val) {
  if (!val) return false;
  if (typeof val === "string") return val.trim().length > 0;
  if (Array.isArray(val)) return val.filter(Boolean).length > 0;
  return false;
}

/* ============================================================
   Component: BuyBookCheckout
   All content values come dynamically from Admin Panel / DB
   No hardcoded default values.
   ============================================================ */
export default function BuyBookCheckout() {
  const { slug, id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [user, setUser] = useState(null);
  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [processingOption, setProcessingOption] = useState(null);
  const [checkoutError, setCheckoutError] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [showQuickForm, setShowQuickForm] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  // Ask SID interactive input
  const [askSidQuery, setAskSidQuery] = useState("");

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [couponInput, setCouponInput] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  const [ownership, setOwnership] = useState({ owned: false, edition: null, canUpgrade: false });
  const [ownershipNotice, setOwnershipNotice] = useState(null);

  // Auth state
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user?.email) {
      setFormData((prev) => ({
        name: user.user_metadata?.full_name || prev.name,
        email: user.email || prev.email,
      }));
      api.checkOwnership(user.email).then((res) => {
        if (res) setOwnership(res);
        // Check for preserved selection after returning from login
        const pending = sessionStorage.getItem("pendingPurchase");
        if (pending) {
          try {
            const parsed = JSON.parse(pending);
            sessionStorage.removeItem("pendingPurchase");
            if (parsed.option) {
              setTimeout(() => handlePurchase(parsed.option), 400);
            }
          } catch (_) {}
        }
      }).catch(() => {});
    } else {
      setOwnership({ owned: false, edition: null, canUpgrade: false });
    }
  }, [user]);

  // Load publication from API
  useEffect(() => {
    let isMounted = true;
    async function loadProduct() {
      try {
        let res = null;
        if (slug) res = await api.getProductBySlug(slug);
        if (!res && id) res = await api.getProductById(id);

        if (res && (res.product || (Array.isArray(res.products) && res.products.length > 0))) {
          const p = res.product || res.products[0];
          if (p && isMounted) {
            setProduct(normalizeProduct(p));
            setLoadingProduct(false);
            return;
          }
        }
      } catch (err) {
        console.warn("API unavailable:", err.message);
      }

      if (isMounted) {
        setProduct(null);
        setLoadingProduct(false);
      }
    }
    loadProduct();
    return () => { isMounted = false; };
  }, [slug, id]);

  function normalizeProduct(p) {
    if (!p) return null;

    let parsedV2 = {};
    if (typeof p.why_this_book_matters === "string" && p.why_this_book_matters.trim().startsWith("{")) {
      try {
        parsedV2 = JSON.parse(p.why_this_book_matters);
      } catch {
        parsedV2 = {};
      }
    }

    const systems = [];
    if (parsedV2.system_1_desc) systems.push({ number: "01", name: "SENSE", desc: parsedV2.system_1_desc, boxClass: "v2-system-box-1" });
    if (parsedV2.system_2_desc) systems.push({ number: "02", name: "SHAPE", desc: parsedV2.system_2_desc, boxClass: "v2-system-box-2" });
    if (parsedV2.system_3_desc) systems.push({ number: "03", name: "SCALE", desc: parsedV2.system_3_desc, boxClass: "v2-system-box-3" });
    if (parsedV2.system_4_desc) systems.push({ number: "04", name: "EXPERIENCE", desc: parsedV2.system_4_desc, boxClass: "v2-system-box-4" });

    const metaYear = parsedV2.meta_edition_year || "";
    const metaPages = parsedV2.meta_pages || "";
    const metaChapters = parsedV2.meta_chapters || "";
    const metaToolkit = parsedV2.meta_toolkit_note || "";

    let metaInfo = "";
    if (metaYear || metaPages || metaChapters) {
      const parts = [];
      if (metaYear) parts.push(`Digital edition, ${metaYear}`);
      if (metaChapters) parts.push(`${metaChapters} chapters`);
      if (metaPages) parts.push(`${metaPages} pages`);
      metaInfo = parts.join(" · ");
    }

    return {
      // Book / Card Product Info (Distinct from Hero)
      id: String(p.id),
      title: p.title || "",
      subtitle: p.subtitle || "",
      author: p.author || "",
      description: p.description || "",
      cover_image: p.cover_image || "",
      price: Number(p.price) || 0,
      currency: p.currency || "USD",
      publication_status: p.publication_status || "available",

      // Dedicated Hero Section Info
      hero_audience_tag: parsedV2.hero_audience_tag || "",
      hero_title: parsedV2.hero_title || "",
      hero_title_accent: parsedV2.hero_title_accent || "",
      hero_subtitle: parsedV2.hero_subtitle || "",
      hero_motto: parsedV2.hero_motto || "",
      hero_image: parsedV2.hero_image || "",
      hero_meta_info: parsedV2.hero_meta_info || metaInfo || "",

      meta_stats: (metaYear || metaPages || metaChapters || metaToolkit) ? {
        year: metaYear,
        pages: metaPages,
        chapters: metaChapters,
        toolkit: metaToolkit,
      } : null,

      // Introduction
      intro_eyebrow: parsedV2.intro_eyebrow || "",
      why_this_book_matters: parsedV2.intro_lead || (typeof p.why_this_book_matters === "string" && !p.why_this_book_matters.startsWith("{") ? p.why_this_book_matters : ""),
      intro_highlight: parsedV2.intro_highlight || "",
      intro_body: parsedV2.intro_body || "",

      // SID Definition
      sid_definition_quote: parsedV2.sid_definition_quote || "",
      sid_definition_full: parsedV2.sid_definition_full || "",
      sid_definition_citation: parsedV2.sid_definition_citation || "",
      author_note: p.author_note || "",

      // Systems & Offerings
      systems,
      loop_note: parsedV2.loop_note || "",
      offering_cards: Array.isArray(parsedV2.offering_cards) ? parsedV2.offering_cards.filter(c => c && c.title) : [],

      // Ask SID
      ask_sid_eyebrow: parsedV2.ask_sid_eyebrow || "",
      ask_sid_title: parsedV2.ask_sid_title || "",
      ask_sid_tagline: parsedV2.ask_sid_tagline || "",
      ask_sid_paragraphs: Array.isArray(parsedV2.ask_sid_paragraphs) ? parsedV2.ask_sid_paragraphs.filter(Boolean) : [],
      ask_sid_link_text: parsedV2.ask_sid_link_text || "Learn more about Ask SID",
      ask_sid_link_url: parsedV2.ask_sid_link_url || "/ask-sid",
      ask_sid_disclaimer: parsedV2.ask_sid_disclaimer || "",
      ask_sid_bottom_quote: parsedV2.ask_sid_bottom_quote || "",
      ask_sid_questions: Array.isArray(parsedV2.ask_sid_questions) ? parsedV2.ask_sid_questions.filter(Boolean) : [],

      // Audience & Scope
      who_its_for: safeArr(p.who_its_for),
      what_not_paras: Array.isArray(parsedV2.what_not_paras) ? parsedV2.what_not_paras.filter(Boolean) : [],
      what_not_conclusion: parsedV2.what_not_conclusion || "",

      // Editions
      editions_eyebrow: parsedV2.editions_eyebrow || "EDITIONS",
      editions_heading: parsedV2.editions_heading || "Choose Your Edition",
      access_options: safeArr(p.access_options).filter(o => o && o.status !== "inactive"),
      editions_footnote: parsedV2.editions_footnote || "",

      // About Book & Author
      about_book_eyebrow: parsedV2.about_book_eyebrow || "ABOUT THE BOOK",
      about_book_title: parsedV2.about_book_title || p.title || "",
      about_book_summary: parsedV2.about_book_summary || "",
      author_photo: parsedV2.author_photo || "/assets/images/img/v2-author-photo.png",
      author_bio: Array.isArray(parsedV2.author_bio) ? parsedV2.author_bio.filter(Boolean) : (p.author_note ? [p.author_note] : []),

      // Final CTA
      cta_heading: parsedV2.cta_heading || "",
      cta_paragraphs: Array.isArray(parsedV2.cta_paragraphs) ? parsedV2.cta_paragraphs.filter(Boolean) : [],
      cta_motto: parsedV2.cta_motto || parsedV2.hero_motto || "",
    };
  }

  // Handle Coupon
  const handleApplyCoupon = async (subtotalAmount) => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    setCouponLoading(true);
    setCouponError("");
    setCouponSuccess("");
    try {
      const data = await api.validateDiscount(code, subtotalAmount || product?.price || 0);
      if (data && data.valid && data.discount) {
        setCouponCode(code);
        setCouponDiscount(data.discount);
        const pct = data.discount.value || data.discount.discount_percentage;
        setCouponSuccess(`Coupon '${code}' applied! Saved ${pct}%.`);
      } else {
        setCouponDiscount(null);
        setCouponCode("");
        setCouponError(data?.error || `Coupon code '${code}' is invalid.`);
      }
    } catch {
      setCouponError("Unable to verify coupon code. Please try again.");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setCouponDiscount(null);
    setCouponInput("");
    setCouponSuccess("");
    setCouponError("");
  };

  // Add to cart with ownership and upgrade rules
  const handleAddToCart = (option) => {
    if (!product) return;
    const isObj = typeof option === "object" && option !== null;
    const accessType = isObj ? (option.access_type || "download") : option;
    const price = isObj ? Number(option.price) : Number(product.price);
    const isOnlineOpt = accessType === "online" || price === 20;
    const isCompanionOpt = accessType === "companion" || price >= 40;

    // Rule 1: Owns $49.99 edition -> block both $20 and $49.99
    if (ownership.edition === "companion") {
      setOwnershipNotice({
        message: "You already own the complete Digital Companion Edition. You have full access to read online and download files.",
      });
      return;
    }

    // Rule 2: Owns $20 edition and tries to buy $20 edition -> block
    if (ownership.edition === "online" && isOnlineOpt) {
      setOwnershipNotice({
        message: "You already own the Online Reading Edition. You have full access to read this publication in your account.",
      });
      return;
    }

    let finalPrice = price;
    let accessLabel = isObj ? option.name : "Publication";
    let isUpgrade = false;

    // Rule 3: Owns $20 edition, buying $49.99 edition -> charge only difference (USD 29.99)
    if (ownership.edition === "online" && isCompanionOpt) {
      finalPrice = 29.99;
      accessLabel = "Upgrade to Digital Companion Edition";
      isUpgrade = true;
    }

    const currency = isObj ? (option.currency || product.currency || "USD") : (product.currency || "USD");

    addItem({
      productId: product.id,
      title: product.title,
      price: finalPrice,
      currency,
      coverImage: product.cover_image,
      accessType,
      accessLabel,
      isUpgrade,
      slug: slug || null,
      payhipProductId: isUpgrade ? (option?.upgrade_payhip_product_id || "") : (option?.payhip_product_id || ""),
      payhipCheckoutUrl: isUpgrade ? (option?.upgrade_payhip_checkout_url || "") : (option?.payhip_checkout_url || ""),
    });

    if (isUpgrade) {
      showToast("Upgrade to Digital Companion Edition ($29.99) added to cart");
    } else {
      showToast(`Added ${accessLabel} to your cart`);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // Sanitize and extract clean Payhip URL
  const extractPayhipUrl = (str) => {
    if (!str) return "";
    const match = String(str).match(/https?:\/\/payhip\.com\/b\/[a-zA-Z0-9]+/i);
    return match ? match[0] : str.trim();
  };

  // Resolve Payhip Checkout URL for selected edition
  const getPayhipCheckoutUrl = (option, isUpgrade = false, customerEmail = "") => {
    let url = "";

    // 1. Upgrade-specific Payhip checkout
    if (isUpgrade) {
      if (option?.upgrade_payhip_checkout_url) {
        url = extractPayhipUrl(option.upgrade_payhip_checkout_url);
      } else if (option?.upgrade_payhip_product_id) {
        url = `https://payhip.com/b/${option.upgrade_payhip_product_id.trim()}`;
      } else if (import.meta.env.VITE_PAYHIP_UPGRADE_URL) {
        url = extractPayhipUrl(import.meta.env.VITE_PAYHIP_UPGRADE_URL);
      } else if (import.meta.env.VITE_PAYHIP_UPGRADE_PRODUCT_ID) {
        url = `https://payhip.com/b/${import.meta.env.VITE_PAYHIP_UPGRADE_PRODUCT_ID.trim()}`;
      }
    }

    // 2. Direct edition-configured checkout
    if (!url && option) {
      if (option.payhip_checkout_url) {
        url = extractPayhipUrl(option.payhip_checkout_url);
      } else if (option.payhip_product_id) {
        url = `https://payhip.com/b/${option.payhip_product_id.trim()}`;
      }
    }

    // 3. Fallbacks by edition tier from environment variables
    if (!url) {
      const isOnline = option?.access_type === "online" || Number(option?.price) === 20;
      if (isOnline) {
        if (import.meta.env.VITE_PAYHIP_ONLINE_URL) {
          url = import.meta.env.VITE_PAYHIP_ONLINE_URL.trim();
        } else if (import.meta.env.VITE_PAYHIP_ONLINE_PRODUCT_ID) {
          url = `https://payhip.com/b/${import.meta.env.VITE_PAYHIP_ONLINE_PRODUCT_ID.trim()}`;
        }
      } else {
        if (import.meta.env.VITE_PAYHIP_COMPANION_URL) {
          url = import.meta.env.VITE_PAYHIP_COMPANION_URL.trim();
        } else if (import.meta.env.VITE_PAYHIP_COMPANION_PRODUCT_ID) {
          url = `https://payhip.com/b/${import.meta.env.VITE_PAYHIP_COMPANION_PRODUCT_ID.trim()}`;
        }
      }
    }

    // 4. Attach buyer email for prefilling on Payhip checkout
    if (url && customerEmail) {
      const sep = url.includes("?") ? "&" : "?";
      url = `${url}${sep}email=${encodeURIComponent(customerEmail.trim())}`;
    }

    return url;
  };

  // Payhip Checkout with ownership and upgrade rules
  const handlePurchase = async (option) => {
    setCheckoutError("");
    const isObj = typeof option === "object" && option !== null;
    const optionKey = isObj ? (option.access_type || "download") : option;
    const price = isObj ? Number(option.price) : Number(product.price);
    const isOnlineOpt = optionKey === "online" || price === 20;
    const isCompanionOpt = optionKey === "companion" || price >= 40;

    // Rule 1: Owns $49.99 edition -> block purchase
    if (ownership.edition === "companion") {
      setOwnershipNotice({
        message: "You already own the complete Digital Companion Edition. You have full access to read online and download files.",
      });
      return;
    }

    // Rule 2: Owns $20 edition and tries to buy $20 edition -> block purchase
    if (ownership.edition === "online" && isOnlineOpt) {
      setOwnershipNotice({
        message: "You already own the Online Reading Edition. You have full access to read this publication in your account.",
      });
      return;
    }

    const customerEmail = (user?.email || formData.email || "").trim();
    if (!customerEmail) {
      setSelectedOption(option);
      setShowQuickForm(true);
      return;
    }

    setProcessingOption(optionKey);

    const isUpgrade = ownership.edition === "online" && isCompanionOpt;
    const payhipUrl = getPayhipCheckoutUrl(option, isUpgrade, customerEmail);

    if (payhipUrl) {
      // Preserve selection in session storage
      try {
        sessionStorage.setItem("pendingPurchase", JSON.stringify({
          option,
          productTitle: product?.title,
          isUpgrade,
          customerEmail,
          timestamp: Date.now()
        }));
      } catch (_) {}

      // Redirect directly to Payhip checkout for the selected edition
      window.location.href = payhipUrl;
      return;
    }

    // Payhip URL not yet configured for this edition
    setProcessingOption(null);
    setCheckoutError(
      `Payhip checkout configuration for ${isObj ? option.name : "this edition"} is pending. Please configure the Payhip Product ID in the Admin Panel.`
    );
  };

  const handleAskSidSubmit = (e) => {
    if (e) e.preventDefault();
    const q = askSidQuery.trim();
    if (!q) return;
    navigate(`/ask-sid?q=${encodeURIComponent(q)}`);
  };

  const handleAskSidChipClick = (chipText) => {
    navigate(`/ask-sid?q=${encodeURIComponent(chipText)}`);
  };

  if (loadingProduct) {
    return (
      <div className="pub-page-v2" style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: "var(--v2-font-serif)", fontSize: "20px", color: "var(--v2-navy)" }}>
          Loading publication details…
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pub-page-v2" style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
        <h2 style={{ fontFamily: "var(--v2-font-serif)", color: "var(--v2-navy)" }}>Publication Not Found</h2>
        <Link to="/publications" className="v2-btn-primary">Browse All Publications</Link>
      </div>
    );
  }

  const isComingSoon = product.publication_status === "coming_soon";
  const hasOptions = product.access_options && product.access_options.length > 0;

  return (
    <div className="pub-page-v2">

      {/* ── 1. HERO (#top) ─────────────────────────────────── */}
      <section id="top" className="v2-hero">
        <div className="v2-hero-inner">
          <div className="v2-hero-content">
            {product.hero_audience_tag && (
              <p className="v2-hero-audience">{product.hero_audience_tag}</p>
            )}

            {(product.hero_title || product.hero_title_accent) ? (
              <h1 className="v2-hero-title">
                {product.hero_title}
                {product.hero_title_accent && (
                  <>
                    {product.hero_title && <br />}
                    <span style={{ color: "#F2C6CD" }}>{product.hero_title_accent}</span>
                  </>
                )}
              </h1>
            ) : product.title ? (
              <h1 className="v2-hero-title">{product.title}</h1>
            ) : null}

            {product.hero_subtitle && (
              <p className="v2-hero-subtitle">{product.hero_subtitle}</p>
            )}

            {product.hero_motto && (
              <p className="v2-hero-motto">{product.hero_motto}</p>
            )}

            {/* CTAs from Access Options or direct price */}
            {!isComingSoon && (
              <div className="v2-hero-actions">
                {hasOptions ? (
                  product.access_options.slice(0, 2).map((opt, i) => (
                    <button
                      key={i}
                      type="button"
                      className={i === 0 ? "v2-btn-primary" : "v2-btn-secondary"}
                      onClick={() => handlePurchase(opt)}
                      disabled={processingOption === (opt.access_type || `opt-${i}`)}
                    >
                      {processingOption === (opt.access_type || `opt-${i}`) ? (
                        <>Connecting to PayPal…</>
                      ) : (
                        <>{opt.cta_text || `${opt.name} · ${opt.currency || product.currency || 'USD'} ${Number(opt.price).toFixed(2)}`}</>
                      )}
                    </button>
                  ))
                ) : product.price > 0 ? (
                  <button
                    type="button"
                    className="v2-btn-primary"
                    onClick={() => handlePurchase("download")}
                    disabled={processingOption === "download"}
                  >
                    {processingOption === "download" ? "Connecting to PayPal…" : `Get Publication · ${product.currency || "USD"} ${Number(product.price).toFixed(2)}`}
                  </button>
                ) : null}
              </div>
            )}

            {isComingSoon && (
              <div className="v2-hero-actions">
                <span className="v2-btn-secondary" style={{ opacity: 0.7, cursor: "default" }}>
                  Coming Soon
                </span>
              </div>
            )}

            {product.hero_meta_info && (
              <p className="v2-hero-meta">{product.hero_meta_info}</p>
            )}
          </div>

          {/* Dedicated Hero Showcase Image (Distinct from book card cover) */}
          {product.hero_image && (
            <div className="v2-hero-cover-col">
              <img
                src={product.hero_image}
                alt={product.hero_title || product.title}
                className="v2-hero-cover-img"
              />
            </div>
          )}
        </div>
      </section>

      {/* ── 2. INTRODUCTION (#book) ────────────────────────── */}
      {hasContent(product.why_this_book_matters) && (
        <section id="book" className="v2-intro-section">
          <div className="v2-container-narrow">
            <div className="v2-intro-content">
              {product.intro_eyebrow && <p className="v2-eyebrow">{product.intro_eyebrow}</p>}
              <p className="v2-intro-lead">{product.why_this_book_matters}</p>
              {product.intro_highlight && (
                <p className="v2-intro-highlight">{product.intro_highlight}</p>
              )}
              {product.intro_body && (
                <p className="v2-intro-body">{product.intro_body}</p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── 3. THE SID DEFINITION OF MARKETING ─────────────── */}
      {(hasContent(product.sid_definition_quote) || hasContent(product.author_note)) && (
        <section className="v2-definition-section">
          <figure className="v2-definition-figure">
            {product.sid_definition_citation && (
              <p className="v2-eyebrow">{product.sid_definition_citation}</p>
            )}
            <svg
              className="v2-quote-icon"
              aria-hidden="true"
              width="48"
              height="36"
              viewBox="0 0 48 36"
              fill="none"
              stroke="#A3192F"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 32 V20 Q4 6 18 4" />
              <path d="M28 32 V20 Q28 6 42 4" />
            </svg>
            <blockquote className="v2-definition-quote">
              {product.sid_definition_quote || product.author_note}
            </blockquote>
            <div className="v2-definition-divider" />
            {product.sid_definition_full && (
              <p className="v2-definition-full">{product.sid_definition_full}</p>
            )}
          </figure>
        </section>
      )}

      {/* ── 4. WHAT THE BOOK OFFERS ────────────────────────── */}
      {(product.systems.length > 0 || product.offering_cards.length > 0) && (
        <section className="v2-offers-section">
          <div className="v2-container">
            <div className="v2-offers-header">
              <p className="v2-eyebrow">WHAT THE BOOK OFFERS</p>
              <h2 className="v2-section-heading">One Operating Loop, Four Systems</h2>
            </div>

            {/* Systems Ribbon */}
            {product.systems.length > 0 && (
              <>
                <div className="v2-systems-ribbon">
                  {product.systems.map((sys) => (
                    <div key={sys.number} className={`v2-system-box ${sys.boxClass}`}>
                      <p className="v2-system-tag">{sys.number} · {sys.name}</p>
                      <p className="v2-system-desc">{sys.desc}</p>
                    </div>
                  ))}
                </div>
                {product.loop_note && (
                  <p className="v2-loop-note">
                    <svg
                      aria-hidden="true"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#A3192F"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 12a9 9 0 1 0 3-6.7" />
                      <path d="M3 3v6h6" />
                    </svg>
                    {product.loop_note}
                  </p>
                )}
              </>
            )}

            {/* Feature Cards */}
            {product.offering_cards.length > 0 && (
              <div className="v2-cards-grid">
                {product.offering_cards.map((card, idx) => (
                  <article key={idx} className="v2-card">
                    <h3 className="v2-card-title">{card.title}</h3>
                    <p className="v2-card-desc">{card.desc}</p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── 5. MEET ASK SID (#asksid) ──────────────────────── */}
      {product.ask_sid_title && (
        <section id="asksid" className="v2-asksid-section">
          <div className="v2-container">
            <div className="v2-asksid-inner">
              <div className="v2-asksid-info">
                {product.ask_sid_eyebrow && (
                  <p className="v2-asksid-eyebrow">{product.ask_sid_eyebrow}</p>
                )}
                <h2 className="v2-asksid-heading">{product.ask_sid_title}</h2>
                {product.ask_sid_tagline && (
                  <p className="v2-asksid-subhead">{product.ask_sid_tagline}</p>
                )}
                {product.ask_sid_paragraphs && product.ask_sid_paragraphs.length > 0 && (
                  product.ask_sid_paragraphs.map((pText, pIdx) => (
                    <p key={pIdx} className="v2-asksid-text">{pText}</p>
                  ))
                )}
                <Link to={product.ask_sid_link_url || "/ask-sid"} className="v2-asksid-learnmore">
                  {product.ask_sid_link_text || "Learn more about Ask SID"}
                  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="M13 6l6 6-6 6" />
                  </svg>
                </Link>
              </div>

              {/* Interactive Ask SID Box */}
              <div className="v2-asksid-box">
                <div className="v2-asksid-box-header">
                  <div className="v2-asksid-avatar">SID</div>
                  <div className="v2-asksid-box-meta">
                    <span className="v2-asksid-box-title">Ask SID</span>
                    <span className="v2-asksid-box-subtitle">Book companion for {product.title}</span>
                  </div>
                </div>

                {product.ask_sid_questions && product.ask_sid_questions.length > 0 && (
                  <>
                    <p className="v2-asksid-chips-label">Try asking:</p>
                    <div className="v2-asksid-chips">
                      {product.ask_sid_questions.map((q, idx) => (
                        <span
                          key={idx}
                          className="v2-asksid-chip"
                          onClick={() => handleAskSidChipClick(q)}
                          role="button"
                          tabIndex={0}
                        >
                          {q}
                        </span>
                      ))}
                    </div>
                  </>
                )}

                <form className="v2-asksid-form" onSubmit={handleAskSidSubmit}>
                  <label htmlFor="asksid-q" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
                    Ask a question about the book
                  </label>
                  <input
                    id="asksid-q"
                    type="text"
                    placeholder="Ask a question about the book…"
                    className="v2-asksid-input"
                    value={askSidQuery}
                    onChange={(e) => setAskSidQuery(e.target.value)}
                  />
                  <button type="submit" aria-label="Send question" className="v2-asksid-send-btn">
                    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14" />
                      <path d="M13 6l6 6-6 6" />
                    </svg>
                  </button>
                </form>

                {product.ask_sid_disclaimer && (
                  <p className="v2-asksid-disclaimer">{product.ask_sid_disclaimer}</p>
                )}
              </div>

              {product.ask_sid_bottom_quote && (
                <p className="v2-asksid-bottom-quote">{product.ask_sid_bottom_quote}</p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── 6. AUDIENCE & WHAT THIS BOOK IS NOT ────────────── */}
      {(hasContent(product.who_its_for) || product.what_not_paras.length > 0) && (
        <section className="v2-audience-section">
          <div className="v2-container">
            <div className="v2-audience-grid">
              {/* Left: Who is this book for */}
              {hasContent(product.who_its_for) && (
                <div className="v2-audience-col">
                  <p className="v2-eyebrow">AUDIENCE</p>
                  <h2 className="v2-audience-heading">Who Is This Book For?</h2>
                  <ul className="v2-audience-list">
                    {product.who_its_for.map((aud, idx) => (
                      <li key={idx} className="v2-audience-item">
                        <svg
                          className="v2-audience-icon"
                          aria-hidden="true"
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#A3192F"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M4 12l5 5L20 6" />
                        </svg>
                        <span>{typeof aud === "string" ? aud : aud.label || String(aud)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Right: What this book is not */}
              {product.what_not_paras.length > 0 && (
                <div className="v2-whatnot-card">
                  <h2 className="v2-whatnot-heading">What This Book Is Not</h2>
                  {product.what_not_paras.map((p, idx) => (
                    <p key={idx} className="v2-whatnot-text">{p}</p>
                  ))}
                  {product.what_not_conclusion && (
                    <p className="v2-whatnot-conclusion">{product.what_not_conclusion}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── 7. EDITIONS (#editions) ────────────────────────── */}
      {hasOptions && (
        <section id="editions" className="v2-editions-section">
          <div className="v2-container-medium">
            <div className="v2-editions-header">
              <p className="v2-eyebrow">{product.editions_eyebrow || "EDITIONS"}</p>
              <h2 className="v2-section-heading">{product.editions_heading || "Choose Your Edition"}</h2>
            </div>

            <div className="v2-editions-grid">
              {product.access_options.map((opt, i) => {
                const isFeatured = opt.badge || opt.access_type === "companion" || i === 1;
                const priceNum = Number(opt.price) || 0;
                const isOnlineOpt = opt.access_type === "online" || priceNum === 20;
                const isCompanionOpt = opt.access_type === "companion" || priceNum >= 40;

                const isOwned =
                  (ownership.edition === "companion") ||
                  (ownership.edition === "online" && isOnlineOpt);

                const isUpgradeAvailable = ownership.edition === "online" && isCompanionOpt;
                const displayPrice = isUpgradeAvailable ? 29.99 : priceNum;

                let cardBadge = opt.badge;
                if (isOwned) cardBadge = "ALREADY OWNED";
                else if (isUpgradeAvailable) cardBadge = "UPGRADE AVAILABLE · SAVE $20";

                return (
                  <article key={i} className={`v2-edition-card ${isFeatured ? "featured" : ""} ${isOwned ? "edition-owned" : ""}`}>
                    <div className="v2-edition-top">
                      <h3 className="v2-edition-title">
                        {isUpgradeAvailable ? "Upgrade to Digital Companion Edition" : opt.name}
                      </h3>
                      {cardBadge && (
                        <span className={`v2-edition-badge ${isOwned ? "badge-owned" : isUpgradeAvailable ? "badge-upgrade" : ""}`}>
                          {cardBadge}
                        </span>
                      )}
                    </div>

                    <p className="v2-edition-price">
                      ${displayPrice.toFixed(2)}
                      {isUpgradeAvailable && (
                        <span style={{ fontSize: "0.45em", color: "#6b7280", marginLeft: 6, fontWeight: 500 }}>
                          (Price difference from Online Edition)
                        </span>
                      )}
                      {couponDiscount && !isUpgradeAvailable && (
                        <span style={{ fontSize: "0.5em", color: "#1E7A4F", marginLeft: 8 }}>
                          (${((priceNum * (100 - (couponDiscount.value || couponDiscount.discount_percentage))) / 100).toFixed(2)})
                        </span>
                      )}
                    </p>

                    {opt.description && (
                      <p className="v2-edition-desc">
                        {isUpgradeAvailable
                          ? "Upgrade your existing Online Reading access to the full Digital Companion Edition. Pay only the difference."
                          : opt.description}
                      </p>
                    )}

                    {safeArr(opt.features).length > 0 && (
                      <ul className="v2-edition-features">
                        {safeArr(opt.features).map((feat, fIdx) => {
                          const isExcluded = typeof feat === "string" && feat.startsWith("__exclude__");
                          const cleanText = isExcluded ? feat.replace("__exclude__", "") : feat;
                          return (
                            <li key={fIdx} className={`v2-feature-item ${isExcluded ? "excluded" : ""}`}>
                              {isExcluded ? (
                                <svg className="v2-feature-icon-cross" aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8A909C" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M6 6l12 12" /><path d="M18 6L6 18" />
                                </svg>
                              ) : (
                                <svg className="v2-feature-icon-check" aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E7A4F" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M4 12l5 5L20 6" />
                                </svg>
                              )}
                              <span>{cleanText}</span>
                            </li>
                          );
                        })}
                      </ul>
                    )}

                    {isOwned ? (
                      <button
                        type="button"
                        className="v2-edition-btn v2-edition-btn-owned"
                        onClick={() =>
                          setOwnershipNotice({
                            message: "You already own this edition. All your editions are available in your account.",
                          })
                        }
                      >
                        <i className="fa-solid fa-circle-check" style={{ marginRight: 6 }} />
                        You already own this edition
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          className={`v2-edition-btn ${isFeatured ? "v2-edition-btn-primary" : "v2-edition-btn-outline"}`}
                          onClick={() => handlePurchase(opt)}
                          disabled={processingOption === (opt.access_type || `opt-${i}`)}
                        >
                          {processingOption === (opt.access_type || `opt-${i}`)
                            ? "Connecting to Payhip…"
                            : isUpgradeAvailable
                            ? "Upgrade to Digital Companion · $29.99"
                            : (opt.cta_text || `Get ${opt.name} · $${priceNum.toFixed(2)}`)}
                        </button>

                        <button
                          type="button"
                          className="v2-cart-secondary-btn"
                          onClick={() => handleAddToCart(opt)}
                        >
                          <i className="fa-solid fa-cart-shopping" />{" "}
                          {isUpgradeAvailable ? "Add Upgrade ($29.99)" : "Add to Cart"}
                        </button>
                      </>
                    )}
                  </article>
                );
              })}
            </div>

            {/* Coupon Code Redemption Bar */}
            {/* <div className="v2-coupon-box">
              <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--v2-navy)" }}>Have a promotional discount code?</span>
              <div className="v2-coupon-row">
                <input
                  type="text"
                  placeholder="PROMO CODE"
                  className="v2-coupon-input"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                />
                {couponCode ? (
                  <button type="button" className="v2-coupon-btn" onClick={handleRemoveCoupon} style={{ background: "#ef4444" }}>
                    Remove
                  </button>
                ) : (
                  <button
                    type="button"
                    className="v2-coupon-btn"
                    onClick={() => handleApplyCoupon(product.price)}
                    disabled={couponLoading}
                  >
                    {couponLoading ? "Applying…" : "Apply"}
                  </button>
                )}
              </div>
              {couponSuccess && <p style={{ margin: 0, fontSize: "13px", color: "var(--v2-green)", fontWeight: 600 }}>{couponSuccess}</p>}
              {couponError && <p style={{ margin: 0, fontSize: "13px", color: "#ef4444", fontWeight: 600 }}>{couponError}</p>}
            </div> */}

            {product.editions_footnote && (
              <p className="v2-editions-footnote">
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4A5163" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="11" width="14" height="10" rx="2" />
                  <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                </svg>
                {product.editions_footnote}
              </p>
            )}
          </div>
        </section>
      )}

      {/* ── 8. ABOUT THE BOOK + AUTHOR (#author) ───────────── */}
      {(product.author || product.author_bio.length > 0 || product.meta_stats || product.about_book_summary) && (
        <section id="author" className="v2-author-section">
          <div className="v2-container">
            <div className="v2-author-grid">
              {/* Left: About the book */}
              {(product.meta_stats || product.about_book_summary) && (
                <div className="v2-book-meta-col">
                  <p className="v2-eyebrow">{product.about_book_eyebrow || "ABOUT THE BOOK"}</p>
                  <h2 className="v2-book-meta-title">{product.about_book_title || product.title}</h2>

                  {product.meta_stats && (
                    <div className="v2-stats-grid">
                      {product.meta_stats.year && (
                        <div className="v2-stat-tile">
                          <p className="v2-stat-number">{product.meta_stats.year}</p>
                          <p className="v2-stat-label">Digital edition</p>
                        </div>
                      )}
                      {product.meta_stats.pages && (
                        <div className="v2-stat-tile">
                          <p className="v2-stat-number">{product.meta_stats.pages}</p>
                          <p className="v2-stat-label">Pages</p>
                        </div>
                      )}
                      {product.meta_stats.chapters && (
                        <div className="v2-stat-tile">
                          <p className="v2-stat-number">{product.meta_stats.chapters}</p>
                          <p className="v2-stat-label">Chapters</p>
                        </div>
                      )}
                      {product.meta_stats.toolkit && (
                        <div className="v2-stat-tile">
                          <p className="v2-stat-label" style={{ fontWeight: 700, color: "var(--v2-navy)", fontSize: "16px", lineHeight: 1.3 }}>
                            {product.meta_stats.toolkit}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {product.about_book_summary && (
                    <p className="v2-book-meta-desc" style={{ marginTop: 16, fontSize: "17px", lineHeight: 1.6, color: "var(--v2-text-secondary)" }}>
                      {product.about_book_summary}
                    </p>
                  )}
                </div>
              )}

              {/* Right: About the author */}
              {(product.author || product.author_bio.length > 0 || product.author_photo) && (
                <div className="v2-author-profile-col">
                  {product.author_photo && (
                    <img
                      src={product.author_photo}
                      alt={product.author}
                      className="v2-author-photo"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                  <div className="v2-author-bio">
                    <p className="v2-eyebrow">{product.about_author_eyebrow || "ABOUT THE AUTHOR"}</p>
                    <h2 className="v2-author-name">{product.author}</h2>
                    {product.author_bio.map((bioP, idx) => (
                      <p key={idx} className="v2-author-text">{bioP}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── 9. FINAL CALL TO ACTION ───────────────────────── */}
      {(product.cta_heading || product.cta_paragraphs.length > 0 || product.cta_motto) && (
        <section className="v2-final-cta-section">
          <div className="v2-final-cta-inner">
            {product.cta_heading && (
              <h2 className="v2-final-cta-heading">{product.cta_heading}</h2>
            )}
            {product.cta_paragraphs.map((p, idx) => (
              <p key={idx} className="v2-final-cta-text">{p}</p>
            ))}
            {product.cta_motto && (
              <p className="v2-final-cta-motto">
                {product.cta_motto}
              </p>
            )}
          {hasOptions && (
            <div className="v2-final-cta-buttons">
              {product.access_options.map((opt, idx) => (
                <a
                  key={idx}
                  href="#editions"
                  className={idx === 0 ? "v2-final-btn-white" : "v2-final-btn-navy"}
                >
                  Explore the {opt.name}
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
      )}

      {/* ── QUICK CHECKOUT MODAL ───────────────────────────── */}
      {showQuickForm && (
        <div className="v2-checkout-modal-backdrop" onClick={() => setShowQuickForm(false)}>
          <div className="v2-checkout-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="v2-modal-close-btn"
              onClick={() => setShowQuickForm(false)}
            >
              ×
            </button>
            <h3 className="v2-modal-title">Complete Your Order</h3>
            <p className="v2-modal-desc">
              Please enter your details to proceed to secure checkout.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!formData.email.trim()) return;
                setShowQuickForm(false);
                handlePurchase(selectedOption);
              }}
              style={{ display: "flex", flexDirection: "column", gap: 14 }}
            >
              <div>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--v2-navy)", display: "block", marginBottom: 4 }}>Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  className="v2-modal-input"
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                />
              </div>
              <div>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--v2-navy)", display: "block", marginBottom: 4 }}>Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="v2-modal-input"
                  value={formData.email}
                  onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                />
              </div>

              {checkoutError && (
                <p style={{ color: "#ef4444", fontSize: "14px", margin: 0 }}>{checkoutError}</p>
              )}

              <button
                type="submit"
                className="v2-btn-primary"
                style={{ width: "100%", marginTop: 4 }}
              >
                Continue to Secure PayPal Checkout
              </button>

              <div style={{ textAlign: "center", marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => {
                    sessionStorage.setItem("pendingPurchase", JSON.stringify({ slug: slug || id, option: selectedOption }));
                    navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#c80808",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  Already have an account? Sign in with Google / Email →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ownership Notice Modal */}
      {ownershipNotice && (
        <div className="v2-checkout-modal-backdrop" onClick={() => setOwnershipNotice(null)}>
          <div className="v2-checkout-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 440, textAlign: "center" }}>
            <div style={{ width: 50, height: 50, borderRadius: "50%", background: "#ecfdf5", color: "#059669", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 24 }}>
              <i className="fa-solid fa-circle-check" />
            </div>
            <h3 className="v2-modal-title" style={{ marginBottom: 8 }}>You already own this edition</h3>
            <p className="v2-modal-desc" style={{ marginBottom: 22 }}>
              {ownershipNotice.message}
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <Link
                to="/my-orders"
                className="v2-btn-primary"
                style={{ textDecoration: "none", padding: "10px 22px" }}
                onClick={() => setOwnershipNotice(null)}
              >
                <i className="fa-solid fa-book" style={{ marginRight: 6 }} /> Go to My Books
              </Link>
              <button
                type="button"
                className="v2-coupon-btn"
                style={{ background: "#f3f4f6", color: "#374151" }}
                onClick={() => setOwnershipNotice(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating toast */}
      {toastMessage && (
        <div className="v2-floating-toast">
          <i className="fa-solid fa-circle-check" style={{ color: "#10b981" }} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
