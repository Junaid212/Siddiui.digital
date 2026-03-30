import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function PageTransition({ children }) {
  const location = useLocation();
  const pathname = location.pathname;
  const [wipeKey, setWipeKey] = useState(0);
  const [wipeDirection, setWipeDirection] = useState(null);

  useEffect(() => {
    // Start new transition
    setWipeDirection('in');
    
    // After wipe-in finishes, start wipe-out
    const wipeOutTimer = setTimeout(() => {
      setWipeDirection('out');
    }, 350);

    // After whole transition, clean up and prepare for next
    const resetTimer = setTimeout(() => {
      setWipeDirection(null);
      setWipeKey(k => k + 1);
    }, 700);

    return () => {
      clearTimeout(wipeOutTimer);
      clearTimeout(resetTimer);
    };
  }, [pathname]);

  return (
    <>
      {/* Page content – always visible, no fade */}
      {children}

      {/* Wipe layers */}
      <AnimatePresence>
        {wipeDirection === 'in' && (
          <motion.div
            key={"wipe-in" + wipeKey}
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1, originX: 0 }}
            exit={{}}
            transition={{ duration: 0.35, ease: [0.77, 0, 0.175, 1] }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "#C21410",
              zIndex: 9999,
              pointerEvents: "none",
              transformOrigin: "left",
              willChange: "transform",
            }}
          />
        )}
        {wipeDirection === 'out' && (
          <motion.div
            key={"wipe-out" + wipeKey}
            initial={{ scaleX: 1, originX: 1 }}
            animate={{ scaleX: 0, originX: 1 }}
            exit={{}}
            transition={{ duration: 0.35, ease: [0.77, 0, 0.175, 1] }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "#c72020",
              zIndex: 9999,
              pointerEvents: "none",
              transformOrigin: "right",
              willChange: "transform",
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}