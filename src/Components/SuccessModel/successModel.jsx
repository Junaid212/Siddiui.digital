import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X, User, Phone, Mail, Calendar } from "lucide-react";

export default function SuccessModal({ isOpen, onClose, date, time, formData }) {
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
              zIndex: 9999
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
              zIndex: 10000,
              padding: '1.5rem',
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
              position: 'relative',
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
                  border: '1px solid #f5f5f4',
                  textAlign: 'left'
                }}>
                  <p style={{ fontSize: '0.8125rem', color: '#a8a29e', marginBottom: '0.75rem', textAlign: 'center' }}>Appointment Details</p>

                  {formData && (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <User size={16} style={{ color: '#10b981' }} />
                        <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#44403c' }}>{formData.name}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <Phone size={16} style={{ color: '#10b981' }} />
                        <span style={{ fontSize: '0.9rem', color: '#44403c' }}>{formData.phone}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <Mail size={16} style={{ color: '#10b981' }} />
                        <span style={{ fontSize: '0.9rem', color: '#44403c' }}>{formData.email}</span>
                      </div>
                    </>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: formData ? 8 : 0, paddingTop: formData ? 8 : 0, borderTop: formData ? '1px solid #e5e7eb' : 'none' }}>
                    <Calendar size={16} style={{ color: '#10b981' }} />
                    <span style={{
                      fontSize: '0.9375rem',
                      fontWeight: '600',
                      color: '#44403c',
                    }}>
                      {date} · {time}
                    </span>
                  </div>
                </div>
              )}

              {formData?.email && (
                <div style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: '#ecfdf5', border: '1px solid #d1fae5', textAlign: 'center' }}>
                  <p style={{ fontSize: '0.85rem', color: '#065f46', marginBottom: 2 }}>📧 Confirmation email sent</p>
                  <p style={{ fontSize: '0.75rem', color: '#047857' }}>A confirmation with booking details has been sent to <strong>{formData.email}</strong></p>
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