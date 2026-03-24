import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Phone, Mail, MessageSquare, CheckCircle, X } from "lucide-react";
import TimeSlotPicker from "../TimeSlotPicker/timeSlotPicker";
import SuccessModal from "../SuccessModel/successModel";
import ProfileCard from "../ProfileCard/profileCard";
import { supabase } from "../../supabaseClient";

// Mock format function (replace with actual date-fns if available)
const format = (date, formatStr) => {
  if (!date) return "";
  const d = new Date(date);
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  if (formatStr === "EEEE, MMMM d") {
    return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
  }
  if (formatStr === "MMMM d, yyyy") {
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  }
  if (formatStr === "yyyy-MM-dd") {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
  return d.toDateString();
};



// X icon component (replacing lucide-react)
const XIcon = ({ size = 16, color = "#78716c" }) => (
  <svg
    className="appointment-drawer-x-icon"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// Simple Calendar Component
const SimpleCalendar = ({ selected, onSelect, disabled }) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const isDateDisabled = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    return disabled && disabled(date);
  };

  const isSelected = (day) => {
    if (!selected) return false;
    return (
      selected.getDate() === day &&
      selected.getMonth() === currentMonth &&
      selected.getFullYear() === currentYear
    );
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="appointment-drawer-calendar-component" >
      <div className="appointment-drawer-calendar-header">
        <button onClick={prevMonth} className="appointment-drawer-calendar-nav-button">&lt;</button>
        <span className="appointment-drawer-calendar-month">
          {monthNames[currentMonth]} {currentYear}
        </span>
        <button onClick={nextMonth} className="appointment-drawer-calendar-nav-button">&gt;</button>
      </div>

      <div className="appointment-drawer-calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="appointment-drawer-calendar-day-header">{day}</div>
        ))}

        {Array.from({ length: firstDayOfMonth }, (_, i) => (
          <div key={`empty-${i}`} className="appointment-drawer-calendar-empty-day"></div>
        ))}

        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
          const date = new Date(currentYear, currentMonth, day);
          const isDisabled = isDateDisabled(day);
          const isSelectedDay = isSelected(day);

          return (
            <button
              key={day}
              onClick={() => !isDisabled && onSelect(date)}
              disabled={isDisabled}
              className={`appointment-drawer-calendar-day ${isSelectedDay ? 'appointment-drawer-calendar-day--selected' : ''
                } ${isDisabled ? 'appointment-drawer-calendar-day--disabled' : ''
                }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default function AppointmentDrawer({ isOpen, onClose }) {
  const [selectedDate, setSelectedDate] = useState(undefined);
  const [selectedPeriod, setSelectedPeriod] = useState("morning");
  const [selectedTime, setSelectedTime] = useState("");
  const [showFormPopup, setShowFormPopup] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [formErrors, setFormErrors] = useState({});
  const [bookedSlots, setBookedSlots] = useState([]);

  const API_BASE = "http://localhost:5000/api";

  const autoCloseTimeoutRef = useRef(null);
  useEffect(() => {
    return () => {
      if (autoCloseTimeoutRef.current) {
        clearTimeout(autoCloseTimeoutRef.current);
      }
    };
  }, []);

  // Convert 12-hour display time to 24-hour format for API
  const to24Hour = (time12) => {
    const [time, period] = time12.split(' ');
    let [h, m] = time.split(':').map(Number);
    if (period === 'PM' && h !== 12) h += 12;
    if (period === 'AM' && h === 12) h = 0;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  // Fetch booked slots whenever selectedDate changes
  useEffect(() => {
    if (!selectedDate) return;
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    fetch(`${API_BASE}/consultation/slots?date=${dateStr}`)
      .then(res => res.json())
      .then(data => setBookedSlots(data.bookedSlots || []))
      .catch(err => console.error('Failed to fetch slots:', err));
  }, [selectedDate]);

  // Check if a display time is already booked
  const isSlotBooked = (displayTime) => bookedSlots.includes(to24Hour(displayTime));

  // Prefill form with Google auth session data
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setFormData(prev => ({
          ...prev,
          name: session.user.user_metadata?.full_name || prev.name,
          email: session.user.email || prev.email,
        }));
      }
    };
    getSession();
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) errors.email = 'Enter a valid email address';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    else if (!/^[+]?[\d\s()-]{7,15}$/.test(formData.phone.trim())) errors.phone = 'Enter a valid phone number';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleContinue = () => {
    if (!selectedDate || !selectedTime) return;
    setShowFormPopup(true);
    setBookingError(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsBooking(true);
    setBookingError(null);
    try {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const timeStr = to24Hour(selectedTime);

      const response = await fetch(`${API_BASE}/consultation/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          message: formData.message.trim(),
          date: dateStr,
          time: timeStr,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to book consultation');
      }

      setShowFormPopup(false);
      setShowSuccess(true);
      autoCloseTimeoutRef.current = setTimeout(() => {
        handleSuccessClose();
      }, 5000);
    } catch (err) {
      console.error('Booking error:', err);
      setBookingError(err.message || 'Failed to book. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  const handleSuccessClose = () => {
    if (autoCloseTimeoutRef.current) {
      clearTimeout(autoCloseTimeoutRef.current);
      autoCloseTimeoutRef.current = null;
    }
    setShowSuccess(false);
    setShowFormPopup(false);
    setSelectedDate(undefined);
    setSelectedTime("");
    setSelectedPeriod("morning");
    setFormData({ name: '', phone: '', email: '', message: '' });
    setBookingError(null);
    onClose();
  };

  const canContinue = selectedDate && selectedTime;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={onClose}
              className="appointment-drawer-backdrop"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="appointment-drawer"
            >
              {/* Header */}
              <div className="appointment-drawer-header">
                <div>
                  <h2 className="appointment-drawer-title">Book Appointment</h2>
                  <p className="appointment-drawer-subtitle">Select your preferred date & time</p>
                </div>
                <button
                  onClick={onClose}
                  className="appointment-drawer-close-button"
                >
                  <XIcon />
                </button>
              </div>

              {/* Content */}
              <div className="appointment-drawer-content">
                {/* Profile */}
                <ProfileCard />

                {/* Calendar */}
                <div className="appointment-drawer-calendar-section">
                  <p className="appointment-drawer-section-label">Select Date</p>
                  <div className="appointment-drawer-calendar-container">
                    <SimpleCalendar
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    />
                  </div>
                </div>

                {/* Time Slots */}
                <TimeSlotPicker
                  selectedPeriod={selectedPeriod}
                  onPeriodChange={setSelectedPeriod}
                  selectedTime={selectedTime}
                  onTimeChange={setSelectedTime}
                  isSlotBooked={isSlotBooked}
                />
              </div>

              {/* Footer */}
              <div className="appointment-drawer-footer">
                {selectedDate && selectedTime && (
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="appointment-drawer-selected-datetime"
                  >
                    {format(selectedDate, "EEEE, MMMM d")} · {selectedTime}
                  </motion.p>
                )}
                <button
                  onClick={handleContinue}
                  disabled={!canContinue || isBooking}
                  className={`appointment-drawer-continue-button ${canContinue
                    ? 'appointment-drawer-continue-button--active'
                    : 'appointment-drawer-continue-button--disabled'
                    }`}
                >
                  {isBooking ? (
                    <span className="appointment-drawer-booking-loader">
                      <svg className="appointment-drawer-spinner" viewBox="0 0 24 24">
                        <circle
                          className="appointment-drawer-spinner-circle"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="appointment-drawer-spinner-path"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Booking...
                    </span>
                  ) : (
                    "Continue"
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}

        {/* Form Popup Modal */}
        {showFormPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)',
              zIndex: 10000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem'
            }}
            onClick={() => setShowFormPopup(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={e => e.stopPropagation()}
              style={{
                backgroundColor: 'white',
                borderRadius: '1.5rem',
                padding: '2rem',
                maxWidth: '480px',
                width: '100%',
                position: 'relative',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <button
                onClick={() => setShowFormPopup(false)}
                style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', padding: 4, borderRadius: 8, display: 'flex', opacity: 0.5, transition: 'opacity 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                onMouseLeave={e => e.currentTarget.style.opacity = '0.5'}
              >
                <X size={20} />
              </button>

              <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', background: 'linear-gradient(135deg, #ef4444, #dc2626)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <User size={24} color="#fff" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111', marginBottom: 4 }}>Complete Your Booking</h3>
              <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '1.5rem' }}>
                {format(selectedDate, "EEEE, MMMM d")} at {selectedTime}
              </p>

              <form onSubmit={handleFormSubmit} style={{ width: '100%' }}>
                {/* Name */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', fontWeight: 600, marginBottom: 6, opacity: 0.8, color: '#333' }}>
                    <User size={15} /> Full Name <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="Enter your full name"
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: 12,
                      border: formErrors.name ? '1.5px solid #ef4444' : '1.5px solid rgba(150,150,150,0.2)',
                      background: 'rgba(0,0,0,0.02)', fontSize: '0.95rem', outline: 'none',
                      transition: 'border-color 0.3s, box-shadow 0.3s', boxSizing: 'border-box',
                      color: '#111'
                    }}
                    onFocus={e => { e.target.style.borderColor = '#ef4444'; e.target.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.1)'; }}
                    onBlur={e => { if (!formErrors.name) { e.target.style.borderColor = 'rgba(150,150,150,0.2)'; e.target.style.boxShadow = 'none'; } }}
                  />
                  {formErrors.name && <p style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: 4 }}>{formErrors.name}</p>}
                </div>

                {/* Phone */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', fontWeight: 600, marginBottom: 6, opacity: 0.8, color: '#333' }}>
                    <Phone size={15} /> Phone Number <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    placeholder="+971 50 123 4567"
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: 12,
                      border: formErrors.phone ? '1.5px solid #ef4444' : '1.5px solid rgba(150,150,150,0.2)',
                      background: 'rgba(0,0,0,0.02)', fontSize: '0.95rem', outline: 'none',
                      transition: 'border-color 0.3s, box-shadow 0.3s', boxSizing: 'border-box',
                      color: '#111'
                    }}
                    onFocus={e => { e.target.style.borderColor = '#ef4444'; e.target.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.1)'; }}
                    onBlur={e => { if (!formErrors.phone) { e.target.style.borderColor = 'rgba(150,150,150,0.2)'; e.target.style.boxShadow = 'none'; } }}
                  />
                  {formErrors.phone && <p style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: 4 }}>{formErrors.phone}</p>}
                </div>

                {/* Email */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', fontWeight: 600, marginBottom: 6, opacity: 0.8, color: '#333' }}>
                    <Mail size={15} /> Email Address <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    placeholder="your@email.com"
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: 12,
                      border: formErrors.email ? '1.5px solid #ef4444' : '1.5px solid rgba(150,150,150,0.2)',
                      background: 'rgba(0,0,0,0.02)', fontSize: '0.95rem', outline: 'none',
                      transition: 'border-color 0.3s, box-shadow 0.3s', boxSizing: 'border-box',
                      color: '#111'
                    }}
                    onFocus={e => { e.target.style.borderColor = '#ef4444'; e.target.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.1)'; }}
                    onBlur={e => { if (!formErrors.email) { e.target.style.borderColor = 'rgba(150,150,150,0.2)'; e.target.style.boxShadow = 'none'; } }}
                  />
                  {formErrors.email && <p style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: 4 }}>{formErrors.email}</p>}
                </div>

                {/* Message */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', fontWeight: 600, marginBottom: 6, opacity: 0.8, color: '#333' }}>
                    <MessageSquare size={15} /> Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleFormChange}
                    placeholder="Tell us about your consultation needs..."
                    rows={3}
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: 12,
                      border: '1.5px solid rgba(150,150,150,0.2)',
                      background: 'rgba(0,0,0,0.02)', fontSize: '0.95rem', outline: 'none',
                      transition: 'border-color 0.3s, box-shadow 0.3s', resize: 'vertical',
                      fontFamily: 'inherit', boxSizing: 'border-box', minHeight: '80px',
                      color: '#111'
                    }}
                    onFocus={e => { e.target.style.borderColor = '#ef4444'; e.target.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.1)'; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(150,150,150,0.2)'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>

                {/* Error Message */}
                {bookingError && (
                  <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: 12, textAlign: 'center', background: 'rgba(239,68,68,0.08)', padding: '8px 12px', borderRadius: 8 }}>{bookingError}</p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isBooking}
                  style={{
                    width: '100%', padding: '14px 24px', borderRadius: 14, border: 'none',
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: '#fff',
                    fontSize: '1rem', fontWeight: 700, cursor: isBooking ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    boxShadow: '0 8px 24px -4px rgba(239,68,68,0.35)', transition: 'all 0.3s',
                    opacity: isBooking ? 0.7 : 1,
                  }}
                >
                  {isBooking ? (
                    <><span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} /> Submitting...</>
                  ) : (
                    <><CheckCircle size={18} /> Submit Booking</>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <SuccessModal
        isOpen={showSuccess}
        onClose={handleSuccessClose}
        date={selectedDate ? format(selectedDate, "EEEE, MMMM d") : ""}
        time={selectedTime}
        formData={formData}
      />
    </>
  );
}