import React, { useState } from "react";
import "./Login.css";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleLogin(e) {
    if (e) e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const API = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const res = await fetch(`${API}/admin-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: username }),
      });

      if (res.status === 200) {
        onLogin("admin");
      } else if (res.status === 404) {
        setError("Invalid username or password.");
      } else {
        setError("An unexpected error occurred.");
      }
    } catch (err) {
      setError("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">

        {/* ── Left Brand Panel ── */}
        <div className="login-brand">
          <div className="brand-top">
            <div className="brand-logo">
              <div className="brand-logo-icon">G</div>
              <div className="brand-logo-text">GigWare</div>
            </div>
            <h1 className="brand-headline">
              Insurance built for<br />
              India's <span>gig workforce</span>
            </h1>
            <p className="brand-description">
              Manage policies, track claims, and monitor worker coverage — all from one unified admin dashboard.
            </p>
          </div>
          <div className="brand-stats">
            <div className="brand-stat">
              <div className="brand-stat-value">2.8K+</div>
              <div className="brand-stat-label">Active Workers</div>
            </div>
            <div className="brand-stat">
              <div className="brand-stat-value">₹2.4L</div>
              <div className="brand-stat-label">Premiums</div>
            </div>
            <div className="brand-stat">
              <div className="brand-stat-value">98%</div>
              <div className="brand-stat-label">Uptime</div>
            </div>
          </div>
        </div>

        {/* ── Right Form Panel ── */}
        <div className="login-form-panel">
          <div className="form-header">
            <h2 className="form-title">Welcome back</h2>
            <p className="form-subtitle">Sign in to your admin account to continue</p>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            <div className="input-group">
              <label className="input-label">Username</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </span>
                <input
                  className="login-input"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  className="login-input"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              className="login-button"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <div className="spinner"></div>
              ) : (
                <>
                  Sign In
                  <span className="button-arrow">→</span>
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="login-error">
              <span className="error-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
              </span>
              <span className="error-text">{error}</span>
            </div>
          )}

          <div className="form-footer">
            <p className="form-footer-text">
              Secured by <span>GigWare</span> · Admin Portal v2.0
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}