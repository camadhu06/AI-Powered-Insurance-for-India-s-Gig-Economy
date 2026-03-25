export default function Sidebar() {
  return (
    <div style={{
      width: "240px",
      background: "#111827",
      color: "#cad8f0",
      height: "100vh",
      padding: "20px",
      borderRight: "1px solid #1f2937"
    }}>
      <h2 style={{ color: "#ff7a00", marginBottom: "20px" }}>GigWare</h2>

      <p style={{ color: "#ff7a00", marginBottom: "10px" }}>Dashboard</p>
      <p>Live Claims</p>
      <p>Workers</p>
      <p>Analytics</p>
      <p>Settings</p>
    </div>
  );
}