import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../supabaseClient";
import { api } from "../../api";
import { INDIVIDUAL_FRAMEWORKS } from "../../Data/FrameworksData";
import "./BuyBookCheckout.css";

/* ============================================================
   STATIC DEFAULTS — used only when API data is unavailable
   ============================================================ */
const STATIC = {
  title: "Marketing Reclassified: A Principle-First Approach",
  subtitle: "Rethinking Marketing Through Purpose, Value, Relevance and Sustainable Growth",
  author: "M. Q. Siddiqui",
  coverFallback: "/assets/images/img/book1.webp",
  downloadProductId: "cff3798b-88bb-41af-8e2a-bc5f7a2a4239",
  onlineProductId: "prod_online_reading_001",
};

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
    if (trimmed.includes(" ") && !trimmed.includes(". ")) {
      return trimmed.split(/\s+/).map((s) => s.trim()).filter(Boolean);
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
   FAQ Accordion Item
   ============================================================ */
function FaqItem({ item, index }) {
  const [open, setOpen] = useState(false);
  const q = item.question || item.q || "";
  const a = item.answer || item.a || "";
  return (
    <div className={`pub-faq-item ${open ? "is-open" : ""}`}>
      <button
        className="pub-faq-trigger"
        onClick={() => setOpen((p) => !p)}
        aria-expanded={open}
        id={`faq-btn-${index}`}
        aria-controls={`faq-body-${index}`}
      >
        <span className="pub-faq-q">{q}</span>
        <span className="pub-faq-icon">{open ? "−" : "+"}</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`faq-body-${index}`}
            role="region"
            aria-labelledby={`faq-btn-${index}`}
            className="pub-faq-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <p className="pub-faq-a">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============================================================
   Pricing Card
   ============================================================ */
function PricingCard({ label, badge, price, currency, description, features, ctaText, highlight, onPurchase, processing, disabled }) {
  return (
    <div className={`pub-price-card ${highlight ? "is-featured" : ""}`}>
      {highlight && <div className="pub-price-badge">{badge || "Most Complete"}</div>}
      <div className="pub-price-label">{label}</div>
      <div className="pub-price-amount">
        <span className="pub-price-currency">{currency}</span>
        <span className="pub-price-number">{price}</span>
      </div>
      {description && <p className="pub-price-desc">{description}</p>}
      {features && features.length > 0 && (
        <ul className="pub-price-features">
          {features.map((f, i) => (
            <li key={i}><i className="fa-solid fa-check" />{f}</li>
          ))}
        </ul>
      )}
      <button
        className={`pub-price-cta ${highlight ? "is-primary" : "is-secondary"}`}
        onClick={onPurchase}
        disabled={processing || disabled}
        id={`pricing-btn-${String(label).replace(/\s+/g, "-").toLowerCase()}`}
      >
        {processing ? (
          <><span className="spinner" /> Connecting to Stripe...</>
        ) : (
          <><i className="fa-solid fa-lock" /> {ctaText}</>
        )}
      </button>
    </div>
  );
}

/* ============================================================
   Main Component
   ============================================================ */
export default function BuyBookCheckout() {
  const { slug, id } = useParams();

  const [user, setUser] = useState(null);
  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [processingOption, setProcessingOption] = useState(null);
  const [checkoutError, setCheckoutError] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [showQuickForm, setShowQuickForm] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  /* ─── Load product from API ─────────────────────────────── */
  useEffect(() => {
    let isMounted = true;
    async function loadProduct() {
      try {
        let res = null;

        // 1. Try slug first (primary routing)
        if (slug) {
          res = await api.getProductBySlug(slug);
        }

        // 2. Fallback to id-based lookup
        if (!res && id) {
          res = await api.getProductById(id);
        }

        if (res && (res.product || (Array.isArray(res.products) && res.products.length > 0))) {
          const p = res.product || res.products[0];
          if (p && isMounted) {
            setProduct(normalizeProduct(p));
            setLoadingProduct(false);
            return;
          }
        }
      } catch (err) {
        console.warn("API unavailable, using fallback:", err.message);
      }

      // Static fallback
      if (isMounted) {
        setProduct(normalizeProduct(null));
        setLoadingProduct(false);
      }
    }
    loadProduct();
    return () => { isMounted = false; };
  }, [slug, id]);

  function normalizeProduct(p) {
    if (!p) {
      return {
        id: STATIC.downloadProductId,
        title: STATIC.title,
        subtitle: STATIC.subtitle,
        author: STATIC.author,
        description: "Marketing Reclassified: A Principle-First Approach challenges the narrow view of marketing as promotion, advertising, selling, or short-term campaign activity.",
        description2: "The book presents marketing as a broader strategic discipline.",
        cover_image: STATIC.coverFallback,
        price: 49.99,
        currency: "USD",
        format: "PDF",
        download_limit: 3,
        publication_status: "available",
        why_this_book_matters: null,
        who_its_for: [],
        what_readers_will_learn: [],
        author_note: null,
        faq: [],
        related_learning: [],
        related_frameworks: [],
        related_blogs: [],
        access_options: [],
      };
    }
    return {
      id: String(p.id),
      title: p.title || STATIC.title,
      subtitle: p.subtitle || null,
      author: p.author || STATIC.author,
      description: p.description || "",
      description2: p.description2 || "",
      cover_image: p.cover_image || p.image || STATIC.coverFallback,
      price: Number(p.price) || 49.99,
      currency: p.currency || "USD",
      format: p.format || "PDF",
      download_limit: p.download_limit || 3,
      slug: p.slug || null,
      publication_status: p.publication_status || "available",
      why_this_book_matters: p.why_this_book_matters || null,
      who_its_for: safeArr(p.who_its_for),
      what_readers_will_learn: safeArr(p.what_readers_will_learn),
      author_note: p.author_note || null,
      faq: safeArr(p.faq),
      related_learning: safeArr(p.related_learning),
      related_frameworks: safeArr(p.related_frameworks),
      related_blogs: safeArr(p.related_blogs),
      access_options: safeArr(p.access_options),
    };
  }

  /* ─── Auth state ─────────────────────────────────────────── */
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
    } finally {
      setAuthLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ─── Initiate Stripe Checkout ───────────────────────────── */
  const handlePurchase = async (option) => {
    // option: 'online' | 'download' | object (access_option)
    setCheckoutError("");

    if (!formData.email.trim()) {
      setSelectedOption(option);
      setShowQuickForm(true);
      setTimeout(() => {
        document.getElementById("pub-quick-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
      return;
    }

    const optionKey = typeof option === "string" ? option : option?.access_type || "download";
    setProcessingOption(optionKey);
    try {
      let productId, bookName, amount, currency;

      if (typeof option === "object" && option !== null) {
        // Dynamic access option from admin
        productId = option.product_id || product?.id || STATIC.downloadProductId;
        bookName = `${product?.title || STATIC.title} — ${option.name}`;
        amount = Number(option.price) || product?.price || 49.99;
        currency = option.currency || product?.currency || "USD";
      } else if (option === "online") {
        productId = STATIC.onlineProductId;
        bookName = `${product?.title || STATIC.title} — Online Access`;
        amount = 20;
        currency = "USD";
      } else {
        productId = product?.id || STATIC.downloadProductId;
        bookName = product?.title || STATIC.title;
        amount = product?.price || 49.99;
        currency = product?.currency || "USD";
      }

      const result = await api.createCheckout({
        productId,
        bookName,
        customerName: formData.name.trim() || "Valued Customer",
        customerEmail: formData.email.trim(),
        userId: user?.id || null,
        accessType: optionKey,
        amount,
        currency,
      });

      if (result && result.url) {
        window.location.href = result.url;
      } else {
        setCheckoutError(result?.error || "Failed to create checkout session. Please contact support.");
        setProcessingOption(null);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setCheckoutError(err.message || "Unable to reach checkout. Please try again.");
      setProcessingOption(null);
    }
  };

  const handleQuickFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.email.trim()) return;
    setShowQuickForm(false);
    handlePurchase(selectedOption);
  };

  /* ─── Loading State ──────────────────────────────────────── */
  if (loadingProduct) {
    return (
      <div className="pub-loading">
        <div className="pub-loading-spinner" />
        <p>Loading publication details…</p>
      </div>
    );
  }

  const formattedPrice = `${product.currency || "USD"} ${Number(product.price || 49.99).toFixed(2)}`;
  const isComingSoon = product.publication_status === "coming_soon";

  // Build access options for pricing section
  // Use dynamic access_options if present, else fall back to the two-option static layout
  const dynamicOptions = (Array.isArray(product.access_options) ? product.access_options : []).filter(o => o && o.status !== "inactive");
  const hasDynamicOptions = dynamicOptions.length > 0;

  function resolveFramework(slugOrName) {
    if (!INDIVIDUAL_FRAMEWORKS || !INDIVIDUAL_FRAMEWORKS.length) return null;
    return INDIVIDUAL_FRAMEWORKS.find(f =>
      f.slug === slugOrName || f.id === slugOrName || f.title?.toLowerCase() === String(slugOrName).toLowerCase()
    );
  }

  /* ============================================================
     RENDER
     ============================================================ */
  return (
    <div className="pub-page">

      {/* ══ 1. HERO ══ */}
      <section className="pub-hero">
        <div className="pub-hero-inner">
          {/* Breadcrumb */}
          <nav className="pub-breadcrumb" aria-label="Breadcrumb">
            <Link to="/" className="pub-breadcrumb-link">Home</Link>
            <span className="pub-breadcrumb-sep">/</span>
            <Link to="/publications" className="pub-breadcrumb-link">Publications</Link>
            <span className="pub-breadcrumb-sep">/</span>
            <span className="pub-breadcrumb-current">{product.title}</span>
          </nav>

          <div className="pub-hero-grid">
            {/* Cover */}
            <motion.div
              className="pub-hero-cover-wrap"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <img src={product.cover_image} alt={product.title} className="pub-hero-cover" />
              <div className="pub-hero-cover-glow" />
            </motion.div>

            {/* Info */}
            <motion.div
              className="pub-hero-info"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            >
              <span className="pub-hero-eyebrow">
                <i className="fa-solid fa-book-open" /> Digital Publication
              </span>

              {isComingSoon && (
                <span style={{ display: 'inline-block', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', color: '#f59e0b', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', padding: '4px 12px', borderRadius: 20, marginBottom: 8 }}>
                  Coming Soon
                </span>
              )}

              <h1 className="pub-hero-title">{product.title}</h1>
              {hasContent(product.subtitle) && <p className="pub-hero-subtitle">{product.subtitle}</p>}
              <p className="pub-hero-author">By <strong>{product.author}</strong></p>
              {hasContent(product.description) && <p className="pub-hero-desc">{product.description}</p>}
              {hasContent(product.description2) && <p className="pub-hero-desc-2">{product.description2}</p>}

              {/* CTAs — shown only when Available and pricing data exists */}
              {!isComingSoon && (
                <div className="pub-hero-cta-row">
                  {hasDynamicOptions ? (
                    dynamicOptions.slice(0, 2).map((opt, i) => (
                      <button
                        key={i}
                        className={i === 0 ? "pub-hero-btn-primary" : "pub-hero-btn-secondary"}
                        onClick={() => handlePurchase(opt)}
                        disabled={!!processingOption}
                        id={`hero-opt-btn-${i}`}
                      >
                        {processingOption === (opt.access_type || `opt-${i}`) ? (
                          <><span className="spinner" /> Connecting…</>
                        ) : (
                          <><i className={`fa-solid ${opt.access_type === 'download' ? 'fa-download' : 'fa-globe'}`} /> {opt.cta_text || opt.name}</>
                        )}
                      </button>
                    ))
                  ) : (
                    <>
                      <button className="pub-hero-btn-primary" id="hero-download-btn" onClick={() => handlePurchase("download")} disabled={processingOption === "download"}>
                        {processingOption === "download" ? <><span className="spinner" /> Connecting…</> : <><i className="fa-solid fa-download" /> Download Edition — {formattedPrice}</>}
                      </button>
                      <button className="pub-hero-btn-secondary" id="hero-online-btn" onClick={() => handlePurchase("online")} disabled={processingOption === "online"}>
                        {processingOption === "online" ? <><span className="spinner" /> Connecting…</> : <><i className="fa-solid fa-globe" /> Online Access — USD 20</>}
                      </button>
                    </>
                  )}
                </div>
              )}

              {isComingSoon && (
                <div className="pub-hero-cta-row">
                  <span className="pub-hero-btn-secondary" style={{ cursor: 'default', opacity: 0.7 }}>
                    <i className="fa-solid fa-clock" /> Coming Soon
                  </span>
                </div>
              )}

              <div className="pub-hero-trust">
                <span><i className="fa-solid fa-lock" /> Secure Checkout</span>
                <span><i className="fa-solid fa-bolt" /> Instant Delivery</span>
                <span><i className="fa-solid fa-shield-halved" /> Protected Format</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Email Form */}
      <AnimatePresence>
        {showQuickForm && (
          <motion.section
            id="pub-quick-form"
            className="pub-quick-form-section"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="pub-container">
              <div className="pub-quick-form-card">
                <h3>Enter your details to continue</h3>
                <p>Your secure download / access link will be sent to your email.</p>
                <form onSubmit={handleQuickFormSubmit} className="pub-quick-form">
                  <div className="pub-form-row">
                    <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleInputChange} className="pub-form-input" id="quick-form-name" />
                    <input type="email" name="email" placeholder="Email Address *" value={formData.email} onChange={handleInputChange} className="pub-form-input" required id="quick-form-email" />
                  </div>
                  {!user && (
                    <div className="pub-quick-form-auth">
                      <button type="button" className="pub-google-btn" onClick={handleGoogleSignIn} disabled={authLoading} id="quick-form-google-btn">
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: 16, height: 16 }} />
                        Autofill with Google
                      </button>
                      <span className="pub-quick-form-or">or enter manually above</span>
                    </div>
                  )}
                  {checkoutError && <div className="pub-error-msg"><i className="fa-solid fa-circle-exclamation" /> {checkoutError}</div>}
                  <div className="pub-quick-form-actions">
                    <button type="submit" className="pub-price-cta is-primary" id="quick-form-submit"><i className="fa-solid fa-arrow-right" /> Continue to Secure Checkout</button>
                    <button type="button" className="pub-quick-form-cancel" onClick={() => setShowQuickForm(false)}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ══ 2. WHY THIS BOOK MATTERS ══ */}
      {hasContent(product.why_this_book_matters) && (
        <section className="pub-section pub-why-section">
          <div className="pub-container">
            <div className="pub-section-header">
              <span className="pub-section-eyebrow"><i className="fa-solid fa-lightbulb" /> Strategic Perspective</span>
              <h2 className="pub-section-title">Why This Book Matters</h2>
            </div>
            <div className="pub-why-editorial">
              <motion.div
                className="pub-why-prose"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                {product.why_this_book_matters.split("\n").filter(l => l.trim()).map((para, i) => (
                  <p key={i} className={i === 0 ? "pub-why-intro-p" : "pub-why-body-p"}>{para.trim()}</p>
                ))}
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* ══ 3. WHO IT IS FOR ══ */}
      {hasContent(product.who_its_for) && (
        <section className="pub-section pub-audience-section">
          <div className="pub-container">
            <div className="pub-section-header">
              <span className="pub-section-eyebrow"><i className="fa-solid fa-users" /> Readership</span>
              <h2 className="pub-section-title">Who It Is For</h2>
            </div>
            <div className="pub-audience-grid">
              {product.who_its_for.map((item, i) => {
                const label = typeof item === "string" ? item : item.label || String(item);
                const icon = typeof item === "object" ? item.icon || "fa-user" : "fa-user";
                return (
                  <motion.div
                    key={i}
                    className="pub-audience-card"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.35, delay: i * 0.06 }}
                  >
                    <i className={`fa-solid ${icon} pub-audience-icon`} />
                    <span className="pub-audience-label">{label}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ══ 4. WHAT READERS WILL LEARN ══ */}
      {hasContent(product.what_readers_will_learn) && (
        <section className="pub-section pub-learn-section">
          <div className="pub-container">
            <div className="pub-section-header">
              <span className="pub-section-eyebrow"><i className="fa-solid fa-book-open-reader" /> Inside the Publication</span>
              <h2 className="pub-section-title">What Readers Will Learn</h2>
            </div>
            <div className="pub-learn-grid">
              {product.what_readers_will_learn.map((item, i) => {
                let num = String(i + 1).padStart(2, "0");
                let title, desc;
                if (typeof item === "string") { title = item; desc = ""; }
                else { title = item.title || item.num || String(i + 1); desc = item.desc || item.description || ""; num = item.num || num; }
                return (
                  <motion.div
                    key={i}
                    className="pub-learn-card"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                  >
                    <span className="pub-learn-num">{num}</span>
                    <div>
                      <h4 className="pub-learn-title">{title}</h4>
                      {desc && <p className="pub-learn-desc">{desc}</p>}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ══ 5. PRICING / ACCESS OPTIONS ══ */}
      {!isComingSoon && (
        <section className="pub-section pub-pricing-section" id="pub-pricing">
          <div className="pub-container">
            <div className="pub-section-header">
              <span className="pub-section-eyebrow"><i className="fa-solid fa-tag" /> Access Options</span>
              <h2 className="pub-section-title">Choose Your Access</h2>
              <p className="pub-section-desc">All options are secured through Stripe.</p>
            </div>

            {checkoutError && !showQuickForm && (
              <div className="pub-error-msg" style={{ maxWidth: 600, margin: "0 auto 2rem" }}>
                <i className="fa-solid fa-circle-exclamation" /> {checkoutError}
              </div>
            )}

            <div className="pub-pricing-grid">
              {hasDynamicOptions ? (
                dynamicOptions.map((opt, i) => (
                  <PricingCard
                    key={i}
                    label={opt.name}
                    price={Number(opt.price).toFixed(2)}
                    currency={opt.currency || "USD"}
                    description={opt.description}
                    features={[]}
                    ctaText={opt.cta_text || `Get ${opt.name}`}
                    highlight={i === dynamicOptions.length - 1}
                    onPurchase={() => handlePurchase(opt)}
                    processing={processingOption === (opt.access_type || `opt-${i}`)}
                    disabled={!!processingOption && processingOption !== (opt.access_type || `opt-${i}`)}
                  />
                ))
              ) : (
                <>
                  <PricingCard
                    label="Online Reading Access"
                    price="20"
                    currency="USD"
                    description="Read the book online through protected website access. Ideal for focused reading sessions."
                    features={["Protected online reading", "Full publication access", "Works on all devices", "Not downloadable"]}
                    ctaText="Get Online Access — USD 20"
                    highlight={false}
                    onPurchase={() => handlePurchase("online")}
                    processing={processingOption === "online"}
                    disabled={!!processingOption && processingOption !== "online"}
                  />
                  <PricingCard
                    label="Downloadable Professional Edition"
                    price={Number(product.price || 49.99).toFixed(2)}
                    currency={product.currency || "USD"}
                    description="Get the complete downloadable digital edition for personal study, professional reference and long-term use."
                    features={["Complete downloadable edition", "PDF format", "Works offline", "Professional reference copy", `Up to ${product.download_limit || 3} secure downloads`]}
                    ctaText={`Download Professional Edition — ${formattedPrice}`}
                    highlight={true}
                    onPurchase={() => handlePurchase("download")}
                    processing={processingOption === "download"}
                    disabled={!!processingOption && processingOption !== "download"}
                  />
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ══ 6. AUTHOR NOTE ══ */}
      {hasContent(product.author_note) && (
        <section className="pub-section pub-author-section">
          <div className="pub-container">
            <div className="pub-author-card">
              <div className="pub-author-accent" />
              <div className="pub-author-body">
                <span className="pub-author-eyebrow">Author Note</span>
                <h3 className="pub-author-name">{product.author || "M. Q. Siddiqui"}</h3>
                {product.author_note.split("\n").filter(l => l.trim()).map((para, i) => (
                  <p key={i} className="pub-author-note">{para.trim()}</p>
                ))}
                <div className="pub-author-sig">{product.author || "M. Q. Siddiqui"}</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══ 7. FAQ ══ */}
      {hasContent(product.faq) && (
        <section className="pub-section pub-faq-section">
          <div className="pub-container">
            <div className="pub-section-header">
              <span className="pub-section-eyebrow"><i className="fa-solid fa-circle-question" /> Common Questions</span>
              <h2 className="pub-section-title">Frequently Asked Questions</h2>
            </div>
            <div className="pub-faq-list">
              {product.faq.map((item, i) => (
                <FaqItem key={i} item={item} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ 8. RELATED LEARNING ══ */}
      {hasContent(product.related_learning) && (
        <section className="pub-section pub-related-section pub-learning-section">
          <div className="pub-container">
            <div className="pub-related-header">
              <div>
                <span className="pub-section-eyebrow"><i className="fa-solid fa-graduation-cap" /> Continue Learning</span>
                <h2 className="pub-section-title" style={{ marginBottom: "0.5rem" }}>Related Learning</h2>
                <p className="pub-section-desc">Courses and modules connected to the frameworks in this publication.</p>
              </div>
              <Link to="/courses" className="pub-related-cta-link">Explore All Courses <i className="fa-solid fa-arrow-right" /></Link>
            </div>
            <div className="pub-learning-grid">
              {product.related_learning.map((item, i) => {
                const label = typeof item === "string" ? item : item.label || item.title || String(item);
                const to = typeof item === "object" ? (item.url || item.to || "/courses") : "/courses";
                return (
                  <Link to={to} key={i} className="pub-learning-pill">
                    <i className="fa-solid fa-book-open" />{label}<i className="fa-solid fa-arrow-right pub-learning-arrow" />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ══ 9. RELATED FRAMEWORKS ══ */}
      {hasContent(product.related_frameworks) && (
        <section className="pub-section pub-related-section pub-frameworks-section">
          <div className="pub-container">
            <div className="pub-related-header">
              <div>
                <span className="pub-section-eyebrow"><i className="fa-solid fa-diagram-project" /> Strategic Frameworks</span>
                <h2 className="pub-section-title" style={{ marginBottom: "0.5rem" }}>Related Frameworks</h2>
                <p className="pub-section-desc">The signature frameworks connected to this publication.</p>
              </div>
              <Link to="/frameworks" className="pub-related-cta-link">Explore Frameworks <i className="fa-solid fa-arrow-right" /></Link>
            </div>
            <div className="pub-frameworks-grid">
              {product.related_frameworks.map((item, i) => {
                // item can be a slug string or an object {code, name, desc, slug}
                let fw = null;
                let code, name, desc, to;
                if (typeof item === "string") {
                  fw = resolveFramework(item);
                  code = fw?.code || "";
                  name = fw?.title || item;
                  desc = fw?.shortDefinition || "";
                  to = fw ? `/frameworks/${fw.slug}` : "/frameworks";
                } else {
                  code = item.code || "";
                  name = item.name || item.title || "";
                  desc = item.desc || item.description || "";
                  to = item.to || item.url || (item.slug ? `/frameworks/${item.slug}` : "/frameworks");
                }
                return (
                  <motion.div
                    key={i}
                    className="pub-fw-card"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                  >
                    {code && <span className="pub-fw-code">{code}</span>}
                    <h4 className="pub-fw-name">{name}</h4>
                    {desc && <p className="pub-fw-desc">{desc}</p>}
                    <Link to={to} className="pub-fw-link">Explore Framework <i className="fa-solid fa-arrow-right" /></Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ══ 10. BLOG + ADVISORY CARDS ══ */}
      <section className="pub-section pub-duo-cards-section">
        <div className="pub-container">
          <div className="pub-duo-cards-grid">
            <motion.div className="pub-duo-card pub-duo-card--dark" initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, ease: "easeOut" }}>
              <div className="pub-duo-card__top"><div className="pub-duo-card__logo"><i className="fa-solid fa-pen-nib" /></div></div>
              <div className="pub-duo-card__meta"><span className="pub-duo-card__variant">Insights</span><span className="pub-duo-card__date">Updated regularly</span></div>
              <h3 className="pub-duo-card__title">Read the Blog</h3>
              <p>Continue exploring articles and reflections on marketing, value creation, relevance, digital transformation, business thinking, and education.</p>
              <div className="pub-duo-card__footer"><Link to="/blog-page" className="pub-duo-card__cta">Read Related Articles</Link></div>
            </motion.div>

            <motion.div className="pub-duo-card pub-duo-card--accent" initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, ease: "easeOut", delay: 0.12 }}>
              <div className="pub-duo-card__top"><div className="pub-duo-card__logo"><i className="fa-solid fa-handshake" /></div></div>
              <div className="pub-duo-card__meta"><span className="pub-duo-card__variant">Advisory</span><span className="pub-duo-card__date">By appointment</span></div>
              <h3 className="pub-duo-card__title">Discuss an Engagement</h3>
              <p>The ideas in this book may also support advisory conversations related to marketing strategy, brand positioning, digital marketing direction, campaign review, career direction, and institutional learning.</p>
              <div className="pub-duo-card__footer"><Link to="/consultation" className="pub-duo-card__cta pub-duo-card__cta--dark">Discuss an Engagement</Link></div>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}
