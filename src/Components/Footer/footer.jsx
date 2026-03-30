import React from "react";
import { Link } from "react-router-dom";
import NewsletterForm from "../Form/NewsletterForm";

const Footer = () => {
    return (
        <footer data-theme="dark" style={{ backgroundColor: '#121212', color: '#FCFCFC' }}>
            <div className="section section-footer dark">
                <div className="hero-container ">
                    <div className="d-flex flex-column gspace-2">
                        <NewsletterForm/>
                        <div className="footer-content-container ">
                            <div className="footer-info-container ">    
                                <div className="footer-info">
                                    {/* <img
                                        src="/assets/images/logo.webp"
                                        alt="Footer Logo"
                                        className="logo"
                                    /> */}
                                    <p className="accent-color-2">
                                        Siddiqui.digital – Reclassifying marketing as strategic intelligence.
                                    </p>
                                    <ul className="footer-list no-dark">
                                        <li>
                                            <div className="d-flex flex-row align-items-center gspace-2 secondary-accent">
                                                <i className="fa-solid fa-location-dot "></i>
                                                <span>Business Centre, Sharjah<br/> Publishing City Free Zone, Sharjah, United Arab Emirates</span>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="d-flex flex-row align-items-center gspace-2 secondary-accent">
                                                <i className="fa-solid fa-envelope-open-text "></i>
                                                <span>example@domain.com</span>
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
                                    <ul className="footer-list no-dark">
                                        <li><Link to="/about">About</Link></li>
                                        <li><Link to="/e_books">E-Book</Link></li>
                                        <li><Link to="/courses">Course</Link></li>
                                        <li><Link to="/consultation">Consultation</Link></li>
                                        <li><Link to="/contact">Contact</Link></li>
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
                                    <h4 className="accent-color">Work Days</h4>
                                    <p>
                                            Feel free to reach out during working hours!
                                        </p>
                                        <div className="d-flex gspace-2">
                                        <i className="fa-solid accent-color-2 fa-clock"></i>
                                        <p className="accent-color-2">
                                            Sunday to Friday
                                            </p>
                                    </div>
                                    <div>
                                        <Link to="/contact" className="btn btn-accent">Contact Us</Link>
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
