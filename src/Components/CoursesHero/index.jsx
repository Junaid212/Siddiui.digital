import React from "react";
import { motion } from "framer-motion";
import "./CoursesHero.css";

export default function CoursesHero() {
  return (
    <section className="hero-section">
      {/* soft background ornament */}
      <div className="hero-bg-ornament" />

      <div className="hero-content">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="hero-badge"
        >
          <span className="badge-line" />
          <span className="badge-text">Courses · Learning Ecosystem</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="hero-title"
        >
          A curated journey through
          <span className="hero-title-italic">strategic thinking.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="hero-description"
        >
          These learning areas are not isolated topics. They belong to one
          unified philosophy — where marketing and business are approached
          through value creation, adaptability, and purposeful decision making.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="hero-note"
        >
          Presented as upcoming learning areas. Availability will be announced in time.
        </motion.p>
      </div>
    </section>
  );
}