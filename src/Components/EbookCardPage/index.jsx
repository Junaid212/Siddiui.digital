import React from 'react'
import EbookCards from '../EbookCards';


const blogPosts = [
  {
    image: 'https://i.pinimg.com/736x/80/28/6d/80286dbd6f046d5e22f752dc3200ffa2.jpg',
    title: "Zero to One",
    description: "How to build the future in the Marketing Field",
    rating: 100,
    tags: ["Startup", "Management"],
    link: '/book1'
  },
  {
    image: 'https://i.pinimg.com/1200x/a7/68/9a/a7689ab417c9ca9363d0b9399a209d59.jpg',
    title: "Laws of Marketing",
    description: "Perfect for seeking mental growth and empowerment through reading.",
    rating: 125,
    tags: ["Marketing", "Strategy"],
    link: '/book1'
  },
  {
    image: 'https://i.pinimg.com/736x/ff/cf/31/ffcf314c25eaabbf3f388a4ca99541d4.jpg',
    title: "The Power of First Impression",
    description: "Mastery To Influence, inspire ans Succeed",
    rating: 90,
    tags: ["Growth", "Operations"],
    link: '/book1'
  },
  // {
  //   image: blog4,
  //   title: "Social Media Mastery",
  //   description: "Build a powerful social media presence that converts followers into loyal customers and brand advocates.",
  //   rating: 4.6,
  //   tags: ["Social Media", "Branding"],
  // },
  // {
  //   image: blog5,
  //   title: "Building Brand Identity",
  //   description: "Craft a memorable brand identity that resonates with your audience and stands out in crowded markets.",
  //   rating: 4.8,
  //   tags: ["Branding", "Design"],
  // },
  // {
  //   image: blog6,
  //   title: "Agile Project Management",
  //   description: "Implement agile methodologies to boost team productivity, innovation, and project delivery speed.",
  //   rating: 4.7,
  //   tags: ["Agile", "Productivity"],
  // },
];

const EbookCardPage = () => {
  return (
    <>
      <style>{`
        /* Index.css - internal styles */

        .index-container {
          position: relative;
        //   min-height: 100vh;
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

        /* Header */
        .index-header {
          border-bottom: 1px solid rgba(var(--border-rgb), 0.5);
          backdrop-filter: blur(8px);
        }

        .index-header-container {
          max-width: 1200px;
          margin-left: auto;
          margin-right: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        //   padding: 1.25rem 1.5rem;
        }

        .index-logo {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--foreground);
        }

        .index-logo-highlight {
          color: var(--primary);
        }

        .index-nav {
          display: none;
          gap: 1.5rem;
          font-family: var(--font-body);
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--muted-foreground);
        }

        @media (min-width: 768px) {
          .index-nav {
            display: flex;
          }
        }

        .index-nav-link {
          color: inherit;
          text-decoration: none;
          transition: color 0.2s;
        }

        .index-nav-link:hover {
          color: var(--primary);
        }

        /* Hero */
        .index-hero {
          max-width: 1200px;
          margin-left: auto;
          margin-right: auto;
          padding: 2rem 1.5rem;
          text-align: center;
        }

        .index-hero-title {
          font-family: var(--font-heading);
          font-size: 2.25rem;
          font-weight: 800;
          line-height: 1.25;
          color: var(--foreground);
        }

        @media (min-width: 768px) {
          .index-hero-title {
            font-size: 3rem;
          }
        }

        @media (min-width: 1024px) {
          .index-hero-title {
            font-size: 3.75rem;
          }
        }

        .index-hero-highlight {
          display: block;
          color: var(--primary);
        }

        .index-hero-description {
          max-width: 42rem;
          margin-left: auto;
          margin-right: auto;
          margin-top: 1rem;
          font-size: 1.125rem;
          color: var(--muted-foreground);
        }

        /* Blog Grid */
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
        {/* Overlay */}
        <div className="index-overlay" />

        {/* Content */}
        <div className="index-content">
          {/* Header */}
          {/* <header className="index-header">
            <div className="index-header-container">
              <h2 className="index-logo">
                <span className="index-logo-highlight">Biz</span>Blog
              </h2>
              <nav className="index-nav">
                <a href="#" className="index-nav-link">Home</a>
                <a href="#" className="index-nav-link">Articles</a>
                <a href="#" className="index-nav-link">About</a>
                <a href="#" className="index-nav-link">Contact</a>
              </nav>
            </div>
          </header> */}

          {/* Hero */}
          <section className="index-hero">
            <div className="service-heading-container">
              <div className="sub-heading justify-content-center">
                <i className="fa-solid fa-circle-notch"></i>
                <h6 className="font-family-1 accent-color">E-Book</h6>
              </div>
              <h2 className="text-center animate-box animated animate__animated" data-animate="animate__fadeInUp">Practical Marketing & Management for  Success</h2>
            </div>
            {/* <h1 className="index-hero-title">
              Marketing & Business
              <span className="index-hero-highlight">Management</span>
            </h1> */}
            {/* <p className="index-hero-description">
              Insights, strategies, and expert advice to grow your business and sharpen your marketing edge.
            </p> */}
          </section>

          {/* Blog Grid */}
          <div className="index-main">
            <div className="index-grid">
              {blogPosts.map((post, i) => (
                <EbookCards key={post.title} {...post} delay={i * 100} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EbookCardPage;