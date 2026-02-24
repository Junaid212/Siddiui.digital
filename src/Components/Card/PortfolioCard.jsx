import React from "react";

const PortfolioCard = ({logo, image, category, title, content, link, speed = ""}) => {
    return(
        <>
            <div className={`card card-portfolio animate-box animate__animated ${speed}`} data-animate="animate__fadeIn">
                <img src={image} alt="Portfolio Image" className="img-fluid" />
                <div className="portfolio-logo">
                    {/* <img src={logo} alt="Portfolio Logo" className="img-fluid" /> */}
                    <p className="accent-color">{category}</p>
                </div>
                <div className="portfolio-content">
                    {/* <p className="accent-color">{category}</p> */}
                    <h3 className="secondary-accent">{title}</h3>
                    <p className="secondary-accent">{content}</p>
                    <div>
                        <a href={link} className="btn btn-accent">Enroll Now</a>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PortfolioCard;