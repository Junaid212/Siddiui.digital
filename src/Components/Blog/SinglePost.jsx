import React, { useState } from "react";
import { Share2, Check } from "lucide-react";
import { copyToClipboard, showShareToast } from "../../utils/shareToast";
import CommentSection from "./CommentSection";

const SinglePostSection = ({ blog, loading }) => {
    const [copied, setCopied] = useState(false);

    const handleShare = () => {
        copyToClipboard(window.location.href).then(() => {
            setCopied(true);
            showShareToast("Article link copied to clipboard!");
            setTimeout(() => setCopied(false), 2000);
        });
    };

    if (loading) return (
        <div className="section">
            <div className="hero-container text-center">
                <div className="spinner-border text-danger" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>
    );

    if (!blog) return (
        <div className="section">
            <div className="hero-container text-center">
                <h3>Post not found</h3>
                <a href="/blog-page" className="btn btn-secondary-accent mt-3">Back to Blogs</a>
            </div>
        </div>
    );

    return (
        <div className="section">
            <div className="hero-container">
                <div className="row row-cols-md-2 row-cols-1 grid-spacer-2">
                    {/* Sidebar Column - Mapped from Portfolio UI */}
                    <div className="col col-md-4">
                        <div className="d-flex flex-column gspace-2">
                            <div className="image-container" style={{ position: 'relative' }}>
                                <img
                                    src={blog.image_url}
                                    alt={blog.title}
                                    className="img-fluid"
                                    style={{ borderRadius: '1rem', width: '100%', objectFit: 'cover' }}
                                />
                                <button
                                    onClick={handleShare}
                                    title={copied ? "Link copied!" : "Share article"}
                                    aria-label="Share article"
                                    style={{
                                        position: 'absolute',
                                        top: '15px',
                                        right: '15px',
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: copied ? '#10B981' : 'rgba(24, 24, 27, 0.85)',
                                        color: '#fff',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                                        transition: 'all 0.25s ease',
                                        backdropFilter: 'blur(8px)',
                                    }}
                                >
                                    {copied ? <Check size={18} /> : <Share2 size={18} />}
                                </button>
                            </div>
                            <div className="row row-cols-lg-2 row-cols-1 grid-spacer-2">
                                <div className="col">
                                    <div className="card project-detail">
                                        <h4 className="secondary-accent">Categories</h4>
                                        {(() => {
                                            const cats = [
                                                ...(blog.topic ? blog.topic.split(',').map(s => s.trim()) : []),
                                                ...(blog.topic2 ? blog.topic2.split(',').map(s => s.trim()) : [])
                                            ].filter(Boolean);

                                            if (cats.length === 0) return <p>General</p>;

                                            return (
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                                                    {cats.map((cat, idx) => (
                                                        <a
                                                            key={idx}
                                                            href={`/blog-page?category=${encodeURIComponent(cat.toLowerCase())}`}
                                                            style={{
                                                                display: 'inline-block',
                                                                color: 'inherit',
                                                                textDecoration: 'none',
                                                                fontWeight: '600',
                                                                background: 'rgba(255,255,255,0.08)',
                                                                padding: '3px 10px',
                                                                borderRadius: '6px',
                                                                border: '1px solid rgba(255,255,255,0.15)',
                                                                transition: 'all 0.2s',
                                                            }}
                                                            title={`View all articles in ${cat}`}
                                                        >
                                                            {cat}
                                                        </a>
                                                    ))}
                                                </div>
                                            );
                                        })()}
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="card project-detail">
                                        <h4 className="secondary-accent">Date</h4>
                                        <p>{new Date(blog.published_date || blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Column - Mapped from Portfolio UI */}
                    <div className="col col-md-8">
                        <div className="portfolio-details">
                            <h3>{blog.title}</h3>

                            <div className="blog-content-main">
                                <p style={{ whiteSpace: 'pre-wrap' }}>
                                    {blog.content}
                                </p>
                            </div>

                            {blog.title2 && (
                                <div className="mt-5">
                                    <h4 className="text-muted mb-3">{blog.title2}</h4>
                                    {blog.content2 && (
                                        <div className="blog-content-secondary">
                                            <p style={{ whiteSpace: 'pre-wrap' }}>
                                                {blog.content2}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            <hr className="my-5" />

                            <div className="d-flex justify-content-between align-items-center mb-5 p-3 rounded" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                <h4 className="mb-0">Share this article</h4>
                                <button
                                    onClick={handleShare}
                                    className="btn btn-secondary-accent btn-sm d-flex align-items-center gap-2"
                                    style={{ borderRadius: '25px', padding: '8px 20px', cursor: 'pointer' }}
                                    title="Copy link to clipboard"
                                >
                                    {copied ? <Check size={16} /> : <Share2 size={16} />}
                                    <span>{copied ? "Link Copied!" : "Copy Share Link"}</span>
                                </button>
                            </div>

                            <CommentSection blogId={blog.id} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SinglePostSection;