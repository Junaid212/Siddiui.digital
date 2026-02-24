import React from "react";
import { Star, MapPin, Award, Clock } from "lucide-react";

export default function ConsultantProfile() {
  return (
    <>
      <style>{`
        /* ConsultantProfile.css - internal styles */

        .cp-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        /* Avatar section */
        .cp-avatar-wrapper {
          position: relative;
          margin-bottom: 1.5rem;
        }
        .cp-avatar {
          width: 7rem;
          height: 7rem;
          border-radius: 9999px;
          overflow: hidden;
          /* ring-4 ring-red-500/40 + shadow-2xl shadow-red-900/40 */
          box-shadow: 0 25px 50px -12px rgba(127, 29, 29, 0.4), 0 0 0 4px rgba(239, 68, 68, 0.4);
        }
        .cp-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .cp-avatar-badge {
          position: absolute;
          bottom: -0.25rem;
          right: -0.25rem;
          width: 2rem;
          height: 2rem;
          background-color: #dc2626; /* red-600 */
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          /* shadow-lg + ring-2 ring-white/20 */
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 0 0 2px rgba(255, 255, 255, 0.2);
        }
        .cp-avatar-badge svg {
          width: 1rem;
          height: 1rem;
          color: #fff;
        }

        /* Name and title */
        .cp-name {
          font-size: 1.25rem;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.025em;
        }
        .cp-title {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.6);
          margin-top: 0.25rem;
          font-weight: 500;
        }

        /* Location */
        .cp-location {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          margin-top: 0.75rem;
          color: rgba(255, 255, 255, 0.4);
          font-size: 0.875rem;
        }
        .cp-location svg {
          width: 0.875rem;
          height: 0.875rem;
        }

        /* Rating */
        .cp-rating {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 1rem;
        }
        .cp-stars {
          display: flex;
          align-items: center;
          gap: 0.125rem;
        }
        .cp-star {
          width: 1rem;
          height: 1rem;
          color: #f87171; /* red-400 */
          fill: #f87171;
        }
        .cp-rating-value {
          font-size: 0.875rem;
          font-weight: 600;
          color: #fff;
        }
        .cp-rating-count {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.4);
        }

        /* Tags */
        .cp-tags {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1.25rem;
        }
        .cp-tag {
          background-color: rgba(220, 38, 38, 0.2); /* red-600/20 */
          border: 1px solid rgba(239, 68, 68, 0.3); /* red-500/30 */
          color: #fca5a5; /* red-300 */
          font-weight: 500;
          font-size: 0.75rem;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
        }

        /* Session info */
        .cp-session-info {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          width: 100%;
          justify-content: center;
        }
        .cp-session-detail {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.875rem;
        }
        .cp-session-detail svg {
          width: 1rem;
          height: 1rem;
        }
        .cp-dot {
          width: 0.25rem;
          height: 0.25rem;
          border-radius: 9999px;
          background-color: rgba(255, 255, 255, 0.2);
        }
        .cp-price {
          font-size: 0.875rem;
          font-weight: 700;
          color: #fff;
        }
      `}</style>

      <div className="cp-container">
        {/* Avatar */}
        <div className="cp-avatar-wrapper">
          <div className="cp-avatar">
            <img
              src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face"
              alt="Dr. Sarah Mitchell"
            />
          </div>
          <div className="cp-avatar-badge">
            <Award />
          </div>
        </div>

        {/* Name & Title */}
        <h2 className="cp-name">Dr. Sarah Mitchell</h2>
        <p className="cp-title">Senior Business Consultant</p>

        {/* Location */}
        <div className="cp-location">
          <MapPin />
          <span>San Francisco, CA</span>
        </div>

        {/* Rating */}
        <div className="cp-rating">
          <div className="cp-stars">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="cp-star" />
            ))}
          </div>
          <span className="cp-rating-value">5.0</span>
          <span className="cp-rating-count">(128)</span>
        </div>

        {/* Tags */}
        <div className="cp-tags">
          {["Strategy", "Growth", "Leadership"].map((tag) => (
            <span key={tag} className="cp-tag">{tag}</span>
          ))}
        </div>

        {/* Session Info */}
        <div className="cp-session-info">
          <div className="cp-session-detail">
            <Clock />
            <span>60 min</span>
          </div>
          <div className="cp-dot" />
          <span className="cp-price">$120</span>
        </div>
      </div>
    </>
  );
}