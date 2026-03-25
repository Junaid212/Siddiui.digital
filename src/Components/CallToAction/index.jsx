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
        style={{marginBottom:'50px'}}
      >
        <div className="hero-container ">
          <div className="cta-banner ">
            <div className="cta-content">
              <div className="cta-container">
                <h2 className="secondary-accent no-dark">
                  Schedule a Free Consultation
                </h2>

                <h6 className="no-dark" style={{color:'white !important',fontSize:'16px',fontWeight:'100',lineHeight:'1.5'}}>
                  Reserve your appointment with an experienced marketing and
                  business professional. Discuss challenges, growth strategies,
                  and solutions with practical industry expertise at no cost.
                </h6>

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
