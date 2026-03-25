import React, { useEffect } from "react";

export default function Welcome({ onFinish }) {

  useEffect(() => {
    setTimeout(() => {
      onFinish();
    }, 2000); // 2 seconds
  }, [onFinish]);

  return (
    <div style={{
      height: "100vh",
      background: "#0b0f19",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "white",
      flexDirection: "column"
    }}>

      <h1 style={{
        color: "#ff7a00",
        fontSize: "40px"
      }}>
        GigWare
      </h1>

      <p style={{ color: "#9ca3af", marginTop: "10px" }}>
        Loading dashboard...
      </p>

    </div>
  );
}