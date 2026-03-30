import { Star, Bookmark } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const BlogCard = ({ image, title, description, link, tags, delay = 0 }) => {
  const navigate = useNavigate();
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

        .blog-card-bookmark {
          position: absolute;
          right: 1rem;
          top: 1rem;
          z-index: 10;
          border-radius: 0.75rem;
          background-color: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(12px);
          padding: 0.625rem;
          transition: all 0.3s;
          border: 1px solid rgba(255, 255, 255, 0.2);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .blog-card-bookmark:hover {
          background-color: rgba(255, 255, 255, 0.95);
          transform: scale(1.1);
        }

        .blog-card-bookmark svg {
          width: 1.125rem;
          height: 1.125rem;
          color: white;
          transition: color 0.3s;
        }

        .blog-card-bookmark:hover svg {
          color: #1a1a1a;
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

        .blog-card-rating {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          background-color: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 0.375rem 0.75rem;
          border-radius: 0.625rem;
          transition: all 0.3s;
        }

        .blog-card-rating:hover {
          background-color: rgba(255, 255, 255, 0.25);
        }

        .blog-card-rating svg {
          width: 1rem;
          height: 1rem;
          fill: #fbbf24;
          color: #fbbf24;
        }

        .blog-card-rating-value {
          font-size: 0.875rem;
          font-weight: 600;
          color: white;
        }

        .blog-card-tag {
          border-radius: 0.625rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background-color: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(8px);
          padding: 0.375rem 0.875rem;
          font-size: 0.8125rem;
          font-weight: 500;
          color: white;
          transition: all 0.3s;
          display: inline-block;
        }

        .blog-card-tag:hover {
          background-color: rgba(255, 255, 255, 0.95);
          color: #1a1a1a;
          border-color: rgba(255, 255, 255, 0.9);
          transform: translateY(-2px);
        }

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
      <Link to={link}>
        <article
          className="blog-card no-dark"
          style={{ animationDelay: `${delay}ms` }}
        >
          <img
            src={image}
            alt={title}
            className="blog-card-image"
            loading="lazy"
          />

          <div className="blog-card-gradient" />

          <button
            className="blog-card-bookmark"
            aria-label="Bookmark this post"
          >
            <Bookmark />
          </button>

          <div className="blog-card-content">
            <h3 className="blog-card-title">{title}</h3>
            <p className="blog-card-description">{description}</p>

            <div className="blog-card-footer">
              {tags && tags.map(tag => (
                <span key={tag} className="blog-card-tag">{tag}</span>
              ))}
            </div>

            <button onClick={(e) => { e.preventDefault(); navigate(link); }} className="blog-card-cta">Read More</button>
          </div>
        </article></Link>
    </>
  );
};

export default BlogCard;
