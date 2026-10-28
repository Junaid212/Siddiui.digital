import React from "react";
import useAnimateOnScroll from "../Hooks/useAnimateOnScroll";
import "./OriginPhilosophy.css";

const OriginPhilosophy = () => {
    useAnimateOnScroll();

    return (
        <section className="section origin-philosophy-section">
            <div className="hero-container">
                {/* ── Section Header ── */}
                <div className="sub-heading mb-2">
                    <i className="fa-solid fa-circle-notch"></i>
                    <h6 className="font-family-1 accent-color">The Origin of the Sid Philosophy</h6>
                </div>

                <h2 
                    className="animate-box animated animate__animated mb-4" 
                    data-animate="animate__fadeInUp"
                >
                    Principles Learned at Home, Tested in Practice
                </h2>

                {/* ── Main Narrative & Pull Quote ── */}
                <div className="row g-4 align-items-stretch">
                    <div className="col-12 col-lg-8">
                        <div className="origin-paragraphs">
                            <p>
                                The Sid Philosophy began with my father, Muhammad Murtaza Siddiqui. He worked hard all his life to earn an honest living, believed deeply in education, and taught me to “draw red lines in your life and never cross them.” Those principles, purpose before profit and integrity before advantage, became the foundation of how I think about business.
                            </p>
                            <p>
                                The Sid Approach came later, from four decades of putting those principles to work: in corporate roles, in my own businesses, in the classroom and in advisory work. Marketing Reclassified is where the two meet, and the book is dedicated to him.
                            </p>
                        </div>

                        <div className="d-flex align-items-center gap-2 mt-4 pt-1">
                            {/* <div className="origin-signature-line"></div> */}
                            <span style={{ fontWeight: 700, fontSize: "1.1rem", letterSpacing: "0.5px" }}>
                                M. Q. Siddiqui
                            </span>
                        </div>
                    </div>

                    <div className="col-12 col-lg-4">
                        <div 
                            className="origin-highlight-quote animate-box animated-fast animate__animated"
                            data-animate="animate__fadeInRight"
                        >
                            <div className="icon-circle mb-3">
                                <i className="fa-solid fa-quote-left"></i>
                            </div>
                            <blockquote className="origin-quote-text">
                                “Draw red lines in your life and never cross them.”
                            </blockquote>
                            <p className="origin-quote-sub">
                                Purpose before profit &middot; Integrity before advantage
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── Education Block ── */}
                <div 
                    className="education-block animate-box animated animate__animated"
                    data-animate="animate__fadeInUp"
                >
                    <div className="sub-heading mb-3">
                        <i className="fa-solid fa-graduation-cap"></i>
                        <h6 className="font-family-1 accent-color">Education</h6>
                    </div>

                    <div className="row g-3 g-md-4">
                        <div className="col-12 col-md-6">
                            <div className="education-card">
                                <div className="icon-circle">
                                    <i className="fa-solid fa-graduation-cap"></i>
                                </div>
                                <div className="education-details">
                                    <h5 className="education-degree">MBA, Marketing and Finance</h5>
                                    <p className="education-school">University of Central Oklahoma, USA</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-md-6">
                            <div className="education-card">
                                <div className="icon-circle">
                                    <i className="fa-solid fa-dna"></i>
                                </div>
                                <div className="education-details">
                                    <h5 className="education-degree">MSc, Genetics</h5>
                                    <p className="education-school">University of Karachi, Pakistan</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OriginPhilosophy;
