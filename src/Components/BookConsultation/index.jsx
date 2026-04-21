import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Star, Award, Users, CheckCircle, X, ChevronLeft, ChevronRight, MapPin, Briefcase, GraduationCap, Phone, User, MessageSquare, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../supabaseClient';

export default function BookConsultation() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showFormPopup, setShowFormPopup] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [formErrors, setFormErrors] = useState({});
  const [user, setUser] = useState(null);
  const [signingIn, setSigningIn] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);

  const API_BASE = "http://localhost:5000/api";

  // Auth logic (shared pattern)
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata?.full_name || session.user.email,
          email: session.user.email,
        });
        setFormData(prev => ({
          ...prev,
          name: session.user.user_metadata?.full_name || prev.name,
          email: session.user.email || prev.email
        }));
      }
    };
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata?.full_name || session.user.email,
          email: session.user.email,
        });
        setFormData(prev => ({
          ...prev,
          name: session.user.user_metadata?.full_name || prev.name,
          email: session.user.email || prev.email
        }));
      } else {
        setUser(null);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    setSigningIn(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.href,
        },
      });
      if (error) throw error;
    } catch (err) {
      console.error('Sign-in error:', err);
      setBookingError('Sign-in failed. Please try again.');
    } finally {
      setSigningIn(false);
    }
  };

  const consultant = {
    name: "Muhammad.Q.Siddiqui",
    title: " Head of Marketing, Ajman University",
    photo: "https://siddiqui.digital/wp-content/uploads/2021/12/my-pic-8.jpg",
    rating: 4.9,
    reviews: 127,
    experience: "39 years",
    location: "New York, NY",
    education: "Harvard Business School",
    bio: "Helping entrepreneurs and students unlock their full potential through strategic planning, market analysis, and growth optimization. Specialized in marketing and business management.",
    specialties: ["Business Analyst", "Marketeer", "Educationist", "Motivational Speaker", "Researcher", "Entrepreneur"],
    stats: { clients: "15+", sessions: "200+", satisfaction: "98%" }
  };

  const timeSlots = {
    morning: ["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM"],
    afternoon: ["1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM"],
    evening: ["5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM"]
  };

  // Convert 12-hour display time to 24-hour format for API comparison
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
    const dateStr = selectedDate.toISOString().split('T')[0];
    fetch(`${API_BASE}/consultation/slots?date=${dateStr}`)
      .then(res => res.json())
      .then(data => setBookedSlots(data.bookedSlots || []))
      .catch(err => console.error('Failed to fetch slots:', err));
  }, [selectedDate]);

  // Check if a display time is booked (compare in 24h format)
  const isSlotBooked = (displayTime) => bookedSlots.includes(to24Hour(displayTime));

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const isDateDisabled = (date) => {
    if (!date) return true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today || date.getDay() === 0 || date.getDay() === 6;
  };

  const formatDate = (date) => {
    return date?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

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

  const handleContinue = () => {
    if (!selectedDate || !selectedTime) return;

    // Require Google Auth before showing the form
    if (!user) {
      handleGoogleSignIn();
      return;
    }

    setShowFormPopup(true);
    setBookingError(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setBookingLoading(true);
    setBookingError(null);
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const timeStr = to24Hour(selectedTime);

      const response = await fetch(`${API_BASE}/consultation/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || null,
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
    } catch (err) {
      console.error('Booking error:', err);
      setBookingError(err.message || 'Failed to book. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <>

      <div className="bc-container aspire-book-page">
        {/* Header */}
        {/* <div className="bc-header">
          <div className="bc-header-inner">
            <div className="bc-logo">
              <div className="bc-logo-icon">
                <Calendar />
              </div>
              <span className="bc-logo-text">ConsultPro</span>
            </div>
            <button className="bc-signin-btn">Sign In</button>
          </div>
        </div> */}

        <div className="bc-main">
          <div className="bc-grid">
            {/* Consultant Profile - Left Side */}
            <div className="bc-profile-col">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bc-profile-card"
              >
                {/* Profile Header */}
                <div className="bc-profile-header">
                  <div className="bc-profile-header-pattern"></div>
                </div>

                <div className="bc-profile-content">
                  <div className="bc-profile-avatar-wrapper">
                    <div className="bc-profile-avatar">
                      <img
                        src={consultant.photo}
                        alt={consultant.name}
                        className="bc-profile-img"
                      />
                      <div className="bc-profile-online"></div>
                    </div>

                    <h1 className="bc-profile-name">{consultant.name}</h1>
                    <p className="bc-profile-title">{consultant.title}</p>

                    <div className="bc-profile-rating">
                      {/* <Star className="bc-star" /> */}
                      {/* <span className="bc-rating-value">{consultant.rating}</span> */}
                      {/* <span className="bc-rating-count">({consultant.reviews} reviews)</span> */}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="bc-stats-grid">
                    <div className="bc-stat-item">
                      <p className="bc-stat-value">{consultant.stats.clients}</p>
                      <p className="bc-stat-label">Certifications</p>
                    </div>
                    <div className="bc-stat-item bc-stat-border">
                      <p className="bc-stat-value">{consultant.stats.sessions}</p>
                      <p className="bc-stat-label">Sessions</p>
                    </div>
                    <div className="bc-stat-item">
                      <p className="bc-stat-value">{consultant.stats.satisfaction}</p>
                      <p className="bc-stat-label">Satisfaction</p>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="bc-info-list">
                    <div className="bc-info-item">
                      <div className="bc-info-icon">
                        <Briefcase />
                      </div>
                      <span className="bc-info-text">{consultant.experience} experience</span>
                    </div>
                    {/* <div className="bc-info-item">
                      <div className="bc-info-icon">
                        <MapPin />
                      </div>
                      <span className="bc-info-text">{consultant.location}</span>
                    </div>
                    <div className="bc-info-item">
                      <div className="bc-info-icon">
                        <GraduationCap />
                      </div>
                      <span className="bc-info-text">{consultant.education}</span>
                    </div> */}
                  </div>

                  {/* Bio */}
                  <p className="bc-bio">{consultant.bio}</p>

                  {/* Specialties */}
                  <div className="bc-specialties">
                    <p className="bc-specialties-title">Specialties</p>
                    <div className="bc-specialties-list">
                      {consultant.specialties.map((specialty, idx) => (
                        <span key={idx} className="bc-badge">{specialty}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Booking Section - Right Side */}
            <div className="bc-booking-col">
              {/* Calendar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bc-card"
              >
                <div className="bc-calendar-header">
                  <div className="bc-calendar-title">
                    <h2>Select Date</h2>
                    {/* <p className="bc-calendar-subtitle">Choose your preferred consultation date</p> */}
                  </div>
                  <div className="bc-calendar-nav">
                    <button
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                      className="bc-nav-btn"
                    >
                      <ChevronLeft />
                    </button>
                    <span className="bc-month-year">
                      {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </span>
                    <button
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                      className="bc-nav-btn"
                    >
                      <ChevronRight />
                    </button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="bc-weekdays">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="bc-weekday">{day}</div>
                  ))}
                </div>
                <div className="bc-days-grid">
                  {getDaysInMonth(currentMonth).map((date, idx) => {
                    const isSelected = selectedDate?.toDateString() === date?.toDateString();
                    const isDisabled = isDateDisabled(date);
                    const isToday = date?.toDateString() === new Date().toDateString();

                    let dayClass = "bc-day-btn";
                    if (!date) dayClass += " bc-day-empty";
                    else if (isDisabled) dayClass += " bc-day-disabled";
                    else dayClass += " bc-day-enabled";
                    if (isSelected) dayClass += " bc-day-selected";
                    if (isToday && !isSelected) dayClass += " bc-today-ring";

                    return (
                      <button
                        key={idx}
                        onClick={() => !isDisabled && date && setSelectedDate(date)}
                        disabled={isDisabled}
                        className={dayClass}
                      >
                        {date?.getDate()}
                        {isToday && !isSelected && <span className="bc-today-dot"></span>}
                      </button>
                    );
                  })}
                </div>
              </motion.div>

              {/* Time Slots */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bc-card"
              >
                <div className="bc-time-header">
                  <h2>Select Time</h2>
                  <p className="bc-time-subtitle">
                    {selectedDate ? formatDate(selectedDate) : 'Please select a date first'}
                  </p>
                </div>

                <div className={`${!selectedDate ? 'bc-time-disabled' : ''}`}>
                  {/* Morning */}
                  <div className="bc-period">
                    <div className="bc-period-header">
                      <div className="bc-period-icon bc-icon-morning">
                        <span>☀️</span>
                      </div>
                      <span className="bc-period-label">Morning</span>
                    </div>
                    <div className="bc-slots-grid bc-slots-grid-morning">
                      {timeSlots.morning.map((time) => {
                        const isUnavailable = isSlotBooked(time);
                        const isSelected = selectedTime === time;
                        let slotClass = "bc-slot-btn";
                        if (isUnavailable) slotClass += " bc-slot-unavailable";
                        else if (isSelected) slotClass += " bc-slot-selected";
                        else slotClass += " bc-slot-available";
                        return (
                          <button
                            key={time}
                            onClick={() => !isUnavailable && setSelectedTime(time)}
                            disabled={isUnavailable}
                            className={slotClass}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Afternoon */}
                  <div className="bc-period">
                    <div className="bc-period-header">
                      <div className="bc-period-icon bc-icon-afternoon">
                        <span>🌤️</span>
                      </div>
                      <span className="bc-period-label">Afternoon</span>
                    </div>
                    <div className="bc-slots-grid bc-slots-grid-afternoon">
                      {timeSlots.afternoon.map((time) => {
                        const isUnavailable = isSlotBooked(time);
                        const isSelected = selectedTime === time;
                        let slotClass = "bc-slot-btn";
                        if (isUnavailable) slotClass += " bc-slot-unavailable";
                        else if (isSelected) slotClass += " bc-slot-selected";
                        else slotClass += " bc-slot-available";
                        return (
                          <button
                            key={time}
                            onClick={() => !isUnavailable && setSelectedTime(time)}
                            disabled={isUnavailable}
                            className={slotClass}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Evening */}
                  <div className="bc-period">
                    <div className="bc-period-header">
                      <div className="bc-period-icon bc-icon-evening">
                        <span>🌙</span>
                      </div>
                      <span className="bc-period-label">Evening</span>
                    </div>
                    <div className="bc-slots-grid bc-slots-grid-evening">
                      {timeSlots.evening.map((time) => {
                        const isUnavailable = isSlotBooked(time);
                        const isSelected = selectedTime === time;
                        let slotClass = "bc-slot-btn";
                        if (isUnavailable) slotClass += " bc-slot-unavailable";
                        else if (isSelected) slotClass += " bc-slot-selected";
                        else slotClass += " bc-slot-available";
                        return (
                          <button
                            key={time}
                            onClick={() => !isUnavailable && setSelectedTime(time)}
                            disabled={isUnavailable}
                            className={slotClass}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Booking Summary & CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bc-summary-card"
              >
                <div className="bc-summary-inner">
                  <div>
                    <p className="bc-selection-label">Your Selection</p>
                    {selectedDate && selectedTime ? (
                      <div className="bc-selection-details">
                        <p className="bc-selection-date">{formatDate(selectedDate)}</p>
                        <p className="bc-selection-time">{selectedTime}</p>
                      </div>
                    ) : (
                      <p className="bc-no-selection">Select a date and time to continue</p>
                    )}
                  </div>
                  <button
                    onClick={handleContinue}
                    disabled={!selectedDate || !selectedTime}
                    className="bc-continue-btn"
                  >
                    Continue to Book
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Contact Form Popup */}
        <AnimatePresence>
          {showFormPopup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bc-modal-overlay"
              onClick={() => setShowFormPopup(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                onClick={e => e.stopPropagation()}
                className="bc-modal-content"
                style={{ maxWidth: '480px', width: '90%' }}
              >
                {/* Close button */}
                <button
                  onClick={() => setShowFormPopup(false)}
                  style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', padding: 4, borderRadius: 8, display: 'flex', opacity: 0.5, transition: 'opacity 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '0.5'}
                >
                  <X size={20} />
                </button>

                <div className="bc-modal-icon" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
                  <User size={24} color="#fff" />
                </div>
                <h3 className="bc-modal-title">Complete Your Booking</h3>

                {user ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'rgba(52, 168, 83, 0.1)', borderRadius: 10, marginBottom: 16, border: '1px solid rgba(52, 168, 83, 0.2)' }}>
                    <CheckCircle size={16} color="#34A853" />
                    <span style={{ fontSize: '0.85rem', color: '#111' }}>Signed in as <strong>{user.email}</strong></span>
                  </div>
                ) : (
                  <div style={{ padding: '8px 12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: 10, marginBottom: 16, border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                    <span style={{ fontSize: '0.85rem', color: '#ef4444' }}>Please sign in to continue</span>
                  </div>
                )}

                <p className="bc-modal-text" style={{ marginBottom: 4 }}>
                  {formatDate(selectedDate)} at {selectedTime}
                </p>

                <form onSubmit={handleFormSubmit} style={{ width: '100%', marginTop: 20 }}>
                  {/* Name */}
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', fontWeight: 600, marginBottom: 6, opacity: 0.8 }}>
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
                        background: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', outline: 'none',
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
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', fontWeight: 600, marginBottom: 6, opacity: 0.8 }}>
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
                        background: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', outline: 'none',
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
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', fontWeight: 600, marginBottom: 6, opacity: 0.8 }}>
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
                        background: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', outline: 'none',
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
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', fontWeight: 600, marginBottom: 6, opacity: 0.8 }}>
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
                        background: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', outline: 'none',
                        transition: 'border-color 0.3s, box-shadow 0.3s', resize: 'vertical',
                        fontFamily: 'inherit', boxSizing: 'border-box', minHeight: '80px',
                        color: '#111'
                      }}
                      onFocus={e => { e.target.style.borderColor = '#ef4444'; e.target.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.1)'; }}
                      onBlur={e => { e.target.style.borderColor = 'rgba(150,150,150,0.2)'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>

                  {bookingError && (
                    <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: 12, textAlign: 'center' }}>{bookingError}</p>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={bookingLoading}
                    style={{
                      width: '100%', padding: '14px 24px', borderRadius: 14, border: 'none',
                      background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: '#fff',
                      fontSize: '1rem', fontWeight: 700, cursor: bookingLoading ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                      boxShadow: '0 8px 24px -4px rgba(239,68,68,0.35)', transition: 'all 0.3s',
                      opacity: bookingLoading ? 0.7 : 1,
                    }}
                  >
                    {bookingLoading ? (
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

        {/* Success Modal */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bc-modal-overlay"
              onClick={() => setShowSuccess(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                className="bc-modal-content"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="bc-success-icon"
                >
                  <CheckCircle />
                </motion.div>

                <h3 className="bc-modal-title">Booking Confirmed!</h3>
                <p className="bc-modal-text">Your consultation has been successfully scheduled</p>

                <div className="bc-success-details">
                  <div className="bc-success-row">
                    <img
                      src={consultant.photo}
                      alt={consultant.name}
                      className="bc-success-img"
                    />
                    <div className="bc-success-info">
                      <p className="bc-success-name">{consultant.name}</p>
                      <p className="bc-success-time">{formatDate(selectedDate)} at {selectedTime}</p>
                    </div>
                  </div>

                  {/* User's booking details */}
                  <div style={{ marginTop: 16, padding: '14px 16px', borderRadius: 12, background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.12)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <User size={16} style={{ color: '#ef4444' }} />
                      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{formData.name}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <Phone size={16} style={{ color: '#ef4444' }} />
                      <span style={{ fontSize: '0.9rem' }}>{formData.phone}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <Mail size={16} style={{ color: '#ef4444' }} />
                      <span style={{ fontSize: '0.9rem' }}>{formData.email}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Calendar size={16} style={{ color: '#ef4444' }} />
                      <span style={{ fontSize: '0.9rem' }}>{formatDate(selectedDate)} • {selectedTime}</span>
                    </div>
                  </div>
                </div>

                <div className="bc-success-email">
                  <p className="bc-email-title">📧 Confirmation email sent</p>
                  <p className="bc-email-note">A confirmation with booking details has been sent to <strong>{formData.email}</strong></p>
                </div>

                <button
                  onClick={() => setShowSuccess(false)}
                  className="bc-done-btn"
                >
                  Done
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}