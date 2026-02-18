import React from "react";
import BannerInnerSection from "../../Components/Banner/inner";
import PortfolioSection from "../../Components/Portfolio";
import CtaSection from "../../Components/CallToAction";
import WhyChooseUsSection from "../../Components/Chooseus";
import TeamSection from "../../Components/Team";
import TestimonialSection from "../../Components/Testimonial/TestimonialSection";
import HeadTitle from "../../Components/Head/HeadTitle";

const PortfolioPage = () => {
    return(
        <>
            <HeadTitle title="Portfolio - Aspire - SEO & Digital Marketing Agency" />
            <BannerInnerSection title="Portfolio" currentPage="Portfolio" />
            <PortfolioSection />
            <CtaSection />
            <WhyChooseUsSection />
            <TeamSection />
            <TestimonialSection />
        </>
    );
}

export default PortfolioPage;