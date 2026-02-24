import React from "react";
import TestimonialCard from "../Card/TestimonialCard";
import { testimonialdata } from "../../Data/Testimonial";

const TestimonialSection = () => {
    return (
        <div className="section">
            <div className="hero-container">
                <div className="row row-cols-lg-2 row-cols-1 grid-spacer-2">
                    <div className="col">
                        <div className="testimonial-details-container">
                            <div className="d-flex flex-column gspace-2">
                                <div className="sub-heading">
                                    <i className="fa-solid fa-circle-notch"></i>
                                    <h6 className="font-family-1 accent-color">Testimonials</h6>
                                </div>
                                <h2 className="animate-box animated animate__animated" data-animate="animate__fadeInUp">
                                    Success Stories From Those Who Know Us Best
                                </h2>
                                <p>Vel inceptos euismod justo turpis platea eu. Est risus quam bibendum accumsan aliquam cubilia. Dolor ultrices imperdiet cursus pretium platea. Amagna ligula sem, porttitor imperdiet mi iaculis rutrum. Faucibus lorem rhoncus justo congue bibendum sagittis leo fermentum.</p>
                                <div>
                                    <a href="#" className="btn btn-accent">View More</a>
                                </div>
                            </div>
                            <div className="testimonial-image-wrapper">
                                <div className="image-container">
                                    <img
                                        src="/assets/images/dummy-img-600x400.jpg"
                                        alt="Testimonial Detail"
                                        className="img-fluid animate-box animated animate__animated" data-animate="animate__fadeInLeft"
                                    />
                                </div>
                                <div className="testimonial-rating animate-box animated animate__animated" data-animate="animate__zoomIn">                  
                                    <span className="rating-count">99%</span>
                                    <h5 className="accent-color">Satisfied Client</h5>
                                    <p>
                                        Ut elit tellus, luctus nec ullamcorper mattis,
                                        pulvinar dapibus leo.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col">
                        <div className="d-flex flex-column gspace-2">
                            {testimonialdata.slice(0, 3).map((item) => (
                                <TestimonialCard
                                    key={item.id}
                                    image={item.image}
                                    name={item.name}
                                    designation={item.designation}
                                    content={item.content}
                                    speed={item.speed}
                                    variant="box"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TestimonialSection;