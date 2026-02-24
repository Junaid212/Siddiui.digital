import React from "react";
import TestimonialCard from "../Card/TestimonialCard";
import { testimonialdata } from "../../Data/Testimonial";
import useAnimateOnScroll from "../Hooks/useAnimateOnScroll";

const TestimonialPageSection = () => {

    useAnimateOnScroll();

    const groupedData = [];
    for (let i = 0; i < testimonialdata.length; i += 2) {
        groupedData.push(testimonialdata.slice(i, i + 2));
    }

    return (
        <div className="section">
            <div className="hero-container">
                <div className="d-flex flex-column gspace-2">
                    <div className="testimonial-heading-container">
                        <div className="sub-heading justify-content-center">
                            <i className="fa-solid fa-circle-notch"></i>
                            <h6 className="font-family-1 accent-color">Testimonials</h6>
                        </div>
                        <h2 className="text-center animate-box animated animate__animated" data-animate="animate__fadeInUp">
                            Success Stories From Those Who Know Us Best
                        </h2>
                    </div>

                    <div className="row row-cols-lg-3 row-cols-1 grid-spacer-2">
                        {groupedData.map((group, index) => (
                            <div className="col" key={index}>
                                <div className="d-flex flex-column flex-md-row flex-lg-column gspace-2">
                                    {group.map((item, i) => (
                                        <TestimonialCard
                                        key={item.id}
                                        image={item.image}
                                        name={item.name}
                                        designation={item.designation}
                                        content={item.content}
                                        variant={`page-${item.size}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TestimonialPageSection;
