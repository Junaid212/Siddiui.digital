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
      backgroundColor: "rgba(16, 16, 16, 0.8)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
      backdropFilter: "blur(4px)",
    }}
  >
    <div
      style={{
        position: "relative",
        maxWidth: "600px",
        width: "90%",
        maxHeight: "80vh",
        overflow: "auto",
        borderRadius: "1rem",
        background: "transparent",
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
          width: "2rem",
          height: "2rem",
          borderRadius: "50%",
          border: "none",
          background: "white",
          cursor: "pointer",
          zIndex: 10,
          fontSize: "1.2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        ✕
      </button>
      {children}
    </div>
  </div>
);

export default function PopupManager() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowPopup(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {/* Your main page content */}
      <h1>Welcome to the site</h1>
      <p>Some content...</p>

      {showPopup && (
        <Modal onClose={() => setShowPopup(false)}>
          <Questionnaire onClose={() => setShowPopup(false)} />
        </Modal>
      )}
    </div>
  );
}