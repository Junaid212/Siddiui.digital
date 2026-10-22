import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../../api';
import { supabase } from '../../supabaseClient';
import HeadTitle from '../../Components/Head/HeadTitle';
import BannerInnerSection2 from '../../Components/Banner/inner2';

const REFERENCE_TOPICS = [
  {
    id: 'sid-philosophy',
    name: 'SID Philosophy',
    description: 'Purpose, value, relevance, profit, principle-based thinking',
  },
  {
    id: 'marketing-reclassified',
    name: 'Marketing Reclassified',
    description: 'Marketing governance, strategic role, book-linked insights',
  },
  {
    id: 'business-strategy-growth',
    name: 'Business Strategy & Growth',
    description: 'Sustainable growth, business models, value creation',
  },
  {
    id: 'leadership-governance',
    name: 'Leadership & Governance',
    description: 'Decision rights, accountability, organizational design',
  },
  {
    id: 'ai-human-thinking',
    name: 'AI & Human Thinking',
    description: 'AI governance, judgment, ethics, decision quality',
  },
  {
    id: 'higher-education-learning',
    name: 'Higher Education & Learning',
    description: 'Teaching, universities, educational transformation',
  },
  {
    id: 'innovation-entrepreneurship',
    name: 'Innovation & Entrepreneurship',
    description: 'Startups, new ideas, Idea Incubator',
  },
];

const INITIAL_VISIBLE_COUNT = 6;
const LOAD_MORE_STEP = 6;

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [featuredBlog, setFeaturedBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  // Search and filter state
  const activeCategory = searchParams.get('category') || 'all';
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  // Helper to extract categories from an article
  const getCategories = useCallback((b) => {
    if (Array.isArray(b.categories) && b.categories.length > 0) {
      return b.categories;
    }
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
      const parts = Array.isArray(b.topic2) ? b.topic2 : b.topic2.split(',');
      parts.forEach((c) => {
        const t = String(c).trim();
        if (t && !list.some((item) => item.toLowerCase() === t.toLowerCase())) {
          list.push(t);
        }
      });
    }
    return list.length > 0 ? list : ['SID Philosophy'];
  }, []);

  // Filter helper: verify article is public and published
  const isPubliclyPublished = useCallback((b) => {
    const st = (b.status || 'published').toLowerCase();
    if (st === 'draft' || st === 'unpublished') return false;
    if (st === 'scheduled') {
      if (!b.scheduled_for) return false;
      return new Date(b.scheduled_for) <= new Date();
    }
    return true;
  }, []);

  // Fetch blogs from API with fallback to Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // 1. Try public admin API
        let publicArticles = [];
        let featured = null;

        try {
          const res = await api.getPublicBlogs();
          if (res && Array.isArray(res.blogs)) {
            publicArticles = res.blogs;
          }
        } catch (_) {}

        // 2. Direct Supabase fallback if API returns empty
        if (publicArticles.length === 0) {
          const { data, error } = await supabase
            .from('blogs')
            .select('*')
            .order('created_at', { ascending: false });

          if (!error && data) {
            publicArticles = data.filter(isPubliclyPublished);
          }
        }

        // Identify featured article
        try {
          const featRes = await api.getFeaturedBlog();
          if (featRes && featRes.blog) {
            featured = featRes.blog;
          }
        } catch (_) {}

        if (!featured && publicArticles.length > 0) {
          featured = publicArticles.find((b) => b.is_featured === true) || publicArticles[0];
        }

        setBlogs(publicArticles);
        setFeaturedBlog(featured);
      } catch (err) {
        console.error('Error loading blog articles:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isPubliclyPublished]);

  // Topic category article counts
  const categoryCounts = useMemo(() => {
    const counts = {};
    REFERENCE_TOPICS.forEach((topic) => {
      counts[topic.name.toLowerCase()] = 0;
    });

    blogs.forEach((b) => {
      const cats = getCategories(b);
      cats.forEach((cat) => {
        const key = cat.toLowerCase();
        REFERENCE_TOPICS.forEach((ref) => {
          if (ref.name.toLowerCase() === key || key.includes(ref.name.toLowerCase())) {
            counts[ref.name.toLowerCase()] = (counts[ref.name.toLowerCase()] || 0) + 1;
          }
        });
      });
    });
    return counts;
  }, [blogs, getCategories]);

  // Filter and search logic
  const filteredBlogs = useMemo(() => {
    return blogs.filter((b) => {
      // Category filter
      if (activeCategory !== 'all') {
        const target = decodeURIComponent(activeCategory).toLowerCase().trim();
        const cats = getCategories(b).map((c) => c.toLowerCase());
        const hasCatMatch = cats.some((c) => c === target || c.includes(target) || target.includes(c));
        if (!hasCatMatch) return false;
      }

      // Live search filter across title, summary, standfirst, content, categories
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const titleMatch = (b.title || '').toLowerCase().includes(q);
        const summaryMatch = (b.summary || '').toLowerCase().includes(q);
        const standfirstMatch = (b.standfirst || '').toLowerCase().includes(q);
        const contentMatch = (b.content || '').toLowerCase().includes(q);
        const catMatch = getCategories(b).some((c) => c.toLowerCase().includes(q));
        if (!titleMatch && !summaryMatch && !standfirstMatch && !contentMatch && !catMatch) {
          return false;
        }
      }

      return true;
    });
  }, [blogs, activeCategory, searchTerm, getCategories]);

  // Reset pagination on category or search change
  const handleCategoryClick = useCallback(
    (cat) => {
      setVisibleCount(INITIAL_VISIBLE_COUNT);
      if (cat === 'all') {
        setSearchParams({});
      } else {
        setSearchParams({ category: cat.toLowerCase() });
      }
      // Smooth scroll to latest section
      const targetEl = document.getElementById('latest-articles');
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    },
    [setSearchParams]
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + LOAD_MORE_STEP);
  };

  // Paginated articles slice
  const displayedArticles = filteredBlogs.slice(0, visibleCount);
  const hasMore = visibleCount < filteredBlogs.length;

  return (
    <>
      <HeadTitle title="Blog - Marketing & Business Management | Siddiqui.digital" />

      {/* Preserve existing site banner styling */}
      {/* <BannerInnerSection2 title="Blog" currentPage="Blog" /> */}

      <style>{`
        /* Editorial Design System */
        .editorial-wrapper {
          // font-family: 'Source Sans 3', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
          color: #000208ff ;
          background-color: #ffffff;
        }

        .editorial-serif {
          // font-family: 'Source Serif 4', Georgia, serif;
        }

        /* Hero Search Section */
        .blog-hero-section {
          background-color: #13294B;
          color: #ffffff;
          padding: 64px 24px 56px;
          border-radius: 30px;
        
        }

        .blog-hero-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .blog-hero-pretitle {
          margin: 0;
          font-size: 13px;
          letter-spacing: 3px;
          font-weight: 700;
          color: #F2C6CD;
          text-transform: uppercase;
        }

        .blog-hero-title {
          margin: 0;
          // font-family: 'Source Serif 4', Georgia, serif;
          font-weight: 700;
          font-size: clamp(32px, 5vw, 52px);
          line-height: 1.15;
          color: #ffffff !important;
        }

        .blog-hero-subtitle {
          margin: 0;
          max-width: 760px;
          font-size: clamp(17px, 2.5vw, 21px);
          line-height: 1.5;
          color: #DCE3F0 !important;
        }

        .blog-search-form {
          margin-top: 16px;
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          max-width: 720px;
        }

        .blog-search-input {
          flex: 1 1 320px;
          min-height: 52px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: #ffffff;
          padding: 0 18px;
          font-size: 16px;
          color: #1B1F2A;
          outline: none;
        }

        .blog-search-btn {
          min-height: 52px;
          padding: 0 26px;
          border: 0;
          border-radius: 8px;
          background: #C80808;
          color: #ffffff;
          font-weight: 700;
          font-size: 16px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: background 0.2s ease, transform 0.15s ease;
        }

        .blog-search-btn:hover {
          background: #8A1528;
          transform: translateY(-1px);
        }

        .blog-clear-btn {
          min-height: 52px;
          padding: 0 18px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          background: transparent;
          color: #ffffff;
          font-size: 14px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        /* Section Container */
        .editorial-section {
          max-width: 1200px;
          margin: 0 auto;
          padding: 56px 24px;
        }

        .editorial-section-tag {
          margin: 0 0 18px 0;
          font-size: 13px;
          letter-spacing: 3px;
          font-weight: 700;
          color: #C80808;
          text-transform: uppercase;
        }

        /* Featured Article Card */
        .featured-card {
          display: flex;
          flex-wrap: wrap;
          border: 1px solid #D9DEE7;
          border-radius: 16px;
          overflow: hidden;
          background: #ffffff;
          box-shadow: 0 6px 24px rgba(19, 41, 75, 0.05);
          transition: box-shadow 0.3s ease;
        }

        .featured-card:hover {
          box-shadow: 0 12px 32px rgba(19, 41, 75, 0.1);
        }

        .featured-image-box {
          flex: 1 1 480px;
          min-height: 340px;
          background-color: #E4E8F0;
          position: relative;
          overflow: hidden;
        }

        .featured-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
        }

        .featured-card:hover .featured-image {
          transform: scale(1.02);
        }

        .featured-content {
          flex: 1 1 460px;
          padding: 44px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 14px;
        }

        .category-pill {
          align-self: flex-start;
          background: #F7EEF0;
          color: #8A1528;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1px;
          padding: 5px 14px;
          border-radius: 999px;
          text-transform: uppercase;
        }

        .featured-headline {
          margin: 0;
          // font-family: 'Source Serif 4', Georgia, serif;
          font-size: clamp(24px, 3vw, 30px);
          line-height: 1.25;
          color: #13294B !important;
        }

        .featured-excerpt {
          margin: 0;
          font-size: 17px;
          line-height: 1.55;
          color: #3E4556;
        }

        .featured-meta {
          margin: 0;
          font-size: 14px;
          color: #4A5163;
        }

        .featured-cta {
          align-self: flex-start;
          background: #C80808;
          color: #ffffff;
          text-decoration: none;
          font-weight: 700;
          font-size: 15px;
          padding: 12px 24px;
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: background 0.2s ease, transform 0.15s ease;
        }

        .featured-cta:hover {
          background: #8A1528;
          color: #ffffff;
          transform: translateY(-1px);
        }

        /* Explore By Topic Grid */
        .topics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 16px;
        }

        .topic-tile {
          background: #F4F5F8;
          border-radius: 12px;
          padding: 22px 24px;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          gap: 6px;
          transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
          border: 1px solid transparent;
        }

        .topic-tile:hover {
          background: #FFFFFF;
          border-color: #C80808;
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(19, 41, 75, 0.08);
        }

        .topic-tile.active-topic {
          border-color: #C80808;
          background: #FFF9FA;
        }

        .topic-tile-name {
          // font-family: 'Source Serif 4', Georgia, serif;
          font-weight: 700;
          font-size: 19px;
          color: #13294B !important;
          display: flex;
          justify-content: space-between;
          align-items: center;
          line-height: 1.2;
        }

        .topic-tile-desc {
          font-size: 14px;
          color: #000000ff !important;
          line-height: 1.45;
          font-weight: 300 !important;
        }

        .topic-tile-count {
          font-size: 12px;
          // font-weight: 700;
          background: #E4E8F0;
          color: #13294B;
          padding: 2px 8px;
          border-radius: 12px;
        }

        /* Latest Articles Section */
        .latest-section {
          background-color: #F4F5F8;
          padding: 64px 24px 72px;
          border-radius: 30px;
        }

        .latest-header {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 32px;
        }

        .latest-title {
          margin: 0;
          // font-family: 'Source Serif 4', Georgia, serif;
          font-size: clamp(28px, 4vw, 36px);
          color: #13294B;
        }

        .latest-filter-group {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .latest-filter-label {
          font-size: 13.5px;
          font-weight: 600;
          color: #4A5163;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .latest-filter-select-wrapper {
          position: relative;
          display: inline-flex;
          align-items: center;
        }

        .latest-filter-select {
          min-height: 44px;
          min-width: 260px;
          padding: 0 42px 0 16px;
          border-radius: 12px;
          border: 1px solid #D0D6E2;
          background-color: #ffffff;
          color: #13294B !important;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          outline: none;
          transition: all 0.2s ease;
          box-shadow: 0 2px 6px rgba(19, 41, 75, 0.04);
        }

        .latest-filter-select:hover {
          border-color: #C80808 !important;
        }

        .latest-filter-select:focus {
          border-color: #C80808 !important;
          box-shadow: 0 0 0 3px rgba(200, 8, 8, 0.12);
        }

        .latest-filter-icon {
          position: absolute;
          right: 14px;
          pointer-events: none;
          color: #4A5163;
          display: flex;
          align-items: center;
        }

        .latest-filter-reset {
          background: transparent;
          border: none;
          color: #C80808 !important;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          padding: 4px 8px;
          text-decoration: underline;
        }

        /* Articles Grid */
        .articles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 26px;
        }

        .article-card {
          background: #ffffff;
          border-radius: 14px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          border: 1px solid #E3E6EC;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          text-decoration: none;
          color: inherit;
        }

        .article-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px rgba(19, 41, 75, 0.08);
          border-color: #D0D6E2;
        }

        .article-card-image-box {
          height: 200px;
          background: #E4E8F0;
          overflow: hidden;
          position: relative;
        }

        .article-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.4s ease;
        }

        .article-card:hover .article-card-img {
          transform: scale(1.03);
        }

        .article-card-body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          flex: 1 1 auto;
        }

        .article-card-category {
          margin: 0;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1px;
          color: #8A1528;
          text-transform: uppercase;
        }

        .article-card-title {
          margin: 0;
          // font-family: 'Source Serif 4', Georgia, serif;
          font-size: 21px;
          line-height: 1.35;
          color: #13294B !important;
        }

        .article-card-summary {
          margin: 0;
          font-size: 14.5px;
          line-height: 1.5;
          color: #3E4556;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          font-weight:200;
        }

        .article-card-footer {
          margin-top: auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          padding-top: 12px;
          border-top: 1px solid #F0F2F6;
        }

        .article-card-date {
          font-size: 11.5px;
          color: #4A5163;
          font-weight:200;
        }

        .article-card-readmore {
          font-weight: 700;
          font-size: 14.5px;
          color: #C80808;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        /* Blog Card Social Links */
        .card-social-links {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .card-social-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #EEF2F6;
          color: #4A5163;
          text-decoration: none;
          transition: all 0.2s ease;
          border: 1px solid #DCE2EC;
        }

        .card-social-icon:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
        }

        .card-social-icon.linkedin:hover {
          background: #0A66C2;
          color: #ffffff;
          border-color: #0A66C2;
        }

        .card-social-icon.instagram:hover {
          background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%);
          color: #ffffff;
          border-color: #d6249f;
        }

        .card-social-icon.facebook:hover {
          background: #1877F2;
          color: #ffffff;
          border-color: #1877F2;
        }

        /* Marketing Reclassified Promo Panel */
        .book-panel-section {
          // background: #ffffff;
          padding: 56px 24px 64px;
        }

        .book-panel-card {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 36px;
          border: 1px solid #D9DEE7;
          border-radius: 16px;
          padding: 36px;
          background: #FAFBFD;
        }

        .book-panel-image {
          width: 140px;
          height: auto;
          border-radius: 8px;
          box-shadow: 0 8px 24px rgba(19, 41, 75, 0.15);
        }

        .book-panel-info {
          flex: 1 1 400px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .book-panel-heading {
          margin: 0;
          // font-family: 'Source Serif 4', Georgia, serif;
          font-size: 26px;
          color: #13294B;
        }

        .book-panel-desc {
          margin: 0;
          font-size: 16px;
          line-height: 1.55;
          color: #3E4556;
        }

        .book-panel-cta {
          align-self: flex-start;
          background: #13294B;
          color: #ffffff;
          text-decoration: none;
          font-weight: 700;
          font-size: 15px;
          padding: 12px 24px;
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: background 0.2s ease;
        }

        .book-panel-cta:hover {
          background: #0d1e38;
          color: #ffffff;
        }

        /* Load More Button */
        .load-more-btn {
          min-height: 50px;
          padding: 0 32px;
          border-radius: 8px;
          border: 2px solid #13294B;
          background: #ffffff;
          color: #13294B;
          font-weight: 700;
          font-size: 15.5px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .load-more-btn:hover {
          background: #13294B;
          color: #ffffff;
        }
      `}</style>

      <div className="section hero-container editorial-wrapper">
        {/* SECTION 2: BLOG INTRO & WORKING SEARCH */}
        <section className="blog-hero-section">
          <div className="blog-hero-container">
            <p className="blog-hero-pretitle">Siddiqui.digital Editorial</p>
            <h1 className="blog-hero-title">Insight and Perspectives</h1>
            <p className="blog-hero-subtitle">
              Ideas that challenge assumptions, improve decisions, and connect purpose with value.
            </p>

            <form
              role="search"
              className="blog-search-form"
              onSubmit={(e) => {
                e.preventDefault();
                const targetEl = document.getElementById('latest-articles');
                if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <label htmlFor="blog-search" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden' }}>
                Search articles, topics and keywords
              </label>
              <input
                id="blog-search"
                type="search"
                placeholder="Search articles, topics and keywords..."
                className="blog-search-input"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <button type="submit" className="blog-search-btn">
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="7"></circle>
                  <path d="M20 20l-4-4"></path>
                </svg>
                Search
              </button>
              {searchTerm && (
                <button type="button" className="blog-clear-btn" onClick={handleClearSearch}>
                  ✕ Clear
                </button>
              )}
            </form>
          </div>
        </section>

        {/* SECTION 3: FEATURED ARTICLE */}
        {featuredBlog && !searchTerm && activeCategory === 'all' && (
          <section className="editorial-section" style={{ paddingBottom: '32px' }}>
            <p className="editorial-section-tag">FEATURED ARTICLE</p>
            <article className="featured-card no-light">
              <div className="featured-image-box">
                {featuredBlog.image_url ? (
                  <img
                    src={featuredBlog.image_url}
                    alt={featuredBlog.image_alt || featuredBlog.title}
                    className="featured-image"
                  />
                ) : (
                  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4A5163', fontSize: '15px', fontWeight: '600' }}>
                    Featured Article
                  </div>
                )}
              </div>

              <div className="featured-content ">
                <span className="category-pill">
                  {getCategories(featuredBlog)[0] || 'FEATURED'}
                </span>
                <h2 className="featured-headline">{featuredBlog.title}</h2>
                <p className="featured-excerpt">
                  {featuredBlog.standfirst ||
                    featuredBlog.summary ||
                    featuredBlog.content?.substring(0, 180).replace(/<[^>]+>/g, '') + '...'}
                </p>
                <p className="featured-meta">
                  {featuredBlog.author_byline || 'By M. Q. Siddiqui, Founder, Siddiqui.digital'} ·{' '}
                  {new Date(featuredBlog.published_date || featuredBlog.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}{' '}
                  · {featuredBlog.reading_time || '4 min read'}
                </p>
                {(featuredBlog.linkedin_url || featuredBlog.instagram_url || featuredBlog.facebook_url) && (
                  <div className="card-social-links" style={{ marginBottom: '16px' }} onClick={(e) => e.stopPropagation()}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#4A5163', marginRight: '4px' }}>Follow:</span>
                    {featuredBlog.linkedin_url && (
                      <a
                        href={featuredBlog.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        title="LinkedIn"
                        aria-label="LinkedIn"
                        className="card-social-icon linkedin"
                        style={{ width: '30px', height: '30px' }}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                      </a>
                    )}
                    {featuredBlog.instagram_url && (
                      <a
                        href={featuredBlog.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        title="Instagram"
                        aria-label="Instagram"
                        className="card-social-icon instagram"
                        style={{ width: '30px', height: '30px' }}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.13-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </a>
                    )}
                    {featuredBlog.facebook_url && (
                      <a
                        href={featuredBlog.facebook_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        title="Facebook"
                        aria-label="Facebook"
                        className="card-social-icon facebook"
                        style={{ width: '30px', height: '30px' }}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </a>
                    )}
                  </div>
                )}
                <Link
                  to={`/blogs/${featuredBlog.slug || featuredBlog.id}`}
                  className="featured-cta"
                >
                  Read Article
                  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"></path>
                    <path d="M13 6l6 6-6 6"></path>
                  </svg>
                </Link>
              </div>
            </article>
          </section>
        )}

        {/* SECTION 4: EXPLORE BY TOPIC */}
        <section className="editorial-section" style={{ paddingTop: '24px', paddingBottom: '48px' }}>
          <p className="editorial-section-tag">EXPLORE BY TOPIC</p>
          <div className="topics-grid">
            {REFERENCE_TOPICS.map((topic) => {
              const count = categoryCounts[topic.name.toLowerCase()] || 0;
              const isActive = activeCategory !== 'all' && decodeURIComponent(activeCategory).toLowerCase() === topic.name.toLowerCase();

              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => handleCategoryClick(topic.name)}
                  className={`topic-tile ${isActive ? 'active-topic' : ''}`}
                  style={{ textAlign: 'left', cursor: 'pointer' }}
                >
                  <span className="topic-tile-name">
                    {topic.name}
                    {count > 0 && <span className="topic-tile-count">{count}</span>}
                  </span>
                  <span className="topic-tile-desc">{topic.description}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* SECTION 5: LATEST ARTICLES */}
        <section id="latest-articles" className="latest-section">
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div className="latest-header">
              <div>
                <h2 className="latest-title">
                  {searchTerm
                    ? `Search Results for "${searchTerm}"`
                    : activeCategory !== 'all'
                    ? `${decodeURIComponent(activeCategory)}`
                    : 'Latest Articles'}
                </h2>
                {activeCategory !== 'all' && (
                  <span style={{ fontSize: '14px', color: '#4A5163', marginTop: '4px', display: 'block' }}>
                    Showing {filteredBlogs.length} article{filteredBlogs.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {/* Filter Dropdown */}
              <div className="latest-filter-group">
                <label htmlFor="topic-filter-select" className="latest-filter-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                  </svg>
                  <span>Filter by Topic:</span>
                </label>
                <div className="latest-filter-select-wrapper">
                  <select
                    id="topic-filter-select"
                    className="latest-filter-select"
                    value={activeCategory.toLowerCase()}
                    onChange={(e) => handleCategoryClick(e.target.value)}
                    aria-label="Filter articles by topic"
                  >
                    <option value="all">All Topics ({blogs.length})</option>
                    {REFERENCE_TOPICS.map((ref) => {
                      const count = categoryCounts[ref.name.toLowerCase()] || 0;
                      return (
                        <option key={ref.id} value={ref.name.toLowerCase()}>
                          {ref.name} ({count})
                        </option>
                      );
                    })}
                  </select>
                  <div className="latest-filter-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                </div>

                {activeCategory !== 'all' && (
                  <button
                    type="button"
                    className="latest-filter-reset"
                    onClick={() => handleCategoryClick('all')}
                  >
                    Reset Filter
                  </button>
                )}
              </div>
            </div>

            {/* Empty State */}
            {filteredBlogs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: '#ffffff', borderRadius: '14px', border: '1px solid #E3E6EC' }}>
                <span style={{ fontSize: '3rem', display: 'block', marginBottom: '12px' }}>🔍</span>
                <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '24px', color: '#13294B', margin: '0 0 8px' }}>
                  No articles found
                </h3>
                <p style={{ color: '#4A5163', margin: '0 0 20px' }}>
                  {searchTerm
                    ? `No published articles matched "${searchTerm}". Try different keywords.`
                    : 'No published articles in this topic yet. Check back soon!'}
                </p>
                {(searchTerm || activeCategory !== 'all') && (
                  <button
                    type="button"
                    className="featured-cta"
                    onClick={() => {
                      setSearchTerm('');
                      handleCategoryClick('all');
                    }}
                  >
                    View All Articles
                  </button>
                )}
              </div>
            ) : (
              /* Articles Grid */
              <div className="articles-grid">
                {displayedArticles.map((post) => {
                  const cats = getCategories(post);
                  const articleUrl = `/blogs/${post.slug || post.id}`;

                  return (
                    <Link
                      key={post.id}
                      to={articleUrl}
                      className="article-card"
                    >
                      <div className="article-card-image-box">
                        {post.image_url ? (
                          <img
                            src={post.image_url}
                            alt={post.image_alt || post.title}
                            className="article-card-img"
                            loading="lazy"
                          />
                        ) : (
                          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4A5163', fontWeight: '600' }}>
                            Article
                          </div>
                        )}
                      </div>

                      <div className="article-card-body">
                        <p className="article-card-category">
                          {cats[0] || 'EDITORIAL'}
                        </p>
                        <h3 className="article-card-title">{post.title}</h3>
                        <p className="article-card-summary">
                          {post.summary || post.standfirst || post.content?.substring(0, 120).replace(/<[^>]+>/g, '') + '...'}
                        </p>

                        <div className="article-card-footer">
                          <span className="article-card-date">
                            {new Date(post.published_date || post.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>

                          {(post.linkedin_url || post.instagram_url || post.facebook_url) && (
                            <div className="card-social-links" onClick={(e) => e.stopPropagation()}>
                              {post.linkedin_url && (
                                <a
                                  href={post.linkedin_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  title="LinkedIn"
                                  aria-label="LinkedIn"
                                  className="card-social-icon linkedin"
                                >
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                  </svg>
                                </a>
                              )}
                              {post.instagram_url && (
                                <a
                                  href={post.instagram_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  title="Instagram"
                                  aria-label="Instagram"
                                  className="card-social-icon instagram"
                                >
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.13-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                  </svg>
                                </a>
                              )}
                              {post.facebook_url && (
                                <a
                                  href={post.facebook_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  title="Facebook"
                                  aria-label="Facebook"
                                  className="card-social-icon facebook"
                                >
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                  </svg>
                                </a>
                              )}
                            </div>
                          )}

                          <span className="article-card-readmore">
                            Read more →
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Load More Button */}
            {hasMore && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
                <button
                  type="button"
                  className="load-more-btn"
                  onClick={handleLoadMore}
                >
                  Load More Articles ({filteredBlogs.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </div>
        </section>

        {/* SECTION 6: MODEST MARKETING RECLASSIFIED PANEL (NO ASK SID) */}
        <section className="book-panel-section">
          <div className="book-panel-card">
            <img
              src="https://cneariiepqywvjpmznqn.supabase.co/storage/v1/object/public/product-covers/1792073568433-FFF_cove_page_Marketing_Reclassified_Web.jpg"
              alt="Marketing Reclassified Book Cover"
              className="book-panel-image"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div className="book-panel-info">
              <span style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '1.5px', color: '#C80808', textTransform: 'uppercase' }}>
                Foundational Publication
              </span>
              <h3 className="book-panel-heading">Marketing Reclassified</h3>
              <p className="book-panel-desc">
                A principle-first approach reclassifying marketing as strategic intelligence and corporate governance. Written by M. Q. Siddiqui.
              </p>
              <Link
                to="/publications/marketing-reclassified-principle-first-approach"
                className="book-panel-cta"
              >
                Explore the Book →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default BlogSection;