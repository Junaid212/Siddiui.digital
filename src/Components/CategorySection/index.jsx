import React from "react";
import { motion } from "framer-motion";
import CourseCard from "../CourseCard";
import "./CategorySection.css";  // regular CSS file

export default function CategorySection({ category, onOpen }) {
  return (
    <section id={category.id} className="category-section">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="category-header"
      >
        <div className="header-text">
          <div className="letter-row">
            <span className="letter-icon">{category.letter}.</span>
            <span className="decor-line" />
            <span className="category-label">Category</span>
          </div>
          <h2 className="category-title">{category.title}</h2>
          <p className="category-tagline">{category.tagline}</p>
        </div>
        <div className="courses-count">
          <span>{category.courses.length} learning areas</span>
        </div>
      </motion.div>

      <div className="courses-grid">
        {category.courses.map((course, i) => (
          <CourseCard
            key={course.code}
            course={course}
            onOpen={onOpen}
            index={i}
          />
        ))}
      </div>
    </section>
  );
}