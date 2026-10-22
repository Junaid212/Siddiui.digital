import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import HeadTitle from "../../Components/Head/HeadTitle";
import BannerInnerSection from "../../Components/Banner/inner";
import "./ResetPassword.css";

export default function ResetPasswordPage() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    // Check if session exists or handle token from hash
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSessionReady(true);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) {
        setSessionReady(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      setSuccessMsg("Your password has been successfully saved! Redirecting to your reader account…");
      setTimeout(() => {
        navigate("/my-orders");
      }, 1500);
    } catch (err) {
      console.error("Password update error:", err);
      setErrorMsg(err.message || "Failed to update password. Your link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HeadTitle title="Set Your Password | Siddiqui.Digital" />
      <BannerInnerSection title="Reader Account" currentPage="Set Password" />

      <div className="reset-page-container">
        <div className="reset-card">
          <div className="reset-card-header">
            <div className="reset-icon">
              <i className="fa-solid fa-key" />
            </div>
            <h1>Set Your Password</h1>
            <p>Choose a secure password for your Siddiqui.Digital reader account.</p>
          </div>

          {errorMsg && (
            <div className="reset-alert error" role="alert">
              <i className="fa-solid fa-circle-exclamation" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="reset-alert success" role="alert">
              <i className="fa-solid fa-circle-check" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleUpdatePassword} className="reset-form">
            <div className="reset-form-group">
              <label htmlFor="new-password">New Password</label>
              <input
                id="new-password"
                type="password"
                className="reset-input"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>

            <div className="reset-form-group">
              <label htmlFor="confirm-password">Confirm New Password</label>
              <input
                id="confirm-password"
                type="password"
                className="reset-input"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              className="reset-submit-btn"
              disabled={loading}
              id="reset-submit-btn"
            >
              {loading ? "Saving Password…" : "Save Password & Enter"}
            </button>
          </form>

          <div className="reset-footer">
            <Link to="/login">← Back to Sign In</Link>
          </div>
        </div>
      </div>
    </>
  );
}
