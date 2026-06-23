import { useState, useEffect } from "react";
import Questionnaire from "../Questionnaire";

const Modal = ({ children, onClose }) => (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(16, 16, 16, 0.75)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
      backdropFilter: "blur(6px)",
      animation: "qs-backdrop-in 0.4s ease",
    }}
  >
    <div
      style={{
        position: "relative",
        maxWidth: "620px",
        width: "92%",
        maxHeight: "85vh",
        overflow: "auto",
        borderRadius: "1.25rem",
        background: "transparent",
        animation: "qs-modal-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
      }}
    >
      <button
        onClick={onClose}
        title="Close"
        style={{
          position: "absolute",
          top: "0.85rem",
          right: "0.85rem",
          width: "2rem",
          height: "2rem",
          borderRadius: "50%",
          border: "none",
          background: "rgba(255,255,255,0.95)",
          cursor: "pointer",
          zIndex: 10,
          fontSize: "1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          transition: "transform 0.2s, background 0.2s",
          lineHeight: 1,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.12)";
          e.currentTarget.style.background = "#fee2e2";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.background = "rgba(255,255,255,0.95)";
        }}
      >
        ✕
      </button>
      {children}
    </div>

    <style>{`
      @keyframes qs-backdrop-in {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
      @keyframes qs-modal-in {
        from { opacity: 0; transform: scale(0.88) translateY(24px); }
        to   { opacity: 1; transform: scale(1)    translateY(0); }
      }
    `}</style>
  </div>
);

export default function PopupManager() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Don't show if user already completed the questionnaire
    if (localStorage.getItem("questionnaireCompleted")) return;

    // Use a sessionStorage flag so the 10-second timer fires only once
    // per browser session (not on every route change / remount)
    if (sessionStorage.getItem("qs_popup_shown")) return;

    const timer = setTimeout(() => {
      sessionStorage.setItem("qs_popup_shown", "true");
      setShowPopup(true);
    }, 10000); // 10 seconds after first page load

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setShowPopup(false);
  };

  if (!showPopup) return null;

  return (
    <Modal onClose={handleClose}>
      <Questionnaire onClose={handleClose} />
    </Modal>
  );
}