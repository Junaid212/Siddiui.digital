import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import HeadTitle from "../../Components/Head/HeadTitle";
import BannerInnerSection from "../../Components/Banner/inner";
import { api } from "../../api";
import "./Login.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sessionUser, setSessionUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Forgot password flow
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");
  const [isGoogleAccount, setIsGoogleAccount] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setSessionUser(session.user);
      }
    });
  }, []);

  /* ── Google Sign In ─────────────────────────────── */
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setErrorMsg("");
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const targetPath = searchParams.get("redirect") || "/my-orders";
      const redirectUrl = window.location.origin + targetPath;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: redirectUrl },
      });
      if (error) throw error;
    } catch (err) {
      console.error("Google login error:", err);
      setErrorMsg(err.message || "Failed to sign in with Google.");
      setGoogleLoading(false);
    }
  };

  /* ── Email & Password Sign In ───────────────────── */
  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        // If credentials invalid, check if this is actually a Google account
        try {
          const checkRes = await api.checkAccountType(cleanEmail);
          if (checkRes && checkRes.isGoogle) {
            setErrorMsg("This account uses Google sign-in. Please sign in with Google above.");
            setLoading(false);
            return;
          }
        } catch (_) {}

        throw error;
      }

      if (data?.session) {
        setSuccessMsg("Signed in successfully!");
        setTimeout(() => {
          const searchParams = new URLSearchParams(window.location.search);
          const targetPath = searchParams.get("redirect") || "/my-orders";
          navigate(targetPath);
        }, 600);
      }
    } catch (err) {
      console.error("Email login error:", err);
      setErrorMsg(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Forgot Password ────────────────────────────── */
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotError("");
    setForgotSuccess("");
    setIsGoogleAccount(false);

    const cleanEmail = forgotEmail.trim();
    if (!cleanEmail) {
      setForgotError("Please enter your email address.");
      return;
    }

    setForgotLoading(true);
    try {
      const res = await api.forgotPassword(cleanEmail);
      if (res && res.isGoogle) {
        setIsGoogleAccount(true);
        setForgotError("This account uses Google sign-in.");
      } else if (res && res.success) {
        setForgotSuccess(res.message || "A link to set or reset your password has been sent to your email.");
      } else {
        setForgotError(res?.error || "Unable to send reset email. Please verify your address.");
      }
    } catch (err) {
      setForgotError(err.message || "Request failed. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <>
      <HeadTitle title="Customer Login | Siddiqui.Digital" />
      <BannerInnerSection title="Account Login" currentPage="Sign In" />

      <div className="login-page-container">
        <div className="login-card">
          <div className="login-card-header">
            <div className="login-brand-icon">
              <i className="fa-solid fa-book-open-reader" />
            </div>
            <h1>Customer Sign In</h1>
            <p>Access your digital editions, online reader, and reader companions.</p>
          </div>

          {sessionUser ? (
            <div className="login-already-box">
              <i className="fa-solid fa-circle-check" />
              <p>You are already signed in as <strong>{sessionUser.email}</strong></p>
              <div className="login-action-row">
                <Link to="/my-orders" className="login-btn-primary">
                  Go to My Books &amp; Orders
                </Link>
                <button
                  type="button"
                  className="login-btn-secondary"
                  onClick={async () => {
                    await supabase.auth.signOut();
                    setSessionUser(null);
                  }}
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Google Sign In */}
              <div className="login-oauth-section">
                <button
                  type="button"
                  className="login-google-btn"
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading}
                  id="login-google-btn"
                >
                  <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="Google"
                    width={18}
                    height={18}
                  />
                  {googleLoading ? "Connecting to Google…" : "Sign in with Google"}
                </button>
                <div className="login-oauth-privacy-note">
                  <i className="fa-solid fa-shield-halved" /> Google shares only your name and email with us.
                </div>
              </div>

              <div className="login-divider">
                <span>or log in with email</span>
              </div>

              {/* Error / Success Messages */}
              {errorMsg && (
                <div className="login-alert error" role="alert">
                  <i className="fa-solid fa-circle-exclamation" />
                  <span>{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div className="login-alert success" role="alert">
                  <i className="fa-solid fa-circle-check" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Email Form */}
              <form onSubmit={handleEmailSignIn} className="login-form">
                <div className="login-form-group">
                  <label htmlFor="login-email">Email Address</label>
                  <input
                    id="login-email"
                    type="email"
                    className="login-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="login-form-group">
                  <div className="login-label-row">
                    <label htmlFor="login-password">Password</label>
                    <button
                      type="button"
                      className="login-forgot-link"
                      onClick={() => {
                        setShowForgot(true);
                        setForgotEmail(email);
                        setForgotError("");
                        setForgotSuccess("");
                        setIsGoogleAccount(false);
                      }}
                      id="login-forgot-btn"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <input
                    id="login-password"
                    type="password"
                    className="login-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>

                <button
                  type="submit"
                  className="login-submit-btn"
                  disabled={loading}
                  id="login-submit-btn"
                >
                  {loading ? "Signing in…" : "Sign In to Read"}
                </button>
              </form>

              {/* Forgot Password Modal / Drawer */}
              {showForgot && (
                <div className="login-modal-overlay" onClick={() => setShowForgot(false)}>
                  <div className="login-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="login-modal-header">
                      <h3>Reset or Set Password</h3>
                      <button
                        type="button"
                        className="login-modal-close"
                        onClick={() => setShowForgot(false)}
                        aria-label="Close"
                      >
                        <i className="fa-solid fa-xmark" />
                      </button>
                    </div>

                    <p className="login-modal-desc">
                      Enter the email address you used at checkout or registration. We will send you a secure link to set or reset your password.
                    </p>

                    {forgotError && (
                      <div className="login-alert error">
                        <i className="fa-solid fa-circle-exclamation" />
                        <div>
                          <strong>{forgotError}</strong>
                          {isGoogleAccount && (
                            <p style={{ margin: "6px 0 0 0", fontSize: "0.85rem" }}>
                              Your account is registered through Google authentication. You don&rsquo;t need a password &mdash; please use the <strong>Sign in with Google</strong> button.
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {forgotSuccess && (
                      <div className="login-alert success">
                        <i className="fa-solid fa-circle-check" />
                        <span>{forgotSuccess}</span>
                      </div>
                    )}

                    {isGoogleAccount ? (
                      <div style={{ marginTop: 16 }}>
                        <button
                          type="button"
                          className="login-google-btn"
                          onClick={() => {
                            setShowForgot(false);
                            handleGoogleSignIn();
                          }}
                        >
                          <img
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                            alt="Google"
                            width={16}
                            height={16}
                          />
                          Continue with Google
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleForgotPassword} className="login-forgot-form">
                        <div className="login-form-group">
                          <label htmlFor="forgot-email">Account Email</label>
                          <input
                            id="forgot-email"
                            type="email"
                            className="login-input"
                            placeholder="you@example.com"
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            required
                            autoFocus
                          />
                        </div>
                        <div className="login-modal-actions">
                          <button
                            type="button"
                            className="login-btn-secondary"
                            onClick={() => setShowForgot(false)}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="login-btn-primary"
                            disabled={forgotLoading || !forgotEmail.trim()}
                          >
                            {forgotLoading ? "Checking…" : "Send Reset Link"}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          <div className="login-footer-info">
            <p>
              Looking for your past purchases? <Link to="/my-orders">View My Orders</Link>
            </p>
            <p className="login-legal-links">
              <Link to="/terms-of-use">Terms of Use</Link> · <Link to="/privacy-policy">Privacy Policy</Link> · <Link to="/refund-policy">Refund Policy</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
