import React, { useState, useEffect } from "react";

const ContactForm = () => {
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("Oops! Form submission failed. Please try again.");
    const [isSubmitting, setIsSubmitting] = useState(false);
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
            }, 5000);
        }
        
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [showSuccess, showError]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setShowSuccess(false);
        setShowError(false);
        
        // Check if name and email are filled
        if (!formData.name.trim() || !formData.email.trim()) {
            setErrorMessage("Please fill in your name and email address.");
            setShowError(true);
            return;
        }

        setIsSubmitting(true);

        try {
            const adminApiUrl = import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:5001';
            const res = await fetch(`${adminApiUrl}/api/public/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setShowSuccess(true);
                // Reset form data
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                const data = await res.json().catch(() => ({}));
                setErrorMessage(data?.message || "Oops! Something went wrong. Please try again.");
                setShowError(true);
            }
        } catch (err) {
            console.error('Contact form submission error:', err);
            setErrorMessage("Unable to connect. Please check your connection and try again.");
            setShowError(true);
        } finally {
            setIsSubmitting(false);
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
                            We'd love to hear from you! Whether you have a question about our services, pricing, or anything else, feel free to contact us.
                        </p>
                        <div className="section p-0">
                            <iframe loading="lazy" className="maps"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d230817.5800078407!2d55.24248632748857!3d25.320168800000012!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f5f004abf0ebf%3A0xbbce34d7cec171d6!2sSharjah%20Publishing%20City%20Free%20Zone!5e0!3m2!1sen!2sin!4v1774866349950!5m2!1sen!2sin" 
                                    title="Sharjah Publishing City Free Zone, Sharjah, United Arab Emirates" aria-label="Sharjah Publishing City Free Zone, Sharjah, United Arab Emirates">
                            </iframe>
                        </div>
                    </div>
                </div>
                <div className="col">
                    {showSuccess && (
                        <div className="alert success">
                            <span className="check-icon"><i className="fa-solid fa-2xl fa-check"></i></span>
                            <p>Thank you! Your message has been sent successfully. We'll be in touch soon.</p>
                        </div>
                    )}
                    
                    {showError && (
                        <div className="alert error">
                            <span className="cross-icon"><i className="fa-solid fa-2xl fa-xmark"></i></span>
                            <p>{errorMessage}</p>
                        </div>
                    )}

                    <div className="card form-card">
                        <form onSubmit={handleSubmit} id="contactForm" className="form d-flex flex-column gspace-2 needs-validation">
                            <div className="d-flex flex-column gspace-2">
                                <label htmlFor="name">Name <span style={{color:'red'}}>*</span></label>
                                <input 
                                    type="text" 
                                    name="name" 
                                    id="name" 
                                    placeholder="Your name" 
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required 
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="d-flex flex-column gspace-2">
                                <label htmlFor="email">Email <span style={{color:'red'}}>*</span></label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    id="email" 
                                    placeholder="your@email.com" 
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required 
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="d-flex flex-column gspace-2">
                                <label htmlFor="subject">Subject</label>
                                <input 
                                    type="text" 
                                    name="subject" 
                                    id="subject" 
                                    placeholder="What is this about?" 
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="d-flex flex-column gspace-2">
                                <label htmlFor="message">Message / Question</label>
                                <textarea 
                                    rows="4" 
                                    name="message" 
                                    id="message" 
                                    placeholder="Ask your question here" 
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    disabled={isSubmitting}
                                ></textarea>
                            </div>
                            <button 
                                type="submit" 
                                className="btn btn-accent"
                                disabled={isSubmitting}
                                style={{ opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
                            >
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ContactForm;