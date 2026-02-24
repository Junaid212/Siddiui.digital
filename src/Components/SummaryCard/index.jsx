import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Send } from "lucide-react";

export default function SummaryCard({ questions, answers, onSubmit }) {
  return (
    <>
      <style>{`
        .summary-card-wrapper {
          width: 100%;
          max-width: 42rem; /* max-w-2xl */
          margin-left: auto;
          margin-right: auto;
        }

        .summary-card {
          position: relative;
          border-radius: 1.5rem; /* rounded-3xl */
          border: 1px solid rgba(255, 255, 255, 0.1);
          background-color: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(40px); /* backdrop-blur-2xl (approx) */
          box-shadow: 0 25px 50px -12px rgba(239, 68, 68, 0.05); /* shadow-2xl shadow-red-500/5 */
          overflow: hidden;
        }

        .summary-glow-top {
          position: absolute;
          top: -6rem; /* -top-24 */
          right: -6rem; /* -right-24 */
          width: 12rem; /* w-48 */
          height: 12rem; /* h-48 */
          background-color: rgba(220, 38, 38, 0.15); /* bg-red-600/15 */
          border-radius: 9999px;
          filter: blur(64px); /* blur-3xl */
        }

        .summary-glow-bottom {
          position: absolute;
          bottom: -6rem; /* -bottom-24 */
          left: -6rem; /* -left-24 */
          width: 12rem;
          height: 12rem;
          background-color: rgba(127, 29, 29, 0.1); /* bg-red-900/10 */
          border-radius: 9999px;
          filter: blur(64px);
        }

        .summary-content {
          position: relative;
          padding: 2rem; /* p-8 */
        }

        @media (min-width: 768px) {
          .summary-content {
            padding: 2.5rem; /* md:p-10 */
          }
        }

        .summary-success-wrapper {
          display: flex;
          justify-content: center;
          margin-bottom: 1.5rem; /* mb-6 */
        }

        .summary-success-icon {
          width: 4rem; /* w-16 */
          height: 4rem; /* h-16 */
          border-radius: 9999px;
          background-color: rgba(239, 68, 68, 0.1); /* bg-red-500/10 */
          border: 1px solid rgba(239, 68, 68, 0.2); /* border-red-500/20 */
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .summary-success-icon svg {
          width: 2rem; /* w-8 */
          height: 2rem; /* h-8 */
          color: #f87171; /* text-red-400 */
        }

        .summary-title {
          font-size: 1.5rem; /* text-2xl */
          font-weight: 700;
          color: #fff;
          text-align: center;
          margin-bottom: 0.5rem; /* mb-2 */
          letter-spacing: -0.025em; /* tracking-tight */
        }

        @media (min-width: 768px) {
          .summary-title {
            font-size: 1.875rem; /* md:text-3xl */
          }
        }

        .summary-subtitle {
          color: rgba(255, 255, 255, 0.4); /* text-white/40 */
          text-align: center;
          margin-bottom: 2rem; /* mb-8 */
          font-size: 0.875rem; /* text-sm */
        }

        .summary-list {
          display: flex;
          flex-direction: column;
          gap: 1rem; /* space-y-4 */
        }

        .summary-item {
          padding: 1rem; /* p-4 */
          border-radius: 1rem; /* rounded-2xl */
          background-color: rgba(255, 255, 255, 0.03); /* bg-white/[0.03] */
          border: 1px solid rgba(255, 255, 255, 0.06); /* border-white/[0.06] */
        }

        .summary-question-number {
          color: rgba(255, 255, 255, 0.4); /* text-white/40 */
          font-size: 0.75rem; /* text-xs */
          font-weight: 500;
          letter-spacing: 0.1em; /* tracking-widest */
          text-transform: uppercase;
          margin-bottom: 0.375rem; /* mb-1.5 */
        }

        .summary-question-text {
          color: rgba(255, 255, 255, 0.8); /* text-white/80 */
          font-size: 0.875rem; /* text-sm */
          font-weight: 500;
          margin-bottom: 0.5rem; /* mb-2 */
        }

        .summary-answer-container {
          display: flex;
          align-items: center;
          gap: 0.5rem; /* gap-2 */
        }

        .summary-answer-dot {
          width: 0.375rem; /* w-1.5 */
          height: 0.375rem; /* h-1.5 */
          border-radius: 9999px;
          background-color: #f87171; /* bg-red-400 */
        }

        .summary-answer-text {
          color: #fca5a5; /* text-red-300 */
          font-size: 0.875rem; /* text-sm */
          font-weight: 600;
        }

        .summary-submit-btn {
          margin-top: 2rem; /* mt-8 */
          width: 100%;
          padding: 1rem; /* py-4 */
          border-radius: 1rem; /* rounded-2xl */
          font-weight: 600;
          color: #fff;
          font-size: 1rem;
          position: relative;
          overflow: hidden;
          border: none;
          cursor: pointer;
          background: none;
        }

        .summary-btn-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, #b91c1c, #dc2626, #ef4444); /* from-red-700 via-red-600 to-red-500 */
          opacity: 0.9;
          transition: opacity 0.2s;
        }

        .summary-submit-btn:hover .summary-btn-gradient {
          opacity: 1;
        }

        .summary-btn-glow {
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, #b91c1c, #dc2626, #ef4444);
          filter: blur(12px); /* blur-xl */
          opacity: 0.3;
          transition: opacity 0.2s;
        }

        .summary-submit-btn:hover .summary-btn-glow {
          opacity: 0.5;
        }

        .summary-btn-text {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem; /* gap-2 */
        }

        .summary-btn-icon {
          width: 1rem; /* w-4 */
          height: 1rem; /* h-4 */
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="summary-card-wrapper"
      >
        <div className="summary-card">
          <div className="summary-glow-top" />
          <div className="summary-glow-bottom" />

          <div className="summary-content">
            {/* Success icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="summary-success-wrapper"
            >
              <div className="summary-success-icon">
                <CheckCircle2 />
              </div>
            </motion.div>

            <h2 className="summary-title">Thank You!</h2>
            <p className="summary-subtitle">Here's a summary of your responses</p>

            <div className="summary-list">
              {questions.map((q, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.15 }}
                  className="summary-item"
                >
                  <p className="summary-question-number">Question {i + 1}</p>
                  <p className="summary-question-text">{q.text}</p>
                  <div className="summary-answer-container">
                    <div className="summary-answer-dot" />
                    <span className="summary-answer-text">
                      {answers[i] !== undefined ? q.options[answers[i]] : "—"}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              onClick={onSubmit}
              className="summary-submit-btn"
            >
              <div className="summary-btn-gradient" />
              <div className="summary-btn-glow" />
              <span className="summary-btn-text">
                <Send className="summary-btn-icon" />
                Submit
              </span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
