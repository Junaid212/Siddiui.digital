import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { X } from "lucide-react";
import "./CourseDetailDialog.css";

export default function CourseDetailDialog({ course, open, onOpenChange }) {
  // Lock body scroll while modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onOpenChange]);

  if (!open || !course) return null;

  const isSignature = course.code?.startsWith("SF-");

  return ReactDOM.createPortal(
    <div
      className="dialog-overlay"
      onClick={() => onOpenChange(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="course-dialog-title"
    >
      <div
        className="dialog-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          className="dialog-close-btn"
          onClick={() => onOpenChange(false)}
          aria-label="Close"
        >
          <X size={18} strokeWidth={1.5} />
        </button>

        {/* Header section */}
        <div className="dialog-inner-padding">
          <div className="dialog-header-row">
            <span className="dialog-code">{course.code}</span>
            {course.label && (
              <>
                <span className="dialog-separator-dot" />
                <span className="dialog-label">{course.label}</span>
              </>
            )}
          </div>

          <div className="dialog-header">
            <h2 id="course-dialog-title" className="dialog-title">
              {course.title}
            </h2>
            {course.subtitle && (
              <p className="dialog-subtitle">{course.subtitle}</p>
            )}
          </div>
        </div>

        {/* Coloured divider */}
        <div className={`dialog-divider ${isSignature ? "gold" : "default"}`} />

        {/* Body */}
        <div className="dialog-body">
          {course.short && (
            <p className="dialog-short">{course.short}</p>
          )}
          <p className="dialog-description">{course.description}</p>
        </div>

        {/* Footer */}
        <div className="dialog-footer">
          <p>Upcoming learning area · Availability to be announced</p>
        </div>
      </div>
    </div>,
    document.body
  );
}