import React from "react";
import BannerInnerSection from "../../Components/Banner/inner";
import HeadTitle from "../../Components/Head/HeadTitle";
import Ebooks from "../../Components/Ebooks";

const EbookPage = () => {
    return (
        <>
            <HeadTitle title="E-Books - Digital Marketing Agency" />
            <BannerInnerSection title="Featured E-Books" currentPage="E-Books" />
            <Ebooks />
        </>
    );
};

export default EbookPage;
