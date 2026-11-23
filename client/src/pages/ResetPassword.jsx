import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import Logo from "../components/Logo";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!email.trim() || !newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please re-enter them.");
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/reset-password", {
        email: email.trim(),
        newPassword,
      });

      setSuccessMsg("Your password has been updated! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.msg ||
          "Could not reset password. Please check your email and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page reset-page">
      <div className="auth-background-sparkle sparkle-one">✦</div>
      <div className="auth-background-sparkle sparkle-two">♡</div>
      <div className="auth-background-sparkle sparkle-three">✧</div>
      <div className="auth-background-sparkle sparkle-four">✦</div>

      <section className="auth-box reset-card">
        <div className="reset-mascot-wrap">
          <Logo size={64} />
        </div>

        <div className="auth-brand">
          <h2>Reset your key</h2>
          <p>Set a fresh master password for your Lockr account.</p>
        </div>

        <form className="auth-form reset-form" onSubmit={handleReset}>
          <label htmlFor="reset-email">Account email</label>
          <input
            id="reset-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          <label htmlFor="reset-new-password">New password</label>
          <div className="password-input-wrap">
            <input
              id="reset-new-password"
              type={showPassword ? "text" : "password"}
              placeholder="At least 8 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
            />

            <button
              type="button"
              className="password-eye"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3 3l18 18" />
                  <path d="M10.6 10.6a2 2 0 002.8 2.8" />
                  <path d="M9.9 5.2A10.8 10.8 0 0112 5c5 0 8.5 4.5 9.5 7-.4 1-1.2 2.1-2.3 3.1" />
                  <path d="M6.2 6.2C4.2 7.5 2.9 9.5 2.5 12c.6 1.5 2.2 3.5 4.5 4.9A9.7 9.7 0 0012 19c1 0 2-.2 2.9-.5" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          <label htmlFor="reset-confirm-password">Confirm new password</label>
          <input
            id="reset-confirm-password"
            type={showPassword ? "text" : "password"}
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
          />

          {error && <div className="auth-error">{error}</div>}
          {successMsg && <div className="success-message">{successMsg}</div>}

          <button
            type="submit"
            className="auth-submit-button"
            disabled={loading}
          >
            {loading ? "Updating..." : "Save new password 🔑"}
          </button>
        </form>

        <div className="reset-nav-links">
          <Link to="/login" className="landing-back-link">
            ← Back to Log in
          </Link>
          <Link to="/" className="landing-back-link">
            Lockr Home
          </Link>
        </div>
      </section>
    </main>
  );
}