import React from "react";

const BannerInnerSection = ({title, currentPage}) => {
    return(
        <>
            <div className="section compact-top-bottom">
                <div className="hero-container">
                    <div className="banner-inner ">
                        <div className="banner-inner-content no-dark" >
                            <h1 > {title}</h1>
                            <nav className="breadcrumb">
                                <a href="#">Home</a>
                                <i className="fa-solid fa-arrow-right no-dark"></i>
                                <a href="#">{currentPage}</a>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default BannerInnerSection;