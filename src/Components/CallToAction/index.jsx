import React, { useState } from "react";
import useAnimateOnScroll from "../Hooks/useAnimateOnScroll";
import AppointmentDrawer from "../AppointmentDrawer/appointmentDrawer";

const CtaSection = () => {
  useAnimateOnScroll();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <div
        className="section py-0 animate-box animated animate__animated"
        data-animate="animate__zoomIn"
      >
        <div className="hero-container ">
          <div className="cta-banner ">
            <div className="cta-content">
              <div className="cta-container">
                <h2 className="secondary-accent no-dark">
                  Schedule a Free Consultation
                </h2>

                <p>
                  Reserve your appointment with an experienced marketing and
                  business professional. Discuss challenges, growth strategies,
                  and solutions with practical industry expertise at no cost.
                </p>

                <div >
                  <button
                    onClick={() => setIsDrawerOpen(true)}
                    className="btn btn-secondary-accent no-lght"
                  >
                    Book Free Consultation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Drawer */}
      <AppointmentDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
};

export default CtaSection;
