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
    description: "The definitive strategic playbook for modern digital marketing and high-performance brand leadership.",
    image: "/assets/images/img/30.webp",
    link: "/buy-book/cff3798b-88bb-41af-8e2a-bc5f7a2a4239"
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
    description: "A step-by-step diagnostic and execution workbook to align your organization around purpose, positioning, and profit.",
    image: "/assets/images/img/31.webp",
    link: "/buy-book/prod_002_sid_philosophy"
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
    description: "Comprehensive analytical report covering emerging industry dynamics, market intelligence, and executive growth paradigms.",
    image: "/assets/images/img/32.webp",
    link: "/buy-book/prod_003_research_report"
  }
];

const slideDirections = [
  { x: -300, y: 0 },   // Left
  { x: 0, y: -300 },   // Top
  { x: 300, y: 0 },    // Right
  { x: -300, y: 300 }, // Bottom-left
  { x: 300, y: 300 },  // Bottom-right
];

function BookCard({ book, index, direction }) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const checkoutLink = book.link || `/buy-book/${book.id}`;
  const displayPrice = book.price || `${book.currency || "AED"} ${Number(book.priceNum || 49).toFixed(2)}`;

  return (
    <motion.div
      initial={{ opacity: 0, x: direction?.x || 0, y: direction?.y || 0 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.2, type: "spring", stiffness: 100, damping: 15 }}
      style={{ position: 'relative', cursor: 'pointer' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(checkoutLink)}
    >
      <div className="bg-accent-color-2" style={{ position: 'relative', overflow: 'hidden', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)', aspectRatio: '1/1' }}>
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
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)'
        }} />
        
        {/* Format Badge Top Left */}
        <div style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          background: 'rgba(200, 8, 8, 0.85)',
          backdropFilter: 'blur(8px)',
          color: '#ffffff',
          fontSize: '11px',
          fontWeight: '700',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          padding: '4px 10px',
          borderRadius: '20px',
          boxShadow: '0 4px 12px rgba(200, 8, 8, 0.4)'
        }}>
          {book.format || "Digital PDF"}
        </div>

        {/* Hover / Card Details Card */}
        <div style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          right: '16px',
          backdropFilter: 'blur(12px)',
          // backgroundColor: 'rgba(24, 24, 27, 0.88)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
        }}>
          <div  style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '6px' }}>
            <h3 className="no-dark" style={{
              color: '#a59e9eff',
              fontWeight: '700',
              fontSize: '16px',
              lineHeight: '1.25',
              letterSpacing: '-0.02em',
              margin: 0
            }}>
              {book.title}
            </h3>
            <span className="no-dark" style={{
              backgroundColor: 'rgba(185, 16, 16, 0.48)',
              border: '1px solid rgba(185, 16, 16, 0.3)',
              color: '#f7f6f6ff',
              fontWeight: '700',
              fontSize: '13px',
              whiteSpace: 'nowrap',
              padding: '2px 8px',
              borderRadius: '6px'
            }}>
              {displayPrice}
            </span>
          </div>
          
          <p style={{
            color: '#cfcfcfff',
            fontSize: '12px',
            lineHeight: '1.4',
            marginBottom: '12px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}>
            {book.description}
          </p>
          
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(checkoutLink);
              }}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #c80808 0%, #990000 100%)',
                color: 'white',
                fontWeight: '700',
                padding: '9px 16px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 10px 15px -3px rgba(200, 8, 8, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                gap: '8px'
              }}
            >
              <i className="fa-solid fa-bag-shopping" />
              Buy Now
            </button>
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
            link: `/buy-book/${p.id}`,
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
              Digital Publications & Frameworks
            </span>
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: 12 }}>
            Executive Learning & Digital Products
          </h2>
          <p style={{ color: '#a1a1aa', fontSize: '1.05rem', maxWidth: '640px', margin: '0 auto' }}>
            Instant digital access to proprietary business frameworks, diagnostics, and strategic leadership publications by Qutub Siddiqui.
          </p>
          <div style={{ width: '60px', height: '3px', background: '#c80808', margin: '20px auto 0', borderRadius: '4px' }} />
        </motion.div>

        {/* Books Grid */}
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px'
          }}>
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

        {/* Security & Guarantee Assurance Bar */}
        {/* <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{
            maxWidth: 800,
            margin: '64px auto 0',
            background: 'rgba(24, 24, 27, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 16,
            padding: '20px 32px',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 20
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <i className="fa-solid fa-lock" style={{ color: '#10b981', fontSize: 18 }} />
            <span style={{ color: '#d4d4d8', fontSize: '0.85rem', fontWeight: 600 }}>256-bit Encrypted Checkout</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <i className="fa-solid fa-bolt" style={{ color: '#f59e0b', fontSize: 18 }} />
            <span style={{ color: '#d4d4d8', fontSize: '0.85rem', fontWeight: 600 }}>Instant PDF Delivery</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <i className="fa-brands fa-stripe" style={{ color: '#635bff', fontSize: 24 }} />
            <span style={{ color: '#d4d4d8', fontSize: '0.85rem', fontWeight: 600 }}>Stripe Verified</span>
          </div>
        </motion.div> */}
      </div>
    </div>
  );
}