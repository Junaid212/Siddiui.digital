import React from "react";
import BannerInnerSection from "../../Components/Banner/inner";
import SingleServiceSection from "../../Components/Service/SingleService";
// import AchievementSection from "../../Components/Achievement";
// import TeamSection from "../../Components/Team";
// import WhyChooseUsSection from "../../Components/Chooseus";
import HeadTitle from "../../Components/Head/HeadTitle";
import EnrollBook from "../../Components/EnrollBook/enrollBook";

const SingleServicePage = () => {
    return(
        <>
            <HeadTitle title="E-Book" />
            {/* <BannerInnerSection title="On-Page SEO" currentPage="On page SEO" /> */}
            <SingleServiceSection />
            {/* <EnrollBook /> */}
            {/* <AchievementSection/> */}
            {/* <TeamSection /> */}
            {/* <WhyChooseUsSection /> */}
        </>
    );
}

export default SingleServicePage;