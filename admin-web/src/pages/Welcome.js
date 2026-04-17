import React, { useEffect } from "react";
import "./Welcome.css";

export default function Welcome({ onFinish }) {

  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2800);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="welcome-page">

      {/* Ambient glow */}
      <div className="welcome-bg-glow"></div>

      <div className="welcome-content">

        {/* Logo */}
        <div className="welcome-logo">
          <div className="welcome-logo-icon">G</div>
          <div className="welcome-logo-text">GigWare</div>
        </div>

        {/* Greeting */}
        <div className="welcome-greeting">
          <h1 className="welcome-title">Welcome back, Admin</h1>
          <p className="welcome-subtitle">
            Preparing your dashboard with the latest data
          </p>
        </div>

        {/* Progress Bar */}
        <div className="welcome-progress-wrapper">
          <div className="welcome-progress-track">
            <div className="welcome-progress-fill"></div>
          </div>
          <div className="welcome-progress-label">
            <span className="welcome-progress-dot"></span>
            Initializing modules
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="welcome-footer">
        <p className="welcome-footer-text">GigWare Admin Portal v2.0 · Secure Session</p>
      </div>

    </div>
  );
}