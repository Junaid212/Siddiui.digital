import React from "react";
import useAnimateOnScroll from "../Hooks/useAnimateOnScroll";
import img1 from "/assets/images/img/37.webp"

const WhyChooseUsSection = () => {
    useAnimateOnScroll();

    return(
        <>
            <div className="section spacious-bottom">
                <div className="hero-container">
                    <div className="d-flex flex-column flex-lg-row gap-4">
                        <div className="whychooseus-image">
                            <div className="image-container">
                                <img src={img1} alt="Why Choose Us" className="img-fluid animate-box animated animate__animated" data-animate="animate__fadeInLeft" />
                            </div>
                            <div className="client-rating-card animate-box animated animate__animated" data-animate="animate__zoomIn">
                                <div className="client-rating-card-content">
                                    <span>4.9</span>
                                    <div className="stars">
                                        <i className="fa-solid fa-star"></i>
                                        <i className="fa-solid fa-star"></i>
                                        <i className="fa-solid fa-star"></i>
                                        <i className="fa-solid fa-star"></i>
                                        <i className="fa-solid fa-star"></i>
                                    </div>
                                    <h5 className="secondary-accent">Client Ratings</h5>
                                    {/* <p>Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</p> */}
                                </div>
                            </div>
                        </div>
                        <div className="whychooseus-details">
                            <div className="sub-heading">
                                <i className="fa-solid fa-circle-notch"></i>
                                <h6 className="font-family-1 accent-color">About Muhammad.Q.Siddiqui</h6>
                            </div>
                            <h2 className="animate-box animated animate__animated" data-animate="animate__fadeInUp">Corporate experience in the field of marketing and business management</h2>
                            <p>Approximately 18 years of corporate experience in different capacities. Industrial Experience has equipped Mr. siddiqui to part his vast experience in the academic field, 
                                which started with City University of New York in 1986, as Adjunct lecturer and then in 2001 in Pakistan  at PAF Kiet University, Bahria University and various other 
                                institutions in Karachi, till 2005 as adjunct faculty covering Marketing and Management areas . He adopted academic field as full time faculty in 2005 till today as Head 
                                of Marketing in Ajman University. In this field also he uses creativity and innovative teaching techniques to motivate his students and with vast industrial experience, 
                                he can share his real life experience with students.</p>
                            <div className="d-flex flex-column gspace-2">
                                <div className="whychooseus-box animate-box animated-fast animate__animated" data-animate="animate__fadeInRight">
                                    <div className="icon-circle">
                                        <i className="fa-solid fa-globe"></i>
                                    </div>
                                    <div className="d-flex flex-column gspace-2">
                                        {/* <h4 className="secondary-accent">Proven Expertise</h4> */}
                                        <p>Mr. Siddiqui is a catalyst to change and always willing to take challenges in his own field.</p>
                                    </div>
                                </div>
                                {/* <div className="whychooseus-box animate-box animated animate__animated" data-animate="animate__fadeInRight">
                                    <div className="icon-circle">
                                        <i className="fa-solid fa-lightbulb"></i>
                                    </div>
                                    <div className="d-flex flex-column gspace-2">
                                        <h4 className="secondary-accent">Innovation and Adaptability</h4>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</p>
                                    </div>
                                </div>
                                <div className="whychooseus-box animate-box animated animate__animated" data-animate="animate__fadeInRight">
                                    <div className="icon-circle">
                                        <i className="fa-solid fa-briefcase"></i>
                                    </div>
                                    <div className="d-flex flex-column gspace-2">
                                        <h4 className="secondary-accent">Comprehensive Services</h4>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</p>
                                    </div>
                                </div>
                                <div className="whychooseus-box animate-box animated-slow animate__animated" data-animate="animate__fadeInRight">
                                    <div className="icon-circle">
                                        <i className="fa-solid fa-user-tie"></i>
                                    </div>
                                    <div className="d-flex flex-column gspace-2">
                                        <h4 className="secondary-accent">Dedicated Support</h4>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</p>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default WhyChooseUsSection;