import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import BlogCard from "../Card/BlogCard";
import useAnimateOnScroll from "../Hooks/useAnimateOnScroll";

const BlogSectionExtend = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    useAnimateOnScroll();

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const { data, error } = await supabase
                    .from('blogs')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setBlogs(data || []);
            } catch (err) {
                console.error("Error fetching archive blogs:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    if (loading) return null;

    return (
        <>
            <div className="section">
                <div className="hero-container">
                    <div className="d-flex flex-column gspace-2">
                        <div className="blog-heading-container">
                            <div className="sub-heading justify-content-center">
                                <i className="fa-solid fa-circle-notch"></i>
                                <h6 className="font-family-1 accent-color">Insight</h6>
                            </div>
                            <h2 className="animate-box animated animate__animated" data-animate="animate__fadeInUp">Access Our Comprehensive Blog Archive</h2>
                        </div>
                        <div className="row row-cols-lg-3 row-cols-md-2 row-cols-1 grid-spacer-2">
                            {blogs.map((item) => (
                                <div className="col" key={item.id}>
                                    <BlogCard
                                        image={item.image_url}
                                        title={item.title}
                                        topic={item.topic}
                                        id={item.id}
                                        date={item.published_date || item.created_at}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default BlogSectionExtend;