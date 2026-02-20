import React, { useState, useEffect } from "react";
// import { base44 } from "@/api/base44Client";
import { ArrowRight, Loader2, CalendarCheck } from "lucide-react";
// import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import ConsultantProfile from "../../Components/ConsultantProfile";
import CalendarPicker from "../../Components/CalenderPicker";
import TimeSlotPickerPage from "../../Components/TimeSlotPickerPage";
import BookingSuccessModal from "../../Components/BookingSuccessModal";
// import moment from "moment";

export default function BookAppointment() {

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Simulate fetching booked slots (demo only)
  useEffect(() => {
    if (!selectedDate) return;
    // For demo, just clear booked slots or set a fake one
    setBookedSlots(selectedDate === '2026-02-22' ? ['10:00 AM'] : []);
  }, [selectedDate]);

  const handleSelectSlot = (slot, period) => {
    setSelectedSlot(slot);
    setSelectedPeriod(period);
  };

  // Simulate booking (no auth, no API)
  const handleContinue = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowSuccess(true);
      // Add the slot to bookedSlots for this session (demo only)
      setBookedSlots((prev) => [...prev, selectedSlot]);
    }, 1000);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    setSelectedDate(null);
    setSelectedSlot(null);
    setSelectedPeriod(null);
  };

  const canContinue = selectedDate && selectedSlot;

  return (
    <>
      <style>{`
        /* BookAppointment.css - internal styles */

        .ba-container {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
        }

        /* Background layers */
        .ba-bg-image {
          position: fixed;
          inset: 0;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          background-image: url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80&fit=crop');
        }
        .ba-overlay-dark {
          position: fixed;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.7);
        }
        .ba-overlay-gradient {
          position: fixed;
          inset: 0;
          background: linear-gradient(to bottom right, rgba(127, 29, 29, 0.4), transparent, rgba(0, 0, 0, 0.6));
        }
        .ba-glow-top {
          position: fixed;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 600px;
          height: 16rem;
          background-color: rgba(220, 38, 38, 0.2);
          border-radius: 9999px;
          filter: blur(48px);
          pointer-events: none;
        }
        .ba-glow-bottom {
          position: fixed;
          bottom: 0;
          right: 0;
          width: 24rem;
          height: 24rem;
          background-color: rgba(153, 27, 27, 0.15);
          border-radius: 9999px;
          filter: blur(48px);
          pointer-events: none;
        }

        /* Content wrapper */
        .ba-content {
          position: relative;
          z-index: 10;
          max-width: 72rem;
          margin-left: auto;
          margin-right: auto;
          padding-left: 1rem;
          padding-right: 1rem;
          padding-top: 2.5rem;
          padding-bottom: 2.5rem;
        }
        @media (min-width: 640px) {
          .ba-content {
            padding-left: 1.5rem;
            padding-right: 1.5rem;
            padding-top: 4rem;
            padding-bottom: 4rem;
          }
        }

        /* Header section */
        .ba-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }
        @media (min-width: 640px) {
          .ba-header {
            margin-bottom: 3.5rem;
          }
        }
        .ba-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background-color: rgba(220, 38, 38, 0.2);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #fca5a5;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          margin-bottom: 1.25rem;
          backdrop-filter: blur(4px);
        }
        .ba-title {
          font-size: 2.25rem;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.025em;
          text-shadow: 0 4px 6px rgba(0,0,0,0.3);
        }
        @media (min-width: 640px) {
          .ba-title {
            font-size: 3rem;
          }
        }
        .ba-subtitle {
          color: rgba(255,255,255,0.6);
          margin-top: 1rem;
          max-width: 28rem;
          margin-left: auto;
          margin-right: auto;
          font-size: 0.875rem;
        }
        @media (min-width: 640px) {
          .ba-subtitle {
            font-size: 1rem;
          }
        }
        .ba-decor-line {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          margin-top: 1.5rem;
        }
        .ba-line-left {
          height: 1px;
          width: 4rem;
          background: linear-gradient(to right, transparent, rgba(239,68,68,0.6));
        }
        .ba-dot {
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 9999px;
          background-color: #ef4444;
        }
        .ba-line-right {
          height: 1px;
          width: 4rem;
          background: linear-gradient(to left, transparent, rgba(239,68,68,0.6));
        }

        /* Main grid */
        .ba-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        @media (min-width: 1024px) {
          .ba-grid {
            grid-template-columns: repeat(12, minmax(0, 1fr));
            gap: 1.75rem;
          }
        }

        /* Card styles */
        .ba-card {
          background-color: rgba(255,255,255,0.1);
          backdrop-filter: blur(24px);
          border-radius: 1.5rem;
          border: 1px solid rgba(255,255,255,0.2);
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
          padding: 1.5rem;
        }
        @media (min-width: 640px) {
          .ba-card {
            padding: 2rem;
          }
        }
        .ba-card-sticky {
          position: sticky;
          top: 2rem;
        }

        /* Step indicators */
        .ba-step {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }
        .ba-step-number {
          width: 2rem;
          height: 2rem;
          border-radius: 0.75rem;
          background-color: #dc2626;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 15px -3px rgba(127,29,29,0.4);
        }
        .ba-step-number span {
          font-size: 0.875rem;
          font-weight: 700;
          color: #fff;
        }
        .ba-step-title {
          font-size: 1rem;
          font-weight: 600;
          color: #fff;
        }

        /* Date selection info */
        .ba-date-info {
          margin-top: 1.25rem;
          padding-top: 1.25rem;
          border-top: 1px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          color: #fca5a5;
          font-size: 0.875rem;
          font-weight: 500;
        }

        /* Placeholder when no date selected */
        .ba-time-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding-top: 4rem;
          padding-bottom: 4rem;
          text-align: center;
        }
        .ba-placeholder-icon {
          width: 4rem;
          height: 4rem;
          border-radius: 1rem;
          background-color: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
        }
        .ba-placeholder-icon svg {
          width: 1.75rem;
          height: 1.75rem;
          color: rgba(255,255,255,0.2);
        }
        .ba-placeholder-text-main {
          font-size: 0.875rem;
          color: rgba(255,255,255,0.4);
          font-weight: 500;
        }
        .ba-placeholder-text-sub {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.25);
          margin-top: 0.25rem;
        }

        /* Continue button */
        .ba-button-wrapper {
          margin-top: 2.5rem;
          display: flex;
          justify-content: center;
        }
        .ba-button {
          height: 3.5rem;
          padding-left: 3rem;
          padding-right: 3rem;
          border-radius: 1rem;
          font-size: 1rem;
          font-weight: 700;
          transition: all 0.3s;
          border: none;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .ba-button-enabled {
          background-color: #dc2626;
          color: #fff;
          box-shadow: 0 25px 50px -12px rgba(127,29,29,0.6);
          border: 1px solid rgba(239,68,68,0.5);
        }
        .ba-button-enabled:hover {
          background-color: #b91c1c;
          box-shadow: 0 25px 50px -12px rgba(127,29,29,0.8);
          transform: translateY(-0.25rem);
        }
        .ba-button-disabled {
          background-color: rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.3);
          cursor: not-allowed;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .ba-button-loading {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .ba-spinner {
          animation: spin 1s linear infinite;
          width: 1.25rem;
          height: 1.25rem;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .ba-button-text {
          display: flex;
          align-items: center;
        }
        .ba-icon-right {
          margin-left: 0.5rem;
          width: 1.25rem;
          height: 1.25rem;
        }
        .ba-note {
          text-align: center;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.35);
          margin-top: 0.75rem;
        }

        /* Grid column spans */
        .ba-col-span-3 {
          grid-column: span 1 / span 1;
        }
        @media (min-width: 1024px) {
          .ba-col-span-3 {
            grid-column: span 3 / span 3;
          }
        }
        .ba-col-span-5 {
          grid-column: span 1 / span 1;
        }
        @media (min-width: 1024px) {
          .ba-col-span-5 {
            grid-column: span 5 / span 5;
          }
        }
        .ba-col-span-4 {
          grid-column: span 1 / span 1;
        }
        @media (min-width: 1024px) {
          .ba-col-span-4 {
            grid-column: span 4 / span 4;
          }
        }

        /* Utility overrides for icons inside buttons, etc. */
        .ba-icon-small {
          width: 0.875rem;
          height: 0.875rem;
        }
        .ba-icon-medium {
          width: 1rem;
          height: 1rem;
        }
      `}</style>

      <div className="ba-container">
        {/* Background layers */}
        <div className="ba-bg-image" />
        <div className="ba-overlay-dark" />
        <div className="ba-overlay-gradient" />
        <div className="ba-glow-top" />
        <div className="ba-glow-bottom" />

        <div className="ba-content">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="ba-header"
          >
            <div className="ba-badge">
              <CalendarCheck className="ba-icon-small" />
              Book a Consultation
            </div>
            <h1 className="ba-title">Schedule Your Session</h1>
            <p className="ba-subtitle">
              Choose a convenient date and time for your personalized consultation
            </p>
            <div className="ba-decor-line">
              <div className="ba-line-left" />
              <div className="ba-dot" />
              <div className="ba-line-right" />
            </div>
          </motion.div>

          {/* Main Grid */}
          <div className="ba-grid">
            {/* Left: Consultant Profile */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="ba-col-span-3"
            >
              <div className="ba-card ba-card-sticky">
                <ConsultantProfile />
              </div>
            </motion.div>

            {/* Center: Calendar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="ba-col-span-5"
            >
              <div className="ba-card">
                <div className="ba-step">
                  <div className="ba-step-number">
                    <span>1</span>
                  </div>
                  <h3 className="ba-step-title">Select a Date</h3>
                </div>
                <CalendarPicker
                  selectedDate={selectedDate}
                  onSelectDate={(d) => {
                    setSelectedDate(d);
                    setSelectedSlot(null);
                    setSelectedPeriod(null);
                  }}
                />
                {selectedDate && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="ba-date-info"
                  >
                    <CalendarCheck className="ba-icon-medium" />
                    {(selectedDate).format("dddd, MMMM D")}
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Right: Time Slots */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="ba-col-span-4"
            >
              <div className="ba-card">
                <div className="ba-step">
                  <div className="ba-step-number">
                    <span>2</span>
                  </div>
                  <h3 className="ba-step-title">Pick a Time</h3>
                </div>

                {selectedDate ? (
                  <TimeSlotPickerPage
                    selectedSlot={selectedSlot}
                    onSelectSlot={handleSelectSlot}
                    bookedSlots={bookedSlots}
                  />
                ) : (
                  <div className="ba-time-placeholder">
                    <div className="ba-placeholder-icon">
                      <CalendarCheck />
                    </div>
                    <p className="ba-placeholder-text-main">Select a date first</p>
                    <p className="ba-placeholder-text-sub">Available time slots will appear here</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Continue Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="ba-button-wrapper"
          >
            <button
              onClick={handleContinue}
              disabled={!canContinue || loading}
              className={`ba-button ${canContinue && !loading ? 'ba-button-enabled' : 'ba-button-disabled'}`}
            >
              {loading ? (
                <span className="ba-button-loading">
                  <Loader2 className="ba-spinner" />
                  Confirming...
                </span>
              ) : (
                <span className="ba-button-text">
                  Continue to Book
                  <ArrowRight className="ba-icon-right" />
                </span>
              )}
            </button>
          </motion.div>

          {canContinue && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="ba-note"
            >
              You'll be asked to sign in if you haven't already
            </motion.p>
          )}
        </div>

        <BookingSuccessModal
          open={showSuccess}
          onClose={handleCloseSuccess}
          date={selectedDate}
          timeSlot={selectedSlot}
        />
      </div>
    </>
  );
}