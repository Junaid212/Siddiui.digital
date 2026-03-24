import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import BlogCard from "../Card/BlogCard";

const BlogSection = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecentBlogs = async () => {
            try {
                const { data, error } = await supabase
                    .from('blogs')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(3);

                if (error) throw error;
                setBlogs(data || []);
            } catch (err) {
                console.error("Error fetching blogs on home page:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRecentBlogs();
    }, []);

    if (loading) return null; // Or a smaller loading state

    return (
        <>
            <div className="section">
                <div className="hero-container">
                    <div className="d-flex flex-column gspace-2">
                        <div className="blog-heading-container">
                            <div className="sub-heading justify-content-center">
                                <i className="fa-solid fa-circle-notch"></i>
                                <h6 className="font-family-1 accent-color">Our Blog</h6>
                            </div>
                            <h2 className="animate-box animated animate__animated" data-animate="animate__fadeInUp">Latest Insights & Stories</h2>
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
                        <div className="cta-container" style={{ marginTop: '30px' }}>
                            <a href="/blog" className="btn btn-secondary-accent ">Explore All Articles</a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default BlogSection;