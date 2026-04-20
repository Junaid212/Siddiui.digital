import React, { useRef } from "react";
import useCounterOnScroll from "../Hooks/useCounterOnScroll";

const AchievementSection = () => {
    const expRef = useRef(null);
    const projRef = useRef(null);
    const clientRef = useRef(null);
    const teamRef = useRef(null);

    const { suffix: expSuffix } = useCounterOnScroll(expRef, 39, 2000);
    const { suffix: projSuffix } = useCounterOnScroll(projRef, 15, 2000);
    const { suffix: clientSuffix } = useCounterOnScroll(clientRef, 15000, 2000);
    const { suffix: teamSuffix } = useCounterOnScroll(teamRef, 5, 2000);

    return (
        <div className="section py-0">
            <div className="hero-container">
                <div className="counter-container">
                    <div className="row row-cols-lg-4 row-cols-md-2 row-cols-1  grid-spacer-2">
                        <div className="col">
                            <div className="counter-box">
                                <div className="d-flex flex-row align-items-center justify-content-center">
                                    <span ref={expRef} className="odometer">0</span>
                                    <span>{expSuffix}</span>
                                    <span>+</span>
                                </div>
                                <p className="counter-text">Years of Experience</p>
                            </div>
                        </div>

                        <div className="col">
                            <div className="counter-box">
                                <div className="d-flex flex-row align-items-center justify-content-center">
                                    <span ref={projRef} className="odometer">0</span>
                                    <span>{projSuffix}</span>
                                    <span>+</span>
                                </div>
                                <p className="counter-text">Certications</p>
                            </div>
                        </div>

                        <div className="col">
                            <div className="counter-box">
                                <div className="d-flex flex-row align-items-center justify-content-center">
                                    <span ref={clientRef} className="odometer">0</span>
                                    <span>{clientSuffix}</span>
                                    <span>+</span>
                                </div>
                                <p className="counter-text">Mentored Students</p>
                            </div>
                        </div>

                        <div className="col">
                            <div className="counter-box">
                                <div className="d-flex flex-row align-items-center justify-content-center">
                                    <span ref={teamRef} className="odometer">0</span>
                                    <span>{teamSuffix}</span>
                                    <span>+</span>
                                </div>
                                <p className="counter-text">Courses</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AchievementSection;
