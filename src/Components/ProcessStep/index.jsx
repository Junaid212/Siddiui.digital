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
                        <h2 className="text-center animate-box animated animate__animated" data-animate="animate__fadeInUp">Three Ways to Work With the Ideas</h2>

                        <div className="row row-cols-md-3 row-cols-1 grid-spacer-2 d-flex">
                            <div className="col">
                                <div className="d-flex flex-column gspace-1">
                                    <div className="process-header">
                                        <span className="process-number">01</span>
                                    </div>
                                    
                                    <div className="card card-process animate-box animated animate__animated" data-animate="animate__fadeInUp">
                                        <i className="fa-solid fa-people-arrows"></i>
                                        <h4 className="secondary-accent">Read the Book</h4>
                                        <p>Marketing Reclassified shows why growth stalls when marketing is placed too late in the decisions that matter, and how to bring market evidence into those decisions before they are locked.</p>
                                        <a href="/publications/marketing-reclassified" className="btn btn-accent">Explore the Book</a>
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
                                        <h4 className="secondary-accent">Learn the Frameworks</h4>
                                        <p>Courses and learning programs in development built on the Sid Approach, AVF, VDI and From Purpose to Profit, with practical tools you can apply to real decisions in your organization.</p>
                                        <a href="/courses" className="btn btn-accent">Explore Learnings</a>
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
                                        <h4 className="secondary-accent">Discuss a Strategic Challenge</h4>
                                        <p>A complimentary 30-minute introductory conversation for leaders exploring how market evidence can better guide their decisions on customers, pricing, value and growth.</p>
                                        <a href="/consultation" className="btn btn-accent">Request a Conversation</a>
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