import React, { useState } from "react";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin() {
    // Simple check (temporary)
    if (username === "admin" && password === "1234") {
      onLogin("admin");
    } else {
      alert("Invalid credentials ❌");
    }
  }

  return (
    <div style={{
      height: "100vh",
      background: "#0b0f19",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "white"
    }}>

      <div style={{
        background: "#111827",
        padding: "40px",
        borderRadius: "16px",
        width: "320px"
      }}>

        <h1 style={{ color: "#ff7a00" }}>GigWare</h1>
        <p style={{ color: "#9ca3af" }}>Admin Login</p>

        {/* USERNAME */}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "20px",
            background: "#0b0f19",
            color: "white",
            border: "1px solid #333",
            borderRadius: "8px"
          }}
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "10px",
            background: "#0b0f19",
            color: "white",
            border: "1px solid #333",
            borderRadius: "8px"
          }}
        />

        {/* BUTTON */}
        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            marginTop: "20px",
            padding: "10px",
            background: "#ff7a00",
            border: "none",
            borderRadius: "8px",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Login →
        </button>

      </div>
    </div>
  );
}