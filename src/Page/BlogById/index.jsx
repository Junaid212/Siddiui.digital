import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api } from "../../api";
import HeadTitle from "../../Components/Head/HeadTitle";
import BannerInnerSection from "../../Components/Banner/inner";
import SinglePostSection from "../../Components/Blog/SinglePost";

const BlogByIdPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            if (!id) return;
            try {
                // Fetch all public blogs and find by ID
                const res = await api.getPublicBlogs();
                const found = (res.blogs || []).find(b => String(b.id) === String(id));
                if (found) {
                    setBlog(found);
                } else {
                    // Blog not found — redirect to blogs page
                    navigate('/blog-page', { replace: true });
                }
            } catch (err) {
                console.error("Error fetching blog by id:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [id, navigate]);

    const pageTitle = blog ? `${blog.title} - Siddiqui Digital` : "Blog Detail";
    const bannerTitle = blog ? blog.title : (loading ? "Loading..." : "Blog Post");

    return (
        <>
            <HeadTitle title={pageTitle} />
            <BannerInnerSection title={bannerTitle} currentPage={bannerTitle} />
            <SinglePostSection blog={blog} loading={loading} />
        </>
    );
};

export default BlogByIdPage;
