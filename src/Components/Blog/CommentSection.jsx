import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { api } from '../../api';

const CommentSection = ({ blogId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyContent, setReplyContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [signingIn, setSigningIn] = useState(false);

    // Check for existing Supabase session (shared with Ebook sign-in)
    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                setUser({
                    id: session.user.id,
                    name: session.user.user_metadata?.full_name || session.user.email,
                    email: session.user.email,
                    avatar: session.user.user_metadata?.avatar_url,
                });
            }
        };
        getSession();

        // Listen for auth changes (e.g. user signs in via Ebook page)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser({
                    id: session.user.id,
                    name: session.user.user_metadata?.full_name || session.user.email,
                    email: session.user.email,
                    avatar: session.user.user_metadata?.avatar_url,
                });
            } else {
                setUser(null);
            }
        });

        return () => subscription?.unsubscribe();
    }, []);

    // Fetch comments from Supabase on every load (persisted — survives refresh)
    useEffect(() => {
        if (!blogId) return;
        const fetchComments = async () => {
            try {
                // Primary: fetch directly from Supabase (reliable, no backend key needed)
                const { data, error } = await supabase
                    .from('blog_comments')
                    .select('*')
                    .eq('blog_id', blogId)
                    .order('created_at', { ascending: true });

                if (error) throw error;
                setComments(data || []);
            } catch (err) {
                console.error('Supabase fetch failed, trying backend API:', err);
                // Fallback: try backend API
                try {
                    const result = await api.getComments(blogId);
                    setComments(result.comments || []);
                } catch {
                    console.error('Both fetch methods failed');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchComments();
    }, [blogId]);

    // Google sign-in via Supabase OAuth
    const handleGoogleSignIn = async () => {
        setSigningIn(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.href, // Come back to the same page
                },
            });
            if (error) {
                console.error('Google sign-in error:', error);
                alert('Sign-in failed. Please try again.');
            }
        } catch (err) {
            console.error('Sign-in error:', err);
        } finally {
            setSigningIn(false);
        }
    };

    const handleSubmit = async (e, parentId = null) => {
        e.preventDefault();
        const content = parentId ? replyContent : newComment;
        if (!content.trim()) return;

        // If not signed in, trigger Google sign-in
        if (!user) {
            handleGoogleSignIn();
            return;
        }

        try {
            let commentData;
            try {
                const result = await api.postComment({
                    blogId,
                    content,
                    parentId,
                    userId: user.id,
                    userName: user.name,
                });
                if (result.error) throw new Error(result.error);
                commentData = result.comment;
            } catch {
                // Fallback: post directly via Supabase if backend API fails
                const { data, error } = await supabase
                    .from('blog_comments')
                    .insert([{
                        blog_id: blogId,
                        parent_id: parentId || null,
                        user_name: user.name,
                        content: content,
                        is_admin: false,
                    }])
                    .select()
                    .single();
                if (error) throw error;
                commentData = data;
            }

            if (commentData) {
                setComments([...comments, commentData]);
            }
            setNewComment('');
            setReplyContent('');
            setReplyingTo(null);
        } catch (err) {
            console.error('Error posting comment:', err);
            alert('Failed to post comment. Please try again.');
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    if (loading) return <div className="text-center py-4">Loading comments...</div>;

    const rootComments = comments.filter(c => !c.parent_id);
    const getReplies = (parentId) => comments.filter(c => c.parent_id === parentId);

    return (
        <div className="comment-section mt-5">
            <h4 className="mb-4">Comments ({comments.length})</h4>

            <div className="comments-chat-container mb-5" style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                padding: '20px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '1.5rem',
                backdropFilter: 'blur(10px)'
            }}>
                {rootComments.map(comment => (
                    <div key={comment.id} className="comment-thread">
                        {/* Parent Comment */}
                        <div className={`comment-bubble user-comment ${comment.is_admin ? 'admin' : ''}`} style={{
                            maxWidth: '80%',
                            alignSelf: comment.is_admin ? 'flex-end' : 'flex-start',
                            background: comment.is_admin ? 'rgba(200, 8, 8, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                            padding: '15px 20px',
                            borderRadius: comment.is_admin ? '1.5rem 1.5rem 0 1.5rem' : '1.5rem 1.5rem 1.5rem 0',
                            border: `1px solid ${comment.is_admin ? 'rgba(200, 8, 8, 0.3)' : 'rgba(255, 255, 255, 0.2)'}`,
                            marginLeft: comment.is_admin ? 'auto' : '0',
                            position: 'relative'
                        }}>
                            <div className="d-flex justify-content-between mb-2">
                                <span style={{ fontWeight: '700', fontSize: '0.9rem', color: comment.is_admin ? '#ff4d4d' : '#fff' }}>
                                    {comment.user_name} {comment.is_admin && '(Admin)'}
                                </span>
                                <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>
                                    {new Date(comment.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="mb-2" style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>{comment.content}</p>
                            <button
                                onClick={() => setReplyingTo(comment)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#C80808',
                                    fontSize: '0.8rem',
                                    fontWeight: '600',
                                    padding: '0'
                                }}
                            >
                                Reply
                            </button>
                        </div>

                        {/* Nested Replies */}
                        <div className="replies-container mt-3" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {getReplies(comment.id).map(reply => (
                                <div key={reply.id} className={`comment-bubble ${reply.is_admin ? 'admin' : ''}`} style={{
                                    maxWidth: '80%',
                                    alignSelf: reply.is_admin ? 'flex-end' : 'flex-start',
                                    background: reply.is_admin ? 'rgba(200, 8, 8, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                                    padding: '12px 18px',
                                    borderRadius: reply.is_admin ? '1.5rem 1.5rem 0 1.5rem' : '1.5rem 1.5rem 1.5rem 0',
                                    border: `1px solid ${reply.is_admin ? 'rgba(200, 8, 8, 0.3)' : 'rgba(255, 255, 255, 0.2)'}`,
                                    marginLeft: reply.is_admin ? 'auto' : '10%',
                                    marginRight: reply.is_admin ? '0' : '0'
                                }}>
                                    <div className="d-flex justify-content-between mb-1">
                                        <span style={{ fontWeight: '700', fontSize: '0.85rem', color: reply.is_admin ? '#ff4d4d' : '#fff' }}>
                                            {reply.user_name} {reply.is_admin && '(Admin)'}
                                        </span>
                                        <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>
                                            {new Date(reply.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="mb-0" style={{ fontSize: '0.9rem' }}>{reply.content}</p>
                                </div>
                            ))}
                        </div>

                        {/* Reply Form */}
                        {replyingTo?.id === comment.id && (
                            <div className="reply-form mt-3 ms-5">
                                <form onSubmit={(e) => handleSubmit(e, comment.id)}>
                                    <textarea
                                        className="form-control mb-2"
                                        rows="2"
                                        placeholder="Write a reply..."
                                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                                        value={replyContent}
                                        onChange={(e) => setReplyContent(e.target.value)}
                                    />
                                    <div className="d-flex gap-2">
                                        <button type="submit" className="btn btn-danger btn-sm">
                                            {user ? 'Post Reply' : 'Sign in to Reply'}
                                        </button>
                                        <button type="button" className="btn btn-outline-light btn-sm" onClick={() => setReplyingTo(null)}>Cancel</button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Main Comment Form */}
            <div className="main-comment-form p-4" style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '1.5rem',
                border: '1px solid rgba(255,255,255,0.1)'
            }}>
                <h5>Leave a Comment</h5>

                {/* Show signed-in user info */}
                {user ? (
                    <div className="d-flex align-items-center gap-3 mb-3 p-2" style={{
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '0.75rem',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        {user.avatar && (
                            <img
                                src={user.avatar}
                                alt={user.name}
                                style={{ width: 36, height: 36, borderRadius: '50%' }}
                            />
                        )}
                        <div style={{ flex: 1 }}>
                            <span style={{ fontWeight: '600', fontSize: '0.9rem', color: '#fff' }}>
                                {user.name}
                            </span>
                            <span style={{ fontSize: '0.75rem', opacity: 0.6, marginLeft: '8px' }}>
                                {user.email}
                            </span>
                        </div>
                        <button
                            onClick={handleSignOut}
                            style={{
                                background: 'none',
                                border: '1px solid rgba(255,255,255,0.2)',
                                color: '#aaa',
                                fontSize: '0.75rem',
                                padding: '4px 10px',
                                borderRadius: '0.5rem',
                                cursor: 'pointer'
                            }}
                        >
                            Sign out
                        </button>
                    </div>
                ) : (
                    <div className="mb-3 p-3 text-center" style={{
                        background: 'rgba(200, 8, 8, 0.1)',
                        borderRadius: '0.75rem',
                        border: '1px solid rgba(200, 8, 8, 0.2)'
                    }}>
                        <p style={{ fontSize: '0.9rem', marginBottom: '10px', color: '#ccc' }}>
                            Sign in with Google to post a comment
                        </p>
                        <button
                            onClick={handleGoogleSignIn}
                            disabled={signingIn}
                            className="btn btn-outline-light btn-sm"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                        >
                            <svg width="18" height="18" viewBox="0 0 48 48">
                                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                            </svg>
                            {signingIn ? 'Signing in...' : 'Sign in with Google'}
                        </button>
                    </div>
                )}

                <form onSubmit={(e) => handleSubmit(e)}>
                    <div className="mb-3">
                        <textarea
                            className="form-control"
                            rows="4"
                            placeholder={user ? "Your Comment" : "Sign in first to comment..."}
                            required
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '12px' }}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-danger px-4 py-2"
                        style={{ borderRadius: '0.75rem', fontWeight: '600' }}
                    >
                        {user ? 'Post Comment' : 'Sign in to Comment'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CommentSection;
