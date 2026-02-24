import React from "react";
import BannerInnerSection from "../../Components/Banner/inner";
import BlogSectionExtend from "../../Components/Blog/extend";
import HeadTitle from "../../Components/Head/HeadTitle";

const BlogPage = () => {
    return(
        <>
            <HeadTitle title="Blog Archive - Aspire - SEO & Digital Marketing Agency" />
            <BannerInnerSection title="Blog Archive" currentPage="Blog Archive" />
            <BlogSectionExtend/>
        </>
    );
}

export default BlogPage;