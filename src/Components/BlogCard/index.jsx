import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Share2, Check } from "lucide-react";
import { copyToClipboard, showShareToast } from "../../utils/shareToast";

const BlogCard = ({ image, title, description, link, tags, delay = 0, onTagClick, linkedin_url, instagram_url, facebook_url }) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleShareClick = (e) => {
    e.stopPropagation();
    const fullUrl = link.startsWith("http")
      ? link
      : `${window.location.origin}${link}`;

    copyToClipboard(fullUrl).then(() => {
      setCopied(true);
      showShareToast("Blog link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const hasSocials = Boolean(linkedin_url || instagram_url || facebook_url);

  return (
    <>
      <style>{`
        .blog-card {
          position: relative;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border-radius: 1rem;
          height: 28rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
          animation: fadeUp 0.6s ease-out forwards;
          cursor: pointer;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .blog-card:hover {
          transform: translateY(-0.75rem);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
        }

        .blog-card-image {
          position: absolute;
          inset: 0;
          height: 100%;
          width: 100%;
          object-fit: cover;
          transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .blog-card:hover .blog-card-image {
          transform: scale(1.15);
        }

        .blog-card-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.95) 0%,
            rgba(0, 0, 0, 0.7) 30%,
            rgba(0, 0, 0, 0.12) 70%,
            rgba(0, 0, 0, 0) 100%
          );
          transition: opacity 0.5s;
        }

        .blog-card:hover .blog-card-gradient {
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.98) 0%,
            rgba(0, 0, 0, 0.8) 50%,
            rgba(0, 0, 0, 0.4) 80%,
            rgba(0, 0, 0, 0.2) 100%
          );
        }

        .blog-card-share {
          position: absolute;
          right: 1rem;
          top: 1rem;
          z-index: 10;
          border-radius: 0.75rem;
          background-color: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(12px);
          padding: 0.625rem;
          transition: all 0.3s;
          border: 1px solid rgba(255, 255, 255, 0.25);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .blog-card-share:hover {
          background-color: rgba(255, 255, 255, 0.95);
          transform: scale(1.1);
        }

        .blog-card-share svg {
          width: 1.125rem;
          height: 1.125rem;
          color: white;
          transition: color 0.3s;
        }

        .blog-card-share:hover svg {
          color: #1a1a1a;
        }

        .blog-card-share.copied {
          background-color: #10B981;
          border-color: #10B981;
        }

        .blog-card-share.copied svg {
          color: #ffffff;
        }

        .blog-card-content {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 5;
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
          padding: 1.75rem;
        }

        .blog-card-title {
          font-size: 1.5rem;
          font-weight: 700;
          line-height: 1.3;
          color: white;
          transition: all 0.3s;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .blog-card:hover .blog-card-title {
          transform: translateY(-4px);
          text-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
        }

        .blog-card-description {
          font-size: 0.9375rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.9);
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .blog-card-footer {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          flex-wrap: wrap;
        }

        /* Category tag — clickable chip */
        .blog-card-tag {
          border-radius: 0.625rem;
          border: 1px solid rgba(255, 255, 255, 0.25);
          background-color: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(8px);
          padding: 0.375rem 0.875rem;
          font-size: 0.8125rem;
          font-weight: 500;
          color: white;
          transition: all 0.3s;
          display: inline-block;
          cursor: pointer;
          user-select: none;
        }

        .blog-card-tag:hover {
          background-color: rgba(255, 255, 255, 0.95);
          color: #1a1a1a;
          border-color: rgba(255, 255, 255, 0.9);
          transform: translateY(-2px);
        }

        /* CTA button */
        .blog-card-cta {
          margin-top: 0.5rem;
          width: 100%;
          border-radius: 0.75rem;
          background-color: rgba(255, 255, 255, 0.25);
          padding: 0.875rem;
          font-size: 0.9375rem;
          font-weight: 600;
          color: white;
          transition: all 0.3s;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
        }

        .blog-card-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px -5px rgba(246, 59, 59, 0.5);
          background: linear-gradient(135deg, #eb2525 0%, #d81d1d 100%);
        }

        .blog-card-cta:active {
          transform: translateY(0);
        }
      `}</style>

      {/* Outer div is NOT an <a> — only CTA navigates */}
      <article
        className="blog-card no-dark"
        style={{ animationDelay: `${delay}ms` }}
        onClick={() => navigate(link)}
      >
        <img
          src={image}
          alt={title}
          className="blog-card-image"
          loading="lazy"
        />

        <div className="blog-card-gradient" />

        {/* Share Icon in place of Bookmark */}
        <button
          className={`blog-card-share ${copied ? "copied" : ""}`}
          aria-label="Share this blog post"
          title={copied ? "Link copied!" : "Share article"}
          onClick={handleShareClick}
        >
          {copied ? <Check size={18} /> : <Share2 size={18} />}
        </button>

        <div className="blog-card-content">
          <h3 className="blog-card-title">{title}</h3>
          <p className="blog-card-description">{description}</p>

          <div className="blog-card-footer">
            {tags && tags.map((tag) => (
              <span
                key={tag}
                className="blog-card-tag"
                onClick={(e) => {
                  e.stopPropagation(); // prevent card navigation
                  if (onTagClick) onTagClick(tag);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.stopPropagation();
                    if (onTagClick) onTagClick(tag);
                  }
                }}
                title={`Filter by ${tag}`}
              >
                {tag}
              </span>
            ))}

            {hasSocials && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }} onClick={(e) => e.stopPropagation()}>
                {linkedin_url && (
                  <a
                    href={linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    title="LinkedIn"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(8px)',
                      color: '#ffffff',
                      textDecoration: 'none',
                      transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                )}
                {instagram_url && (
                  <a
                    href={instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    title="Instagram"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(8px)',
                      color: '#ffffff',
                      textDecoration: 'none',
                      transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.13-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                )}
                {facebook_url && (
                  <a
                    href={facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    title="Facebook"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(8px)',
                      color: '#ffffff',
                      textDecoration: 'none',
                      transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                )}
              </div>
            )}
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); navigate(link); }}
            className="blog-card-cta"
          >
            Read More
          </button>
        </div>
      </article>
    </>
  );
};

export default BlogCard;
