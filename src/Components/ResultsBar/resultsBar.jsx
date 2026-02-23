import React from "react";
import { motion } from "framer-motion";

export default function ResultsBar({ label, percentage, index, isSelected, delay }) {
  return (
    <>
      <style>{`
        .rb-container {
          margin-bottom: 0.75rem; /* mb-3 */
        }
        .rb-container:last-child {
          margin-bottom: 0; /* last:mb-0 */
        }

        .rb-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.375rem; /* mb-1.5 */
        }

        .rb-label {
          font-size: 0.875rem; /* text-sm */
          font-weight: 500; /* font-medium */
        }
        .rb-label-selected {
          color: #fff; /* text-white */
        }
        .rb-label-default {
          color: rgba(255, 255, 255, 0.6); /* text-white/60 */
        }

        .rb-checkmark {
          margin-left: 0.5rem; /* ml-2 */
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 1.25rem; /* w-5 */
          height: 1.25rem; /* h-5 */
          border-radius: 9999px; /* rounded-full */
          background-color: rgba(255, 255, 255, 0.2); /* bg-white/20 */
          font-size: 10px; /* text-[10px] */
        }

        .rb-percentage {
          font-size: 0.875rem; /* text-sm */
          font-weight: 700; /* font-bold */
        }
        .rb-percentage-selected {
          color: #fff; /* text-white */
        }
        .rb-percentage-default {
          color: rgba(255, 255, 255, 0.5); /* text-white/50 */
        }

        .rb-track {
          height: 0.625rem; /* h-2.5 */
          background-color: rgba(255, 255, 255, 0.05); /* bg-white/5 */
          border-radius: 9999px;
          overflow: hidden;
        }

        .rb-bar {
          height: 100%;
          border-radius: 9999px;
        }
        .rb-bar-0 {
          background: linear-gradient(to right, #8b5cf6, #9333ea); /* from-violet-500 to-purple-600 */
        }
        .rb-bar-1 {
          background: linear-gradient(to right, #3b82f6, #06b6d4); /* from-blue-500 to-cyan-500 */
        }
        .rb-bar-2 {
          background: linear-gradient(to right, #ec4899, #f43f5e); /* from-pink-500 to-rose-500 */
        }
        .rb-bar-3 {
          background: linear-gradient(to right, #fbbf24, #f97316); /* from-amber-400 to-orange-500 */
        }
        .rb-bar-selected {
          opacity: 1;
        }
        .rb-bar-default {
          opacity: 0.4;
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay, duration: 0.4, ease: "easeOut" }}
        className="rb-container"
      >
        <div className="rb-header">
          <span className={`rb-label ${isSelected ? "rb-label-selected" : "rb-label-default"}`}>
            {label}
            {isSelected && (
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rb-checkmark"
              >
                ✓
              </motion.span>
            )}
          </span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.3 }}
            className={`rb-percentage ${isSelected ? "rb-percentage-selected" : "rb-percentage-default"}`}
          >
            {percentage}%
          </motion.span>
        </div>
        <div className="rb-track">
          <motion.div
            className={`rb-bar rb-bar-${index} ${isSelected ? "rb-bar-selected" : "rb-bar-default"}`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ delay: delay + 0.1, duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </motion.div>
    </>
  );
}