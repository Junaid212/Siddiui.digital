import React from "react";
import BannerInnerSection from "../../Components/Banner/inner";
import CtaSection from "../../Components/CallToAction";
import WhyChooseUsSection from "../../Components/Chooseus";
import TestimonialSection from "../../Components/Testimonial/TestimonialSection";
import PortfolioDetailSection from "../../Components/Portfolio/PortfolioDetail";
import HeadTitle from "../../Components/Head/HeadTitle";

const SinglePortfolioPage = () => {
    return(
        <>
            <HeadTitle title="Portfolio Detail" />
            <BannerInnerSection title="Digital Marketing Strategy" currentPage=" Blogs" />
            <PortfolioDetailSection />
            {/* <CtaSection /> */}
            {/* <WhyChooseUsSection /> */}
            {/* <TestimonialSection /> */}
        </>
    );
}

export default SinglePortfolioPage;