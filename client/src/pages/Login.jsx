import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const path = isSignup ? "/auth/signup" : "/auth/login";
      const { data } = await api.post(path, { email, password });
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.msg || "Something went wrong");
    }
  };

  return (
    <div className="auth-box">
      <h1>🔐 Lockr</h1>
      <p>One place for all your keys.</p>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password (8+ characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">{isSignup ? "Create account" : "Log in"}</button>
      </form>

      <p className="toggle" onClick={() => setIsSignup(!isSignup)}>
        {isSignup ? "Already have an account? Log in" : "New here? Sign up"}
      </p>
    </div>
  );
}