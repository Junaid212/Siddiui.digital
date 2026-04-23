import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import "./CourseCard.css";

export default function CourseCard({ course, onOpen, index }) {
  return (
    <motion.button
      type="button"
      onClick={() => onOpen(course)}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: (index % 4) * 0.05, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      className="course-card"
    >
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
        <div className="card-header">
          <span className="card-code">{course.code}</span>
          <ArrowRight className="card-arrow" />
        </div>

        <h4 className="card-title">{course.title}</h4>

        <p className="card-description">{course.short}</p>
      </div>
    </motion.button>
  );
}