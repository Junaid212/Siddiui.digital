import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import BlogCard from '../../Components/BlogCard';
import BannerInnerSection from '../../Components/Banner/inner';

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setBlogs(data || []);
      } catch (err) {
        console.error("Error fetching blogs for list page:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) return <BannerInnerSection title='Loading...' currentPage='Blogs' />;

  return (
    <>
      <BannerInnerSection title='Blogs' currentPage='Blogs' />
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
            <h1 className="index-hero-title">
              Marketing & Business
              <span className="index-hero-highlight">Management</span>
            </h1>
            <p className="index-hero-description">
              Insights, strategies, and expert advice to grow your business and sharpen your marketing edge.
            </p>
          </section>

          {/* Blog Grid */}
          <div className="index-main">
            <div className="index-grid">
              {blogs.map((post, i) => (
                <BlogCard
                  key={post.id}
                  title={post.title}
                  image={post.image_url}
                  description={post.content.substring(0, 150) + '...'}
                  id={post.id}
                  tags={[post.topic]}
                  link={`/blog/${post.topic ? post.topic.toLowerCase().replace(/\s+/g, '-') : 'general'}`}
                  delay={i * 100}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogSection;