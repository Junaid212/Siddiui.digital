
import BannerInnerSection from "../../Components/Banner/inner";
import PartnersipSection from "../../Components/Partnership";
import AboutSection from "../../Components/About/about";
import TeamSection from "../../Components/Team";
import AchievementSection from "../../Components/Achievement";
import CtaSection from "../../Components/CallToAction";
import ProcessSection from "../../Components/ProcessStep";
import TestimonialSection from "../../Components/Testimonial/TestimonialSection";
import HeadTitle from "../../Components/Head/HeadTitle";
import Awards from "../../Components/Awards/awards";
import WhyChooseUsSection from "../../Components/ChooseUs";
import OriginPhilosophy from "../../Components/About/OriginPhilosophy";

const AboutPage = () => {
    return(
        <>
            <HeadTitle title="Siddiqui.Digital"/>
            <BannerInnerSection title="About M. Q. Siddiqui" currentPage="About M. Q. Siddiqui" />
            {/* <PartnersipSection /> */}
            <section className="seo-content container" style={{display:'none'}}>
              <h1>About Siddiqui Digital</h1>
              <p>
                Marketing thought leader, educator, and strategic advisor
              </p>
            </section>
            <WhyChooseUsSection />
            <OriginPhilosophy />
            <AchievementSection />
            <ProcessSection />
            <Awards />
            {/* <WhyChooseUsSection /> */}
            {/* <AboutSection /> */}
            {/* <AchievementSection /> */}
            {/* <TeamSection /> */}
            {/* <WhyChooseUsSection /> */}
            {/* <CtaSection /> */}
            
            
            <TeamSection />
            {/* <TestimonialSection /> */}
        </>
    );

}

export default AboutPage;