import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../../api";
import HeadTitle from "../../Components/Head/HeadTitle";
import SinglePostSection from "../../Components/Blog/SinglePost";

const BlogByIdPage = () => {
    const params = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [blog, setBlog] = useState(null);
    const [relatedArticles, setRelatedArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    const identifier = params.slug || params.id || params.topic;
    const isPreview = searchParams.get('preview') === 'true';

    useEffect(() => {
        let isMounted = true;

        const fetchBlog = async () => {
            if (!identifier) {
                if (isMounted) setLoading(false);
                return;
            }

            setLoading(true);
            try {
                // 1. Try getBlogBySlug (matches slug or ID and returns related articles)
                try {
                    const slugRes = await api.getBlogBySlug(identifier, isPreview);
                    if (slugRes && slugRes.blog) {
                        if (isMounted) {
                            setBlog(slugRes.blog);
                            setRelatedArticles(slugRes.relatedArticles || []);
                            setLoading(false);
                        }
                        return;
                    }
                } catch (e) {
                    // Slug API failed or 404, fallback to search in all public blogs
                }

                // 2. Fallback: Search all public blogs
                const publicRes = await api.getPublicBlogs();
                const allBlogs = publicRes.blogs || [];

                // Match by slug, ID, or sanitized title
                const found = allBlogs.find(b =>
                    String(b.slug).toLowerCase() === String(identifier).toLowerCase() ||
                    String(b.id) === String(identifier) ||
                    (b.title && b.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === String(identifier).toLowerCase())
                );

                if (found) {
                    if (isMounted) {
                        setBlog(found);
                        // Find up to 3 related articles from same category
                        const others = allBlogs.filter(b => b.id !== found.id);
                        const sameCat = others.filter(b =>
                            Array.isArray(b.categories) &&
                            Array.isArray(found.categories) &&
                            b.categories.some(c => found.categories.includes(c))
                        );
                        setRelatedArticles(sameCat.length >= 3 ? sameCat.slice(0, 3) : others.slice(0, 3));
                        setLoading(false);
                    }
                } else {
                    // Check if identifier matches a category/topic name
                    const isTopic = allBlogs.some(b =>
                        Array.isArray(b.categories) &&
                        b.categories.some(c => c.toLowerCase() === identifier.toLowerCase().replace(/-/g, ' '))
                    );
                    if (isTopic) {
                        navigate(`/blog-page?category=${encodeURIComponent(identifier.toLowerCase())}`, { replace: true });
                    } else {
                        navigate('/blog-page', { replace: true });
                    }
                }
            } catch (err) {
                console.error("Error fetching blog:", err);
                if (isMounted) setLoading(false);
            }
        };

        fetchBlog();

        return () => {
            isMounted = false;
        };
    }, [identifier, isPreview, navigate]);

    const pageTitle = blog
        ? (blog.seo_title || `${blog.title} - Siddiqui Digital`)
        : (loading ? "Loading Article - Siddiqui Digital" : "Article - Siddiqui Digital");

    const pageDescription = blog
        ? (blog.seo_description || blog.standfirst || blog.summary || "Editorial insights, frameworks, and strategic perspectives by M. Q. Siddiqui.")
        : "Editorial insights and strategic perspectives by M. Q. Siddiqui.";

    return (
        <>
            <HeadTitle title={pageTitle} description={pageDescription} />
            <SinglePostSection
                blog={blog}
                relatedArticles={relatedArticles}
                loading={loading}
            />
        </>
    );
};

export default BlogByIdPage;
