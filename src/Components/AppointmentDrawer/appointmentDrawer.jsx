import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TimeSlotPicker from "../TimeSlotPicker/timeSlotPicker";
import SuccessModal from "../SuccessModel/successModel";
import ProfileCard from "../ProfileCard/profileCard";
// import "./AppointmentDrawer.css";

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

// Mock base44 API
const base44 = {
  auth: {
    isAuthenticated: async () => {
      // Mock authentication check
      return true;
    },
    redirectToLogin: (url) => {
      console.log(`Redirect to login from: ${url}`);
      // Add your login redirect logic here
    }
  },
  entities: {
    Appointment: {
      create: async (data) => {
        console.log("Creating appointment:", data);
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { success: true };
      }
    }
  }
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
              className={`appointment-drawer-calendar-day ${
                isSelectedDay ? 'appointment-drawer-calendar-day--selected' : ''
              } ${
                isDisabled ? 'appointment-drawer-calendar-day--disabled' : ''
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
  const [showSuccess, setShowSuccess] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  const autoCloseTimeoutRef = useRef(null);
   useEffect(() => {
    return () => {
      if (autoCloseTimeoutRef.current) {
        clearTimeout(autoCloseTimeoutRef.current);
      }
    };
  }, []);

  const handleContinue = async () => {
    if (!selectedDate || !selectedTime) return;

    setIsBooking(true);

    const isAuthenticated = await base44.auth.isAuthenticated();

    if (!isAuthenticated) {
      base44.auth.redirectToLogin(window.location.href);
      return;
    }

    await base44.entities.Appointment.create({
      consultant_name: "Muhammad.Q Siddiqui",
      date: format(selectedDate, "yyyy-MM-dd"),
      time_slot: selectedTime,
      time_period: selectedPeriod,
      status: "confirmed",
    });

    setIsBooking(false);
    setShowSuccess(true);
     autoCloseTimeoutRef.current = setTimeout(() => {
    handleSuccessClose();
  }, 3000);
  };

  
      
    
  

  const handleSuccessClose = () => {
       if (autoCloseTimeoutRef.current) {
    clearTimeout(autoCloseTimeoutRef.current);
    autoCloseTimeoutRef.current = null;
  }
    setShowSuccess(false);
    setSelectedDate(undefined);
    setSelectedTime("");
    setSelectedPeriod("morning");
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
                  className={`appointment-drawer-continue-button ${
                    canContinue 
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
      </AnimatePresence>

      <SuccessModal
        isOpen={showSuccess}
        onClose={handleSuccessClose}
        date={selectedDate ? format(selectedDate, "MMMM d, yyyy") : ""}
        time={selectedTime}
      />
    </>
  );
}