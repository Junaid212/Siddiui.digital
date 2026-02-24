import React from "react";

const TestimonialCard = ({image, name, designation, content, variant, speed = ""}) => {
    const getClassName = () => {
        switch (variant) {
            case "box":
                return "card-testimonial card-testimonial--box";
            case "page-wide":
                return "card-testimonial card-testimonial--page card-testimonial-wide";
            case "page-small":
                return "card-testimonial card-testimonial--page card-testimonial-small";
            default:
                return "card-testimonial";
        }
    };

    const dataAnimate = variant === "box" ? "animate__fadeInRight" : "animate__fadeIn";

    return (
        <div
            className={`${getClassName()} animate-box animate__animated ${speed}`}
            data-animate={dataAnimate}
        >
            <div className="d-flex flex-row align-items-center justify-content-between">
                <div className="d-flex flex-row gspace-2">
                    <img src={image} alt="Testimonial Image" className="testimonial-person-image" />
                    <div className="d-flex flex-column gap-0">
                        <span>{name}</span>
                        <p className="testimonial-designation">{designation}</p>
                    </div>
                </div>
                <i className="fa-solid fa-3x fa-quote-right"></i>
            </div>
            <p>{content}</p>
        </div>
      );
}

export default TestimonialCard;