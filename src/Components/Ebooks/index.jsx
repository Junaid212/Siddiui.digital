import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { api } from "../../api";

const DEFAULT_CATALOG = [
  {
    id: "cff3798b-88bb-41af-8e2a-bc5f7a2a4239",
    sku: "EBOOK-001",
    title: "Marketing Reclassified",
    author: "Qutub Siddiqui",
    price: "AED 49.00",
    priceNum: 49.00,
    currency: "AED",
    format: "Digital Edition (PDF)",
    description: "From transaction to human progress.",
    image: "/assets/images/img/book1.webp",
    link: "/publications/marketing-reclassified",
    publication_status: "available",
  },
  {
    id: "prod_002_sid_philosophy",
    sku: "WORKBOOK-002",
    title: "The Value Drift Index",
    author: "Qutub Siddiqui",
    price: "AED 79.00",
    priceNum: 79.00,
    currency: "AED",
    format: "Interactive Workbook (PDF)",
    description: "Practical tool for measuring managing and preventing value drift",
    image: "/assets/images/img/book2.webp",
    link: "/buy-book/prod_002_sid_philosophy",
    publication_status: "available",
  },
  {
    id: "prod_003_research_report",
    sku: "REPORT-003",
    title: "The Adaptive Value Framework",
    author: "Qutub Siddiqui",
    price: "AED 99.00",
    priceNum: 99.00,
    currency: "AED",
    format: "Research Publication (PDF)",
    description: "A practical approach to creating sustainable value in a changing world.",
    image: "/assets/images/img/book3.webp",
    link: "/buy-book/prod_003_research_report",
    publication_status: "available",
  }
];

const slideDirections = [
  { x: -300, y: 0 },
  { x: 0, y: -300 },
  { x: 300, y: 0 },
  { x: -300, y: 300 },
  { x: 300, y: 300 },
];

// Resolve the correct link for a product — prefer slug-based /publications/:slug
function resolveProductLink(book) {
  if (book.link) return book.link;
  if (book.slug) return `/publications/${book.slug}`;
  return `/buy-book/${book.id}`;
}

function BookCard({ book, index, direction }) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const checkoutLink = resolveProductLink(book);
  const displayPrice = book.price || `${book.currency || "AED"} ${Number(book.priceNum || 49).toFixed(2)}`;
  const isComingSoon = book.publication_status === "coming_soon";

  return (
    <motion.div
      initial={{ opacity: 0, x: direction?.x || 0, y: direction?.y || 0 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.2, type: "spring", stiffness: 100, damping: 15 }}
      style={{ position: 'relative', cursor: 'pointer' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => !isComingSoon && navigate(checkoutLink)}
    >
      <div className="bg-accent-color-2" style={{ position: 'relative', overflow: 'hidden', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)', aspectRatio: '1/1' }}>
        {/* Coming Soon Badge */}
        {isComingSoon && (
          <div style={{
            position: 'absolute', top: '14px', right: '14px', zIndex: 10,
            background: 'rgba(245, 158, 11, 0.9)', backdropFilter: 'blur(8px)',
            color: '#000', fontSize: '10px', fontWeight: '800', letterSpacing: '0.06em',
            textTransform: 'uppercase', padding: '4px 10px', borderRadius: '20px',
          }}>
            Coming Soon
          </div>
        )}

        {/* Book Image */}
        <motion.img
          src={book.image || book.cover_image || "/assets/images/img/30.webp"}
          alt={book.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          animate={{ scale: isHovered ? 1.08 : 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
        {/* Gradient Overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)'
        }} />

        {/* Hover / Card Details Card */}
        <div style={{
          position: 'absolute', bottom: '16px', left: '16px', right: '16px',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '12px', padding: '16px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '6px' }}>
            <h3 className="no-dark" style={{
              color: '#a59e9eff', fontWeight: '700', fontSize: '16px',
              lineHeight: '1.25', letterSpacing: '-0.02em', margin: 0
            }}>
              {book.title}
            </h3>
          </div>

          <p style={{
            color: '#cfcfcfff', fontSize: '12px', lineHeight: '1.4',
            marginBottom: '12px', overflow: 'hidden', textOverflow: 'ellipsis',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          }}>
            {book.description}
          </p>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            {isComingSoon ? (
              <div style={{
                width: '100%', background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b',
                fontWeight: '700', padding: '9px 16px', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.3)',
                cursor: 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', gap: '8px'
              }}>
                <i className="fa-solid fa-clock" />
                Coming Soon
              </div>
            ) : (
              <button
                onClick={(e) => { e.stopPropagation(); navigate(checkoutLink); }}
                style={{
                  width: '100%', background: 'linear-gradient(135deg, #c80808 0%, #990000 100%)',
                  color: 'white', fontWeight: '700', padding: '9px 16px', borderRadius: '8px',
                  border: 'none', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(200, 8, 8, 0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', gap: '8px'
                }}
              >
                <i className="fa-solid fa-bag-shopping" />
                Buy Now
              </button>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Ebooks() {
  const [products, setProducts] = useState(DEFAULT_CATALOG);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchProducts() {
      try {
        const res = await api.getProducts();
        if (res && res.products && res.products.length > 0) {
          const formatted = res.products.map((p, idx) => ({
            id: String(p.id),
            sku: p.sku || `PROD-${String(idx + 1).padStart(3, '0')}`,
            title: p.title || "Digital Publication",
            author: p.author || "Qutub Siddiqui",
            price: `${p.currency || "AED"} ${Number(p.price || 49).toFixed(2)}`,
            priceNum: Number(p.price) || 49,
            currency: p.currency || "AED",
            format: p.format || "Digital Edition (PDF)",
            description: p.description || p.short_description || "High-performance digital publication.",
            image: p.cover_image || p.image || `/assets/images/img/${30 + (idx % 5)}.webp`,
            // Slug-based link (preferred) or fall back to ID-based
            link: p.slug ? `/publications/${p.slug}` : `/buy-book/${p.id}`,
            slug: p.slug || null,
            publication_status: p.publication_status || "available",
          }));
          if (isMounted) {
            setProducts(formatted);
          }
        }
      } catch (err) {
        console.warn("Using default catalog for books view:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchProducts();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="aspire-book-page" style={{ minHeight: '90vh', overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'relative', zIndex: 10, padding: '64px 24px' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: '56px' }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(200, 8, 8, 0.1)', border: '1px solid rgba(200, 8, 8, 0.25)', padding: '6px 16px', borderRadius: 20, marginBottom: 14 }}>
            <i className="fa-solid fa-book-open" style={{ color: '#ef4444', fontSize: 13 }} />
            <span style={{ color: '#ef4444', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Digital Publications &amp; Frameworks
            </span>
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: 12 }}>
            Strategic Books &amp; Digital Publications
          </h2>
          <p style={{ color: '#a1a1aa', fontSize: '1.05rem', maxWidth: '640px', margin: '0 auto' }}>
            Instant digital access to proprietary business frameworks, diagnostics, and strategic leadership publications by Qutub Siddiqui.
          </p>
          <div style={{ width: '60px', height: '3px', background: '#c80808', margin: '20px auto 0', borderRadius: '4px' }} />
        </motion.div>

        {/* Books Grid */}
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
            {products.map((book, index) => (
              <BookCard
                key={book.id}
                book={book}
                index={index}
                direction={slideDirections[index % slideDirections.length]}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
