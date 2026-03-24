import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import HeadTitle from "../../Components/Head/HeadTitle";
import BannerInnerSection from "../../Components/Banner/inner";
import SinglePostSection from "../../Components/Blog/SinglePost";

const SinglePostPage = () => {
    const { topic } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            if (!topic) return;
            try {
                // Un-slugify the topic from URL to match the DB Topic (hyphens back to spaces)
                const formattedTopic = topic.replace(/-/g, ' ');

                const { data, error } = await supabase
                    .from('blogs')
                    .select('*')
                    .ilike('topic', formattedTopic)
                    .single();

                if (error) throw error;
                setBlog(data);
            } catch (err) {
                console.error("Error fetching blog by topic:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [topic]);

    const pageTitle = blog ? `${blog.title} - Siddiui Digital` : "Blog Detail";
    const bannerTitle = blog ? blog.title : (loading ? "Loading..." : "Blog Post");

    return (
        <>
            <HeadTitle title={pageTitle} />
            <BannerInnerSection title={bannerTitle} currentPage={bannerTitle} />
            <SinglePostSection blog={blog} loading={loading} />
        </>
    );
}

export default SinglePostPage;