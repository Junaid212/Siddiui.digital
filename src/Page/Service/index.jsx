import React from "react";
import BannerInnerSection from "../../Components/Banner/inner";
import PartnersipSection from "../../Components/Partnership";
import ServiceSection from "../../Components/Service";
import AchievementSection from "../../Components/Achievement";
import ProcessSection from "../../Components/ProcessStep";
import WhyChooseUsSection from "../../Components/Chooseus";
import CtaSection from "../../Components/CallToAction";
import TeamSection from "../../Components/Team";
import TestimonialSection from "../../Components/Testimonial/TestimonialSection";
import HeadTitle from "../../Components/Head/HeadTitle";

const ServicePage = () => {
    return(
        <>
            <HeadTitle title="Services - Aspire - SEO & Digital Marketing Agency" />
            <BannerInnerSection title="Services" currentPage="Services" />
            <PartnersipSection />
            <ServiceSection />
            <AchievementSection />
            <ProcessSection />
            <WhyChooseUsSection />
            <CtaSection />
            <TeamSection />
            <TestimonialSection />
        </>
    );
}

export default ServicePage;