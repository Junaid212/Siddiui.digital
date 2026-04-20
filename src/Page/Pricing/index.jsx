import React from "react";
import BannerInnerSection from "../../Components/Banner/inner";
import CtaSection from "../../Components/CallToAction";
import WhyChooseUsSection from "../../Components/Chooseus";
import ProcessSection from "../../Components/ProcessStep";
import PricingSection from "../../Components/Pricing";
import HeadTitle from "../../Components/Head/HeadTitle";
import HeroThree from "../../Components/HeroThree/heroThree";
import BannerHome from "../../Components/Banner";

const PricingPage = () => {
    return(
        <>       
            <HeadTitle title="Pricing Plan - Aspire - SEO & Digital Marketing Agency" />
            {/* <BannerInnerSection title="Pricing Plan" currentPage="Pricing Plan" /> */}
            <BannerHome />
            <PricingSection />
            {/* <CtaSection />
            <WhyChooseUsSection />
            <ProcessSection /> */}
        </>
    );
}

export default PricingPage;