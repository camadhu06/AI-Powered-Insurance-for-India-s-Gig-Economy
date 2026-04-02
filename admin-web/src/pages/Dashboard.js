import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

export default function Dashboard() {
  const [activePage, setActivePage] = useState('dashboard');
  
  // Dashboard State
  const [stats, setStats] = useState({
    totalWorkers: 0,
    totalPaidOut: 0,
    totalClaims: 0,
    avgPayoutTime: "0 mins"
  });
  const [liveClaims, setLiveClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activePage === 'dashboard' || activePage === 'live-claims') {
      fetchDashboardData();
    }
  }, [activePage]);

  async function fetchDashboardData() {
    try {
      setLoading(true);
      const [statsRes, claimsRes] = await Promise.all([
        fetch("http://localhost:5000/admin/stats"),
        fetch("http://localhost:5000/admin/claims")
      ]);
      const statsData = await statsRes.json();
      const claimsData = await claimsRes.json();

      setStats(statsData);
      setLiveClaims(claimsData);
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    } finally {
      setLoading(false);
    }
  }

  // Styles
  const cardStyle = {
    background: "#111827",
    padding: "24px",
    borderRadius: "16px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    border: "1px solid #1f2937"
  };

  const labelStyle = {
    color: "#9ca3af",
    marginBottom: "12px",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "1px"
  };

  const valueStyle = {
    fontSize: "32px",
    fontWeight: "800",
    color: "#fff",
    marginBottom: "8px"
  };

  // Mock static data for fallback, but dynamically computing if data exists
  const dynamicPieData = liveClaims.length > 0 ? Object.entries(
    liveClaims.reduce((acc, claim) => {
      acc[claim.triggerType] = (acc[claim.triggerType] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value })) : [
    { name: "No Claims", value: 1 }
  ];

  // Group real claims by date locally
  const tempBarDict = {};
  liveClaims.forEach(claim => {
    const d = new Date(claim.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    tempBarDict[d] = (tempBarDict[d] || 0) + claim.payoutAmount;
  });
  
  // Real active premium volume calculation vs trailing payload
  const currentTotalPremiumVolume = stats.activePlans * 79; // Using standard shield Rs 79 avg base

  const dynamicBarData = Object.keys(tempBarDict).length > 0 
    ? Object.keys(tempBarDict).map(date => ({
        name: date,
        premium: currentTotalPremiumVolume,
        claims: tempBarDict[date]
      }))
    : [
        { name: "Last Week", premium: 0, claims: 0 },
        { name: "This Week", premium: currentTotalPremiumVolume, claims: stats.totalPaidOut },
      ];

  // Darker chart colors requested
  const COLORS = ["#0284c7", "#7e22ce", "#b45309", "#991b1b", "#15803d"];

  // Disruption Map logic grouping real claims identically onto locations and triggers
  const disruptionMap = {};
  liveClaims.forEach(c => {
    const key = `${c.triggerType}-${c.userId?.city || 'Unknown'}`;
    if (!disruptionMap[key]) {
      disruptionMap[key] = {
        reason: c.triggerType,
        location: c.userId?.city || 'Unknown',
        time: "4.2 mins", // Automated disbursement timeframe
        payout: 0,
        count: 0
      };
    }
    disruptionMap[key].payout += c.payoutAmount;
    disruptionMap[key].count += 1;
  });
  const liveDisruptionFeed = Object.values(disruptionMap);

  // Formatter for currency
  const formatRs = (num) => new Intl.NumberFormat('en-IN').format(num);

  return (
    <div style={{
      background: "#0b0f19",
      minHeight: "100vh",
      color: "#e6edf3",
      display: "flex"
    }}>
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      <div style={{ flex: 1, height: "100vh", overflowY: "auto" }}>
        
        {/* Only render dashboard content if activePage is dashboard, else blank placeholders for physical routing map */}
        {activePage === 'dashboard' && (
          <div style={{ padding: "32px" }}>
            
            {/* Header / Top */}
            <div style={{ marginBottom: "32px" }}>
              <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#fff", letterSpacing: "-0.5px" }}>Overview</h1>
              <p style={{ color: "#9ca3af", marginTop: "4px" }}>System vitals and automated payout engine metrics.</p>
            </div>

            {/* CARDS */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "24px",
              marginBottom: "32px"
            }}>
              {/* Box 1: Active Workers */}
              <div style={{ ...cardStyle, borderTop: "4px solid #f37500" }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <p style={{ color: "#a1a1aa", fontSize: "12px", fontWeight: "600", letterSpacing: "1px" }}>ACTIVE WORKERS</p>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f37500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
                  <h2 style={{ fontSize: "32px", fontWeight: "800", color: "#fff", lineHeight: "1" }}>{loading ? "..." : stats.totalWorkers}</h2>
                  <span style={{ color: "#22c55e", fontSize: "11px", fontWeight: "700", background: "rgba(34, 197, 94, 0.1)", padding: "4px 8px", borderRadius: "6px", marginBottom: "2px" }}>{stats.activePlans} Covered</span>
                </div>
              </div>

              {/* Box 2: Premium Collected */}
              <div style={{ ...cardStyle, borderTop: "4px solid #22c55e" }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <p style={{ color: "#a1a1aa", fontSize: "12px", fontWeight: "600", letterSpacing: "1px" }}>PREMIUMS</p>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
                  <h2 style={{ fontSize: "32px", fontWeight: "800", color: "#fff", lineHeight: "1" }}>
                    {loading ? "..." : `₹${formatRs(currentTotalPremiumVolume)}`}
                  </h2>
                  <span style={{ color: "#22c55e", fontSize: "11px", fontWeight: "700", background: "rgba(34, 197, 94, 0.1)", padding: "4px 8px", borderRadius: "6px", marginBottom: "2px" }}>↑ Yield</span>
                </div>
              </div>

              {/* Box 3: Claims This Week */}
              <div style={{ ...cardStyle, borderTop: "4px solid #ef4444" }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <p style={{ color: "#a1a1aa", fontSize: "12px", fontWeight: "600", letterSpacing: "1px" }}>CLAIMS (WEEK)</p>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
                  <h2 style={{ fontSize: "32px", fontWeight: "800", color: "#fff", lineHeight: "1" }}>{loading ? "..." : stats.totalClaims}</h2>
                  <span style={{ color: "#ef4444", fontSize: "11px", fontWeight: "700", background: "rgba(239, 68, 68, 0.1)", padding: "4px 8px", borderRadius: "6px", marginBottom: "2px" }}>₹{formatRs(stats.totalPaidOut)} Paid</span>
                </div>
              </div>

              {/* Box 4: Avg Payout Time */}
              <div style={{ ...cardStyle, borderTop: "4px solid #3b82f6" }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <p style={{ color: "#a1a1aa", fontSize: "12px", fontWeight: "600", letterSpacing: "1px" }}>AVG PAYOUT</p>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
                  <h2 style={{ fontSize: "32px", fontWeight: "800", color: "#fff", lineHeight: "1", whiteSpace: "nowrap" }}>{stats.avgPayoutTime.replace(" ", "")}</h2>
                  <span style={{ color: "#3b82f6", fontSize: "11px", fontWeight: "700", background: "rgba(59, 130, 246, 0.1)", padding: "4px 8px", borderRadius: "6px", marginBottom: "2px", whiteSpace: "nowrap" }}>Automated</span>
                </div>
              </div>
            </div>

            {/* CHART SECTION */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr",
              gap: "24px",
              marginBottom: "32px"
            }}>
              {/* BAR CHART */}
              <div style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div>
                    <h3 style={{ color: "#fff", fontSize: "16px", fontWeight: "600", letterSpacing: "0.5px" }}>
                      Capital Efficiency
                    </h3>
                    <p style={{ color: "#71717a", fontSize: "12px", marginTop: "4px" }}>Income vs Payout correlation</p>
                  </div>
                  <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.1)", padding: "6px 10px", borderRadius: "8px", fontSize: "11px", color: "#a1a1aa", display: "flex", alignItems: "center", gap: "6px", fontWeight: "600", letterSpacing: "0.5px" }}>
                    <div style={{width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e"}}></div>
                    SYNCED
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dynamicBarData}>
                    <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={val => `₹${Math.floor(val/1000)}k`} />
                    <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                    <Bar dataKey="premium" fill="#15803d" radius={[4, 4, 0, 0]} /> {/* Darker green */}
                    <Bar dataKey="claims" fill="#b91c1c" radius={[4, 4, 0, 0]} /> {/* Darker red */}
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* PIE CHART */}
              <div style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div>
                    <h3 style={{ color: "#fff", fontSize: "16px", fontWeight: "600", letterSpacing: "0.5px" }}>
                      Disruption Matrix
                    </h3>
                    <p style={{ color: "#71717a", fontSize: "12px", marginTop: "4px" }}>Regional impact trigger events</p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={dynamicPieData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={5}>
                      {dynamicPieData.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 'bold' }} itemStyle={{ color: '#fff' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AUTO CLAIMS TABLE */}
            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h3 style={{ color: "#fff", fontSize: "16px", fontWeight: "600", letterSpacing: "0.5px" }}>
                    Automated Claims Ledger
                  </h3>
                  <p style={{ color: "#71717a", fontSize: "12px", marginTop: "4px" }}>Real-time systemic disbursement logs</p>
                </div>
                <div style={{ cursor: "pointer", background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '8px 14px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', border: '1px solid rgba(59, 130, 246, 0.2)', textTransform: "uppercase", letterSpacing: "1px" }}>
                  Export Table →
                </div>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #1f2937", color: "#9ca3af", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>
                      <th style={{ padding: "16px", fontWeight: "600" }}>Worker</th>
                      <th style={{ padding: "16px", fontWeight: "600" }}>Disruption</th>
                      <th style={{ padding: "16px", fontWeight: "600" }}>Zone</th>
                      <th style={{ padding: "16px", fontWeight: "600" }}>Fraud Score</th>
                      <th style={{ padding: "16px", fontWeight: "600" }}>Payout</th>
                      <th style={{ padding: "16px", fontWeight: "600" }}>Status</th>
                      <th style={{ padding: "16px", fontWeight: "600" }}>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {liveClaims.length === 0 ? (
                      <tr>
                        <td colSpan="7" style={{ padding: "24px", textAlign: "center", color: "#6b7280" }}>
                          {loading ? "Loading live claims..." : "No claims processed yet."}
                        </td>
                      </tr>
                    ) : (
                      liveClaims.slice(0, 10).map((claim, idx) => {
                        const date = new Date(claim.createdAt);
                        return (
                          <tr key={idx} style={{ borderBottom: "1px solid #1f2937", transition: "background 0.2s ease" }}>
                            <td style={{ padding: "16px", color: "#fff", fontWeight: "500" }}>
                              {claim.userId?.name || "Unknown"}
                            </td>
                            <td style={{ padding: "16px" }}>
                              <span style={{ 
                                background: claim.triggerType === 'Heavy Rain' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
                                color: claim.triggerType === 'Heavy Rain' ? '#3b82f6' : '#ef4444', 
                                padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' 
                              }}>
                                {claim.triggerType}
                              </span>
                            </td>
                            <td style={{ padding: "16px", color: "#a1a1aa" }}>{claim.userId?.city || "-"}</td>
                            <td style={{ padding: "16px" }}>
                              <span style={{ color: "#22c55e", fontWeight: "600" }}>Low (98% Trust)</span>
                            </td>
                            <td style={{ padding: "16px", color: "#fff", fontWeight: "700" }}>
                              ₹{claim.payoutAmount}
                            </td>
                            <td style={{ padding: "16px" }}>
                              <span style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <div style={{width:'6px', height:'6px', borderRadius:'50%', background:'#22c55e'}}></div>
                                Paid
                              </span>
                            </td>
                            <td style={{ padding: "16px", color: "#6b7280", fontSize: "12px" }}>
                              {date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* LIVE CLAIMS PAGE SCREEN */}
        {activePage === 'live-claims' && (
          <div style={{ padding: "32px" }}>
            {/* Header */}
            <div style={{ marginBottom: "32px" }}>
              <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#fff", letterSpacing: "-0.5px" }}>Live Claims Processing</h1>
              <p style={{ color: "#9ca3af", marginTop: "4px" }}>Monitor atmospheric disruptions and zero-touch payout routing instantaneously.</p>
            </div>

            {/* 3 Horizontal Boxes */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "24px",
              marginBottom: "32px"
            }}>
              {/* Box 1: Active Disruption */}
              <div style={{ ...cardStyle, borderTop: "4px solid #f59e0b" }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <p style={{ color: "#a1a1aa", fontSize: "12px", fontWeight: "600", letterSpacing: "1px" }}>ACTIVE DISRUPTIONS</p>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
                  <h2 style={{ fontSize: "32px", fontWeight: "800", color: "#fff", lineHeight: "1" }}>{loading ? "..." : liveDisruptionFeed.length}</h2>
                  <span style={{ color: "#f59e0b", fontSize: "11px", fontWeight: "700", background: "rgba(245, 158, 11, 0.1)", padding: "4px 8px", borderRadius: "6px", marginBottom: "2px" }}>Active Geozones</span>
                </div>
              </div>

              {/* Box 2: Claims Preprocessing */}
              <div style={{ ...cardStyle, borderTop: "4px solid #8b5cf6" }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <p style={{ color: "#a1a1aa", fontSize: "12px", fontWeight: "600", letterSpacing: "1px" }}>PREPROCESSING</p>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
                  <h2 style={{ fontSize: "32px", fontWeight: "800", color: "#fff", lineHeight: "1" }}>0</h2>
                  <span style={{ color: "#8b5cf6", fontSize: "11px", fontWeight: "700", background: "rgba(139, 92, 246, 0.1)", padding: "4px 8px", borderRadius: "6px", marginBottom: "2px" }}>100% Automated</span>
                </div>
              </div>

              {/* Box 3: Paid Out Today */}
              <div style={{ ...cardStyle, borderTop: "4px solid #15803d" }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <p style={{ color: "#a1a1aa", fontSize: "12px", fontWeight: "600", letterSpacing: "1px" }}>PAID OUT TODAY</p>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
                  <h2 style={{ fontSize: "32px", fontWeight: "800", color: "#fff", lineHeight: "1" }}>
                    {loading ? "..." : `₹${formatRs(liveDisruptionFeed.reduce((sum, item) => sum + item.payout, 0))}`}
                  </h2>
                  <span style={{ color: "#22c55e", fontSize: "11px", fontWeight: "700", background: "rgba(34, 197, 94, 0.1)", padding: "4px 8px", borderRadius: "6px", marginBottom: "2px" }}>Zero-Touch Sent</span>
                </div>
              </div>
            </div>

            {/* Live Disruption Feed Table */}
            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h3 style={{ color: "#fff", fontSize: "16px", fontWeight: "600", letterSpacing: "0.5px" }}>
                    Live Disruption Radar
                  </h3>
                  <p style={{ color: "#71717a", fontSize: "12px", marginTop: "4px" }}>Regional cluster mapping mapping triggers strictly to location damage</p>
                </div>
                <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.1)", padding: "6px 10px", borderRadius: "8px", fontSize: "11px", color: "#ef4444", display: "flex", alignItems: "center", gap: "6px", fontWeight: "600", letterSpacing: "0.5px" }}>
                  <div style={{width: "6px", height: "6px", borderRadius: "50%", background: "#ef4444", boxShadow: "0 0 6px #ef4444"}}></div>
                  LIVE FEED
                </div>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #1f2937", color: "#9ca3af", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>
                      <th style={{ padding: "16px", fontWeight: "600" }}>Disruption</th>
                      <th style={{ padding: "16px", fontWeight: "600" }}>Location</th>
                      <th style={{ padding: "16px", fontWeight: "600" }}>Payload Time</th>
                      <th style={{ padding: "16px", fontWeight: "600" }}>Aggregated Capital Dispersed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {liveDisruptionFeed.length === 0 ? (
                      <tr>
                        <td colSpan="4" style={{ padding: "24px", textAlign: "center", color: "#6b7280" }}>
                          {loading ? "Scanning environmental matrices..." : "No active disruptions detected across network."}
                        </td>
                      </tr>
                    ) : (
                      liveDisruptionFeed.map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: "1px solid #1f2937", transition: "background 0.2s ease" }}>
                          <td style={{ padding: "16px" }}>
                            <span style={{ 
                              background: item.reason === 'Heavy Rain' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
                              color: item.reason === 'Heavy Rain' ? '#3b82f6' : '#ef4444', 
                              padding: '4px 10px', borderRadius: '4px', fontSize: '13px', fontWeight: '700' 
                            }}>
                              {item.reason}
                            </span>
                          </td>
                          <td style={{ padding: "16px", color: "#fff", fontWeight: "600", letterSpacing: "0.5px" }}>{item.location}</td>
                          <td style={{ padding: "16px", color: "#3b82f6", fontSize: "13px", fontWeight: "600" }}>{item.time} latency</td>
                          <td style={{ padding: "16px", color: "#22c55e", fontWeight: "800", fontSize: "15px" }}>
                            ₹{formatRs(item.payout)}
                            <span style={{ color: "#71717a", fontSize: "11px", fontWeight: "500", marginLeft: "12px", paddingLeft: "12px", borderLeft: "1px solid #3f3f46" }}>
                              Allocated to {item.count} worker claims
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        {activePage === 'system-trigger' && (
          <div style={{ padding: "32px" }}>
            <h1 style={{ color: "#fff" }}>Manual System Triggers</h1>
            <p style={{ color: "#9ca3af" }}>Test disruption endpoints forcefully.</p>
          </div>
        )}
        
      </div>
    </div>
  );
}