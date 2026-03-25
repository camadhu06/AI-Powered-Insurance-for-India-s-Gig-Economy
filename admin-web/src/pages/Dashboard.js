import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

export default function Dashboard() {

  const cardStyle = {
    background: "#111827",
    padding: "20px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.6)"
  };

  const labelStyle = {
    color: "#9ca3af",
    marginBottom: "10px",
    fontSize: "14px"
  };

  const data = [
    { name: "Feb 1", premium: 180000, claims: 90000 },
    { name: "Feb 8", premium: 200000, claims: 85000 },
    { name: "Feb 15", premium: 210000, claims: 120000 },
    { name: "Feb 22", premium: 220000, claims: 100000 },
    { name: "Mar 1", premium: 230000, claims: 95000 },
    { name: "Mar 8", premium: 240000, claims: 140000 },
  ];

  const pieData = [
    { name: "Rain", value: 40 },
    { name: "AQI", value: 20 },
    { name: "Heat", value: 25 },
    { name: "Strike", value: 15 },
  ];

  const COLORS = ["#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444"];

  return (
    <div style={{
      background: "#0b0f19",
      minHeight: "100vh",
      color: "#e6edf3"
    }}>

      <Header />

      <div style={{ display: "flex" }}>
        <Sidebar />

        <div style={{ flex: 1 }}>

          {/* HEADER */}
          <div style={{
            padding: "20px",
            borderBottom: "1px solid #1f2937"
          }}>
            <h2 style={{ color: "#f37500" }}>
              Dashboard Overview
            </h2>
            <p style={{ color: "#9ca3af" }}>
              Real-time insurance operations
            </p>
          </div>

          {/* CARDS */}
          <div style={{
            padding: "20px",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px"
          }}>

            <div style={cardStyle}>
              <p style={labelStyle}>ACTIVE WORKERS</p>
              <h2 style={{ color: "#f37500", fontSize: "28px" }}>2,847</h2>
              <p style={{ color: "#22c55e" }}>↑ 12% this week</p>
            </div>

            <div style={cardStyle}>
              <p style={labelStyle}>PREMIUMS COLLECTED</p>
              <h2 style={{ color: "#22c55e", fontSize: "28px" }}>₹2.4L</h2>
              <p style={{ color: "#22c55e" }}>↑ 8% growth</p>
            </div>

            <div style={cardStyle}>
              <p style={labelStyle}>CLAIMS THIS WEEK</p>
              <h2 style={{ color: "#ef4444", fontSize: "28px" }}>342</h2>
              <p style={{ color: "#ef4444" }}>↑ Risk spike</p>
            </div>

            <div style={cardStyle}>
              <p style={labelStyle}>AVG PAYOUT TIME</p>
              <h2 style={{ color: "#3b82f6", fontSize: "28px" }}>4.2m</h2>
              <p style={{ color: "#22c55e" }}>↓ Improved</p>
            </div>

          </div>

          {/* CHART SECTION */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "20px",
            padding: "20px"
          }}>

            {/* BAR CHART */}
            <div style={{
              background: "#111827",
              padding: "20px",
              borderRadius: "16px"
            }}>
              <h3 style={{ color: "#f37500" }}>
                Claims vs Premiums
              </h3>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip />
                  <Bar dataKey="premium" fill="#22c55e" />
                  <Bar dataKey="claims" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* PIE CHART */}
            <div style={{
              background: "#111827",
              padding: "20px",
              borderRadius: "16px"
            }}>
              <h3 style={{ color: "#f37500" }}>
                Disruption Mix
              </h3>

              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" outerRadius={100}>
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}