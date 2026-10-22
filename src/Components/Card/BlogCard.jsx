import React, { useState } from "react";
import { Share2, Check } from "lucide-react";
import { copyToClipboard, showShareToast } from "../../utils/shareToast";

const BlogCard = ({ image, title, topic, topic2, id, date, linkedin_url, instagram_url, facebook_url }) => {
    const [copied, setCopied] = useState(false);

    const handleShare = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const shareUrl = id
            ? `${window.location.origin}/blogs/${id}`
            : `${window.location.origin}/blog/${topic ? topic.toLowerCase().replace(/\s+/g, '-') : 'general'}`;

        copyToClipboard(shareUrl).then(() => {
            setCopied(true);
            showShareToast("Blog link copied to clipboard!");
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const hasSocials = Boolean(linkedin_url || instagram_url || facebook_url);

    return (
        <>
            <div className="card h-100 shadow-sm border-0" style={{ borderRadius: '25px', overflow: 'hidden', background: '#fff' }}>
                <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                    <img
                        src={image}
                        alt={title}
                        className="img-fluid w-100 h-100"
                        style={{ objectFit: 'cover' }}
                    />
                    <div style={{
                        position: 'absolute',
                        top: '15px',
                        left: '15px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '6px'
                    }}>
                        {[
                            ...(topic ? topic.split(',').map(s => s.trim()) : []),
                            ...(topic2 ? topic2.split(',').map(s => s.trim()) : [])
                        ].filter(Boolean).map((t, idx) => (
                            <span key={idx} style={{
                                background: idx === 0 ? '#C80808' : 'rgba(24, 24, 27, 0.85)',
                                color: '#fff',
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '0.75rem',
                                fontWeight: '700'
                            }}>
                                {t}
                            </span>
                        ))}
                    </div>

                    <button
                        onClick={handleShare}
                        title={copied ? "Link copied!" : "Share article"}
                        aria-label="Share article"
                        style={{
                            position: 'absolute',
                            top: '15px',
                            right: '15px',
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: copied ? '#10B981' : 'rgba(255, 255, 255, 0.9)',
                            color: copied ? '#fff' : '#1a1a1a',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                            transition: 'all 0.25s ease',
                            zIndex: 2,
                        }}
                        onMouseEnter={(e) => {
                            if (!copied) {
                                e.currentTarget.style.transform = 'scale(1.1)';
                                e.currentTarget.style.background = '#fff';
                                e.currentTarget.style.color = '#C80808';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!copied) {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                                e.currentTarget.style.color = '#1a1a1a';
                            }
                        }}
                    >
                        {copied ? <Check size={16} /> : <Share2 size={16} />}
                    </button>
                </div>
                <div className="card-body p-4 d-flex flex-column">
                    <div className="blog-date mb-2" style={{ fontSize: '0.8rem', color: '#666' }}>
                        <span>{new Date(date).toLocaleDateString()}</span>
                    </div>
                    <h3 className="blog-title h5 mb-3" style={{ fontWeight: '700', lineHeight: '1.4', color: '#222' }}>
                        {title}
                    </h3>
                    <div className="card_footer mt-auto pt-3 border-top d-flex align-items-center justify-content-between">
                        <a href={`/blogs/${id || (topic ? topic.toLowerCase().replace(/\s+/g, '-') : 'general')}`} className="blog-link text-decoration-none" style={{ color: '#C80808', fontWeight: '600' }}>
                            Read More <i className="fa-solid fa-arrow-right ms-2"></i>
                        </a>

                        {hasSocials && (
                            <div className="d-inline-flex align-items-center" style={{ gap: '6px' }} onClick={(e) => e.stopPropagation()}>
                                {linkedin_url && (
                                    <a
                                        href={linkedin_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        title="LinkedIn"
                                        aria-label="LinkedIn"
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '26px',
                                            height: '26px',
                                            borderRadius: '50%',
                                            background: '#EEF2F6',
                                            color: '#0A66C2',
                                            textDecoration: 'none',
                                            border: '1px solid #DCE2EC'
                                        }}
                                    >
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                        </svg>
                                    </a>
                                )}
                                {instagram_url && (
                                    <a
                                        href={instagram_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        title="Instagram"
                                        aria-label="Instagram"
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '26px',
                                            height: '26px',
                                            borderRadius: '50%',
                                            background: '#EEF2F6',
                                            color: '#C13584',
                                            textDecoration: 'none',
                                            border: '1px solid #DCE2EC'
                                        }}
                                    >
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.13-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                        </svg>
                                    </a>
                                )}
                                {facebook_url && (
                                    <a
                                        href={facebook_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        title="Facebook"
                                        aria-label="Facebook"
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '26px',
                                            height: '26px',
                                            borderRadius: '50%',
                                            background: '#EEF2F6',
                                            color: '#1877F2',
                                            textDecoration: 'none',
                                            border: '1px solid #DCE2EC'
                                        }}
                                    >
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                        </svg>
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default BlogCard;