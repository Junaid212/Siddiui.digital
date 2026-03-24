import React from "react";
import { Sun, CloudSun, Moon } from "lucide-react";

const periods = [
  {
    key: "morning",
    label: "Morning",
    icon: Sun,
    slots: ["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM"],
  },
  {
    key: "afternoon",
    label: "Afternoon",
    icon: CloudSun,
    slots: ["12:00 PM", "12:30 PM", "1:00 PM", "2:00 PM", "3:00 PM"],
  },
  {
    key: "evening",
    label: "Evening",
    icon: Moon,
    slots: ["5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM"],
  },
];

export default function TimeSlotPicker({
  selectedPeriod,
  onPeriodChange,
  selectedTime,
  onTimeChange,
  isSlotBooked,
}) {
  const activePeriod = periods.find((p) => p.key === selectedPeriod) || periods[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <p style={{
        fontSize: '0.8125rem',
        fontWeight: '600',
        color: '#78716c',
        textTransform: 'uppercase',
        letterSpacing: '0.1em'
      }}>
        Select Time
      </p>

      {/* Period Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {periods.map((period) => {
          const Icon = period.icon;
          const isActive = selectedPeriod === period.key;
          return (
            <button
              key={period.key}
              onClick={() => onPeriodChange(period.key)}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.625rem',
                borderRadius: '0.75rem',
                fontSize: '0.8125rem',
                fontWeight: '500',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s',
                backgroundColor: isActive ? '#1c1917' : '#fafaf9',
                color: isActive ? 'white' : '#a8a29e',
                boxShadow: isActive ? '0 10px 15px -3px rgba(28, 25, 23, 0.2)' : 'none'
              }}
            >
              <Icon style={{ width: '0.875rem', height: '0.875rem' }} />
              {period.label}
            </button>
          );
        })}
      </div>

      {/* Time Slots */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '0.5rem'
      }}>
        {activePeriod.slots.map((slot) => {
          const isSelected = selectedTime === slot;
          const isBooked = isSlotBooked ? isSlotBooked(slot) : false;
          return (
            <button
              key={slot}
              onClick={() => !isBooked && onTimeChange(slot)}
              disabled={isBooked}
              style={{
                padding: '0.625rem',
                borderRadius: '0.75rem',
                fontSize: '0.8125rem',
                fontWeight: '500',
                border: 'none',
                cursor: isBooked ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                backgroundColor: isBooked ? '#fee2e2' : isSelected ? '#f59e0b' : '#fafaf9',
                color: isBooked ? '#ef4444' : isSelected ? 'white' : '#78716c',
                boxShadow: isSelected && !isBooked ? '0 4px 6px -1px rgba(245, 158, 11, 0.25)' : 'none',
                opacity: isBooked ? 0.6 : 1,
                textDecoration: isBooked ? 'line-through' : 'none',
              }}
            >
              {slot}
            </button>
          );
        })}
      </div>
    </div>
  );
}