import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const books = [
  {
    id: 1,
    title: "The Silent Echo",
    price: "AED 24.99",
    description: "A gripping tale of mystery and redemption in modern Tokyo.",
    image: "./assets/images/img/30.webp",
    link:"/book1"
  },
  {
    id: 2,
    title: "Midnight Gardens",
    price: "AED 19.99",
    description: "Romance blooms under the stars in this enchanting novel.",
    image: "./assets/images/img/31.webp",
    link:"/book1"
  },
  {
    id: 3,
    title: "Beyond The Horizon",
    price: "AED 29.99",
    description: "An epic adventure across uncharted worlds and dimensions.",
    image: "./assets/images/img/32.webp",
    link:"/book1"
  },
  {
    id: 4,
    title: "The Last Algorithm",
    price: "AED 22.99",
    description: "When AI awakens, humanity faces its greatest challenge.",
    image: "./assets/images/img/33.webp",
    link:"/book1"
  },
  {
    id: 5,
    title: "Whispers of Time",
    price: "AED 27.99",
    description: "A historical saga spanning three generations of love.",
    image: "./assets/images/img/34.webp",
    link:"/book1"
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

  return (
    <motion.div
      initial={{ opacity: 0, x: direction.x, y: direction.y }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.45, type: "spring", stiffness: 100, damping: 15, ease: "easeIn" }}
      style={{ position: 'relative', cursor: 'pointer' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(book.link)} // 👈 Navigate when clicking anywhere on the card
    >
      <div className="bg-accent-color-2" style={{ position: 'relative', overflow: 'hidden', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', aspectRatio: '1/1' }}>
        {/* Book Image */}
        <motion.img
          src={book.image}
          alt={book.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
        {/* Gradient Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent, transparent)'
        }} />
        
        {/* Hover Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ 
            opacity: isHovered ? 1 : 0, 
            y: isHovered ? 0 : 30,
            scale: isHovered ? 1 : 0.9
          }}
          transition={{ 
            duration: 0.3, 
            type: "spring",
            stiffness: 300,
            damping: 20
          }}
          style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px' }}
        >
          <div style={{
            backdropFilter: 'blur(12px)',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
              <h3 className="no-dark" style={{
                color: '#ffffff !important',
                fontWeight: 'bold',
                fontSize: '18px',
                lineHeight: '1.25',
                letterSpacing: '-0.025em'
              }}>
                {book.title}
              </h3>
              <span className="no-dark" style={{
                backgroundColor:'#ffffff',
                color: '#f4f4f4',
                fontWeight: 'bold',
                fontSize: '18px',
                whiteSpace: 'nowrap',
                padding: '2px 12px',
                borderRadius: '20px'
              }}>
                {book.price}
              </span>
            </div>
            
            <p className="no-dark" style={{
              color: 'rgb(255, 227, 184) !important',
              fontSize: '14px',
              marginBottom: '12px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {book.description}
            </p>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation(); // 👈 Prevent card click from firing
                  navigate(book.link);  // 👈 Use book.link
                }}
                style={{
                  width: '100%',
                  background: 'linear-gradient(to right, #f50b0b, #f91616)',
                  color: 'white',
                  fontWeight: '600',
                  padding: '10px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 10px 15px -3px rgba(245, 11, 11, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px'
                }}
              >
                <i className="fa-solid fa-cart-shopping" style={{ marginRight: '8px' }}></i>
                Buy Book
              </button>
            </motion.div>
          </div>
        </motion.div>
        {/* Decorative Corner Accent */}
        <div className="bg-accent-color" style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', borderBottomLeftRadius: '9999px', opacity: isHovered ? 1 : 0, transition: 'opacity 0.5s' }} />
      </div>
    </motion.div>
  );
}

export default function Ebooks() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const firstRow = books.slice(0, 3);
  const secondRow = books.slice(3, 5);

  return (
    <>
    
    <div className="aspire-book-page" style={{ minHeight: '90vh', overflow: 'hidden', position: 'relative' }}>

      <div style={{ position: 'relative', zIndex: 10, padding: '64px 24px' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ textAlign: 'center', marginBottom: '64px' }}
        >
          {/* <h1 className="accent-color font-family-1" style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '16px', letterSpacing: '-0.025em' }}>
            Featured Books
          </h1> */}
          <p className="secondary-accent font-family-2 " style={{ fontSize: '1.125rem', maxWidth: '672px', margin: '0 auto' }}>
            Discover our handpicked collection of extraordinary reads
          </p>
          <div className="bg-accent-color" style={{ marginTop: '24px', width: '96px', height: '4px', margin: '24px auto 0', borderRadius: '9999px' }} />
        </motion.div>

        {/* Books Grid */}
        <div className="no-dark" style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {/* First Row - 3 Books */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '32px',
            marginBottom: '32px'
          }}>
            {firstRow.map((book, index) => (
              <BookCard 
                key={book.id} 
                book={book} 
                index={index}
                direction={slideDirections[index]}
              />
            ))}
          </div>

          {/* Second Row - 2 Books Centered */}
          <div className="no-dark" style={{ display: 'flex', justifyContent: 'center', gap: '32px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '32px',
              maxWidth: '768px',
              width: '100%'
            }}>
              {secondRow.map((book, index) => (
                <BookCard 
                  key={book.id} 
                  book={book} 
                  index={index + 3}
                  direction={slideDirections[index + 3]}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          style={{ textAlign: 'center', marginTop: '80px' }}
        >
          <p className="secondary-accent font-family-2" style={{ fontSize: '0.875rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
            {/* Explore More */}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#ef4444',
                  borderRadius: '9999px'
                }}
                animate={{ y: [0, -8, 0] }}
                transition={{ 
                  duration: 1, 
                  repeat: Infinity, 
                  delay: i * 0.15,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
    </>
  );
}