import React from "react";
import ContactForm from "../Form/ContactForm";
import useAnimateOnScroll from "../Hooks/useAnimateOnScroll";

const ContactSection = () =>{
    
    useAnimateOnScroll();

    return(
        <>
            <div className="section">
                <div className="hero-container">
                    <div className="d-flex flex-column gspace-2">
                        <div className="row row-cols-lg-4 row-cols-md-2 row-cols-1 grid-spacer-2">
                            <div className="col">
                                <div className="card contact-card">
                                    <div className="icon-circle">
                                        <i className="fa-solid fa-phone"></i>
                                    </div>
                                    <span>Phone Number</span>
                                    <p className="description" style={{fontSize: '14px', textAlign: 'center'}}>+971 54 568 1182</p>
                                </div>
                            </div>
                            <div className="col">
                                <div className="card contact-card">
                                    <div className="icon-circle">
                                        <i className="fa-solid fa-envelope"></i>
                                    </div>
                                    <span>Mail Address</span>
                                    <a
                                        href="mailto:info@siddiqui.digital"
                                        style={{ textDecoration: 'none', color: 'inherit' }}
                                        onClick={() => {
                                            let appOpened = false;
                                            const onBlur = () => { appOpened = true; };
                                            window.addEventListener("blur", onBlur, { once: true });
                                            window.location.href = "mailto:info@siddiqui.digital";
                                            setTimeout(() => {
                                                window.removeEventListener("blur", onBlur);
                                                if (!appOpened && document.hasFocus()) {
                                                    window.open("https://mail.google.com/mail/?view=cm&fs=1&to=info@siddiqui.digital", "_blank");
                                                }
                                            }, 600);
                                        }}
                                        title="Send email to info@siddiqui.digital"
                                    >
                                        <p className="description" style={{fontSize: '14px', textAlign: 'center', cursor: 'pointer'}}>info@siddiqui.digital</p>
                                    </a>
                                </div>
                            </div>
                            <div className="col">
                                <div className="card contact-card">
                                    <div className="icon-circle">
                                        <i className="fa-solid fa-location-dot"></i>
                                    </div>
                                    <span>Location</span>
                                    <p className="description" style={{fontSize: '14px', textAlign: 'center'}}>Business Centre, Sharjah<br/> Publishing City Free Zone, Sharjah, United Arab Emirates</p>
                                </div>
                            </div>
                            <div className="col">
                                <div className="card contact-card">
                                    <div className="icon-circle">
                                        <i className="fa-solid fa-clock"></i>
                                    </div>
                                    <span>Work Days</span>
                                    <p className="description" style={{fontSize: '14px', textAlign: 'center'}}>Sun to Fri, 09:00 - 17:00</p>
                                </div>
                            </div>
                        </div>

                        <div className="contact-spacer"></div>

                        <ContactForm/>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ContactSection;