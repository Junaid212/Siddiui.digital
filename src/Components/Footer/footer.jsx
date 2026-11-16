import React from "react";
import { Link } from "react-router-dom";
import NewsletterForm from "../Form/NewsletterForm";

// TODO: replace with the real profile URLs once the client supplies them.
const SOCIAL_LINKS = [
    { name: "LinkedIn", icon: "fa-brands fa-linkedin-in", href: "https://www.linkedin.com/in/muhammad-q-siddiqui" },
    { name: "Facebook", icon: "fa-brands fa-facebook-f", href: "https://www.facebook.com/mqsiddiqui.digital" },
    { name: "Instagram", icon: "fa-brands fa-instagram", href: "https://www.instagram.com/siddiqui.digital1" },
];

const Footer = () => {
    return (
        <footer data-theme="dark" style={{ backgroundColor: '#121212', color: '#FCFCFC' }}>
            <div className="section section-footer dark">
                <div className="hero-container ">
                    <div className="d-flex flex-column gspace-2">
                        {/* <NewsletterForm/> */}
                        <div className="footer-content-container ">
                            <div className="footer-info-container ">    
                                <div className="footer-info">
                                    {/* <img
                                        src="/assets/images/logo.webp"
                                        alt="Footer Logo"
                                        className="logo"
                                    /> */}
                                    <p className="accent-color-2">
                                        Reclassifying marketing as governed strategic intelligence.
                                    </p>
                                    <ul className="footer-list no-dark">
                                        <li>
                                            <div className="footer-contact-row d-flex flex-row align-items-center gspace-2 secondary-accent">
                                                <i className="fa-solid fa-location-dot "></i>
                                                <span>Ajman, United Arab Emirates</span>
                                            </div>
                                        </li>
                                        <li>
                                            <a
                                                href="mailto:info@siddiqui.digital"
                                                className="footer-contact-row d-flex flex-row align-items-center gspace-2 secondary-accent text-decoration-none"
                                                onClick={(e) => {
                                                    // Allow standard mailto, but if user has no desktop mail client (common on Windows/Chrome), fallback to webmail
                                                    let appOpened = false;
                                                    const onBlur = () => { appOpened = true; };
                                                    window.addEventListener("blur", onBlur, { once: true });
                                                    
                                                    // Give mailto protocol handler a chance to activate
                                                    window.location.href = "mailto:info@siddiqui.digital";

                                                    setTimeout(() => {
                                                        window.removeEventListener("blur", onBlur);
                                                        // If window didn't lose focus, OS didn't launch a desktop mail client -> open Gmail webmail compose
                                                        if (!appOpened && document.hasFocus()) {
                                                            window.open("https://mail.google.com/mail/?view=cm&fs=1&to=info@siddiqui.digital", "_blank");
                                                        }
                                                    }, 600);
                                                }}
                                                title="Send email to info@siddiqui.digital"
                                                style={{ color: "inherit", cursor: "pointer" }}
                                            >
                                                <i className="fa-solid fa-envelope-open-text"></i>
                                                <span>info@siddiqui.digital</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="tel:+971545681182"
                                                className="footer-contact-row d-flex flex-row align-items-center gspace-2 secondary-accent text-decoration-none"
                                                title="Call +971 54 568 1182"
                                                style={{ color: "inherit", cursor: "pointer" }}
                                            >
                                                <i className="fa-solid fa-phone"></i>
                                                <span>+971 54 568 1182</span>
                                            </a>
                                        </li>
                                    </ul>
                                    <div className="footer-social" aria-label="Social media">
                                        {SOCIAL_LINKS.map((s) => (
                                            <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.name} title={s.name}>
                                                <i className={s.icon}></i>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                                <div className="footer-quick-links">
                                    <h4 className="footer-heading">Quick Links</h4>
                                    <ul className="footer-list no-dark">
                                        <li><Link to="/about">About</Link></li>
                                        <li><Link to="/publication">Books & Digital Publications</Link></li>
                                        <li><Link to="/courses">Learning</Link></li>
                                        <li><Link to="/ask-sid">Ask Sid</Link></li>
                                        <li><Link to="/frameworks">Frameworks</Link></li>
                                        <li><Link to="/consultation">Advisory</Link></li>
                                        <li><Link to="/blog-page">Blog</Link></li>
                                    </ul>
                                </div>
                                {/* <div className="footer-services">
                                    <h4 className="accent-color">Services</h4>
                                    <ul className="footer-list">
                                        <li><a href="/services">On-Page SEO</a></li>
                                        <li><a href="/services">Content Marketing</a></li>
                                        <li><a href="/services">Off-Page SEO</a></li>
                                        <li><a href="/services">Social Media Marketing</a></li>
                                        <li><a href="/services">Analytics & Reporting</a></li>
                                        <li><a href="/services">Influencer Marketing</a></li>
                                    </ul>
                                </div> */}
                                <div className="footer-cta">
                                    <h4 className="footer-heading">Work Days</h4>
                                    <p>
                                            Feel free to reach out during working hours.
                                        </p>
                                        <div className="d-flex gspace-2">
                                        <i className="fa-solid fa-clock footer-hours-icon"></i>
                                        <p className="footer-hours-text">
                                            Monday to Friday, 9:00 AM to 6:00 PM (UAE time)
                                            </p>
                                    </div>
                                    {/* <div>
                                        <Link to="/contact" className="btn btn-accent">Contact Us</Link>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                        <div className="copyright-container">
                            <span className="copyright-text">
                                 © 2026 Siddiqui.digital, a Targefy FZC LLC company. All rights reserved. Website by <a href="https://brightmedia.tech" target="_blank" rel="noopener noreferrer" style={{color:'#C80808'}}>Bright Media</a>
                            </span>
                            <nav className="footer-legal-links" aria-label="Legal & Policies">
                                <Link to="/privacy-policy" className="footer-legal-link" id="footer-privacy-policy">Privacy Policy</Link>
                                <span className="footer-legal-divider" aria-hidden="true">·</span>
                                <Link to="/terms-of-use" className="footer-legal-link" id="footer-terms-of-use">Terms of Use</Link>
                                <span className="footer-legal-divider" aria-hidden="true">·</span>
                                <Link to="/refund-policy" className="footer-legal-link" id="footer-refund-policy">Refund Policy</Link>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
