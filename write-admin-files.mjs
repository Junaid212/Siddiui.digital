import { writeFileSync } from 'fs';

// ─────────────────────────────────────────────────────────
// 1. Admin Client: BlogForm.jsx  (Topic label → Category)
// ─────────────────────────────────────────────────────────
const blogFormPath = 'D:\\Bright Media WORK\\siddique-admin\\client\\src\\components\\Blog\\BlogForm.jsx';
const blogFormContent = `import { useState, useEffect } from 'react';

export default function BlogForm({ blog, onSubmit, onCancel }) {
    const [title, setTitle] = useState('');
    const [topic, setTopic] = useState('');
    const [published_date, setPublishedDate] = useState('');
    const [content, setContent] = useState('');
    const [title2, setTitle2] = useState('');
    const [content2, setContent2] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (blog) {
            setTitle(blog.title || '');
            setTopic(blog.topic || '');
            setPublishedDate(blog.published_date ? new Date(blog.published_date).toISOString().split('T')[0] : '');
            setContent(blog.content || '');
            setTitle2(blog.title2 || '');
            setContent2(blog.content2 || '');
            setPreview(blog.image_url || null);
        }
    }, [blog]);

    function handleImageChange(e) {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;

        setSubmitting(true);
        try {
            const formData = {
                title,
                topic,
                published_date,
                content,
                title2,
                content2,
                imageFile: image,
                image_url: preview,
                image_path: blog ? blog.image_path : null
            };
            await onSubmit(formData);
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal__header">
                    <h2>{blog ? 'Edit Blog' : 'Create New Blog'}</h2>
                    <button className="modal__close" onClick={onCancel}>×</button>
                </div>

                <form onSubmit={handleSubmit} className="blog-form">
                    <div className="form-group">
                        <label htmlFor="blog-title">Title</label>
                        <input
                            id="blog-title"
                            type="text"
                            className="form-input"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter blog title..."
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="blog-topic">Category</label>
                        <input
                            id="blog-topic"
                            type="text"
                            className="form-input"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g. Digital Marketing, Leadership"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="blog-date">Publish Date</label>
                        <input
                            id="blog-date"
                            type="date"
                            className="form-input"
                            value={published_date}
                            onChange={(e) => setPublishedDate(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="blog-content">Primary Content</label>
                        <textarea
                            id="blog-content"
                            className="form-input form-textarea"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write your main blog content here..."
                            rows="6"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="blog-title2">Secondary Title (Title 2)</label>
                        <input
                            id="blog-title2"
                            type="text"
                            className="form-input"
                            value={title2}
                            onChange={(e) => setTitle2(e.target.value)}
                            placeholder="Optional secondary heading..."
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="blog-content2">Secondary Content (Content 2)</label>
                        <textarea
                            id="blog-content2"
                            className="form-input form-textarea"
                            value={content2}
                            onChange={(e) => setContent2(e.target.value)}
                            placeholder="Write additional content here..."
                            rows="6"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="blog-image">Cover Image</label>
                        <div className="image-upload">
                            <input
                                id="blog-image"
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/gif"
                                onChange={handleImageChange}
                                className="image-upload__input"
                            />
                            <div className="image-upload__area">
                                {preview ? (
                                    <img src={preview} alt="Preview" className="image-upload__preview" />
                                ) : (
                                    <div className="image-upload__placeholder">
                                        <span>📷</span>
                                        <p>Click to upload image</p>
                                        <small>JPEG, PNG, WebP, GIF (max 5MB)</small>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn btn--ghost"
                            onClick={onCancel}
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn--primary"
                            disabled={submitting}
                        >
                            {submitting ? 'Saving...' : blog ? 'Update Blog' : 'Create Blog'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
`;

// ─────────────────────────────────────────────────────────
// 2. Admin Client: BlogCard.jsx  (add Share button)
// ─────────────────────────────────────────────────────────
const blogCardPath = 'D:\\Bright Media WORK\\siddique-admin\\client\\src\\components\\Blog\\BlogCard.jsx';
const blogCardContent = `import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const SITE_URL = 'https://siddiqui.digital';

export default function BlogCard({ blog, onEdit, onDelete }) {
    function handleShare() {
        const shareUrl = \`\${SITE_URL}/blogs/\${blog.id}\`;
        navigator.clipboard.writeText(shareUrl)
            .then(() => toast.success('Share link copied to clipboard!'))
            .catch(() => {
                // Fallback for older browsers
                const el = document.createElement('textarea');
                el.value = shareUrl;
                document.body.appendChild(el);
                el.select();
                document.execCommand('copy');
                document.body.removeChild(el);
                toast.success('Share link copied to clipboard!');
            });
    }

    return (
        <div className="blog-card">
            <div className="blog-card__image">
                {blog.image_url ? (
                    <img src={blog.image_url} alt={blog.title} />
                ) : (
                    <div className="blog-card__image-placeholder">
                        <span>📝</span>
                    </div>
                )}
            </div>
            <div className="blog-card__body">
                <div className="blog-card__pretitle" style={{ display: 'flex', gap: '8px', fontSize: '0.8rem', color: 'var(--primary-color)', fontWeight: '600', marginBottom: '4px' }}>
                    {blog.topic && <span>{blog.topic.toUpperCase()}</span>}
                </div>
                <h3 className="blog-card__title">{blog.title}</h3>
                <p className="blog-card__excerpt">
                    {blog.content?.substring(0, 120).replace(/<[^>]+>/g, '')}
                    {blog.content?.length > 120 ? '...' : ''}
                </p>
                <div className="blog-card__meta">
                    <span className="blog-card__date">
                        {new Date(blog.published_date || blog.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                        })}
                    </span>
                </div>
            </div>
            <div className="blog-card__actions">
                <button
                    className="btn btn--outline btn--sm"
                    onClick={handleShare}
                    title="Copy share link"
                    style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                    🔗 Share
                </button>
                <Link to={\`/blogs/\${blog.id}/comments\`} className="btn btn--outline btn--sm">
                    Comments
                </Link>
                <button className="btn btn--outline btn--sm" onClick={() => onEdit(blog)}>
                    Edit
                </button>
                <button className="btn btn--danger btn--sm" onClick={() => onDelete(blog.id)}>
                    Delete
                </button>
            </div>
        </div>
    );
}
`;

try {
    writeFileSync(blogFormPath, blogFormContent, 'utf8');
    console.log('✅ BlogForm.jsx written');
} catch (e) {
    console.error('❌ BlogForm.jsx failed:', e.message);
}

try {
    writeFileSync(blogCardPath, blogCardContent, 'utf8');
    console.log('✅ BlogCard.jsx written');
} catch (e) {
    console.error('❌ BlogCard.jsx failed:', e.message);
}

console.log('Done.');
