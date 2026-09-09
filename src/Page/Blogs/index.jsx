import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import BlogCard from '../../Components/BlogCard';
import BannerInnerSection from '../../Components/Banner/inner';
import { supabase } from '../../supabaseClient';

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  // Active category from URL param (e.g. ?category=digital-marketing)
  const activeCategory = searchParams.get('category') || 'all';

  // Helper to extract all categories for a blog (supports topic, topic2, and comma-separated)
  const getBlogCategories = useCallback((b) => {
    const list = [];
    if (b.topic) {
      b.topic.split(',').forEach((c) => {
        const t = c.trim();
        if (t && !list.some((item) => item.toLowerCase() === t.toLowerCase())) {
          list.push(t);
        }
      });
    }
    if (b.topic2) {
      b.topic2.split(',').forEach((c) => {
        const t = c.trim();
        if (t && !list.some((item) => item.toLowerCase() === t.toLowerCase())) {
          list.push(t);
        }
      });
    }
    return list;
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all blogs directly from Supabase (including topic2 and all fields)
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        const blogList = data || [];
        setBlogs(blogList);

        // Extract unique non-empty categories across all blogs (interlinked from topic & topic2)
        const catMap = new Map();
        blogList.forEach((b) => {
          getBlogCategories(b).forEach((cat) => {
            const key = cat.toLowerCase();
            if (!catMap.has(key)) {
              catMap.set(key, cat);
            }
          });
        });
        const uniqueCats = Array.from(catMap.values()).sort((a, b) => a.localeCompare(b));
        setCategories(uniqueCats);
      } catch (err) {
        console.error('Error fetching blogs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getBlogCategories]);

  // Filter blogs by active category (matches any assigned category)
  const filteredBlogs =
    activeCategory === 'all'
      ? blogs
      : blogs.filter((b) => {
          const target = decodeURIComponent(activeCategory).toLowerCase();
          return getBlogCategories(b).some((c) => c.toLowerCase() === target);
        });

  const handleCategoryClick = useCallback(
    (cat) => {
      if (cat === 'all') {
        setSearchParams({});
      } else {
        setSearchParams({ category: cat.toLowerCase() });
      }
    },
    [setSearchParams]
  );

  if (loading) return <BannerInnerSection title="Loading..." currentPage="Blogs" />;

  return (
    <>
      <BannerInnerSection title="Blogs" currentPage="Blogs" />
      <style>{`
        /* ─── Layout ─── */
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

        /* ─── Hero ─── */
        .index-hero {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1.5rem 1rem;
          text-align: center;
        }
        .index-hero-title {
          font-family: var(--font-heading);
          font-size: 2.25rem;
          font-weight: 800;
          line-height: 1.25;
          color: var(--foreground);
        }
        @media (min-width: 768px) { .index-hero-title { font-size: 3rem; } }
        @media (min-width: 1024px) { .index-hero-title { font-size: 3.75rem; } }
        .index-hero-highlight { display: block; color: var(--primary); }
        .index-hero-description {
          max-width: 42rem;
          margin: 1rem auto 0;
          font-size: 1.125rem;
          color: var(--muted-foreground);
        }

        /* ─── Category Filter Bar ─── */
        .category-filter-bar {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1.5rem 1.5rem 0;
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
          align-items: center;
        }
        .category-filter-label {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--muted-foreground);
          letter-spacing: 0.07em;
          text-transform: uppercase;
          margin-right: 0.2rem;
          flex-shrink: 0;
        }
        .category-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.42rem 1rem;
          border-radius: 2rem;
          border: 1.5px solid rgba(var(--border-rgb, 150,150,150), 0.5);
          background: transparent;
          color: var(--muted-foreground);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.22s ease;
          white-space: nowrap;
          backdrop-filter: blur(6px);
          line-height: 1;
        }
        .category-btn:hover {
          border-color: var(--primary);
          color: var(--primary);
          background: rgba(220,38,38, 0.07);
          transform: translateY(-1px);
        }
        .category-btn.cat-active {
          background: var(--primary, #dc2626);
          border-color: var(--primary, #dc2626);
          color: #fff;
          box-shadow: 0 4px 14px rgba(220,38,38, 0.32);
          transform: translateY(-1px);
        }
        .category-btn.cat-active:hover { filter: brightness(1.1); }
        .cat-count {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 1.2rem;
          height: 1.2rem;
          padding: 0 0.25rem;
          border-radius: 999px;
          font-size: 0.7rem;
          font-weight: 700;
          background: rgba(128,128,128,0.2);
          transition: background 0.2s;
        }
        .category-btn.cat-active .cat-count {
          background: rgba(255,255,255,0.25);
          color: #fff;
        }

        /* ─── No results ─── */
        .no-results {
          text-align: center;
          padding: 5rem 1.5rem;
          color: var(--muted-foreground);
        }
        .no-results h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--foreground);
          margin-bottom: 0.5rem;
        }
        .no-results-clear {
          margin-top: 1rem;
          padding: 0.5rem 1.5rem;
          background: var(--primary, #dc2626);
          color: #fff;
          border: none;
          border-radius: 2rem;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.9rem;
          transition: filter 0.2s;
        }
        .no-results-clear:hover { filter: brightness(1.1); }

        /* ─── Blog Grid ─── */
        .index-main {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1.5rem 5rem;
        }
        .index-grid {
          display: grid;
          gap: 2rem;
        }
        @media (min-width: 640px) {
          .index-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (min-width: 1024px) {
          .index-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        }

        /* ─── Results summary ─── */
        .results-summary {
          font-size: 0.85rem;
          color: var(--muted-foreground);
          margin-bottom: 1.25rem;
        }
        .results-summary strong { color: var(--foreground); }
      `}</style>

      <div className="index-container aspire-book-page">
        <div className="index-overlay" />
        <div className="index-content">

          {/* Hero */}
          <section className="index-hero">
            <h1 className="index-hero-title">
              Marketing &amp; Business
              <span className="index-hero-highlight">Management</span>
            </h1>
            <p className="index-hero-description">
              Insights, strategies, and expert advice to grow your business and sharpen your marketing edge.
            </p>
          </section>

          {/* Category Filter Bar — only renders when categories exist */}
          {categories.length > 0 && (
            <nav
              className="category-filter-bar"
              aria-label="Blog category filter"
            >
              <span className="category-filter-label">Filter:</span>

              {/* All */}
              <button
                id="cat-all"
                className={`category-btn${activeCategory === 'all' ? ' cat-active' : ''}`}
                onClick={() => handleCategoryClick('all')}
              >
                All
                <span className="cat-count">{blogs.length}</span>
              </button>

              {/* One button per unique category */}
              {categories.map((cat) => {
                const count = blogs.filter((b) =>
                  getBlogCategories(b).some((c) => c.toLowerCase() === cat.toLowerCase())
                ).length;
                const isActive =
                  activeCategory !== 'all' &&
                  decodeURIComponent(activeCategory).toLowerCase() === cat.toLowerCase();

                return (
                  <button
                    key={cat}
                    id={`cat-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                    className={`category-btn${isActive ? ' cat-active' : ''}`}
                    onClick={() => handleCategoryClick(cat)}
                  >
                    {cat}
                    <span className="cat-count">{count}</span>
                  </button>
                );
              })}
            </nav>
          )}

          {/* Blog Grid */}
          <div className="index-main">

            {/* Results summary when filtered */}
            {activeCategory !== 'all' && (
              <p className="results-summary">
                Showing <strong>{filteredBlogs.length}</strong> article
                {filteredBlogs.length !== 1 ? 's' : ''} in{' '}
                <strong>{decodeURIComponent(activeCategory)}</strong>
              </p>
            )}

            {filteredBlogs.length === 0 ? (
              <div className="no-results">
                <h3>No articles in this category yet</h3>
                <p>Try a different filter or check back later.</p>
                <button
                  className="no-results-clear"
                  onClick={() => handleCategoryClick('all')}
                >
                  View all articles
                </button>
              </div>
            ) : (
              <div className="index-grid">
                {filteredBlogs.map((post, i) => {
                  const postCats = getBlogCategories(post);
                  const primarySlug = postCats[0]
                    ? postCats[0].toLowerCase().replace(/\s+/g, '-')
                    : (post.topic ? post.topic.split(',')[0].trim().toLowerCase().replace(/\s+/g, '-') : null);

                  return (
                    <BlogCard
                      key={post.id}
                      title={post.title}
                      image={post.image_url}
                      description={
                        post.content
                          ? post.content.replace(/<[^>]+>/g, '').substring(0, 150) + '...'
                          : ''
                      }
                      id={post.id}
                      tags={postCats}
                      link={
                        primarySlug
                          ? `/blog/${primarySlug}`
                          : `/blogs/${post.id}`
                      }
                      delay={i * 100}
                      onTagClick={handleCategoryClick}
                    />
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default BlogSection;