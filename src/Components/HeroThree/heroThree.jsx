import React from "react";
import { Link } from "react-router-dom";
import "../HeroFour.css";

const HeroThree = () => {
    return (
        <div className="mil-hero-simple">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8 text-center">
                        <div className="mil-hero-content">
                            {/* Name */}
                            <h6 className="mil-hero-name mil-mb-20">Emma Freeman</h6>
                            
                            {/* Title */}
                            <h1 className="mil-hero-title mil-mb-30">Freelance Digital Marketing Expert</h1>
                            
                            {/* Description */}
                            <p className="mil-hero-description mil-mb-50">
                                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni ratione.
                            </p>
                            
                            {/* Buttons */}
                            <div className="mil-hero-buttons">
                                <Link to="#" className="mil-button mil-button-md mil-button-linear mil-button-dark mil-mr-20">
                                    <span>MORE ABOUT US</span>
                                </Link>
                                <Link to="#" className="mil-button mil-button-md mil-button-linear mil-button-dark">
                                    <span>VIEW PORTFOLIO</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HeroThree;