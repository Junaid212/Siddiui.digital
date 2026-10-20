import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { api } from '../../api';

const CommentSection = ({ blogId }) => {
    const [comments, setComments] = useState([]);
    const [authorName, setAuthorName] = useState('');
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyName, setReplyName] = useState('');
    const [replyContent, setReplyContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [user, setUser] = useState(null);

    // Check for existing Supabase session (e.g. from Ebook sign-in) to pre-fill name
    useEffect(() => {
        const getSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    const fullName = session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || '';
                    setUser({
                        id: session.user.id,
                        name: fullName,
                        email: session.user.email,
                    });
                    if (fullName) setAuthorName(fullName);
                }
            } catch (e) {}
        };
        getSession();
    }, []);

    // Fetch approved comments
    useEffect(() => {
        if (!blogId) return;
        const fetchComments = async () => {
            try {
                const res = await api.getComments(blogId);
                setComments(res.comments || []);
            } catch (err) {
                console.error('Error fetching comments:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchComments();
    }, [blogId]);

    const handleSubmit = async (e, parentId = null) => {
        e.preventDefault();
        const content = parentId ? replyContent : newComment;
        const name = (parentId ? replyName : authorName).trim() || 'Reader';

        if (!content.trim()) return;

        setSubmitting(true);
        try {
            await api.postComment(blogId, {
                userName: name,
                content: content.trim(),
                parentId: parentId || null,
            });

            setSubmitSuccess(true);
            if (parentId) {
                setReplyContent('');
                setReplyingTo(null);
            } else {
                setNewComment('');
            }

            // Auto-hide success message after 8 seconds
            setTimeout(() => setSubmitSuccess(false), 8000);
        } catch (err) {
            console.error('Failed to submit comment:', err);
            alert(err.message || 'Failed to submit comment. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const rootComments = comments.filter(c => !c.parent_id);
    const getReplies = (parentId) => comments.filter(c => c.parent_id === parentId);

    return (
        <section style={{ background: '#ffffff', width: '100%', borderTop: '1px solid #E3E6EC' }}>
            <div style={{
                maxWidth: '720px',
                margin: '0 auto',
                padding: '56px 24px 72px',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                fontFamily: "'Source Sans 3', 'Segoe UI', sans-serif"
            }}>
                <div>
                    <h2 style={{
                        margin: '0 0 6px 0',
                        fontFamily: "'Source Serif 4', Georgia, serif",
                        fontSize: '28px',
                        fontWeight: 700,
                        color: '#13294B'
                    }}>
                        Reader Comments {comments.length > 0 && `(${comments.length})`}
                    </h2>
                    <p style={{ margin: 0, fontSize: '15px', color: '#4A5163' }}>
                        Comments are reviewed before they are published.
                    </p>
                </div>

                {/* Submission Success Alert */}
                {submitSuccess && (
                    <div style={{
                        padding: '16px 20px',
                        background: '#EEF7F2',
                        border: '1px solid #B7E4C7',
                        borderRadius: '10px',
                        color: '#1E4620',
                        fontSize: '15px',
                        lineHeight: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2D6A4F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                        <div>
                            <strong>Thank you!</strong> Your comment has been submitted for editorial review and will appear once approved.
                        </div>
                    </div>
                )}

                {/* Comment Submission Form */}
                <form onSubmit={(e) => handleSubmit(e, null)} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label htmlFor="c-name" style={{ fontSize: '15px', fontWeight: 600, color: '#13294B' }}>
                            Name
                        </label>
                        <input
                            id="c-name"
                            type="text"
                            placeholder="Your full name"
                            value={authorName}
                            onChange={(e) => setAuthorName(e.target.value)}
                            required
                            style={{
                                minHeight: '48px',
                                boxSizing: 'border-box',
                                border: '1px solid #C9CFDB',
                                borderRadius: '8px',
                                padding: '0 14px',
                                font: 'inherit',
                                fontSize: '16px',
                                color: '#1B1F2A',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label htmlFor="c-text" style={{ fontSize: '15px', fontWeight: 600, color: '#13294B' }}>
                            Your comment
                        </label>
                        <textarea
                            id="c-text"
                            rows={4}
                            placeholder="Share your perspective or ask a question..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            required
                            style={{
                                boxSizing: 'border-box',
                                border: '1px solid #C9CFDB',
                                borderRadius: '8px',
                                padding: '12px 14px',
                                font: 'inherit',
                                fontSize: '16px',
                                color: '#1B1F2A',
                                outline: 'none',
                                resize: 'vertical'
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        style={{
                            alignSelf: 'flex-start',
                            minHeight: '48px',
                            padding: '0 28px',
                            border: 0,
                            borderRadius: '8px',
                            background: '#A3192F',
                            color: '#ffffff',
                            font: 'inherit',
                            fontWeight: 700,
                            fontSize: '16px',
                            cursor: submitting ? 'wait' : 'pointer',
                            transition: 'background 0.2s ease',
                            opacity: submitting ? 0.7 : 1
                        }}
                    >
                        {submitting ? 'Submitting...' : 'Submit for review'}
                    </button>
                </form>

                {/* Approved Comments List */}
                {loading ? (
                    <div style={{ padding: '24px 0', color: '#6A7282', fontSize: '15px' }}>
                        Loading comments...
                    </div>
                ) : rootComments.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '24px' }}>
                        {rootComments.map((comment) => (
                            <div
                                key={comment.id}
                                style={{
                                    border: '1px solid #E3E6EC',
                                    borderRadius: '12px',
                                    padding: '20px 24px',
                                    background: '#FAFBFD'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontWeight: 700, fontSize: '16px', color: '#13294B' }}>
                                            {comment.user_name || 'Reader'}
                                        </span>
                                        {comment.is_admin && (
                                            <span style={{
                                                fontSize: '11px',
                                                fontWeight: 700,
                                                letterSpacing: '0.5px',
                                                background: '#F7EEF0',
                                                color: '#8A1528',
                                                padding: '2px 8px',
                                                borderRadius: '999px',
                                                textTransform: 'uppercase'
                                            }}>
                                                Author
                                            </span>
                                        )}
                                    </div>
                                    <span style={{ fontSize: '13px', color: '#6A7282' }}>
                                        {new Date(comment.created_at).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>

                                <p style={{ margin: '0 0 12px 0', fontSize: '16px', lineHeight: 1.6, color: '#2B303B', whiteSpace: 'pre-wrap' }}>
                                    {comment.content}
                                </p>

                                <button
                                    type="button"
                                    onClick={() => setReplyingTo(replyingTo?.id === comment.id ? null : comment)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        padding: 0,
                                        color: '#A3192F',
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        cursor: 'pointer'
                                    }}
                                >
                                    {replyingTo?.id === comment.id ? 'Cancel reply' : 'Reply'}
                                </button>

                                {/* Nested Replies */}
                                {getReplies(comment.id).length > 0 && (
                                    <div style={{
                                        marginTop: '16px',
                                        paddingLeft: '18px',
                                        borderLeft: '2px solid #E3E6EC',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '14px'
                                    }}>
                                        {getReplies(comment.id).map((reply) => (
                                            <div key={reply.id} style={{ background: '#ffffff', padding: '14px 18px', borderRadius: '8px', border: '1px solid #EAECEF' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <span style={{ fontWeight: 700, fontSize: '15px', color: '#13294B' }}>
                                                            {reply.user_name || 'Reader'}
                                                        </span>
                                                        {reply.is_admin && (
                                                            <span style={{
                                                                fontSize: '11px',
                                                                fontWeight: 700,
                                                                background: '#F7EEF0',
                                                                color: '#8A1528',
                                                                padding: '2px 8px',
                                                                borderRadius: '999px',
                                                                textTransform: 'uppercase'
                                                            }}>
                                                                Author
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span style={{ fontSize: '12px', color: '#6A7282' }}>
                                                        {new Date(reply.created_at).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                                <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.55, color: '#2B303B', whiteSpace: 'pre-wrap' }}>
                                                    {reply.content}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Inline Reply Form */}
                                {replyingTo?.id === comment.id && (
                                    <form onSubmit={(e) => handleSubmit(e, comment.id)} style={{
                                        marginTop: '16px',
                                        padding: '16px',
                                        background: '#ffffff',
                                        borderRadius: '8px',
                                        border: '1px solid #D9DEE7',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '10px'
                                    }}>
                                        <input
                                            type="text"
                                            placeholder="Your name"
                                            value={replyName}
                                            onChange={(e) => setReplyName(e.target.value)}
                                            required
                                            style={{
                                                minHeight: '40px',
                                                border: '1px solid #C9CFDB',
                                                borderRadius: '6px',
                                                padding: '0 12px',
                                                fontSize: '14px'
                                            }}
                                        />
                                        <textarea
                                            rows={2}
                                            placeholder={`Reply to ${comment.user_name || 'reader'}...`}
                                            value={replyContent}
                                            onChange={(e) => setReplyContent(e.target.value)}
                                            required
                                            style={{
                                                border: '1px solid #C9CFDB',
                                                borderRadius: '6px',
                                                padding: '10px 12px',
                                                fontSize: '14px',
                                                resize: 'vertical'
                                            }}
                                        />
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                                type="submit"
                                                disabled={submitting}
                                                style={{
                                                    minHeight: '38px',
                                                    padding: '0 18px',
                                                    border: 0,
                                                    borderRadius: '6px',
                                                    background: '#A3192F',
                                                    color: '#ffffff',
                                                    fontWeight: 600,
                                                    fontSize: '14px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Submit reply for review
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setReplyingTo(null)}
                                                style={{
                                                    minHeight: '38px',
                                                    padding: '0 14px',
                                                    border: '1px solid #C9CFDB',
                                                    borderRadius: '6px',
                                                    background: '#ffffff',
                                                    color: '#4A5163',
                                                    fontSize: '14px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        ))}
                    </div>
                ) : null}
            </div>
        </section>
    );
};

export default CommentSection;
