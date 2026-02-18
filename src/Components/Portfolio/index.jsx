import React from "react";
import { portfoliodata } from "../../Data/Portfolio";
import PortfolioCard from "../Card/PortfolioCard";

const PortfolioSection = () => {
    return(
        <>
            <div className="section spacious-top">
                <div className="hero-container">
                    <div className="d-flex flex-column gspace-2">
                        <div className="portfolio-heading-container">
                            <div className="sub-heading justify-content-center">
                                <i className="fa-solid fa-circle-notch"></i>
                                <h6 className="font-family-1 accent-color-1">Courses</h6>
                            </div>
                            <h2 className="animate-box animated animate__animated" data-animate="animate__fadeInUp">Expert-Led Marketing &  Management Courses</h2>
                        </div>
                        <div className="row row-cols-lg-2 row-cols-md-2 row-cols-1 grid-spacer-2">
                            {portfoliodata.map((item) => (
                                <div className="col" key={item.id}>
                                    <PortfolioCard
                                        image={item.image}
                                        logo={item.logo}
                                        category={item.category}
                                        title={item.title}
                                        content={item.content}
                                        link={item.link}
                                        speed={item.speed}
                                    />
                                </div>
                            ))}
                        </div>
                         <div className="cta-container" style={{marginTop:'30px'}}>
                                    <a href="#" className="btn btn-secondary-accent ">Explore Courses</a>
                                </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PortfolioSection;