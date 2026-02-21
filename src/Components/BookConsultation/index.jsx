import React, { useState } from 'react';
import { Calendar, Clock, Star, Award, Users, CheckCircle, X, ChevronLeft, ChevronRight, MapPin, Briefcase, GraduationCap } from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';

export default function BookConsultation() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoggedIn] = useState(false);

  const consultant = {
    name: "Muhammad.Q.Siddiqui",
    title: " Head of Marketing, Ajman University",
    photo: "https://siddiqui.digital/wp-content/uploads/2021/12/my-pic-8.jpg",
    rating: 4.9,
    reviews: 127,
    experience: "18+ years",
    location: "New York, NY",
    education: "Harvard Business School",
    bio: "Helping entrepreneurs and students unlock their full potential through strategic planning, market analysis, and growth optimization. Specialized in marketing and business management.",
    specialties: ["Business Analyst", "Marketeer", "Educationist", "Motivational Speaker", "Researcher","Entrepreneur"],
    stats: { clients: "15+", sessions: "200+", satisfaction: "98%" }
  };

  const timeSlots = {
    morning: ["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM"],
    afternoon: ["1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM"],
    evening: ["5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM"]
  };

  const unavailableSlots = ["10:00 AM", "2:00 PM", "6:00 PM"];

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

  const handleContinue = () => {
    if (!selectedDate || !selectedTime) return;
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
    } else {
      setShowSuccess(true);
    }
  };

  const handleLogin = () => {
    setShowLoginPrompt(false);
    setShowSuccess(true);
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
                      <Star className="bc-star" />
                      <span className="bc-rating-value">{consultant.rating}</span>
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
                    <p className="bc-calendar-subtitle">Choose your preferred consultation date</p>
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
                        const isUnavailable = unavailableSlots.includes(time);
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
                        const isUnavailable = unavailableSlots.includes(time);
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
                        const isUnavailable = unavailableSlots.includes(time);
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

        {/* Login Prompt Modal */}
        <AnimatePresence>
          {showLoginPrompt && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bc-modal-overlay"
              onClick={() => setShowLoginPrompt(false)}
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                className="bc-modal-content"
              >
                <div className="bc-modal-icon">
                  <Users />
                </div>
                <h3 className="bc-modal-title">Sign in to Continue</h3>
                <p className="bc-modal-text">Create an account or sign in to complete your booking</p>
                
                <div className="bc-modal-actions">
                  <button 
                    onClick={handleLogin}
                    className="bc-modal-btn bc-modal-btn-primary"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={handleLogin}
                    className="bc-modal-btn bc-modal-btn-secondary"
                  >
                    Create Account
                  </button>
                </div>

                <button 
                  onClick={() => setShowLoginPrompt(false)}
                  className="bc-modal-link"
                >
                  Cancel
                </button>
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
                </div>

                <div className="bc-success-email">
                  <p className="bc-email-title">📧 Confirmation email sent</p>
                  <p className="bc-email-note">Check your inbox for meeting details and calendar invite</p>
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