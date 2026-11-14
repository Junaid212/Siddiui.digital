import React from "react";
import BannerInnerSection from "../../Components/Banner/inner";
import ContactSection from "../../Components/Contact";
import HeadTitle from "../../Components/Head/HeadTitle";
import { seoProps } from "../../Data/pageSeo";

const ContactPage = () => {
    return(
        <>
            <HeadTitle {...seoProps("contact")} />
            <BannerInnerSection title="Contact Us" currentPage="Contact Us" />
            <ContactSection />
        </>
    );
}

export default ContactPage;