import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";

export default function SuccessModal({ isOpen, onClose, date, time }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(4px)',
              zIndex: 60
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            style={{
              position: 'fixed',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 70,
              padding: '1.5rem'
            }}
          >
            <div style={{
              backgroundColor: 'white',
              borderRadius: '1.5rem',
              padding: '2rem',
              maxWidth: '24rem',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              position: 'relative'
            }}>
              <button
                onClick={onClose}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  color: '#d6d3d1',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'color 0.2s'
                }}
              >
                <X style={{ width: '1.25rem', height: '1.25rem' }} />
              </button>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", damping: 12 }}
                style={{
                  width: '5rem',
                  height: '5rem',
                  borderRadius: '50%',
                  background: 'linear-gradient(to bottom right, #34d399, #10b981)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.25)'
                }}
              >
                <CheckCircle2 style={{ width: '2.5rem', height: '2.5rem', color: 'white' }} />
              </motion.div>

              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#1c1917',
                letterSpacing: '-0.025em'
              }}>
                Booked Successfully!
              </h3>
              <p style={{
                fontSize: '0.875rem',
                color: '#a8a29e',
                marginTop: '0.5rem',
                lineHeight: '1.6'
              }}>
                Your consultation has been confirmed.
              </p>

              {date && time && (
                <div style={{
                  marginTop: '1.25rem',
                  padding: '1rem',
                  borderRadius: '1rem',
                  backgroundColor: '#fafaf9',
                  border: '1px solid #f5f5f4'
                }}>
                  <p style={{ fontSize: '0.8125rem', color: '#a8a29e' }}>Appointment</p>
                  <p style={{
                    fontSize: '0.9375rem',
                    fontWeight: '600',
                    color: '#44403c',
                    marginTop: '0.25rem'
                  }}>
                    {date} · {time}
                  </p>
                </div>
              )}

              <button
                onClick={onClose}
                style={{
                  marginTop: '1.5rem',
                  width: '100%',
                  padding: '0.875rem',
                  borderRadius: '1rem',
                  backgroundColor: '#1c1917',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
              >
                Done
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}