import React from "react";
import { servicedata } from "../../Data/Service";
import ServiceCard from "../Card/ServiceCard";
import useAnimateOnScroll from "../Hooks/useAnimateOnScroll";

const EBook = () => {

    useAnimateOnScroll();

    return(
        <>
            <div className="section spacious-bottom">
                <div className="hero-container">
                    <div className="d-flex flex-column gspace-2">
                        {/* <div className="service-heading-container">
                            <div className="sub-heading justify-content-center">
                                <i className="fa-solid fa-circle-notch"></i>
                                <h6 className="font-family-1 accent-color">E-Book</h6>
                            </div>
                            <h2 className="text-center animate-box animated animate__animated" data-animate="animate__fadeInUp">Practical Marketing & Management for  Success</h2>
                        </div> */}
                        <div className="row row-cols-lg-3 row-cols-md-2 row-cols-1 grid-spacer-2">
                            {servicedata.slice(0, 5).map((item) => (
                                    <div className="col" key={item.id}>
                                        <ServiceCard
                                            // icon={item.icon}
                                            image={item.image}
                                            title={item.title}
                                            content={item.content}
                                            link={item.link}
                                            // highlight={index === 1}
                                        />
                                    </div>
                            ))}
                        </div>
                        {/* <div className="cta-container" style={{marginTop:'30px'}}>
                                    <a href="#" className="btn btn-secondary-accent ">Explore Books</a>
                                </div> */}
                    </div>
                </div>
            </div>
        </>
    )
}

export default EBook;