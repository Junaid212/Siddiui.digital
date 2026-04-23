import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import "./SignatureCard.css";

export default function SignatureCard({ course, onOpen, index }) {
  return (
    <motion.button
      type="button"
      onClick={() => onOpen(course)}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className="signature-card"
    >
      {/* subtle gold corner accent */}
      <span className="card-corner-accent" />
      <span className="card-top-line" />

      <div className="card-inner">
        {course.image && (
          <div className="card-image-container">
            <img 
              src={`${import.meta.env.BASE_URL}${course.image.replace(/^\//, '')}`} 
              alt={course.title} 
              className="card-image"
            />
            <div className="card-image-overlay" />
          </div>
        )}
        <div className="card-content-wrapper">
          <div className="card-header-row">
            <span className="card-code">{course.code}</span>
            <span className="card-separator" />
            <span className="card-label">{course.label}</span>
          </div>

          <h3 className="card-title">{course.title}</h3>

          {course.subtitle && (
            <p className="card-subtitle">{course.subtitle}</p>
          )}

          <p className="card-description">{course.short}</p>

          <div className="card-cta">
            <span>Learn more</span>
            <ArrowUpRight className="card-cta-icon" />
          </div>
        </div>
      </div>
    </motion.button>
  );
}