import React from "react";
import BannerInnerSection from "../../Components/Banner/inner";
import BlogSectionExtend from "../../Components/Blog/extend";
import HeadTitle from "../../Components/Head/HeadTitle";
import BannerInnerSection2 from "../../Components/Banner/inner2";

const BlogPage = () => {
    return(
        <>
            <HeadTitle title="Siddiqui.Digital"/>
            <BannerInnerSection2 title="Blog" currentPage="Blog Archive" />
            <BlogSectionExtend/>
        </>
    );
}

export default BlogPage;