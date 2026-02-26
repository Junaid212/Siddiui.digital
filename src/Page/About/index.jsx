
import BannerInnerSection from "../../Components/Banner/inner";
import PartnersipSection from "../../Components/Partnership";
import AboutSection from "../../Components/About/about";
import TeamSection from "../../Components/Team";
import AchievementSection from "../../Components/Achievement";
import CtaSection from "../../Components/CallToAction";
import ProcessSection from "../../Components/ProcessStep";
import TestimonialSection from "../../Components/Testimonial/TestimonialSection";
import WhyChooseUsSection from "../../Components/Chooseus";
import HeadTitle from "../../Components/Head/HeadTitle";
import Awards from "../../Components/Awards/awards";

const AboutPage = () => {
    return(
        <>
            <HeadTitle title="About Us"/>
            <BannerInnerSection title="About Us" currentPage="About Us" />
            {/* <PartnersipSection /> */}
            <WhyChooseUsSection />
            <Awards />
            {/* <AboutSection /> */}
            <AchievementSection />
            {/* <TeamSection /> */}
            {/* <WhyChooseUsSection /> */}
            {/* <CtaSection /> */}
            <ProcessSection />
            
            <TeamSection />
            {/* <TestimonialSection /> */}
        </>
    );

}

export default AboutPage;