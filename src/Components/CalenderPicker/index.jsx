import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
// import moment from "moment";

export default function CalendarPicker({ selectedDate, onSelectDate }) {
  const [currentMonth, setCurrentMonth] = useState(moment().startOf("month"));

  const today = moment().startOf("day");
  const daysInMonth = currentMonth.daysInMonth();
  const firstDayOfWeek = currentMonth.day();

  const prevMonth = () => setCurrentMonth(moment(currentMonth).subtract(1, "month"));
  const nextMonth = () => setCurrentMonth(moment(currentMonth).add(1, "month"));

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const days = [];
  for (let i = 0; i < firstDayOfWeek; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(moment(currentMonth).date(d));

  const isPast = (day) => day && day.isBefore(today);
  const isToday = (day) => day && day.isSame(today, "day");
  const isSelected = (day) =>
    day && selectedDate && day.format("YYYY-MM-DD") === selectedDate;

  return (
    <>
      <style>{`
        /* CalendarPicker.css - internal styles */

        .cp-container {
          /* No extra styles needed, just a wrapper */
        }

        /* Header */
        .cp-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }
        .cp-month-title {
          font-size: 1rem;
          font-weight: 600;
          color: #fff;
        }
        .cp-nav-buttons {
          display: flex;
          gap: 0.25rem;
        }
        .cp-nav-btn {
          width: 2rem;
          height: 2rem;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.5);
          transition: all 0.2s;
          border: none;
          background: transparent;
          cursor: pointer;
        }
        .cp-nav-btn:hover:not(:disabled) {
          background-color: rgba(255, 255, 255, 0.1);
          color: #fff;
        }
        .cp-nav-btn:disabled {
          opacity: 0.2;
          cursor: not-allowed;
        }
        .cp-nav-icon {
          width: 1rem;
          height: 1rem;
        }

        /* Day names row */
        .cp-weekdays {
          display: grid;
          grid-template-columns: repeat(7, minmax(0, 1fr));
          margin-bottom: 0.5rem;
        }
        .cp-weekday {
          text-align: center;
          font-size: 0.75rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.3);
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
        }

        /* Days grid */
        .cp-days-grid {
          display: grid;
          grid-template-columns: repeat(7, minmax(0, 1fr));
          gap: 0.25rem 0;
        }

        /* Day button base */
        .cp-day {
          position: relative;
          height: 2.5rem;
          width: 100%;
          border-radius: 0.75rem;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.2s;
          border: none;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cp-day:focus-visible {
          outline: 2px solid #ef4444;
          outline-offset: 2px;
        }

        /* Past days (disabled) */
        .cp-day-past {
          color: rgba(255, 255, 255, 0.15);
          cursor: not-allowed;
        }

        /* Selected day */
        .cp-day-selected {
          background-color: #dc2626; /* red-600 */
          color: #fff;
          box-shadow: 0 10px 15px -3px rgba(127, 29, 29, 0.5); /* shadow-lg shadow-red-900/50 */
          transform: scale(1.05);
        }

        /* Today (but not selected) */
        .cp-day-today {
          color: #f87171; /* red-400 */
          font-weight: 700;
        }

        /* Weekend (and not past, not selected, not today) */
        .cp-day-weekend {
          color: rgba(255, 255, 255, 0.35);
        }

        /* Default day (weekday, not past, not selected, not today) */
        .cp-day-default {
          color: rgba(255, 255, 255, 0.7);
        }

        /* Hover effect for interactive days (not past, not selected) */
        .cp-day:not(.cp-day-past):not(.cp-day-selected):hover {
          background-color: rgba(255, 255, 255, 0.1);
          color: #fff;
        }

        /* Today dot (only shown when today and not selected) */
        .cp-today-dot {
          position: absolute;
          bottom: 0.25rem;
          left: 50%;
          transform: translateX(-50%);
          width: 0.25rem;
          height: 0.25rem;
          border-radius: 9999px;
          background-color: #ef4444; /* red-500 */
        }
      `}</style>

      <div className="cp-container">
        {/* Header */}
        <div className="cp-header">
          <h3 className="cp-month-title">
            {currentMonth.format("MMMM YYYY")}
          </h3>
          <div className="cp-nav-buttons">
            <button
              onClick={prevMonth}
              disabled={currentMonth.isSameOrBefore(moment().startOf("month"))}
              className="cp-nav-btn"
            >
              <ChevronLeft className="cp-nav-icon" />
            </button>
            <button
              onClick={nextMonth}
              className="cp-nav-btn"
            >
              <ChevronRight className="cp-nav-icon" />
            </button>
          </div>
        </div>

        {/* Day names */}
        <div className="cp-weekdays">
          {dayNames.map((name) => (
            <div key={name} className="cp-weekday">{name}</div>
          ))}
        </div>

        {/* Day grid */}
        <div className="cp-days-grid">
          {days.map((day, idx) => {
            if (!day) return <div key={`empty-${idx}`} />;

            const past = isPast(day);
            const todayDay = isToday(day);
            const selected = isSelected(day);
            const isWeekend = day.day() === 0 || day.day() === 6;

            // Build class list conditionally
            let dayClass = "cp-day";
            if (past) dayClass += " cp-day-past";
            if (selected) dayClass += " cp-day-selected";
            else if (todayDay) dayClass += " cp-day-today";
            else if (isWeekend) dayClass += " cp-day-weekend";
            else dayClass += " cp-day-default";

            return (
              <button
                key={day.format("YYYY-MM-DD")}
                disabled={past}
                onClick={() => onSelectDate(day.format("YYYY-MM-DD"))}
                className={dayClass}
              >
                {day.format("D")}
                {todayDay && !selected && <div className="cp-today-dot" />}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}