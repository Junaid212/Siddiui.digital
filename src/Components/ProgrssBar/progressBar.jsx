import React from "react";
import { motion } from "framer-motion";

export default function ProgressBar({ current, total }) {
  const progress = ((current + 1) / total) * 100;

  return (
    <>
      <style>{`
        .progress-bar-container {
          width: 100%;
          max-width: 42rem; /* max-w-2xl */
          margin-left: auto;
          margin-right: auto;
          margin-bottom: 2.5rem; /* mb-10 */
        }

        .progress-bar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem; /* mb-3 */
        }

        .progress-bar-question-text {
          font-size: 0.875rem; /* text-sm */
          font-weight: 500; /* font-medium */
          color: rgba(255, 255, 255, 0.5); /* text-white/50 */
          letter-spacing: 0.1em; /* tracking-widest */
          text-transform: uppercase;
        }

        .progress-bar-percentage {
          font-size: 0.875rem; /* text-sm */
          font-weight: 600; /* font-semibold */
          color: rgba(255, 255, 255, 0.7); /* text-white/70 */
        }

        .progress-bar-track {
          height: 0.375rem; /* h-1.5 (6px) */
          background-color: rgba(255, 255, 255, 0.1); /* bg-white/10 */
          border-radius: 9999px; /* rounded-full */
          overflow: hidden;
          backdrop-filter: blur(4px); /* backdrop-blur-sm */
        }

        .progress-bar-fill {
          height: 100%;
          border-radius: 9999px;
          background: linear-gradient(90deg, #7f1d1d, #dc2626, #ef4444);
        }
      `}</style>

      <div className="progress-bar-container">
        <div className="progress-bar-header">
          <span className="progress-bar-question-text">
            Question {current + 1} of {total}
          </span>
          <span className="progress-bar-percentage">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="progress-bar-track">
          <motion.div
            className="progress-bar-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
      </div>
    </>
  );
}        