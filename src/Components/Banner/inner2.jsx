import React from "react";

const BannerInnerSection2 = ({title, currentPage}) => {
    return(
        <>
            <div className="section compact-top-bottom">
                <div className="hero-container">
                    <div className="banner-inner-style2 ">
                        <div className="banner-inner-content2 no-dark"  >
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

export default BannerInnerSection2;