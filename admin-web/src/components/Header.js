export default function Header() {
  return (
    <div style={{
      background: "#0b0f19",
      color: "white",
      padding: "15px 20px",
      borderBottom: "1px solid #1f2937",
      display: "flex",
      justifyContent: "space-between"
    }}>
      <h2>Dashboard Overview</h2>

      <div style={{ color: "#f37500" }}>
        ● 3 Active Disruptions
      </div>
    </div>
  );
}