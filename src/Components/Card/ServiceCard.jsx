import React from "react";


const ServiceCard  = ({icon,image, title, content, link, highlight}) => {
    return(
        <>
            <div
                className={`card card-service animate-box animated animate__animated ${highlight ? 'card-service--highlight' : ''}`}
                data-animate="animate__fadeIn"
            >
                <div className="" style={{display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "1rem"}}>
                    {/* <i className={icon}></i> */}
                    <img src={image} alt={title} className="service-icon" style={{borderRadius:'10px'}} />
               </div>
                <h3 className="secondary-accent">{title}</h3>
                <p>{content}</p>
                <div className="service-cta ">
                    <a href={link} className="accent-color  no-light">Buy Now</a>
                    <i className="fa-solid fa-arrow-right"></i>
                </div>
            </div>
        </>
    );
}

export default ServiceCard;