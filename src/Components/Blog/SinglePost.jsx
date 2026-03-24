const SinglePostSection = ({ blog, loading }) => {
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
                            <div className="image-container">
                                <img
                                    src={blog.image_url}
                                    alt={blog.title}
                                    className="img-fluid"
                                    style={{ borderRadius: '1rem', width: '100%', objectFit: 'cover' }}
                                />
                            </div>
                            <div className="row row-cols-lg-2 row-cols-1 grid-spacer-2">
                                <div className="col">
                                    <div className="card project-detail">
                                        <h4 className="secondary-accent">Topic</h4>
                                        <p>{blog.topic || 'General'}</p>
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

                            {/* <div className="d-flex justify-content-between align-items-center mb-5">
                                <h4>Share this article</h4>
                                <div className="d-flex flex-row gspace-2">
                                    <a href="#" className="social-item accent-color">
                                        <i className="fa-brands fa-facebook-f"></i>
                                    </a>
                                    <a href="#" className="social-item accent-color">
                                        <i className="fa-brands fa-x-twitter"></i>
                                    </a>
                                    <a href="#" className="social-item accent-color">
                                        <i className="fa-brands fa-instagram"></i>
                                    </a>
                                </div>
                            </div> */}

                            <CommentSection blogId={blog.id} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

import CommentSection from "./CommentSection";
export default SinglePostSection;