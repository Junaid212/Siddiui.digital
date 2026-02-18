import React, { useState, useEffect } from "react";

const ContactForm = () => {
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    useEffect(() => {
        let timeoutId;
        
        if (showSuccess || showError) {
            timeoutId = setTimeout(() => {
                setShowSuccess(false);
                setShowError(false);
            }, 3000);
        }
        
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [showSuccess, showError]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        setShowSuccess(false);
        setShowError(false);
        
        // Check if name and email are filled
        if (formData.name.trim() && formData.email.trim()) {
            setShowSuccess(true);
            setShowError(false);
        } else {
            setShowSuccess(false);
            setShowError(true);
        }
    };

    return(
        <>
            <div className="row row-cols-lg-2 row-cols-1 grid-spacer-2">
                <div className="col">
                    <div className="contact-details">
                        <div className="sub-heading">
                            <i className="fa-solid fa-circle-notch"></i>
                            <h6 className="font-1">Get In Touch</h6>
                        </div>
                        <h2 className="animate-box animate__animated animated" data-animate="animate__fadeInUp">Let's Discuss How We Can Support Your Success</h2>
                        <p>
                            Parturient nunc montes, habitasse ligula habitant facilisi. 
                            Luctus dis penatibus ad augue rutrum. Non gravida sociosqu pellentesque cursus dictum.
                            Gravida at luctus sollicitudin sagittis odio venenatis adipiscing mus sem.
                        </p>
                        <div className="section p-0">
                            <iframe loading="lazy" className="maps"
                                    src="https://maps.google.com/maps?q=London%20Eye%2C%20London%2C%20United%20Kingdom&amp;t=m&amp;z=14&amp;output=embed&amp;iwloc=near"
                                    title="London Eye, London, United Kingdom" aria-label="London Eye, London, United Kingdom">
                            </iframe>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className={`alert success ${!showSuccess ? 'hidden' : ''}`}>
                        <span className="check-icon"><i className="fa-solid fa-2xl fa-check"></i></span>
                        <p>Thank you! Form submitted successfully.</p>
                    </div>
                    
                    <div className={`alert error ${!showError ? 'hidden' : ''}`}>
                        <span className="cross-icon"><i className="fa-solid fa-2xl fa-xmark"></i></span>
                        <p>Oops! Form submission failed. Please try again.</p>
                    </div>

                    <div className="card form-card">
                        <form onSubmit={handleSubmit} id="contactForm" className="form d-flex flex-column gspace-2 needs-validation">
                            <div className="d-flex flex-column gspace-2">
                                <label htmlFor="name">Name</label>
                                <input 
                                    type="text" 
                                    name="name" 
                                    id="name" 
                                    placeholder="name" 
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required 
                                />
                            </div>

                            <div className="d-flex flex-column gspace-2">
                                <label htmlFor="email">Email</label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    id="email" 
                                    placeholder="Email" 
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required 
                                />
                            </div>

                            <div className="d-flex flex-column gspace-2">
                                <label htmlFor="subject">Subject</label>
                                <input 
                                    type="text" 
                                    name="subject" 
                                    id="subject" 
                                    placeholder="Subject" 
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="d-flex flex-column gspace-2">
                                <label htmlFor="message">Message/Question</label>
                                <textarea 
                                    rows="4" 
                                    name="message" 
                                    id="message" 
                                    placeholder="Ask your question here" 
                                    value={formData.message}
                                    onChange={handleInputChange}
                                ></textarea>
                            </div>
                            <button type="submit" className="btn btn-accent">Send Message</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ContactForm;