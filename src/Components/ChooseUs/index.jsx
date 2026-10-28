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
                                    <span>40+</span>
                                    {/* <div className="stars">
                                        <i className="fa-solid fa-star"></i>
                                        <i className="fa-solid fa-star"></i>
                                        <i className="fa-solid fa-star"></i>
                                        <i className="fa-solid fa-star"></i>
                                        <i className="fa-solid fa-star"></i>
                                    </div> */}
                                    <h5 className="secondary-accent">Years Experience</h5>
                                    {/* <p>Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</p> */}
                                </div>
                            </div>
                        </div>
                        <div className="whychooseus-details">
                            <div className="sub-heading">
                                <i className="fa-solid fa-circle-notch"></i>
                                <h6 className="font-family-1 accent-color">About Muhammad.Q.Siddiqui</h6>
                            </div>
                            <h2 className="animate-box animated animate__animated" data-animate="animate__fadeInUp">From Practice to Philosophy<br/>
Four decades in the market, the classroom and the boardroom</h2>
                            <p>From practice to philosophy M. Q. Siddiqui is the Founder of Siddiqui.digital and the originator of the Sid Philosophy and the Sid Approach. His career spans four decades across Pakistan, the United States and the UAE.</p>
                            <p>He began in corporate practice in 1985, in sales and marketing roles in pharmaceuticals and healthcare, including marketing management in the United States and product management at a leading Karachi hospital. He later built businesses of his own, including founding a school in Karachi.</p>
                            <p>In 2005 he moved to the UAE to teach full time, and went on to lead a university marketing department for thirteen years, where he was recognized for teaching excellence and long service.</p>
                            <p> Today he focuses on helping leaders reclassify marketing as governed strategic intelligence, through his book Marketing Reclassified, his frameworks, SID Insights and advisory work.</p>
                            <div className="d-flex flex-column gspace-2">
                                <div className="whychooseus-box animate-box animated-fast animate__animated" data-animate="animate__fadeInRight">
                                    <div className="icon-circle">
                                        <i className="fa-solid fa-globe"></i>
                                    </div>
                                    <div className="d-flex flex-column ">
                                        {/* <h4 className="secondary-accent">Proven Expertise</h4> */}
                                        <p>"I did not begin my career thinking marketing had been misclassified. Forty years of practice and teaching showed me it was."</p>
                                        <p style={{fontWeight:600}}>M. Q. Siddiqui</p>
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