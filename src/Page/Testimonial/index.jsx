import React from "react";
import BannerInnerSection from "../../Components/Banner/inner";
import TestimonialPageSection from "../../Components/Testimonial/TestimonialPage";
import HeadTitle from "../../Components/Head/HeadTitle";

const TestimonialPage = () => {
    return(
        <>
            <HeadTitle title="Testimonials - Aspire - SEO & Digital Marketing Agency" />
            <BannerInnerSection title="Testimonial" currentPage="Testimonial" />
            <TestimonialPageSection />
        </>
    );
}

export default TestimonialPage;