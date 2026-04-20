import React from "react";
import { BannerTag } from "../../Data/BannerTag";
import VideoButton from "../Video/VideoButton";
import useAnimateOnScroll from "../Hooks/useAnimateOnScroll";

const BannerHome =() => {
    useAnimateOnScroll();
    return(
        <>
            <div className="section">
                <div className="hero-container">
                    <div className="banner-heading">
                        <h1 className="font-family-1 animate-box animated animate__animated" data-animate="animate__fadeInUp">A curated  <span className="accent-color">journey through</span> strategic thinking. </h1>
                        <div className="banner-client-container">
                            <div className="banner-client-rating">
                                {/* <div>
                                    <img src="/assets/images/dummy-img-400x400.jpg" alt="client-1" className="banner-client-person animate-box animated animate__animated" data-animate="animate__fadeIn"/>
                                    <img src="/assets/images/dummy-img-400x400.jpg" alt="client-2" className="banner-client-person animate-box animated animate__animated" data-animate="animate__fadeIn"/>
                                    <img src="/assets/images/dummy-img-400x400.jpg" alt="client-3" className="banner-client-person animate-box animated animate__animated" data-animate="animate__fadeIn"/>
                                    <img src="/assets/images/dummy-img-400x400.jpg" alt="client-4" className="banner-client-person animate-box animated animate__animated" data-animate="animate__fadeIn"/>
                                </div> */}
                                <div className="d-flex flex-column gspace-0">
                                    <h3 className="font-family-1 secondary-accent">Courses</h3>
                                    <p className="m-0">Learning Ecosystem</p>
                                </div>
                            </div>
                            <div className="banner-text-description">
                                <p>These learning areas are not isolated topics. They belong to one unified philosophy — where marketing and business are approached through value creation, adaptability, and purposeful decision making.</p>
                            </div>
                        </div>
                        <div className="banner-home animate-box animated animate__animated" data-animate="animate__fadeIn">
                            <div className="banner-icon-container">
                                {BannerTag.map((tag) => (
                                    <div className="banner-icon" key={tag.id}>
                                        {tag.title}
                                    </div>
                                ))}
                            </div>
                            {/* <div className="d-flex flex-wrap d-flex flex-wrap justify-content-between align-items-end z-2">
                                <div>
                                    <a href="./portfolio" className="btn btn-secondary-accent">View Portfolio</a>
                                </div>

                                <VideoButton videoUrl="https://www.youtube.com/embed/VhBl3dHT5SY?autoplay=1" />
                            </div> */}
                        </div>
                        <div className="d-flex flex-column flex-sm-row gap-4 justify-content-between">
                            {/* <div className="social-container">
                                <a href="#" className="social-item primary-accent">
                                    <i className="fa-brands fa-facebook-f"></i>
                                </a>
                                <a href="#" className="social-item primary-accent">
                                    <i className="fa-brands fa-x-twitter"></i>
                                </a>
                                <a href="#" className="social-item primary-accent">
                                    <i className="fa-brands fa-instagram"></i>
                                </a>
                                <a href="#" className="social-item primary-accent">
                                    <i className="fa-brands fa-pinterest"></i>
                                </a>
                                <a href="#" className="social-item primary-accent">
                                    <i className="fa-brands fa-youtube"></i>
                                </a>
                            </div> */}
                            <div className="d-flex flex-row flex-wrap gap-4 justify-content-center text-center">
                                <p>Presented as upcoming learning areas. Availability will be announced in time.</p>
                                {/* <p>Experienced Team</p>
                                <p>Affordable Pricing</p> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default BannerHome;