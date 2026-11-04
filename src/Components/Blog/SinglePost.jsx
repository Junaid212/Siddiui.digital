import DOMPurify from "dompurify";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { copyToClipboard, showShareToast } from "../../utils/shareToast";
import CommentSection from "./CommentSection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
    faLinkedin,
    faWhatsapp,
    faXTwitter,
    faThreads,
    faFacebook,
} from "@fortawesome/free-brands-svg-icons";

import {
    Mail,
    Copy,
    Check,
    Share2,
} from "lucide-react";


// Helper to calculate reading time from text
const calculateReadingTime = (text) => {
    if (!text) return "3 min read";
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${Math.max(1, minutes)} min read`;
};

const BrandIcon = ({ icon }) => (
    <svg
        viewBox="0 0 24 24"
        width="17"
        height="17"
        fill="currentColor"
        aria-hidden="true"
    >
        <path d={icon.path} />
    </svg>
);

const ArticleShareBar = ({ title, url }) => {
    const [copied, setCopied] = useState(false);

    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const shareText = encodeURIComponent(`${title}\n${url}`);

    const shareOptions = [
        {
            name: "LinkedIn",
            label: "Share on LinkedIn",
            url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
            icon: <FontAwesomeIcon icon={faLinkedin} />,
        },
        {
            name: "WhatsApp",
            label: "Share on WhatsApp",
            url: `https://wa.me/?text=${shareText}`,
            icon: <FontAwesomeIcon icon={faWhatsapp} />,
        },
        {
            name: "X",
            label: "Share on X",
            url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
            icon: <FontAwesomeIcon icon={faXTwitter} />,
        },
        {
            name: "Threads",
            label: "Share on Threads",
            url: `https://www.threads.net/intent/post?text=${shareText}`,
            icon: <FontAwesomeIcon icon={faThreads} />,
        },
        {
            name: "Facebook",
            label: "Share on Facebook",
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            icon: <FontAwesomeIcon icon={faFacebook} />,
        },
    ];

    const handleCopy = async () => {
        try {
            await copyToClipboard(url);
            setCopied(true);
            showShareToast("Link copied");

            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error("Unable to copy link:", error);
        }
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    url,
                    text: title,
                });
            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error("Native sharing failed:", error);
                }
            }
        } else {
            handleCopy();
        }
    };

    return (
        <div className="article-share-bar">
            <span className="article-share-label">
                Share this article
            </span>

            <div className="article-share-icons">
                {shareOptions.map((item) => (
                    <a
                        key={item.name}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="article-share-icon"
                        aria-label={item.label}
                        data-tooltip={item.label}
                    >
                        {item.icon}
                    </a>
                ))}

                <a
                    href={`mailto:?subject=${encodedTitle}&body=${shareText}`}
                    className="article-share-icon"
                    aria-label="Share by Email"
                    data-tooltip="Share by Email"
                >
                    <Mail />
                </a>

                <button
                    type="button"
                    className="article-share-icon"
                    onClick={handleCopy}
                    aria-label="Copy article link"
                    data-tooltip="Copy Link"
                >
                    {copied ? <Check /> : <Copy />}
                </button>

                <button
                    type="button"
                    className="article-share-icon"
                    onClick={handleNativeShare}
                    aria-label="More sharing options"
                    data-tooltip="More sharing options"
                >
                    <Share2 />
                </button>
            </div>

            {copied && (
                <span className="article-share-feedback" role="status">
                    Link copied
                </span>
            )}
        </div>
    );
};

const SinglePostSection = ({ blog, relatedArticles = [], loading }) => {
    const [copied, setCopied] = useState(false);

    const shareUrl =
    typeof window !== "undefined"
        ? `${window.location.origin}${window.location.pathname}`
        : "";

    const handleCopyLink = () => {
        copyToClipboard(shareUrl).then(() => {
            setCopied(true);
            showShareToast("Article link copied to clipboard!");
            setTimeout(() => setCopied(false), 2500);
        });
    };

    if (loading) {
        return (
            <div style={{ background: '#ffffff', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                    <div className="spinner-border text-danger" role="status">
                        <span className="visually-hidden">Loading article...</span>
                    </div>
                    <span style={{ color: '#4A5163', fontSize: '16px', fontFamily: "'Source Sans 3', sans-serif" }}>
                        Loading article...
                    </span>
                </div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div style={{ background: '#ffffff', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
                <div style={{ textAlign: 'center', maxWidth: '480px' }}>
                    <h2 style={{ fontFamily: "'Source Serif 4', Georgia, serif", color: '#13294B', fontSize: '32px', marginBottom: '16px' }}>
                        Article Not Found
                    </h2>
                    <p style={{ color: '#4A5163', fontSize: '17px', lineHeight: 1.6, marginBottom: '24px' }}>
                        The article you are looking for may have been moved, unpublished, or is no longer available.
                    </p>
                    <Link
                        to="/blog-page"
                        style={{
                            display: 'inline-block',
                            background: '#A3192F',
                            color: '#ffffff',
                            fontWeight: 700,
                            padding: '12px 28px',
                            borderRadius: '8px',
                            textDecoration: 'none'
                        }}
                    >
                        Back to Blog Archive
                    </Link>
                </div>
            </div>
        );
    }

    // Extract categories
    const categories = Array.isArray(blog.categories) && blog.categories.length > 0
        ? blog.categories
        : [
            ...(blog.topic ? blog.topic.split(',').map(s => s.trim()) : []),
            ...(blog.topic2 ? blog.topic2.split(',').map(s => s.trim()) : [])
        ].filter(Boolean);

    const primaryCategory = categories[0] || 'Perspectives';
    const standfirst = blog.standfirst || blog.summary || '';
    const authorByline = blog.author_byline || 'By M. Q. Siddiqui, Founder, Siddiqui.digital';
    const authorName = authorByline.replace(/^By\s+/i, '').split(',')[0].trim() || 'M. Q. Siddiqui';
    const rolePart = authorByline.includes(',') ? authorByline.substring(authorByline.indexOf(',') + 1).trim() : 'Founder, Siddiqui.digital';

    // Normalize repeatable sub-sections with backwards compatibility for title2/content2
    let normalizedSubSections = [];
    if (Array.isArray(blog.sub_sections) && blog.sub_sections.length > 0) {
        normalizedSubSections = blog.sub_sections;
    } else if (typeof blog.sub_sections === 'string' && blog.sub_sections.trim()) {
        try {
            const parsed = JSON.parse(blog.sub_sections);
            if (Array.isArray(parsed) && parsed.length > 0) {
                normalizedSubSections = parsed;
            }
        } catch (e) {
            // fallback
        }
    }

    // Move current "Additional Sub-Section" content automatically into Sub-section 1 if sub_sections is empty
    if (normalizedSubSections.length === 0 && (blog.title2 || blog.content2)) {
        normalizedSubSections = [{
            heading: blog.title2 || '',
            body: blog.content2 || '',
            highlight_type: 'none',
            highlight_text: ''
        }];
    }

    const allSubText = normalizedSubSections.map(s => `${s.heading || ''} ${s.body || ''}`).join(' ');
    const readingTime = blog.reading_time || calculateReadingTime(`${blog.content || ''} ${allSubText}`);

    // Pull quote placement (0 = after full body, 1 = after sub 1, etc.; default 1)
    const pullQuotePos = (blog.pull_quote_position !== undefined && blog.pull_quote_position !== null)
        ? parseInt(blog.pull_quote_position, 10)
        : 1;

    // Helper functions for bullet lines and paragraphs
    const isBulletLine = (line) => {
        if (!line) return false;
        const t = line.trim();
        return t.startsWith('•') || t.startsWith('·') || t.startsWith('- ') || t.startsWith('* ');
    };

    const cleanBulletText = (line) => {
        if (!line) return '';
        return line.trim().replace(/^[•·\-\*]\s*/, '').trim();
    };

    const isHtmlContent = (str) => {
        if (!str || typeof str !== 'string') return false;
        return /<(p|h[1-6]|ul|ol|li|blockquote|div|strong|em|u|a|img|hr|table|span)\b[^>]*>/i.test(str);
    };

    // Parse editorial body: supports rich HTML as well as legacy plain text
    const renderEditorialBody = (text) => {
        if (!text || typeof text !== 'string') return null;

        if (isHtmlContent(text)) {
            const cleanHtml = DOMPurify.sanitize(text, {
                ADD_ATTR: ['target', 'rel', 'class', 'style', 'alt', 'title', 'src'],
                ADD_TAGS: ['img', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'p', 'blockquote', 'strong', 'em', 'u', 'a', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td']
            });

            return (
                <div
                    className="editorial-rendered-content"
                    dangerouslySetInnerHTML={{ __html: cleanHtml }}
                />
            );
        }

        const blocks = text.split(/\n\s*\n/);

        return blocks.map((block, bIdx) => {
            const trimmed = block.trim();
            if (!trimmed) return null;

            const lines = trimmed.split('\n').map(l => l.trim()).filter(Boolean);
            const allBullets = lines.length > 0 && lines.every(isBulletLine);

            if (allBullets) {
                return (
                    <ul key={bIdx} style={{ margin: '0 0 24px 0', paddingLeft: '26px', listStyleType: 'disc' }}>
                        {lines.map((l, lIdx) => (
                            <li key={lIdx} style={{ marginBottom: '8px', lineHeight: '1.75' }}>
                                {cleanBulletText(l)}
                            </li>
                        ))}
                    </ul>
                );
            }

            const hasBullets = lines.some(isBulletLine);
            if (hasBullets) {
                const elements = [];
                let bulletGroup = [];

                lines.forEach((line, lIdx) => {
                    if (isBulletLine(line)) {
                        bulletGroup.push(cleanBulletText(line));
                    } else {
                        if (bulletGroup.length > 0) {
                            elements.push(
                                <ul key={`ul-${lIdx}`} style={{ margin: '0 0 16px 0', paddingLeft: '26px', listStyleType: 'disc' }}>
                                    {bulletGroup.map((bText, bi) => (
                                        <li key={bi} style={{ marginBottom: '8px', lineHeight: '1.75' }}>{bText}</li>
                                    ))}
                                </ul>
                            );
                            bulletGroup = [];
                        }
                        elements.push(
                            <p key={`p-${lIdx}`} style={{ margin: '0 0 16px 0', lineHeight: '1.75', whiteSpace: 'pre-wrap' }}>
                                {line}
                            </p>
                        );
                    }
                });

                if (bulletGroup.length > 0) {
                    elements.push(
                        <ul key="ul-end" style={{ margin: '0 0 16px 0', paddingLeft: '26px', listStyleType: 'disc' }}>
                            {bulletGroup.map((bText, bi) => (
                                <li key={bi} style={{ marginBottom: '8px', lineHeight: '1.75' }}>{bText}</li>
                            ))}
                        </ul>
                    );
                }

                return <div key={bIdx} style={{ marginBottom: '24px' }}>{elements}</div>;
            }

            return (
                <p key={bIdx} style={{ margin: '0 0 24px 0', lineHeight: '1.75', whiteSpace: 'pre-wrap' }}>
                    {trimmed}
                </p>
            );
        });
    };

    // Render Highlight Box directly after sub-section: Quote box (light maroon / maroon text) or Question box (light gray / navy text)
    const renderHighlightBox = (sub) => {
        if (!sub || !sub.highlight_type || sub.highlight_type === 'none' || !sub.highlight_text) {
            return null;
        }

        if (sub.highlight_type === 'quote') {
            return (
                <div style={{
                    background: '#F7EEF0',
                    borderLeft: '4px solid #8A1528',
                    borderRadius: '8px',
                    padding: '18px 22px',
                    margin: '24px 0 28px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px'
                }}>
                    <span style={{ fontSize: '28px', lineHeight: 1, color: '#8A1528', fontFamily: 'Georgia, serif' }}>“</span>
                    <p style={{
                        margin: 0,
                        fontFamily: "'Source Serif 4', Georgia, serif",
                        fontSize: '18px',
                        lineHeight: '1.5',
                        fontWeight: '600',
                        color: '#8A1528',
                        fontStyle: 'italic'
                    }}>
                        {sub.highlight_text}
                    </p>
                </div>
            );
        }

        if (sub.highlight_type === 'question') {
            return (
                <div style={{
                    background: '#F4F5F8',
                    borderLeft: '4px solid #13294B',
                    borderRadius: '8px',
                    padding: '18px 22px',
                    margin: '24px 0 28px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px'
                }}>
                    <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        background: '#13294B',
                        color: '#ffffff',
                        fontSize: '15px',
                        fontWeight: '700',
                        flexShrink: 0
                    }}>
                        ?
                    </span>
                    <p style={{
                        margin: 0,
                        fontSize: '17px',
                        lineHeight: '1.55',
                        fontWeight: '600',
                        color: '#13294B'
                    }}>
                        {sub.highlight_text}
                    </p>
                </div>
            );
        }

        return null;
    };

    return (
        <div style={{
            // fontFamily: "'Source Sans 3', 'Segoe UI', sans-serif",
            color: '#9f9f9fff',
            background: '#ffffff',
            fontSize: '19px',
            lineHeight: 1.7
        }}>
            {/* Inline Media Query Styles */}
            <style>{`
                .editorial-headline {
                    font-size: 40px;
                    line-height: 1.15;
                    color: #13294B !important;
                }
                .editorial-rendered-content {
                    font-size: 19px;
                    line-height: 1.75;
                    color: #1B1F2A;
                }
                .editorial-rendered-content p {
                    margin: 0 0 24px 0;
                    line-height: 1.75;
                }
                .editorial-rendered-content h2 {
                    font-size: 30px;
                    line-height: 1.3;
                    color: #13294B !important;
                    font-family: 'Source Serif 4', Georgia, serif;
                    font-weight: 700;
                    margin: 38px 0 16px;
                }
                .editorial-rendered-content h3 {
                    font-size: 24px;
                    line-height: 1.35;
                    color: #13294B !important;
                    font-family: 'Source Serif 4', Georgia, serif;
                    font-weight: 700;
                    margin: 30px 0 14px;
                }
                .editorial-rendered-content h4 {
                    font-size: 20px;
                    line-height: 1.4;
                    color: #13294B !important;
                    font-weight: 600;
                    margin: 24px 0 12px;
                }
                .editorial-rendered-content ul,
                .editorial-rendered-content ol {
                    margin: 0 0 24px 0;
                    padding-left: 28px;
                }
                .editorial-rendered-content ul {
                    list-style-type: disc;
                }
                .editorial-rendered-content ol {
                    list-style-type: decimal;
                }
                .editorial-rendered-content li {
                    margin-bottom: 8px;
                    line-height: 1.75;
                }
                .editorial-rendered-content blockquote {
                    margin: 32px 0;
                    padding: 18px 24px;
                    border-left: 4px solid #8A1528;
                    background: #F7EEF0;
                    border-radius: 0 8px 8px 0;
                    font-style: italic;
                    font-family: 'Source Serif 4', Georgia, serif;
                    font-size: 20px;
                    color: #8A1528;
                }
                .editorial-rendered-content img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 12px;
                    margin: 28px 0;
                    display: block;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.08);
                }
                .editorial-rendered-content a {
                    color: #8A1528;
                    text-decoration: underline;
                    font-weight: 600;
                }
                .editorial-rendered-content hr {
                    border: none;
                    border-top: 1px solid #E3E6EC;
                    margin: 36px 0;
                }
                .editorial-standfirst {
                    font-size: 22px;
                    line-height: 1.55;
                }
                .editorial-author-card {
                    margin-top: 36px;
                }
                @media (max-width: 640px) {
                    .editorial-author-card {
                        padding: 18px 20px !important;
                        flex-direction: column !important;
                        align-items: flex-start !important;
                    }
                }
                .editorial-featured-img {
                    height: 100% !important;
                }
                .book-connection-panel,
                .book-connection-panel *,
                .book-connection-panel p,
                .book-connection-panel a,
                .book-connection-panel span {
                    color: #ffffff !important;
                }
                .book-connection-panel a svg {
                    stroke: #ffffff !important;
                }
                .editorial-share-label {
                    color: #13294B !important;
                }
                .editorial-share-linkedin,
                .editorial-share-linkedin span,
                .editorial-share-linkedin svg {
                    color: #ffffff !important;
                    fill: #ffffff !important;
                }
                .editorial-share-linkedin:hover {
                    color: #ffffff !important;
                }
                @media (max-width: 768px) {
                    .editorial-headline {
                        font-size: 32px !important;
                        line-height: 1.2 !important;
                    }
                    .editorial-standfirst {
                        font-size: 17px !important;
                    }
                    .editorial-featured-img {
                        height: 260px !important;
                    }
                }
                    .article-share-bar {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
    margin-top: 8px;
}

.article-share-label {
    color: #13294B;
    font-size: 14px;
    font-weight: 700;
}

.article-share-icons {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
}

.article-share-icon {
    position: relative;
    width: 38px;
    height: 38px;
    min-width: 38px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: 1px solid #DCE1E9;
    border-radius: 50%;
    background: #FFFFFF;
    color: #13294B;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.2s ease;
}

.article-share-icon svg {
    width: 17px;
    height: 17px;
    stroke-width: 2;
}

.article-share-icon:hover {
    color: #A3192F;
    border-color: #A3192F;
    background: #FFFFFF;
    transform: translateY(-2px);
}

/* Tooltip */
.article-share-icon::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: calc(100% + 9px);
    left: 50%;
    transform: translateX(-50%);
    padding: 6px 9px;
    border-radius: 5px;
    background: #13294B;
    color: #FFFFFF;
    font-size: 11px;
    font-weight: 500;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transition: opacity 0.2s ease;
    z-index: 10;
}

.article-share-icon:hover::after,
.article-share-icon:focus-visible::after {
    opacity: 1;
    visibility: visible;
}

.article-share-feedback {
    color: #A3192F;
    font-size: 12px;
    font-weight: 600;
}

@media (max-width: 600px) {
    .article-share-icons {
        gap: 9px;
    }

    .article-share-icon {
        width: 38px;
        height: 38px;
        min-width: 38px;
    }
}
            `}</style>

            {/* SUB-NAV / BREADCRUMB */}
            <nav aria-label="Article navigation" style={{
                borderBottom: '1px solid #E3E6EC',
                background: '#FAFBFD'
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '14px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '15px'
                }}>
                    <Link
                        to="/blog-page"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontWeight: 700,
                            color: '#13294B',
                            textDecoration: 'none'
                        }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        <span>Back to Blog</span>
                    </Link>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6A7282', fontSize: '14px' }}>
                        <Link to="/" style={{ color: '#6A7282', textDecoration: 'none' }}>Home</Link>
                        <span>/</span>
                        <Link to="/blog-page" style={{ color: '#6A7282', textDecoration: 'none' }}>Blog</Link>
                        <span>/</span>
                        <span style={{ color: '#13294B', fontWeight: 600, maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {primaryCategory}
                        </span>
                    </div>
                </div>
            </nav>

            <article>
                {/* ARTICLE HEADER */}
                <header style={{
                    maxWidth: '960px',
                    margin: '0 auto',
                    padding: '56px 24px 32px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '18px'
                }}>
                    <p style={{
                        margin: 0,
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '10px',
                        alignItems: 'center',
                        fontSize: '14px',
                        fontWeight: 700,
                        letterSpacing: '1px',
                        color: '#4A5163'
                    }}>
                        <Link
                            to={`/blog-page?category=${encodeURIComponent(primaryCategory.toLowerCase())}`}
                            style={{
                                background: '#F7EEF0',
                                color: '#8A1528',
                                padding: '4px 14px',
                                borderRadius: '999px',
                                textDecoration: 'none',
                                textTransform: 'uppercase',
                                display: 'inline-block'
                            }}
                        >
                            {primaryCategory}
                        </Link>
                        <span>
                            {new Date(blog.published_date || blog.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            })}
                        </span>
                        <span aria-hidden="true" style={{ color: '#9AA1B2' }}>·</span>
                        <span>{readingTime}</span>
                    </p>

                    <h1 className="editorial-headline" style={{
                        margin: 0,
                        // fontFamily: "'Source Serif 4', Georgia, serif",
                        fontWeight: 700,
                        color: '#13294B'
                    }}>
                        {blog.title}
                    </h1>

                    {standfirst && (
                        <p className="editorial-standfirst" style={{
                            margin: 0,
                            color: '#3E4556'
                        }}>
                            {standfirst}
                        </p>
                    )}

                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                        <p style={{ margin: 0, fontSize: '16px', color: '#4A5163' }}>
                            {authorByline}
                        </p>
                        {(blog.linkedin_url || blog.instagram_url || blog.facebook_url) && (
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '13px', fontWeight: 600, color: '#6A7282' }}>Connect:</span>
                                {blog.linkedin_url && (
                                    <a
                                        href={blog.linkedin_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="Author LinkedIn"
                                        aria-label="Author LinkedIn"
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            background: '#0A66C2',
                                            color: '#ffffff',
                                            textDecoration: 'none',
                                            transition: 'transform 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    >
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                        </svg>
                                    </a>
                                )}
                                {blog.instagram_url && (
                                    <a
                                        href={blog.instagram_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="Author Instagram"
                                        aria-label="Author Instagram"
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)',
                                            color: '#ffffff',
                                            textDecoration: 'none',
                                            transition: 'transform 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    >
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.13-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                        </svg>
                                    </a>
                                )}
                                {blog.facebook_url && (
                                    <a
                                        href={blog.facebook_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="Author Facebook"
                                        aria-label="Author Facebook"
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            background: '#1877F2',
                                            color: '#ffffff',
                                            textDecoration: 'none',
                                            transition: 'transform 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    >
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                        </svg>
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                    {/* SHARE BUTTONS - BELOW ARTICLE TITLE */}
<ArticleShareBar
    title={blog.title}
    url={shareUrl}
/>
                </header>

                {/* FEATURED IMAGE */}
                <div style={{ maxWidth: '1040px', margin: '0 auto', padding: '0 24px', height: 'full' }}>
                    <figure style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {blog.image_url ? (
                            <img
                                src={blog.image_url}
                                alt={blog.image_alt || blog.title}
                                className="editorial-featured-img"
                                style={{
                                    width: '100%',
                                    borderRadius: '14px',
                                    objectFit: 'cover',
                                    display: 'block',
                                }}
                            />
                        ) : (
                            <div className="editorial-featured-img" style={{
                                borderRadius: '14px',
                                background: 'linear-gradient(135deg, #13294B 0%, #1E3A67 100%)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#ffffff',
                                padding: '24px',
                                textAlign: 'center'
                            }}>
                                <span style={{
                                    // fontFamily: "'Source Serif 4', Georgia, serif",
                                    fontSize: '26px',
                                    fontWeight: 700,
                                    maxWidth: '600px'
                                }}>
                                    {blog.title}
                                </span>
                            </div>
                        )}
                        {blog.image_caption && (
                            <figcaption style={{ fontSize: '14px', color: '#4A5163', fontStyle: 'italic', paddingLeft: '4px' }}>
                                {blog.image_caption}
                            </figcaption>
                        )}
                    </figure>
                </div>

                {/* BODY CONTENT */}
                <div style={{
                    maxWidth: '920px',
                    margin: '0 auto',
                    padding: '48px 24px 24px',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    {/* Helper to render Pull Quote */}
                    {(() => {
                        const renderPullQuote = () => {
                            if (!blog.pull_quote) return null;
                            return (
                                <figure style={{
                                    margin: '36px 0',
                                    padding: '18px 0',
                                    textAlign: 'center',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '10px',
                                    borderTop: '1px solid #E3E6EC',
                                    borderBottom: '1px solid #E3E6EC'
                                }}>
                                    <blockquote style={{
                                        margin: '14px 0 0',
                                        fontFamily: "'Source Serif 4', Georgia, serif",
                                        fontWeight: 600,
                                        fontSize: '28px',
                                        lineHeight: 1.4,
                                        color: '#A3192F',
                                        fontStyle: 'italic'
                                    }}>
                                        “{blog.pull_quote}”
                                    </blockquote>
                                    {blog.pull_quote_author && (
                                        <figcaption style={{ marginBottom: '14px', fontSize: '15px', color: '#4A5163', fontWeight: 600 }}>
                                            - {blog.pull_quote_author}
                                        </figcaption>
                                    )}
                                </figure>
                            );
                        };

                        return (
                            <>
                                {/* 1. Full Article Body */}
                                {renderEditorialBody(blog.content)}

                                {/* Pull quote after Full Body if pullQuotePos === 0 */}
                                {pullQuotePos === 0 && renderPullQuote()}

                                {/* 2. Sub-sections in the order set */}
                                {normalizedSubSections.map((sub, idx) => {
                                    const subIndex = idx + 1;
                                    return (
                                        <div key={idx} style={{ marginTop: idx === 0 ? '8px' : '16px' }}>
                                            {sub.heading && (
                                                <h2 style={{
                                                    margin: '38px 0 16px',
                                                    fontFamily: "'Source Serif 4', Georgia, serif",
                                                    fontSize: '30px',
                                                    lineHeight: 1.3,
                                                    color: '#13294B',
                                                    fontWeight: 700
                                                }}>
                                                    {sub.heading}
                                                </h2>
                                            )}
                                            {renderEditorialBody(sub.body)}
                                            {renderHighlightBox(sub)}
                                            {pullQuotePos === subIndex && renderPullQuote()}
                                        </div>
                                    );
                                })}

                                {/* Fallback Pull Quote: If pullQuotePos was beyond sub-sections count or if 0 sub-sections and pullQuotePos >= 1 */}
                                {((pullQuotePos > normalizedSubSections.length && pullQuotePos !== 0) || (normalizedSubSections.length === 0 && pullQuotePos >= 1)) && renderPullQuote()}

                                {/* 3. Concluding Insight */}
                                {blog.concluding_insight && (
                                    <div style={{
                                        background: '#F4F5F8',
                                        borderRadius: '12px',
                                        padding: '24px 28px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '10px',
                                        marginTop: '32px'
                                    }}>
                                        <p style={{
                                            margin: 0,
                                            fontSize: '13px',
                                            letterSpacing: '3px',
                                            fontWeight: 700,
                                            color: '#13294B',
                                            textTransform: 'uppercase'
                                        }}>
                                            CONCLUDING INSIGHT
                                        </p>
                                        <p style={{
                                            margin: 0,
                                            fontSize: '15px',
                                            lineHeight: 1.6,
                                            color: '#1B1F2A'
                                        }}>
                                            {blog.concluding_insight}
                                        </p>
                                    </div>
                                )}

                                {/* 4. Author Box directly after Concluding Insight */}
                                <div className="editorial-author-card" style={{
                                    marginTop: '36px',
                                    padding: '24px 28px',
                                    borderRadius: '14px',
                                    background: '#FAFBFD',
                                    border: '1px solid #E3E6EC',
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '20px',
                                    alignItems: 'center'
                                }}>
                                    <div style={{
                                        width: '64px',
                                        height: '64px',
                                        borderRadius: '50%',
                                        overflow: 'hidden',
                                        background: '#13294B',
                                        flexShrink: 0,
                                        border: '2px solid #8A1528',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <img
                                            src="/assets/images/img/v2-author-photo.png"
                                            alt={authorName}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                        <span style={{ display: 'none', color: '#ffffff', fontWeight: 700, fontSize: '20px' }}>
                                            MQS
                                        </span>
                                    </div>
                                    <div style={{ flex: '1 1 240px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '1.5px', color: '#8A1528', textTransform: 'uppercase' }}>
                                            Author
                                        </span>
                                        <h4 style={{
                                            margin: 0,
                                            fontFamily: "'Source Serif 4', Georgia, serif",
                                            fontSize: '20px',
                                            color: '#13294B',
                                            fontWeight: 700
                                        }}>
                                            {authorName}
                                        </h4>
                                        <p style={{ margin: 0, fontSize: '14px', color: '#4A5163', lineHeight: 1.5 }}>
                                            {rolePart}
                                        </p>
                                    </div>
                                    {(blog.linkedin_url || blog.instagram_url || blog.facebook_url) && (
                                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                            {blog.linkedin_url && (
                                                <a
                                                    href={blog.linkedin_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ display: 'inline-flex', padding: '8px 14px', borderRadius: '8px', background: '#0A66C2', color: '#ffffff', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}
                                                >
                                                    LinkedIn
                                                </a>
                                            )}
                                            {blog.instagram_url && (
                                                <a
                                                    href={blog.instagram_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ display: 'inline-flex', padding: '8px 14px', borderRadius: '8px', background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)', color: '#ffffff', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}
                                                >
                                                    Instagram
                                                </a>
                                            )}
                                            {blog.facebook_url && (
                                                <a
                                                    href={blog.facebook_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ display: 'inline-flex', padding: '8px 14px', borderRadius: '8px', background: '#1877F2', color: '#ffffff', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}
                                                >
                                                    Facebook
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </>
                        );
                    })()}
                </div>

                {/* BOOK CONNECTION PANEL (Shown ONLY when article connects to book - NO ASK SID) */}
                {(blog.related_to_book || blog.book_concept) && (
                    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '16px 24px 32px' }}>
                        <aside
                            className="book-connection-panel"
                            aria-label="From Marketing Reclassified"
                            style={{
                                background: '#13294B',
                                borderRadius: '14px',
                                padding: '28px',
                                display: 'flex',
                                flexWrap: 'wrap',
                                alignItems: 'center',
                                gap: '24px',
                                color: '#ffffff'
                            }}
                        >
                            <img
                                src="https://cneariiepqywvjpmznqn.supabase.co/storage/v1/object/public/product-covers/1792073568433-FFF_cove_page_Marketing_Reclassified_Web.jpg"
                                alt="Marketing Reclassified Book Cover"
                                style={{
                                    width: '110px',
                                    height: 'auto',
                                    borderRadius: '8px',
                                    boxShadow: '0 6px 18px rgba(0,0,0,0.3)',
                                    flexShrink: 0
                                }}
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                            <div style={{ flex: '999 1 300px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: '8px', color: '#ffffff' }}>
                                <p style={{
                                    margin: 0,
                                    fontSize: '13px',
                                    letterSpacing: '3px',
                                    fontWeight: 700,
                                    color: '#ffffff',
                                    textTransform: 'uppercase'
                                }}>
                                    FROM MARKETING RECLASSIFIED
                                </p>
                                <p style={{
                                    margin: 0,
                                    fontSize: '17px',
                                    color: '#ffffff',
                                    lineHeight: 1.5
                                }}>
                                    {blog.book_concept || "Explore the foundational principles connecting purpose with measurable business value."}
                                </p>
                                <Link
                                    to="/publications/marketing-reclassified"
                                    style={{
                                        fontWeight: 700,
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        textDecoration: 'none',
                                        fontSize: '16px',
                                        color: '#ffffff',
                                        marginTop: '4px'
                                    }}
                                >
                                    <span>Explore the Book</span>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                        <polyline points="12 5 19 12 12 19"></polyline>
                                    </svg>
                                </Link>
                            </div>
                        </aside>
                    </div>
                )}
            {/* SHARE ACTIONS - ARTICLE END */}
            <div style={{
                maxWidth: "720px",
                margin: "0 auto",
                padding: "16px 24px 48px",
                borderBottom: "1px solid #E3E6EC"
                }}>
                <ArticleShareBar
                title={blog.title}
                url={shareUrl}
                />
            </div>
            </article>

            {/* RELATED ARTICLES */}
            {relatedArticles && relatedArticles.length > 0 && (
                <section style={{ background: '#F4F5F8' }}>
                    <div style={{
                        maxWidth: '1200px',
                        margin: '0 auto',
                        padding: '56px 24px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '24px'
                    }}>
                        <h2 style={{
                            margin: 0,
                            fontFamily: "'Source Serif 4', Georgia, serif",
                            fontSize: '30px',
                            color: '#13294B',
                            fontWeight: 700
                        }}>
                            Related Articles
                        </h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: '24px'
                        }}>
                            {relatedArticles.map((rel) => {
                                const relCat = Array.isArray(rel.categories) && rel.categories[0]
                                    ? rel.categories[0]
                                    : (rel.topic || 'Article');
                                const targetUrl = `/blogs/${rel.slug || rel.id}`;

                                return (
                                    <Link
                                        key={rel.id}
                                        to={targetUrl}
                                        style={{
                                            background: '#ffffff',
                                            border: '1px solid #E3E6EC',
                                            borderRadius: '14px',
                                            overflow: 'hidden',
                                            textDecoration: 'none',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            transition: 'transform 0.2s, box-shadow 0.2s'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-3px)';
                                            e.currentTarget.style.boxShadow = '0 10px 24px rgba(19, 41, 75, 0.08)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    >
                                        <div style={{
                                            height: '160px',
                                            background: '#E4E8F0',
                                            overflow: 'hidden',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            {rel.image_url ? (
                                                <img
                                                    src={rel.image_url}
                                                    alt={rel.title}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <span style={{ color: '#6A7282', fontSize: '14px', fontWeight: 600 }}>
                                                    {relCat}
                                                </span>
                                            )}
                                        </div>
                                        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px', flex: '1 1 auto' }}>
                                            <span style={{
                                                fontSize: '12px',
                                                fontWeight: 700,
                                                letterSpacing: '1px',
                                                color: '#8A1528',
                                                textTransform: 'uppercase'
                                            }}>
                                                {relCat}
                                            </span>
                                            <h3 style={{
                                                margin: 0,
                                                fontFamily: "'Source Serif 4', Georgia, serif",
                                                fontWeight: 700,
                                                fontSize: '20px',
                                                color: '#13294B',
                                                lineHeight: 1.35
                                            }}>
                                                {rel.title}
                                            </h3>

                                            {(rel.linkedin_url || rel.instagram_url || rel.facebook_url) && (
                                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '6px' }} onClick={(e) => e.stopPropagation()}>
                                                    {rel.linkedin_url && (
                                                        <a
                                                            href={rel.linkedin_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            onClick={(e) => e.stopPropagation()}
                                                            title="LinkedIn"
                                                            aria-label="LinkedIn"
                                                            style={{
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                width: '24px',
                                                                height: '24px',
                                                                borderRadius: '50%',
                                                                background: '#EEF2F6',
                                                                color: '#0A66C2',
                                                                textDecoration: 'none'
                                                            }}
                                                        >
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                                            </svg>
                                                        </a>
                                                    )}
                                                    {rel.instagram_url && (
                                                        <a
                                                            href={rel.instagram_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            onClick={(e) => e.stopPropagation()}
                                                            title="Instagram"
                                                            aria-label="Instagram"
                                                            style={{
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                width: '24px',
                                                                height: '24px',
                                                                borderRadius: '50%',
                                                                background: '#EEF2F6',
                                                                color: '#C13584',
                                                                textDecoration: 'none'
                                                            }}
                                                        >
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.13-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                                            </svg>
                                                        </a>
                                                    )}
                                                    {rel.facebook_url && (
                                                        <a
                                                            href={rel.facebook_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            onClick={(e) => e.stopPropagation()}
                                                            title="Facebook"
                                                            aria-label="Facebook"
                                                            style={{
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                width: '24px',
                                                                height: '24px',
                                                                borderRadius: '50%',
                                                                background: '#EEF2F6',
                                                                color: '#1877F2',
                                                                textDecoration: 'none'
                                                            }}
                                                        >
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                                            </svg>
                                                        </a>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* READER COMMENTS SECTION */}
            <CommentSection blogId={blog.id} />
        </div>
    );
};

export default SinglePostSection;