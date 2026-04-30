import React from "react";
import { ChevronRight } from "lucide-react";

export default function ProfileCard() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '1rem',
      borderRadius: '1rem',
      backgroundColor: '#e1d7d7',
      border: '1px solid #f5f5f4'
    }}>
      <div style={{
        width: '3.5rem',
        height: '3.5rem',
        borderRadius: '50%',
        background: 'linear-gradient(to bottom right, #fd3333, #cc1111)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '1.25rem',
        fontWeight: '600',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
      }}>
        S
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 style={{
          fontSize: '0.9375rem',
          fontWeight: '600',
          color: '#1c1917',
          letterSpacing: '-0.025em'
        }}>
          Mohammad.Q Siddiqui
        </h3>
        <p style={{
          fontSize: '0.8125rem',
          color: '#ef2d2d !important',
          marginTop: '0.125rem'
        }}>
          Head of Marketing, Ajman University
        </p>
      </div>
      {/* <button style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
        fontSize: '0.75rem',
        fontWeight: '500',
        color: '#d97706',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        transition: 'color 0.2s'
      }}>
        View more
        <ChevronRight style={{ width: '0.875rem', height: '0.875rem' }} />
      </button> */}
    </div>
  );
}