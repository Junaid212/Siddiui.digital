import React, { useState } from "react";
import { Share2, Check } from "lucide-react";
import { copyToClipboard, showShareToast } from "../../utils/shareToast";

const BlogCard = ({ image, title, topic, topic2, id, date }) => {
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
                <div className="card-body p-4">
                    <div className="blog-date mb-2" style={{ fontSize: '0.8rem', color: '#666' }}>
                        <span>{new Date(date).toLocaleDateString()}</span>
                    </div>
                    <h3 className="blog-title h5 mb-3" style={{ fontWeight: '700', lineHeight: '1.4', color: '#222' }}>
                        {title}
                    </h3>
                    <div className="card_footer mt-auto pt-3 border-top">
                        <a href={`/blog/${topic ? topic.toLowerCase().replace(/\s+/g, '-') : 'general'}`} className="blog-link text-decoration-none" style={{ color: '#C80808', fontWeight: '600' }}>
                            Read More <i className="fa-solid fa-arrow-right ms-2"></i>
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}

export default BlogCard;