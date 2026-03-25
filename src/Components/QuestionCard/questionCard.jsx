import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
// import { base44 } from "@/api/base44Client";

const optionIcons = ["◆", "●", "▲", "■"];

export default function QuestionCard({ question, questionIndex, onNext, isLast, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [distributions, setDistributions] = useState([0, 0, 0, 0]);
  const [counts, setCounts] = useState([0, 0, 0, 0]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    setSelected(null);
    setDistributions([0, 0, 0, 0]);
    setCounts([0, 0, 0, 0]);
    setTotalVotes(0);
    setAnswered(false);
    setIsSubmitting(false);
  }, [questionIndex]);

  const handleSelect = async (optionIndex) => {
    if (selected !== null) return;
    setSelected(optionIndex);
    setIsSubmitting(true);
    if (onAnswer) onAnswer(questionIndex, optionIndex);

    await base44.entities.PollResponse.create({
      question_index: questionIndex,
      selected_option: optionIndex,
    });

    const allResponses = await base44.entities.PollResponse.filter({ question_index: questionIndex });
    const rawCounts = [0, 0, 0, 0];
    allResponses.forEach((r) => {
      if (r.selected_option >= 0 && r.selected_option <= 3) rawCounts[r.selected_option]++;
    });
    const total = rawCounts.reduce((a, b) => a + b, 0);
    const pcts = rawCounts.map((c) => (total > 0 ? Math.round((c / total) * 100) : 0));
    setDistributions(pcts);
    setCounts(rawCounts);
    setTotalVotes(total);
    setIsSubmitting(false);
    setAnswered(true);

    setTimeout(() => {
      if (onNext) onNext();
    }, 1000);
  };

  return (
    <>
      <style>{`
        /* QuestionCard.css - internal styles */

        .qc-card-wrapper {
          width: 100%;
          max-width: 42rem; /* max-w-2xl */
          margin-left: auto;
          margin-right: auto;
        }

        .qc-card {
          position: relative;
          border-radius: 1.5rem; /* rounded-3xl */
          border: 1px solid rgba(255, 255, 255, 0.31);
          background-color: rgba(211, 211, 211, 1);
          backdrop-filter: blur(40px); /* backdrop-blur-2xl (approx) */
          box-shadow: 0 25px 50px -12px rgba(239, 68, 68, 0.18); /* shadow-2xl shadow-red-500/5 */
          overflow: hidden;
        }

        .qc-glow-top {
          position: absolute;
          top: -6rem; /* -top-24 */
          right: -6rem; /* -right-24 */
          width: 12rem; /* w-48 */
          height: 12rem; /* h-48 */
          background-color: rgba(220, 38, 38, 0.36); /* bg-red-600/15 */
          border-radius: 9999px;
          filter: blur(64px); /* blur-3xl */
        }

        .qc-glow-bottom {
          position: absolute;
          bottom: -6rem; /* -bottom-24 */
          left: -6rem; /* -left-24 */
          width: 12rem;
          height: 12rem;
          background-color: rgba(127, 29, 29, 0.1); /* bg-red-900/10 */
          border-radius: 9999px;
          filter: blur(64px);
        }

        .qc-card-content {
          position: relative;
          padding: 2rem; /* p-8 */
        }

        @media (min-width: 768px) {
          .qc-card-content {
            padding: 2.5rem; /* md:p-10 */
          }
        }

        .qc-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem; /* gap-2 */
          padding: 0.25rem 0.75rem; /* py-1 px-3 */
          border-radius: 9999px;
          background-color: rgba(255, 255, 255, 0.06); /* bg-white/[0.06] */
          border: 1px solid rgba(255, 255, 255, 0.1);
          margin-bottom: 1.5rem; /* mb-6 */
        }

        .qc-badge-dot {
          width: 0.5rem; /* w-2 */
          height: 0.5rem; /* h-2 */
          border-radius: 9999px;
          background: linear-gradient(to right, #ef4444, #fca5a5); /* from-red-500 to-red-300 */
        }

        .qc-badge-text {
          font-size: 0.75rem; /* text-xs */
          font-weight: 500;
          color: rgba(255, 255, 255, 0.4); /* text-white/40 */
          letter-spacing: 0.1em; /* tracking-widest */
          text-transform: uppercase;
        }

        .qc-question {
          font-size: 1.5rem; /* text-2xl */
          font-weight: 700;
          color: #fff;
          margin-bottom: 2rem; /* mb-8 */
          line-height: 1.25; /* leading-tight */
          letter-spacing: -0.025em; /* tracking-tight */
        }

        @media (min-width: 768px) {
          .qc-question {
            font-size: 1.875rem; /* md:text-3xl */
          }
        }

        .qc-options-container {
          display: flex;
          flex-direction: column;
          gap: 0.75rem; /* space-y-3 */
        }

        /* Base option button */
        .qc-option {
          width: 100%;
          text-align: left;
          padding: 1rem 1.25rem; /* py-4 px-5 */
          border-radius: 1rem; /* rounded-2xl */
          border: 1px solid;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
          cursor: pointer;
          background: none;
          font-family: inherit;
        }

        .qc-option-default {
          border-color: rgba(151, 20, 20, 0.56); /* border-white/10 */
          background-color: rgba(255, 255, 255, 0.03); /* bg-white/[0.03] */
        }

        .qc-option-default:hover {
          border-color: rgba(255, 255, 255, 0.2); /* hover:border-white/20 */
          background-color: rgba(255, 255, 255, 0.06); /* hover:bg-white/[0.06] */
        }

        .qc-option-selected {
          border-color: rgb(254, 0, 0); /* border-red-500/60 */
          background-color: rgba(239, 68, 68, 0.1); /* bg-red-500/10 */
        }

        .qc-option-disabled {
          border-color: rgba(255, 255, 255, 0.05); /* border-white/5 */
          background-color: rgba(255, 255, 255, 0.02); /* bg-white/[0.02] */
          opacity: 0.5;
          cursor: not-allowed;
        }

        .qc-option-bar {
          position: absolute;
          inset: 0;
          border-radius: 1rem;
          background-color: rgba(255, 255, 255, 0.02); /* default bar background */
        }

        .qc-option-bar-selected {
          background-color: rgba(239, 68, 68, 0.1); /* bg-red-500/10 */
        }

        .qc-option-content {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          gap: 1rem; /* gap-4 */
        }

        .qc-option-icon {
          font-size: 10px; /* text-[10px] */
          transition: color 0.3s;
        }

        .qc-option-default .qc-option-icon {
          color: rgba(255, 255, 255, 0.2); /* text-white/20 */
        }

        .qc-option-default:hover .qc-option-icon {
          color: rgba(255, 255, 255, 0.4); /* group-hover:text-white/40 */
        }

        .qc-option-selected .qc-option-icon {
          color: #f13333; /* text-red-400 */
        }

        .qc-option-text {
          font-size: 1rem; /* text-base */
          font-weight: 500;
          flex: 1 1 0%; /* flex-1 */
          transition: color 0.3s;
        }

        .qc-option-default .qc-option-text {
          color: rgba(255, 255, 255, 0.7); /* text-white/70 */
        }

        .qc-option-default:hover .qc-option-text {
          color: rgba(255, 255, 255, 0.9); /* group-hover:text-white/90 */
        }

        .qc-option-selected .qc-option-text {
          color: #fff; /* text-white */
        }

        .qc-option-right {
          margin-left: auto;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.125rem; /* gap-0.5 */
          min-width: 4rem; /* min-w-[4rem] */
        }

        .qc-spinner {
          width: 1rem; /* w-4 */
          height: 1rem; /* h-4 */
          border: 2px solid rgba(248, 113, 113, 0.5); /* border-red-400/50 */
          border-top-color: #f80000; /* border-t-red-400 */
          border-radius: 9999px;
          animation: qc-spin 0.8s linear infinite;
        }

        @keyframes qc-spin {
          to { transform: rotate(360deg); }
        }

        .qc-percentage {
          font-size: 0.875rem; /* text-sm */
          font-weight: 700;
          line-height: 1;
        }

        .qc-percentage-selected {
          color: #ff5353; /* text-red-300 */
        }

        .qc-percentage-default {
          color: rgba(255, 255, 255, 0.5); /* text-white/50 */
        }

        .qc-votes {
          font-size: 11px; /* text-[11px] */
          line-height: 1;
        }

        .qc-votes-selected {
          color: rgba(248, 113, 113, 0.7); /* text-red-400/70 */
        }

        .qc-votes-default {
          color: rgba(255, 255, 255, 0.25); /* text-white/25 */
        }

        .qc-next-btn {
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

        .qc-next-btn-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, #b91c1c, #dc2626, #ef4444); /* from-red-700 via-red-600 to-red-500 */
          opacity: 0.9;
          transition: opacity 0.2s;
        }

        .qc-next-btn:hover .qc-next-btn-gradient {
          opacity: 1;
        }

        .qc-next-btn-glow {
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, #b91c1c, #dc2626, #ef4444);
          filter: blur(12px); /* blur-xl */
          opacity: 0.3;
          transition: opacity 0.2s;
        }

        .qc-next-btn:hover .qc-next-btn-glow {
          opacity: 0.5;
        }

        .qc-next-btn-text {
          position: relative;
          z-index: 10;
        }
      `}</style>

      <motion.div
        key={questionIndex}
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -40, scale: 0.95 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="qc-card-wrapper"
      >
        <div className="qc-card">
          {/* Glow accents */}
          <div className="qc-glow-top" />
          <div className="qc-glow-bottom" />

          <div className="qc-card-content">
            {/* Question number badge */}
            <div className="qc-badge">
              <div className="qc-badge-dot" />
              <span className="qc-badge-text">Question {questionIndex + 1}</span>
            </div>

            {/* Question text */}
            <h2 className="qc-question">{question.text}</h2>

            {/* Options */}
            <div className="qc-options-container">
              {question.options.map((option, i) => {
                const isSelected = selected === i;
                const pct = distributions[i];
                const isDisabled = selected !== null && !isSelected;

                // Determine option class
                let optionClass = "qc-option";
                if (isSelected) {
                  optionClass += " qc-option-selected";
                } else if (isDisabled) {
                  optionClass += " qc-option-disabled";
                } else {
                  optionClass += " qc-option-default";
                }

                return (
                  <motion.button
                    key={i}
                    onClick={() => handleSelect(i)}
                    disabled={selected !== null}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                    whileHover={selected === null ? { scale: 1.02, x: 4 } : {}}
                    whileTap={selected === null ? { scale: 0.98 } : {}}
                    className={optionClass}
                  >
                    {/* Poll bar fill behind content */}
                    {answered && (
                      <motion.div
                        className={`qc-option-bar ${isSelected ? "qc-option-bar-selected" : ""}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: i * 0.1 + 0.1, duration: 0.5, ease: "easeOut" }}
                        style={{ originX: 0 }}
                      />
                    )}

                    <div className="qc-option-content">
                      <span className="qc-option-icon">{optionIcons[i]}</span>
                      <span className="qc-option-text">{option}</span>

                      {/* Right side: spinner while loading, then votes + percentage */}
                      <div className="qc-option-right">
                        {isSelected && isSubmitting ? (
                          <div className="qc-spinner" />
                        ) : answered ? (
                          <>
                            <motion.span
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.1 + 0.4 }}
                              className={`qc-percentage ${isSelected ? "qc-percentage-selected" : "qc-percentage-default"}`}
                            >
                              {pct}%
                            </motion.span>
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: i * 0.1 + 0.55 }}
                              className={`qc-votes ${isSelected ? "qc-votes-selected" : "qc-votes-default"}`}
                            >
                              {counts[i]} {counts[i] === 1 ? "vote" : "votes"}
                            </motion.span>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

          </div>
        </div>
      </motion.div>
    </>
  );
}