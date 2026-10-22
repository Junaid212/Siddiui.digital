import { useNavigate } from "react-router-dom";
import { useCart } from "../Cart/CartContext";
import { useState } from "react";

const EbookCards = ({
  image,
  title,
  description,
  delay = 0,
  link,
  status,
  price,
  priceNum,
  currency,
  productId,
  slug,
}) => {
  const navigate = useNavigate();
  const { addItem, items } = useCart();
  const [addedToCart, setAddedToCart] = useState(false);

  const isComingSoon = status === "coming_soon";
  const isInCart = items.some((i) => i.productId === productId);

  const handleCardClick = () => {
    if (!isComingSoon && link) navigate(link);
  };

  const handleReadMore = (e) => {
    e.stopPropagation();
    if (link) navigate(link);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isInCart) {
      navigate("/cart/checkout");
      return;
    }
    addItem({
      productId,
      title,
      price: Number(priceNum) || 49,
      currency: currency || "AED",
      coverImage: image,
      accessType: "download",
      accessLabel: "Digital Companion Edition",
      slug: slug || null,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const displayPrice = price || `${currency || "AED"} ${Number(priceNum || 49).toFixed(2)}`;

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

        .blog-card.coming-soon-card {
          cursor: default;
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

        .blog-card:hover:not(.coming-soon-card) {
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

        .blog-card:hover:not(.coming-soon-card) .blog-card-image {
          transform: scale(1.15);
        }

        .blog-card-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.95) 0%,
            rgba(0, 0, 0, 0.7) 30%,
            rgba(0, 0, 0, 0) 70%,
            rgba(0, 0, 0, 0) 100%
          );
          transition: opacity 0.5s;
        }

        .blog-card:hover:not(.coming-soon-card) .blog-card-gradient {
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.98) 0%,
            rgba(0, 0, 0, 0.8) 50%,
            rgba(0, 0, 0, 0.09) 80%,
            rgba(0, 0, 0, 0) 100%
          );
        }

        .blog-card-coming-soon-badge {
          position: absolute;
          top: 14px;
          right: 14px;
          z-index: 10;
          background: rgba(245, 158, 11, 0.9);
          backdrop-filter: blur(8px);
          color: #000;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 4px 12px;
          border-radius: 20px;
        }

        .blog-card-content {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 5;
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
          padding: 1.75rem;
        }

        .blog-card-title {
          font-size: 1.25rem;
          font-weight: 600;
          line-height: 1.3;
          color: white;
          transition: all 0.3s;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .blog-card:hover:not(.coming-soon-card) .blog-card-title {
          transform: translateY(-4px);
          text-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
        }

        .blog-card-description {
          font-size: 0.85rem;
          line-height: 1.6;
          color: rgba(200, 198, 198, 0.9);
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 0.4rem;
        }

        .blog-card-price {
          font-size: 0.8rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.85);
          letter-spacing: 0.02em;
          margin-bottom: 0.4rem;
        }

        .blog-card-btns {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.25rem;
        }

        .blog-card-cta {
          flex: 1;
          border-radius: 0.75rem;
          background-color: rgba(255, 255, 255, 0.15);
          padding: 0.7rem 0.5rem;
          font-size: 0.8rem;
          font-weight: 600;
          color: white;
          transition: all 0.3s;
          border: 1px solid rgba(255,255,255,0.2);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          backdrop-filter: blur(6px);
        }

        .blog-card-cta:hover {
          transform: translateY(-2px);
          background-color: rgba(255,255,255,0.25);
        }

        .blog-card-cta-primary {
          flex: 1;
          border-radius: 0.75rem;
          background: linear-gradient(135deg, #c80808 0%, #990000 100%);
          padding: 0.7rem 0.5rem;
          font-size: 0.8rem;
          font-weight: 700;
          color: white;
          transition: all 0.3s;
          border: none;
          cursor: pointer;
          box-shadow: 0 6px 16px -3px rgba(200, 8, 8, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
        }

        .blog-card-cta-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px -5px rgba(246, 59, 59, 0.5);
        }

        .blog-card-cta-primary:active,
        .blog-card-cta:active {
          transform: translateY(0);
        }

        .blog-card-cta.in-cart {
          background: rgba(5, 150, 105, 0.15);
          color: #34d399;
          border-color: rgba(52, 211, 153, 0.4);
        }

        .blog-card-coming-soon-btn {
          width: 100%;
          background: rgba(245, 158, 11, 0.2);
          color: #f59e0b;
          font-weight: 700;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          border: 1px solid rgba(245, 158, 11, 0.3);
          cursor: default;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          gap: 8px;
          margin-top: 0.25rem;
        }
      `}</style>

      <article
        className={`blog-card no-dark${isComingSoon ? " coming-soon-card" : ""}`}
        style={{ animationDelay: `${delay}ms` }}
        onClick={handleCardClick}
      >
        {/* Book Image */}
        <img
          src={image}
          alt={title}
          className="blog-card-image"
          loading="lazy"
        />
        <div className="blog-card-gradient" />

        {/* Coming Soon Badge */}
        {isComingSoon && (
          <div className="blog-card-coming-soon-badge">Coming Soon</div>
        )}

        {/* Card Content */}
        <div className="blog-card-content">
          <h3 className="blog-card-title">{title}</h3>
          <p className="blog-card-description">{description}</p>

          {/* Price — only for active books */}
          {!isComingSoon && (
            <p className="blog-card-price">{displayPrice}</p>
          )}

          {/* Buttons */}
          {isComingSoon ? (
            <div className="blog-card-coming-soon-btn">
              <i className="fa-solid fa-clock" />
              Coming Soon
            </div>
          ) : (
            <div className="blog-card-btns">
              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                className={`blog-card-cta${isInCart || addedToCart ? " in-cart" : ""}`}
              >
                <i className={`fa-solid ${isInCart ? "fa-check" : addedToCart ? "fa-check" : "fa-cart-plus"}`} />
                {isInCart ? "In Cart" : addedToCart ? "Added!" : "Add to Cart"}
              </button>

              {/* Read More */}
              <button
                onClick={handleReadMore}
                className="blog-card-cta-primary"
              >
                <i className="fa-solid fa-arrow-right" />
                Read More
              </button>
            </div>
          )}
        </div>
      </article>
    </>
  );
};

export default EbookCards;