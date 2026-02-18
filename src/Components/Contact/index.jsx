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
                                    <p className="description">+123 123 123</p>
                                </div>
                            </div>
                            <div className="col">
                                <div className="card contact-card">
                                    <div className="icon-circle">
                                        <i className="fa-solid fa-envelope"></i>
                                    </div>
                                    <span>Mail Address</span>
                                    <p className="description">aspire@dummy.com</p>
                                </div>
                            </div>
                            <div className="col">
                                <div className="card contact-card">
                                    <div className="icon-circle">
                                        <i className="fa-solid fa-location-dot"></i>
                                    </div>
                                    <span>Location</span>
                                    <p className="description">Somewhere, Earth</p>
                                </div>
                            </div>
                            <div className="col">
                                <div className="card contact-card">
                                    <div className="icon-circle">
                                        <i className="fa-solid fa-clock"></i>
                                    </div>
                                    <span>Work Days</span>
                                    <p className="description">Mon to Fri, 09:00 - 17:00</p>
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