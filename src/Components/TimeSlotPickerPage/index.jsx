import React from "react";
import { Sun, CloudSun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const periods = [
  {
    key: "morning",
    label: "Morning",
    icon: Sun,
    slots: ["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM"],
  },
  {
    key: "afternoon",
    label: "Afternoon",
    icon: CloudSun,
    slots: ["12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM"],
  },
  {
    key: "evening",
    label: "Evening",
    icon: Moon,
    slots: ["4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM", "6:00 PM"],
  },
];

export default function TimeSlotPickerPage({ selectedSlot, onSelectSlot, bookedSlots = [] }) {
  return (
    <>
      <style>{`
        /* TimeSlotPicker.css - internal styles */

        .tsp-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .tsp-period {
          /* No extra styles, just a wrapper */
        }

        .tsp-period-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .tsp-icon-wrapper {
          width: 1.75rem;
          height: 1.75rem;
          border-radius: 0.5rem; /* rounded-lg */
          background-color: rgba(255, 255, 255, 0.1); /* white/10 */
          border: 1px solid rgba(255, 255, 255, 0.15); /* white/15 */
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .tsp-icon {
          width: 0.875rem;
          height: 0.875rem;
          color: #f87171; /* red-400 */
        }

        .tsp-period-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.8); /* white/80 */
        }

        .tsp-slots-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 0.5rem;
        }

        /* Base slot button */
        .tsp-slot {
          padding: 0.625rem 0.75rem; /* py-2.5 px-3 */
          border-radius: 0.75rem; /* rounded-xl */
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.2s;
          border: none;
          cursor: pointer;
          text-align: center;
        }

        /* Booked slot */
        .tsp-slot-booked {
          background-color: rgba(255, 255, 255, 0.05); /* white/5 */
          color: rgba(255, 255, 255, 0.15); /* white/15 */
          text-decoration: line-through;
          border: 1px solid rgba(255, 255, 255, 0.05); /* white/5 */
          cursor: not-allowed;
        }

        /* Selected slot */
        .tsp-slot-selected {
          background-color: #dc2626; /* red-600 */
          color: #fff;
          box-shadow: 0 10px 15px -3px rgba(127, 29, 29, 0.5); /* shadow-lg shadow-red-900/50 */
          transform: scale(1.04);
          border: 1px solid rgba(239, 68, 68, 0.5); /* red-500/50 */
        }

        /* Available slot (default) */
        .tsp-slot-available {
          background-color: rgba(255, 255, 255, 0.06); /* white/6 (matching inline style) */
          color: rgba(255, 255, 255, 0.6); /* white/60 */
          border: 1px solid rgba(255, 255, 255, 0.1); /* white/10 */
        }
        .tsp-slot-available:hover {
          background-color: rgba(255, 255, 255, 0.15); /* hover:bg-white/15 */
          color: #fff;
          border-color: rgba(255, 255, 255, 0.2); /* hover:border-white/20 */
          transform: scale(1.02);
        }
      `}</style>

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="tsp-container"
        >
          {periods.map((period) => {
            const Icon = period.icon;
            return (
              <div key={period.key} className="tsp-period">
                {/* Period Header */}
                <div className="tsp-period-header">
                  <div className="tsp-icon-wrapper">
                    <Icon className="tsp-icon" />
                  </div>
                  <span className="tsp-period-label">{period.label}</span>
                </div>

                {/* Slots */}
                <div className="tsp-slots-grid">
                  {period.slots.map((slot) => {
                    const isBooked = bookedSlots.includes(slot);
                    const isSelected = selectedSlot === slot;

                    // Determine class based on state
                    let slotClass = "tsp-slot";
                    if (isBooked) {
                      slotClass += " tsp-slot-booked";
                    } else if (isSelected) {
                      slotClass += " tsp-slot-selected";
                    } else {
                      slotClass += " tsp-slot-available";
                    }

                    return (
                      <button
                        key={slot}
                        disabled={isBooked}
                        onClick={() => onSelectSlot(isSelected ? null : slot, period.key)}
                        className={slotClass}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </>
  );
}