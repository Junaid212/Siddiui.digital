import React from "react";
import useAnimateOnScroll from "../Hooks/useAnimateOnScroll";

const ProcessSection = () => {
    useAnimateOnScroll();
    return(
        <>
            <div className="section spacious-top">
                <div className="hero-container">
                    <div className="d-flex flex-column gspace-2">
                        <div className="sub-heading justify-content-center">
                            <i className="fa-solid fa-circle-notch"></i>
                            <h6 className="font-family-1 accent-color">Our Process</h6>
                        </div>
                        <h2 className="text-center animate-box animated animate__animated" data-animate="animate__fadeInUp">Step-by-Step to Achieving Your Goals</h2>

                        <div className="row row-cols-md-3 row-cols-1 grid-spacer-2">
                            <div className="col">
                                <div className="d-flex flex-column gspace-1">
                                    <div className="process-header">
                                        <span className="process-number">01</span>
                                    </div>
                                    
                                    <div className="card card-process animate-box animated animate__animated" data-animate="animate__fadeInUp">
                                        <i className="fa-solid fa-people-arrows"></i>
                                        <h3 className="secondary-accent">Free Consultation & Mentorship</h3>
                                        <p>Get a free consultation with Mr. Siddiqui, an experienced marketing and business management professional offering practical, real-world guidance to help you grow with clarity and confidence.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="d-flex flex-column gspace-1">
                                    <div className="process-header">
                                        <span className="process-number">02</span>
                                    </div>
                                    
                                    <div className="card card-process animate-box animated animate__animated" data-animate="animate__fadeInUp">
                                        <i className="fa-solid fa-file-invoice"></i>
                                        <h3 className="secondary-accent">Books by Mr. Siddiqui</h3>
                                        <p>Discover practical marketing and management books by Mr. Siddiqui, blending academic expertise with real corporate experience to deliver actionable business insights.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="d-flex flex-column gspace-1">
                                    <div className="process-header">
                                        <span className="process-number">03</span>
                                    </div>
                                    
                                    <div className="card card-process animate-box animated animate__animated" data-animate="animate__fadeInUp">
                                        <i className="fa-solid fa-computer"></i>
                                        <h3 className="secondary-accent">Professional Courses & Training</h3>
                                        <p>Join industry-focused marketing and business courses by Mr. Siddiqui, designed with real-life case studies and proven strategies for measurable career and business success.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProcessSection;