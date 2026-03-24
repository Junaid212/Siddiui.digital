import React from "react";
import AboutSection from "../../Components/About/about";
import BannerHome from "../../Components/Banner";
import ModalVideoSection from "../../Components/Video/VideoPlayer";
import ProcessSection from "../../Components/ProcessStep";
import PartnersipSection from "../../Components/Partnership";
import ServiceSection from "../../Components/Service";
import WhyChooseUsSection from "../../Components/Chooseus";
import CtaSection from "../../Components/CallToAction";
import PortfolioSection from "../../Components/Portfolio";
import BlogSection from "../../Components/Blog";
import TestimonialSection from "../../Components/Testimonial/TestimonialSection";
import AchievementSection from "../../Components/Achievement";
import Hero from "../../Components/Hero/hero";
import HeroThree from "../../Components/HeroThree/heroThree";
import EbookCardPage from "../../Components/EbookCardPage";

const HomePage = () => {
    return(
        <>
            <Hero/>
            {/* <HeroThree/> */}
            {/* <BannerHome /> */}
            {/* <ModalVideoSection /> */}
            {/* <PartnersipSection /> */}
            <AboutSection />
            {/* <ServiceSection /> */}
            <EbookCardPage/>
            {/* <AchievementSection /> */}
            {/* <ProcessSection /> */}
            {/* <WhyChooseUsSection /> */}
            
            <PortfolioSection />
            <CtaSection />
            {/* <TestimonialSection /> */}
            {/* <BlogSection /> */}
        </>
    );
}

export default HomePage;