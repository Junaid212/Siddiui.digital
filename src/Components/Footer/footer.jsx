import React from "react";
import NewsletterForm from "../Form/NewsletterForm";

const Footer = () => {
    return (
        <footer>
            <div className="section section-footer">
                <div className="hero-container">
                    <div className="d-flex flex-column gspace-2">
                        <NewsletterForm/>
                        <div className="footer-content-container">
                            <div className="footer-info-container">    
                                <div className="footer-info">
                                    {/* <img
                                        src="/assets/images/logo.webp"
                                        alt="Footer Logo"
                                        className="logo"
                                    /> */}
                                    <p className="accent-color-2">
                                        Quam lacus suspendisse faucibus interdum posuere lorem
                                        ipsum dolor sit. Vel quam elementum pulvinar etiam.
                                    </p>
                                    <ul className="footer-list">
                                        <li>
                                            <div className="d-flex flex-row align-items-center gspace-2 secondary-accent">
                                                <i className="fa-solid fa-location-dot"></i>
                                                <span>Somewhere, Earth</span>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="d-flex flex-row align-items-center gspace-2 secondary-accent">
                                                <i className="fa-solid fa-envelope-open-text "></i>
                                                <span>aspire@dummy.com</span>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="d-flex flex-row align-items-center gspace-2 secondary-accent">
                                                <i className="fa-solid fa-phone"></i>
                                                <span>+123 123 123</span>
                                            </div>
                                            </li>
                                    </ul>
                                </div>
                                <div className="footer-quick-links">
                                    <h4 className="accent-color">Quick Links</h4>
                                    <ul className="footer-list">
                                        <li><a href="/about">About</a></li>
                                        <li><a href="/contact">E-Book</a></li>
                                        <li><a href="/team">Course</a></li>
                                        <li><a href="/faq">Consultation</a></li>
                                        <li><a href="/contact">Contact</a></li>
                                    </ul>
                                </div>
                                <div className="footer-services">
                                    <h4 className="accent-color">Services</h4>
                                    <ul className="footer-list">
                                        <li><a href="/services">On-Page SEO</a></li>
                                        <li><a href="/services">Content Marketing</a></li>
                                        <li><a href="/services">Off-Page SEO</a></li>
                                        <li><a href="/services">Social Media Marketing</a></li>
                                        <li><a href="/services">Analytics & Reporting</a></li>
                                        <li><a href="/services">Influencer Marketing</a></li>
                                    </ul>
                                </div>
                                <div className="footer-cta">
                                    <h4 className="accent-color">Work Days</h4>
                                    <p>
                                        Euismod elementum nisi quis eleifend quam adipiscing
                                        vitae proin sagittis.
                                    </p>
                                    <div className="d-flex gspace-2">
                                        <i className="fa-solid accent-color-2 fa-clock"></i>
                                        <p className="accent-color-2">
                                        Mon to Fri, 09:00 - 17:00
                                        </p>
                                    </div>
                                    <div>
                                        <a href="/contact" className="btn btn-accent">Contact Us</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="copyright-container">
                            <span className="copyright-text">
                                Siddiqui.digital © 2026 All Rights Reserved. <a href="https://brightmedia.tech" target="_blank" rel="noopener noreferrer" style={{color:'#C80808'}}>Bright Media</a>
                            </span>
                            <div className="social-footer" >
                                <a href="#" className="social-item accent-color" id="accent-color">
                                    <i className="fa-brands fa-facebook-f"></i>
                                </a>
                                <a href="#" className="social-item accent-color">
                                    <i className="fa-brands fa-x-twitter"></i>
                                </a>
                                <a href="#" className="social-item accent-color">
                                    <i className="fa-brands fa-instagram"></i>
                                </a>
                                <a href="#" className="social-item accent-color">
                                    <i className="fa-brands fa-pinterest"></i>
                                </a>
                                <a href="#" className="social-item accent-color">
                                    <i className="fa-brands fa-youtube"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
