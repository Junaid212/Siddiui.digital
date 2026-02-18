import React from "react";
import BannerInnerSection from "../../Components/Banner/inner";
import TeamSectionExtend from "../../Components/Team/extend";
import CtaSection from "../../Components/CallToAction";
import WhyChooseUsSection from "../../Components/Chooseus";
import ProcessSection from "../../Components/ProcessStep";
import HeadTitle from "../../Components/Head/HeadTitle";

const TeamPage = () => {
    return(
        <>
            <HeadTitle title="Team - Aspire - SEO & Digital Marketing Agency" />
            <BannerInnerSection title="Team" currentPage="Team" />
            <TeamSectionExtend />
            <CtaSection />
            <WhyChooseUsSection />
            <ProcessSection />
        </>
    );
}

export default TeamPage;