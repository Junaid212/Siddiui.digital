import React from "react";

const BlogCard = ({ image, title, topic, id, date }) => {
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
                        background: '#C80808',
                        color: '#fff',
                        padding: '5px 15px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: '700'
                    }}>
                        {topic || 'General'}
                    </div>
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