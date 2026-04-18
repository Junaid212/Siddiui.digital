import React from "react";
import useAnimateOnScroll from "../Hooks/useAnimateOnScroll";
import img1 from "/assets/images/img/29.webp";
import { Link } from "react-router-dom";

const AboutSection = () => {
    useAnimateOnScroll();
    return(
        <>
            <div className="section">
                <div className="hero-container">
                    <div className="d-flex flex-column gspace-2">
                        <div className="d-flex flex-column flex-md-row h-100 gspace-3">
                            <div className="about-image-wrapper">
                                <div className="image-container">
                                    <img src={img1}alt="About Image" className="img-fluid animate-box animated animate__animated" data-animate="animate__fadeInRight" />
                                </div>
                                <div className="card about-traffic-card animate-box animated animate__animated" data-animate="animate__zoomIn">
                                    <div className="d-flex flex-column gspace-2 align-self-center text-center">
                                        {/* <i className="fa-solid fa-2x fa-chart-simple"></i> */}
                                        <p className="secondary-accent mb-0">Experience</p>
                                        <h2 className="secondary-accent">39 Years</h2>
                                    </div>
                                    {/* <div className="d-flex justify-content-center accent-color">
                                        <i className="fa-solid fa-arrow-trend-up"></i>
                                        <p className="description">+70%</p>
                                    </div> */}
                                </div>
                            </div>
                            <div className="about-details">
                                <div className="sub-heading">
                                    <i className="fa-solid fa-circle-notch"></i>
                                    <h6 className="font-family-1 accent-color">Who is M. Q. Siddiqui </h6>
                                </div>
                                <h2 className="animate-box animated animate__animated" data-animate="animate__fadeInUp">A strategic marketing thinker with a philosophy, not just a practice</h2>
                                <p>M. Q. Siddiqui is a marketing thought leader whose work spans academia, industry, and advisory practice. Over nearly four decades, he has developed a body of thinking that consistently returns to one central question: how do businesses create genuine value — for customers, for organisations, and for the wider environments they operate within.</p>
                                <p>His frameworks — including AVF, VDI, and From Purpose to Profit — are not borrowed models. They are original tools developed through sustained engagement with real business challenges, teaching, and strategic advisory work.</p>
                                <div>
                                    {/* <Link to="/about" className="btn btn-accent">Learn More</Link> */}
                                </div>
                            </div>
                            
                        </div>
                        <div className="about-spacer"></div>
                        <div className="row row-cols-md-3 row-cols-1 grid-spacer-2">
                            <div className="col">
                                <div className="card card-about animate-box animated-fast animate__animated" data-animate="animate__fadeInUp">
                                    <div className="d-flex flex-column flex-lg-row gspace-2">
                                        <div className="  align-self-start">
                                            <i className="fa-solid fa-lightbulb"></i>
                                        </div>
                                        <div className="d-flex flex-column gspace-2">
                                            {/* <h3 className="secondary-accent">Our Philosophy</h3> */}
                                            <p className="secondary-accent">
                                                Strategic marketing educator & advisor
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="card card-about animate-box animated-fast animate__animated" data-animate="animate__fadeInUp">
                                    <div className="d-flex flex-column flex-lg-row gspace-2">
                                        <div className="  align-self-start">
                                            <i className="fa-solid fa-lightbulb"></i>
                                        </div>
                                        <div className="d-flex flex-column gspace-2">
                                            {/* <h3 className="secondary-accent">Our Philosophy</h3> */}
                                            <p className="secondary-accent">
                                                Recognised for contributions to marketing education
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="card card-about animate-box animated-fast animate__animated" data-animate="animate__fadeInUp">
                                    <div className="d-flex flex-column flex-lg-row gspace-2">
                                        <div className="  align-self-start">
                                            <i className="fa-solid fa-lightbulb"></i>
                                        </div>
                                        <div className="d-flex flex-column gspace-2">
                                            {/* <h3 className="secondary-accent">Our Philosophy</h3> */}
                                            <p className="secondary-accent">
                                                Mentor to more than 15,000 students
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* <div className="col">
                                <div className="card card-about animate-box animated animate__animated" data-animate="animate__fadeInUp">
                                    <h3 className="secondary-accent">Our Vision</h3>
                                    <p className="secondary-accent">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
                                    </p>
                                </div>
                            </div>
                            <div className="col">
                                <div className="card card-about animate-box animated-slow animate__animated" data-animate="animate__fadeInUp">
                                    <h3 className="secondary-accent">Our Mission</h3>
                                    <p className="secondary-accent">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
                                    </p>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AboutSection;