import React from "react";
import BannerInnerSection from "../../Components/Banner/inner";
import FaqSection from "../../Components/Faq";
import HeadTitle from "../../Components/Head/HeadTitle";

const FaqPage = () => {
    return(
        <>
            <HeadTitle title="FAQs - Aspire - SEO & Digital Marketing Agency" />
            <BannerInnerSection title="Frequently Asked Questions" currentPage="Frequently Asked Questions" />
            <FaqSection />
        </>
    );
}

export default FaqPage;