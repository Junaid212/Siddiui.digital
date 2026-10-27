import React, { useState, useEffect } from 'react';
import EbookCards from '../EbookCards';
import { Link } from 'react-router-dom';
import { api } from '../../api';

const DEFAULT_CATALOG = [
  {
    id: 'cff3798b-88bb-41af-8e2a-bc5f7a2a4239',
    title: 'Marketing Reclassified',
    description: 'From transaction to human progress',
    price: 'AED 49.00',
    priceNum: 49.00,
    currency: 'AED',
    image: '/assets/images/img/book1.webp',
    link: '/publications/marketing-reclassified',
    slug: 'marketing-reclassified',
    publication_status: 'available',
  },
  {
    id: 'prod_002_sid_philosophy',
    title: 'The Value Drift Index',
    description: 'Practical tool for measuring managing and preventing value drift',
    price: 'AED 79.00',
    priceNum: 79.00,
    currency: 'AED',
    image: '/assets/images/img/book2.webp',
    link: '/publications/value-drift-index',
    slug: 'value-drift-index',
    publication_status: 'available',
  },
  {
    id: 'prod_003_research_report',
    title: 'The Adaptive Value Framework',
    description: 'A practical approach to creating sustainable value in a changing world',
    price: 'AED 99.00',
    priceNum: 99.00,
    currency: 'AED',
    image: '/assets/images/img/book3.webp',
    link: '/publications/adaptive-value-framework',
    slug: 'adaptive-value-framework',
    publication_status: 'available',
  },
];

const EbookCardPage = () => {
  const [books, setBooks] = useState(DEFAULT_CATALOG);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchBooks() {
      try {
        const res = await api.getProducts();
        if (res && res.products && res.products.length > 0) {
          const formatted = res.products.map((p, idx) => ({
            id: String(p.id),
            title: p.title || 'Digital Publication',
            description: p.description || p.short_description || 'High-performance digital publication.',
            price: (p.currency || 'AED') + ' ' + Number(p.price || 49).toFixed(2),
            priceNum: Number(p.price) || 49,
            currency: p.currency || 'AED',
            image: p.cover_image || p.image || '/assets/images/img/book' + ((idx % 3) + 1) + '.webp',
            link: p.slug ? '/publications/' + p.slug : '/buy-book/' + p.id,
            slug: p.slug || null,
            publication_status: p.publication_status || 'available',
          }));
          if (isMounted) setBooks(formatted);
        }
      } catch (err) {
        console.warn('Using default catalog for home ebook section:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchBooks();
    return () => { isMounted = false; };
  }, []);

  // On home page: show only the first 3 books
  const displayBooks = books.slice(0, 3);

  return (
    <>
      <style>{`
        .index-container {
          position: relative;
          background-image: var(--book-bg-light);
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
        }
        .index-overlay {
          position: absolute;
          inset: 0;
          background-color: rgba(var(--background-rgb), 0.85);
        }
        .index-content {
          position: relative;
          z-index: 10;
        }
        .index-hero {
          max-width: 1200px;
          margin-left: auto;
          margin-right: auto;
          padding: 2rem 1.5rem;
          text-align: center;
        }
        .index-main {
          max-width: 1200px;
          margin-left: auto;
          margin-right: auto;
          padding: 0 1.5rem 5rem 1.5rem;
        }
        .index-grid {
          display: grid;
          gap: 2rem;
        }
        @media (min-width: 640px) {
          .index-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (min-width: 1024px) {
          .index-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
      `}</style>

      <div className="index-container aspire-book-page">
        <div className="index-overlay" />
        <div className="index-content">
          <section className="index-hero">
            <div className="service-heading-container">
              <div className="sub-heading justify-content-center">
                <i className="fa-solid fa-circle-notch"></i>
                <h6 className="font-family-1 accent-color">Featured Books</h6>
              </div>
              <h2 className="text-center animate-box animated animate__animated" data-animate="animate__fadeInUp">
                Practical Marketing &amp; Management for Success
              </h2>
            </div>
          </section>

          <div className="index-main">
            <div className="index-grid">
              {displayBooks.map((book, i) => (
                <EbookCards
                  key={book.id}
                  image={book.image}
                  title={book.title}
                  description={book.description}
                  delay={i * 100}
                  link={book.link}
                  status={book.publication_status}
                  price={book.price}
                  priceNum={book.priceNum}
                  currency={book.currency}
                  productId={book.id}
                  slug={book.slug}
                />
              ))}
            </div>
            <div className="cta-container" style={{ marginTop: '30px', marginBottom: '-30px' }}>
              <Link to="/publications" className="btn btn-secondary-accent">View All Publications</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EbookCardPage;
