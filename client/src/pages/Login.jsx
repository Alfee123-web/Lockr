import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../api";
import Logo from "../components/Logo";

export default function Login() {
  const [searchParams] = useSearchParams();
  const [isSignup, setIsSignup] = useState(
    searchParams.get("mode") === "signup"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setIsSignup(searchParams.get("mode") === "signup");
    setError("");
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please fill in both fields.");
      return;
    }

    try {
      setLoading(true);

      const endpoint = isSignup ? "/auth/signup" : "/auth/login";
      const { data } = await api.post(endpoint, {
        email: email.trim(),
        password,
      });

      if (!data.token) {
        throw new Error("Authentication token was not received.");
      }

      localStorage.setItem("token", data.token);
      navigate("/vault");
    } catch (err) {
      setError(
        err.response?.data?.msg ||
          err.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page auth-split-page">
      <div className="auth-background-sparkle sparkle-one">✦</div>
      <div className="auth-background-sparkle sparkle-two">♡</div>
      <div className="auth-background-sparkle sparkle-three">✧</div>
      <div className="auth-background-sparkle sparkle-four">✦</div>

      <section className="auth-split-layout">
        {/* LEFT: Animated treasure chest */}
        <div className="treasure-side">
          <div className="treasure-intro">
            <span className="treasure-eyebrow">
              ✨ YOUR LITTLE SPACE OF SECURITY
            </span>
            <h1>
              Keep your secrets
              <span> safe and sweet.</span>
            </h1>
            <p>
              All your passwords, tucked away safely in one lovely little
              treasure box.
            </p>
          </div>

          <div
            className="treasure-scene"
            aria-label="Decorative treasure chest"
          >
            <span className="chest-floating floating-heart heart-one">♡</span>
            <span className="chest-floating floating-heart heart-two">♥</span>
            <span className="chest-floating floating-star star-one">✦</span>
            <span className="chest-floating floating-star star-two">✧</span>
            <span className="chest-floating floating-star star-three">✦</span>

            <div className="chest-glow"></div>

            <div className="treasure-chest">
              <div className="chest-lid">
                <div className="chest-lid-bow">🎀</div>
              </div>
              <div className="chest-treasure">💗 ✨ 💎</div>
              <div className="chest-body">
                <div className="chest-lock">♥</div>
              </div>
            </div>

            <div className="treasure-caption">
              <span>♡</span> Your secrets are safe here! <span>♡</span>
            </div>
          </div>

          <div className="treasure-footer-note">
            <Link to="/" className="landing-back-link">
              ← Back to Lockr overview
            </Link>
          </div>
        </div>

        {/* RIGHT: Login / Signup card */}
        <div className="auth-box auth-login-card">
          <div className="auth-brand">
            <div className="auth-brand-logo">
              <Logo size={64} />
            </div>
            <h2>Lockr</h2>
            <p>One place for all your keys.</p>
          </div>

          <div className="auth-heading">
            <h3>{isSignup ? "Create your account!" : "Welcome back!"}</h3>
            <p>
              {isSignup
                ? "Start keeping your little treasures safe."
                : "Your little vault of secrets is waiting."}
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label htmlFor="lockr-email">Email address</label>
            <input
              id="lockr-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />

            <label htmlFor="lockr-password">Password</label>
            <div className="password-input-wrap">
              <input
                id="lockr-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isSignup ? "new-password" : "current-password"}
                required
              />

              <button
                type="button"
                className="password-eye"
                onClick={() => setShowPassword((previous) => !previous)}
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

            {error && <div className="auth-error">{error}</div>}

            <button
              type="submit"
              className="auth-submit-button"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : isSignup
                  ? "Create my account ♡"
                  : "Unlock my vault ♡"}
            </button>
          </form>

          {!isSignup && (
            <div className="auth-forgot-footer">
              <Link to="/reset-password" className="forgot-password-link">
                Forgot your password?
              </Link>
            </div>
          )}

          <div className="auth-switch">
            <span>
              {isSignup ? "Already have an account?" : "New to Lockr?"}
            </span>
            <button
              type="button"
              onClick={() => {
                setIsSignup((previous) => !previous);
                setError("");
                setShowPassword(false);
              }}
            >
              {isSignup ? "Log in" : "Create account"}
            </button>
          </div>

          <div className="auth-card-footer">
            <span>♡</span> Made with love, secured with care <span>♡</span>
          </div>
        </div>
      </section>
    </main>
  );
}