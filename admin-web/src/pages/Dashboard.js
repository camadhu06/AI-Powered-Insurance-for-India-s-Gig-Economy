import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

// =============================================
// Workers Management Page Component
// =============================================
function WorkersPage({ loading: parentLoading, stats, cardStyle, formatRs }) {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchWorkers();
  }, []);

  async function fetchWorkers() {
    try {
      setLoading(true);
      const API = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const res = await fetch(`${API}/admin/workers`);
      const data = await res.json();
      setWorkers(data);
    } catch (err) {
      console.error("Failed to fetch workers", err);
    } finally {
      setLoading(false);
    }
  }

  const totalRegistered = workers.length;
  const activePolicies = workers.filter(w => w.planName !== null && w.planName !== undefined).length;
  const swiggyPartners = workers.filter(w => w.platforms && w.platforms.some(p => p.toLowerCase().includes("swiggy"))).length;
  const zomatoPartners = workers.filter(w => w.platforms && w.platforms.some(p => p.toLowerCase().includes("zomato"))).length;

  // Risk score generator based on worker data
  const getRiskScore = (worker) => {
    let score = 0.3; // base
    if (worker.claimCount > 3) score += 0.3;
    else if (worker.claimCount > 1) score += 0.15;
    if (!worker.planName) score += 0.15;
    if (worker.avgDailyEarnings && worker.avgDailyEarnings < 400) score += 0.1;
    score = Math.min(score, 0.95);
    return score;
  };

  const getRiskLabel = (score) => {
    if (score >= 0.7) return { label: "High", color: "#ef4444", bg: "rgba(239, 68, 68, 0.1)" };
    if (score >= 0.45) return { label: "Medium", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.1)" };
    return { label: "Low", color: "#22c55e", bg: "rgba(34, 197, 94, 0.1)" };
  };

  const filteredWorkers = workers.filter(w =>
    w.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.platforms?.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // CSV Export Workers logic
  const handleExportWorkers = () => {
    if (!filteredWorkers || filteredWorkers.length === 0) return;
    const headers = ["Worker Name", "Phone", "City", "Platforms", "Plan Name", "Premium (Rs.)", "Risk Score"];
    const rows = filteredWorkers.map(w => [
      w.name || "Unknown", w.phone || "-", w.city || "-", 
      (w.platforms || []).join(" | "), w.planName || "No Plan",
      w.weeklyPremium || 0, getRiskScore(w)
    ]);
    const csv = [headers.join(","), ...rows.map(r => r.map(v => `"${v}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `GigWare_Workers_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const miniCardStyle = {
    background: "#111827",
    padding: "20px 24px",
    borderRadius: "14px",
    border: "1px solid #1f2937",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    transition: "all 0.3s ease",
    cursor: "default"
  };

  return (
    <div style={{ padding: "32px" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#fff", letterSpacing: "-0.5px" }}>Worker Registry</h1>
          <p style={{ color: "#9ca3af", marginTop: "4px" }}>Platform partner management and workforce analytics.</p>
        </div>
        <div style={{
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          padding: "6px 10px",
          borderRadius: "8px",
          fontSize: "11px",
          color: "#22c55e",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontWeight: "600",
          letterSpacing: "0.5px"
        }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e" }}></div>
          LIVE DATA
        </div>
      </div>

      {/* 4 STAT CARDS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "20px",
        marginBottom: "32px"
      }}>
        {/* Total Registered */}
        <div style={{ ...miniCardStyle, borderTop: "3px solid #f37500" }}>
          <div style={{
            width: "44px", height: "44px", borderRadius: "12px",
            background: "rgba(243, 117, 0, 0.12)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f37500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
          <div>
            <p style={{ color: "#71717a", fontSize: "11px", fontWeight: "600", letterSpacing: "1px", marginBottom: "4px" }}>TOTAL REGISTERED</p>
            <h3 style={{ fontSize: "26px", fontWeight: "800", color: "#fff", lineHeight: "1" }}>
              {loading ? "..." : totalRegistered}
            </h3>
          </div>
        </div>

        {/* Active Policies */}
        <div style={{ ...miniCardStyle, borderTop: "3px solid #22c55e" }}>
          <div style={{
            width: "44px", height: "44px", borderRadius: "12px",
            background: "rgba(34, 197, 94, 0.12)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          </div>
          <div>
            <p style={{ color: "#71717a", fontSize: "11px", fontWeight: "600", letterSpacing: "1px", marginBottom: "4px" }}>ACTIVE POLICIES</p>
            <h3 style={{ fontSize: "26px", fontWeight: "800", color: "#fff", lineHeight: "1" }}>
              {loading ? "..." : activePolicies}
            </h3>
          </div>
        </div>

        {/* Swiggy Partners */}
        <div style={{ ...miniCardStyle, borderTop: "3px solid #ff6b35" }}>
          <div style={{
            width: "44px", height: "44px", borderRadius: "12px",
            background: "rgba(255, 107, 53, 0.12)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff6b35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
          </div>
          <div>
            <p style={{ color: "#71717a", fontSize: "11px", fontWeight: "600", letterSpacing: "1px", marginBottom: "4px" }}>SWIGGY PARTNERS</p>
            <h3 style={{ fontSize: "26px", fontWeight: "800", color: "#fff", lineHeight: "1" }}>
              {loading ? "..." : swiggyPartners}
            </h3>
          </div>
        </div>

        {/* Zomato Partners */}
        <div style={{ ...miniCardStyle, borderTop: "3px solid #e23744" }}>
          <div style={{
            width: "44px", height: "44px", borderRadius: "12px",
            background: "rgba(226, 55, 68, 0.12)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e23744" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
          </div>
          <div>
            <p style={{ color: "#71717a", fontSize: "11px", fontWeight: "600", letterSpacing: "1px", marginBottom: "4px" }}>ZOMATO PARTNERS</p>
            <h3 style={{ fontSize: "26px", fontWeight: "800", color: "#fff", lineHeight: "1" }}>
              {loading ? "..." : zomatoPartners}
            </h3>
          </div>
        </div>
      </div>

      {/* WORKER REGISTRY TABLE */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h3 style={{ color: "#fff", fontSize: "16px", fontWeight: "600", letterSpacing: "0.5px" }}>
              Worker Registry
            </h3>
            <p style={{ color: "#71717a", fontSize: "12px", marginTop: "4px" }}>
              Complete workforce directory with risk profiling
            </p>
          </div>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            {/* Search Bar */}
            <div style={{
              display: "flex", alignItems: "center", gap: "8px",
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              padding: "8px 14px",
              borderRadius: "8px"
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input
                type="text"
                placeholder="Search workers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#fff",
                  fontSize: "12px",
                  width: "140px",
                  fontFamily: "inherit"
                }}
              />
            </div>
            <div onClick={handleExportWorkers} style={{
              cursor: "pointer",
              background: 'rgba(59, 130, 246, 0.1)',
              color: '#3b82f6',
              padding: '8px 14px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: '700',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              textTransform: "uppercase",
              letterSpacing: "1px"
            }}>
              Export {"\u2192"}
            </div>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1f2937", color: "#9ca3af", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>
                <th style={{ padding: "16px", fontWeight: "600" }}>Worker</th>
                <th style={{ padding: "16px", fontWeight: "600" }}>Platform</th>
                <th style={{ padding: "16px", fontWeight: "600" }}>Zone</th>
                <th style={{ padding: "16px", fontWeight: "600" }}>Plan</th>
                <th style={{ padding: "16px", fontWeight: "600" }}>Weekly Premium</th>
                <th style={{ padding: "16px", fontWeight: "600" }}>Risk Score</th>
                <th style={{ padding: "16px", fontWeight: "600" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                      <div style={{
                        width: "32px", height: "32px", border: "3px solid #1f2937",
                        borderTop: "3px solid #f37500", borderRadius: "50%",
                        animation: "spin 1s linear infinite"
                      }}></div>
                      Loading worker registry...
                    </div>
                  </td>
                </tr>
              ) : filteredWorkers.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>
                    {searchTerm ? "No workers match your search." : "No workers registered yet."}
                  </td>
                </tr>
              ) : (
                filteredWorkers.map((worker, idx) => {
                  const risk = getRiskScore(worker);
                  const riskInfo = getRiskLabel(risk);
                  const hasActivePlan = worker.planName !== null && worker.planName !== undefined;

                  return (
                    <tr key={worker._id || idx} style={{
                      borderBottom: "1px solid #1f2937",
                      transition: "background 0.2s ease"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      {/* Worker */}
                      <td style={{ padding: "16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div style={{
                            width: "36px", height: "36px", borderRadius: "10px",
                            background: `linear-gradient(135deg, ${['#f37500', '#3b82f6', '#8b5cf6', '#22c55e', '#e23744'][idx % 5]}22, ${['#f37500', '#3b82f6', '#8b5cf6', '#22c55e', '#e23744'][idx % 5]}44)`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: ['#f37500', '#3b82f6', '#8b5cf6', '#22c55e', '#e23744'][idx % 5],
                            fontSize: "14px", fontWeight: "700", flexShrink: 0
                          }}>
                            {worker.name?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                          <div>
                            <div style={{ color: "#fff", fontWeight: "600", fontSize: "13px" }}>{worker.name || "Unknown"}</div>
                            <div style={{ color: "#6b7280", fontSize: "11px", marginTop: "2px" }}>{worker.phone || "-"}</div>
                          </div>
                        </div>
                      </td>

                      {/* Platform */}
                      <td style={{ padding: "16px" }}>
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                          {worker.platforms && worker.platforms.length > 0 ? worker.platforms.map((p, i) => {
                            const isSwiggy = p.toLowerCase().includes("swiggy");
                            const isZomato = p.toLowerCase().includes("zomato");
                            const platformColor = isSwiggy ? "#ff6b35" : isZomato ? "#e23744" : "#3b82f6";
                            return (
                              <span key={i} style={{
                                background: `${platformColor}18`,
                                color: platformColor,
                                padding: "3px 8px",
                                borderRadius: "4px",
                                fontSize: "11px",
                                fontWeight: "600",
                                border: `1px solid ${platformColor}30`
                              }}>
                                {p}
                              </span>
                            );
                          }) : (
                            <span style={{ color: "#6b7280", fontSize: "12px" }}>-</span>
                          )}
                        </div>
                      </td>

                      {/* Zone */}
                      <td style={{ padding: "16px", color: "#a1a1aa", fontSize: "13px", fontWeight: "500" }}>
                        {worker.city || "Unknown"}
                      </td>

                      {/* Plan */}
                      <td style={{ padding: "16px" }}>
                        {hasActivePlan ? (
                          <span style={{
                            background: "rgba(139, 92, 246, 0.1)",
                            color: "#a78bfa",
                            padding: "4px 10px",
                            borderRadius: "6px",
                            fontSize: "11px",
                            fontWeight: "700",
                            border: "1px solid rgba(139, 92, 246, 0.2)"
                          }}>
                            {worker.planName}
                          </span>
                        ) : (
                          <span style={{
                            background: "rgba(107, 114, 128, 0.1)",
                            color: "#6b7280",
                            padding: "4px 10px",
                            borderRadius: "6px",
                            fontSize: "11px",
                            fontWeight: "600"
                          }}>
                            No Plan
                          </span>
                        )}
                      </td>

                      {/* Weekly Premium */}
                      <td style={{ padding: "16px", color: "#fff", fontWeight: "700", fontSize: "13px" }}>
                        {worker.weeklyPremium ? `Rs.${worker.weeklyPremium}` : "-"}
                      </td>

                      {/* Risk Score */}
                      <td style={{ padding: "16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div style={{
                            width: "48px", height: "5px", borderRadius: "3px",
                            background: "#1f2937", overflow: "hidden"
                          }}>
                            <div style={{
                              width: `${risk * 100}%`, height: "100%",
                              borderRadius: "3px",
                              background: riskInfo.color,
                              transition: "width 0.5s ease"
                            }}></div>
                          </div>
                          <span style={{
                            background: riskInfo.bg,
                            color: riskInfo.color,
                            padding: "3px 8px",
                            borderRadius: "4px",
                            fontSize: "11px",
                            fontWeight: "700"
                          }}>
                            {riskInfo.label}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: "16px" }}>
                        <span style={{
                          background: hasActivePlan ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                          color: hasActivePlan ? '#22c55e' : '#f59e0b',
                          padding: '5px 10px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: '700',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}>
                          <div style={{
                            width: '6px', height: '6px', borderRadius: '50%',
                            background: hasActivePlan ? '#22c55e' : '#f59e0b',
                            boxShadow: hasActivePlan ? '0 0 6px #22c55e' : '0 0 6px #f59e0b'
                          }}></div>
                          {hasActivePlan ? 'Covered' : 'Uninsured'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer stats */}
        {!loading && filteredWorkers.length > 0 && (
          <div style={{
            marginTop: "20px",
            paddingTop: "16px",
            borderTop: "1px solid #1f2937",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <span style={{ color: "#6b7280", fontSize: "12px" }}>
              Showing {filteredWorkers.length} of {workers.length} workers
            </span>
            <div style={{ display: "flex", gap: "16px" }}>
              <span style={{ color: "#6b7280", fontSize: "12px" }}>
                Coverage Rate: <span style={{ color: "#22c55e", fontWeight: "700" }}>{totalRegistered > 0 ? Math.round((activePolicies / totalRegistered) * 100) : 0}%</span>
              </span>
              <span style={{ color: "#6b7280", fontSize: "12px" }}>
                Avg Premium: <span style={{ color: "#fff", fontWeight: "700" }}>
                  Rs.{workers.filter(w => w.weeklyPremium).length > 0 ? Math.round(workers.filter(w => w.weeklyPremium).reduce((sum, w) => sum + w.weeklyPremium, 0) / workers.filter(w => w.weeklyPremium).length) : 0}/wk
                </span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* CSS animation for loader */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// =============================================
// Live Claims Panel Component (API-connected)
// =============================================
function LiveClaimsPage({ cardStyle }) {
  const [claims, setClaims] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [lastUpdated, setLastUpdated] = React.useState(null);
  const [search, setSearch] = React.useState("");

  const fetchClaims = React.useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const API = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const res = await fetch(`${API}/admin/live-claims`);
      const data = await res.json();
      setClaims(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to fetch live claims", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial load + auto-poll every 10 seconds
  React.useEffect(() => {
    fetchClaims();
    const interval = setInterval(() => fetchClaims(), 10000);
    return () => clearInterval(interval);
  }, [fetchClaims]);

  const filtered = claims.filter(c =>
    c.worker.name.toLowerCase().includes(search.toLowerCase()) ||
    c.worker.phone.includes(search) ||
    c.worker.city.toLowerCase().includes(search.toLowerCase()) ||
    (c.triggerType || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalPaid = claims.reduce((s, c) => s + (c.payoutAmount || 0), 0);
  const avgFraud = claims.length > 0 ? (claims.reduce((s, c) => s + (c.fraudScore || 0), 0) / claims.length).toFixed(1) : 0;
  const flagged = claims.filter(c => (c.fraudScore || 0) > 40).length;

  const fraudColor = (score) => {
    if (score > 75) return { color: "#ef4444", bg: "rgba(239,68,68,0.1)" };
    if (score > 40) return { color: "#f59e0b", bg: "rgba(245,158,11,0.1)" };
    return { color: "#22c55e", bg: "rgba(34,197,94,0.1)" };
  };

  const triggerIcon = (t) => {
    if (!t) return "📋";
    if (t.includes("Rain")) return "🌧️";
    if (t.includes("Heat")) return "🔥";
    if (t.includes("AQI")) return "💨";
    if (t.includes("Flood")) return "🌊";
    if (t.includes("Strike")) return "🚫";
    return "⚡";
  };

  const miniCard = { background: "#111827", padding: "20px 24px", borderRadius: "14px", border: "1px solid #1f2937", display: "flex", alignItems: "center", gap: "16px" };

  return (
    <div style={{ padding: "32px" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#fff", letterSpacing: "-0.5px" }}>Live Claims</h1>
          <p style={{ color: "#9ca3af", marginTop: "4px" }}>Real-time payouts with ML fraud scores from MongoDB.</p>
        </div>
        <div style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", padding: "6px 10px", borderRadius: "8px", fontSize: "11px", color: "#22c55e", display: "flex", alignItems: "center", gap: "10px", fontWeight: "600" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e" }}></div>
            LIVE — {claims.length} CLAIMS
          </div>
          {lastUpdated && (
            <span style={{ color: "#4b5563", fontSize: "10px", fontWeight: "500" }}>
              Updated {lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          )}
          <button
            onClick={() => fetchClaims(true)}
            disabled={refreshing}
            style={{ background: refreshing ? "rgba(255,255,255,0.05)" : "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", color: "#22c55e", borderRadius: "6px", padding: "4px 10px", fontSize: "10px", fontWeight: "700", cursor: refreshing ? "not-allowed" : "pointer", letterSpacing: "0.5px", fontFamily: "inherit" }}
          >
            {refreshing ? "↻ ..." : "↻ REFRESH"}
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "32px" }}>
        <div style={{ ...miniCard, borderTop: "3px solid #22c55e" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(34,197,94,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "20px" }}>💸</div>
          <div>
            <p style={{ color: "#71717a", fontSize: "11px", fontWeight: "600", letterSpacing: "1px", marginBottom: "4px" }}>TOTAL PAID OUT</p>
            <h3 style={{ fontSize: "24px", fontWeight: "800", color: "#22c55e", lineHeight: "1" }}>Rs.{new Intl.NumberFormat('en-IN').format(totalPaid)}</h3>
          </div>
        </div>
        <div style={{ ...miniCard, borderTop: "3px solid #f59e0b" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(245,158,11,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "20px" }}>🤖</div>
          <div>
            <p style={{ color: "#71717a", fontSize: "11px", fontWeight: "600", letterSpacing: "1px", marginBottom: "4px" }}>AVG FRAUD SCORE (ML)</p>
            <h3 style={{ fontSize: "24px", fontWeight: "800", color: "#f59e0b", lineHeight: "1" }}>{avgFraud}<span style={{ fontSize: "13px", fontWeight: "500", color: "#6b7280", marginLeft: "4px" }}>/100</span></h3>
          </div>
        </div>
        <div style={{ ...miniCard, borderTop: "3px solid #ef4444" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(239,68,68,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "20px" }}>🚩</div>
          <div>
            <p style={{ color: "#71717a", fontSize: "11px", fontWeight: "600", letterSpacing: "1px", marginBottom: "4px" }}>FLAGGED (ML SCORE &gt;40)</p>
            <h3 style={{ fontSize: "24px", fontWeight: "800", color: "#ef4444", lineHeight: "1" }}>{flagged}</h3>
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <div>
            <h3 style={{ color: "#fff", fontSize: "16px", fontWeight: "600" }}>All Processed Claims</h3>
            <p style={{ color: "#71717a", fontSize: "12px", marginTop: "4px" }}>XGBoost fraud score · ML-estimated payout · Remaining plan cap</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", padding: "8px 14px", borderRadius: "8px" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Search name, phone, city, trigger..." value={search} onChange={e => setSearch(e.target.value)} style={{ background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: "12px", width: "220px", fontFamily: "inherit" }} />
          </div>
        </div>

        {loading ? (
          <div style={{ padding: "60px", textAlign: "center", color: "#6b7280" }}>Loading live claims...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "60px", textAlign: "center", color: "#6b7280" }}>{search ? "No claims match your search." : "No claims processed yet."}</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #1f2937", color: "#9ca3af", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px" }}>
                  <th style={{ padding: "14px", fontWeight: "600" }}>Worker</th>
                  <th style={{ padding: "14px", fontWeight: "600" }}>Phone</th>
                  <th style={{ padding: "14px", fontWeight: "600" }}>City</th>
                  <th style={{ padding: "14px", fontWeight: "600" }}>Trigger</th>
                  <th style={{ padding: "14px", fontWeight: "600" }}>ML Fraud Score</th>
                  <th style={{ padding: "14px", fontWeight: "600" }}>Paid Out</th>
                  <th style={{ padding: "14px", fontWeight: "600" }}>Plan Cap</th>
                  <th style={{ padding: "14px", fontWeight: "600" }}>Remaining Cap</th>
                  <th style={{ padding: "14px", fontWeight: "600" }}>Time</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, idx) => {
                  const fc = fraudColor(c.fraudScore);
                  const capPct = Math.max(0, Math.round((c.worker.remainingCap / c.worker.planCap) * 100));
                  return (
                    <tr key={idx} style={{ borderBottom: "1px solid #1f2937", transition: "background 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      {/* Worker */}
                      <td style={{ padding: "14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(243,117,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#f37500", fontSize: "13px", fontWeight: "700", flexShrink: 0 }}>
                            {(c.worker.name || "?").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ color: "#fff", fontWeight: "600", fontSize: "13px" }}>{c.worker.name}</div>
                            <div style={{ color: "#6b7280", fontSize: "10px", marginTop: "1px" }}>{c.worker.planName}</div>
                          </div>
                        </div>
                      </td>
                      {/* Phone */}
                      <td style={{ padding: "14px", color: "#a1a1aa", fontSize: "13px", fontFamily: "monospace" }}>{c.worker.phone}</td>
                      {/* City */}
                      <td style={{ padding: "14px", color: "#a1a1aa", fontSize: "13px" }}>{c.worker.city}</td>
                      {/* Trigger */}
                      <td style={{ padding: "14px" }}>
                        <span style={{ background: "rgba(59,130,246,0.1)", color: "#60a5fa", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "600" }}>
                          {triggerIcon(c.triggerType)} {c.triggerType}
                        </span>
                      </td>
                      {/* ML Fraud Score */}
                      <td style={{ padding: "14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ background: fc.bg, color: fc.color, padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "700" }}>
                            {c.fraudScore.toFixed(1)}
                          </span>
                          <span style={{ color: "#4b5563", fontSize: "10px" }}>{c.fraudScore > 75 ? "BLOCKED" : c.fraudScore > 40 ? "REVIEW" : "OK"}</span>
                        </div>
                      </td>
                      {/* Paid */}
                      <td style={{ padding: "14px", color: "#22c55e", fontWeight: "700", fontSize: "14px" }}>Rs.{c.payoutAmount?.toLocaleString('en-IN')}</td>
                      {/* Plan Cap */}
                      <td style={{ padding: "14px", color: "#a1a1aa", fontSize: "13px" }}>Rs.{c.worker.planCap?.toLocaleString('en-IN')}</td>
                      {/* Remaining Cap */}
                      <td style={{ padding: "14px", minWidth: "140px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div style={{ flex: 1, height: "5px", borderRadius: "3px", background: "#1f2937", overflow: "hidden" }}>
                            <div style={{ width: `${capPct}%`, height: "100%", borderRadius: "3px", background: capPct > 50 ? "#22c55e" : capPct > 20 ? "#f59e0b" : "#ef4444", transition: "width 0.5s" }}></div>
                          </div>
                          <span style={{ color: capPct > 50 ? "#22c55e" : capPct > 20 ? "#f59e0b" : "#ef4444", fontSize: "12px", fontWeight: "700", whiteSpace: "nowrap" }}>Rs.{c.worker.remainingCap?.toLocaleString('en-IN')}</span>
                        </div>
                      </td>
                      {/* Time */}
                      <td style={{ padding: "14px", color: "#6b7280", fontSize: "11px" }}>
                        {new Date(c.createdAt).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {!loading && (<div style={{ marginTop: "16px", paddingTop: "14px", borderTop: "1px solid #1f2937", display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "#6b7280", fontSize: "12px" }}>Showing {filtered.length} of {claims.length} claims</span>
          <span style={{ color: "#6b7280", fontSize: "12px" }}>All fraud scores generated by XGBoost ML model</span>
        </div>)}
      </div>
    </div>
  );
}

// =============================================
// Fraud Detection Page Component (API-connected)
// =============================================
function FraudDetectionPage({ cardStyle }) {
  const [fraudData, setFraudData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [blockedClaims, setBlockedClaims] = React.useState([]);

  const fetchAll = React.useCallback(() => {
    const API = process.env.REACT_APP_API_URL || "http://localhost:5000";
    Promise.all([
      fetch(`${API}/admin/fraud-stats`).then(r => r.json()),
      fetch(`${API}/admin/blocked-claims`).then(r => r.json()),
    ]).then(([fraudD, blocked]) => {
      setFraudData(fraudD);
      setBlockedClaims(Array.isArray(blocked) ? blocked : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  React.useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 10000); // auto-poll every 10s
    return () => clearInterval(interval);
  }, [fetchAll]);

  const flaggedClaims = fraudData?.flaggedClaims || [];
  const fraudSignals = (fraudData?.fraudSignals || []).filter(s => s.count > 0);
  const highRisk = fraudData?.highRisk || 0;
  const mediumRisk = fraudData?.mediumRisk || 0;
  const fraudPrevented = fraudData?.fraudPrevented || 0;

  // 6-Layer Anti-Spoofing Colors
  const signalColors = {
    "Mock Location Flag (Spoof)": "#ef4444",
    "Device Integrity Failed": "#f59e0b",
    "Cell Tower Mismatch": "#8b5cf6",
    "Unnatural Movement Pattern": "#e23744",
    "WiFi Triangulation Failed": "#3b82f6",
    "Zero Platform Activity": "#22c55e"
  };
  const coloredSignals = fraudSignals.map(s => ({ ...s, color: signalColors[s.flag] || "#6b7280" }));
  const maxCount = Math.max(...coloredSignals.map(s => s.count), 1);

  const miniCardStyle = {
    background: "#111827", padding: "20px 24px", borderRadius: "14px",
    border: "1px solid #1f2937", display: "flex", alignItems: "center", gap: "16px", cursor: "default"
  };

  if (loading) return <div style={{ padding: "32px", color: "#9ca3af" }}>Loading fraud data...</div>;

  return (
    <div style={{ padding: "32px" }}>
      <div style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#fff", letterSpacing: "-0.5px" }}>Fraud Detection</h1>
          <p style={{ color: "#9ca3af", marginTop: "4px" }}>AI-powered anomaly detection from live claims database.</p>
        </div>
        <div style={{ background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.2)", padding: "6px 10px", borderRadius: "8px", fontSize: "11px", color: "#ef4444", display: "flex", alignItems: "center", gap: "6px", fontWeight: "600", letterSpacing: "0.5px" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#ef4444", boxShadow: "0 0 6px #ef4444" }}></div>
          LIVE  - {fraudData?.totalClaims || 0} CLAIMS ANALYZED
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "32px" }}>
        <div style={{ ...miniCardStyle, borderTop: "3px solid #ef4444" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(239, 68, 68, 0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          </div>
          <div>
            <p style={{ color: "#71717a", fontSize: "11px", fontWeight: "600", letterSpacing: "1px", marginBottom: "4px" }}>HIGH RISK CLAIMS</p>
            <h3 style={{ fontSize: "26px", fontWeight: "800", color: "#ef4444", lineHeight: "1" }}>{highRisk}</h3>
          </div>
        </div>
        <div style={{ ...miniCardStyle, borderTop: "3px solid #f59e0b" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(245, 158, 11, 0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          </div>
          <div>
            <p style={{ color: "#71717a", fontSize: "11px", fontWeight: "600", letterSpacing: "1px", marginBottom: "4px" }}>MEDIUM RISK CLAIMS</p>
            <h3 style={{ fontSize: "26px", fontWeight: "800", color: "#f59e0b", lineHeight: "1" }}>{mediumRisk}</h3>
          </div>
        </div>
        <div style={{ ...miniCardStyle, borderTop: "3px solid #22c55e" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(34, 197, 94, 0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          </div>
          <div>
            <p style={{ color: "#71717a", fontSize: "11px", fontWeight: "600", letterSpacing: "1px", marginBottom: "4px" }}>FRAUD PREVENTED</p>
            <h3 style={{ fontSize: "26px", fontWeight: "800", color: "#22c55e", lineHeight: "1" }}>Rs.{fraudPrevented.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "24px" }}>
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h3 style={{ color: "#fff", fontSize: "16px", fontWeight: "600" }}>Flagged Claims - High Risk</h3>
              <p style={{ color: "#71717a", fontSize: "12px", marginTop: "4px" }}>Claims flagged by fraud analysis engine</p>
            </div>
          </div>
          {flaggedClaims.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <p style={{ color: "#22c55e", fontSize: "14px", fontWeight: "600" }}> No flagged claims</p>
              <p style={{ color: "#6b7280", fontSize: "12px", marginTop: "4px" }}>All claims are within normal parameters</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #1f2937", color: "#9ca3af", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>
                    <th style={{ padding: "14px", fontWeight: "600" }}>Name</th>
                    <th style={{ padding: "14px", fontWeight: "600" }}>Location</th>
                    <th style={{ padding: "14px", fontWeight: "600" }}>Risk Level</th>
                    <th style={{ padding: "14px", fontWeight: "600" }}>Review</th>
                  </tr>
                </thead>
                <tbody>
                  {flaggedClaims.map((claim, idx) => {
                    const isHigh = claim.riskLevel === "High";
                    return (
                      <tr key={idx} style={{ borderBottom: "1px solid #1f2937" }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                        <td style={{ padding: "14px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: isHigh ? "rgba(239,68,68,0.15)" : "rgba(245,158,11,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: isHigh ? "#ef4444" : "#f59e0b", fontSize: "13px", fontWeight: "700" }}>
                              {(claim.name || "?").charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div style={{ color: "#fff", fontWeight: "600", fontSize: "13px" }}>{claim.name}</div>
                              <div style={{ color: "#6b7280", fontSize: "10px", marginTop: "1px" }}>{claim.reason}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "14px", color: "#a1a1aa", fontSize: "13px" }}>{claim.location || "Unknown"}</td>
                        <td style={{ padding: "14px" }}>
                          <span style={{ background: isHigh ? "rgba(239,68,68,0.1)" : "rgba(245,158,11,0.1)", color: isHigh ? "#ef4444" : "#f59e0b", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                            <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: isHigh ? "#ef4444" : "#f59e0b" }}></div>
                            {claim.riskLevel} ({claim.score})
                          </span>
                        </td>
                        <td style={{ padding: "14px" }}>
                          <span style={{ cursor: "pointer", background: "rgba(59,130,246,0.1)", color: "#3b82f6", padding: "5px 12px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", border: "1px solid rgba(59,130,246,0.2)" }}>Review {"\u2192"}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div style={cardStyle}>
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ color: "#fff", fontSize: "16px", fontWeight: "600" }}>Fraud Signal Breakdown</h3>
            <p style={{ color: "#71717a", fontSize: "12px", marginTop: "4px" }}>Flags raised by detection engine</p>
          </div>
          {coloredSignals.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <p style={{ color: "#22c55e", fontSize: "14px", fontWeight: "600" }}> No fraud signals detected</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {coloredSignals.map((signal, idx) => (
                <div key={idx}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span style={{ color: "#e5e7eb", fontSize: "13px", fontWeight: "500" }}>{signal.flag}</span>
                    <span style={{ color: signal.color, fontSize: "13px", fontWeight: "700" }}>{signal.count}</span>
                  </div>
                  <div style={{ width: "100%", height: "8px", borderRadius: "4px", background: "#1f2937", overflow: "hidden" }}>
                    <div style={{ width: `${(signal.count / maxCount) * 100}%`, height: "100%", borderRadius: "4px", background: `linear-gradient(90deg, ${signal.color}cc, ${signal.color})`, transition: "width 0.8s ease" }}></div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid #1f2937" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#6b7280", fontSize: "12px" }}>Total Flags Raised</span>
              <span style={{ color: "#fff", fontWeight: "700", fontSize: "14px" }}>{coloredSignals.reduce((s, f) => s + f.count, 0)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── BLOCKED CLAIMS PANEL ── */}
      <div style={{ ...cardStyle, marginTop: "24px", borderTop: "3px solid #ef4444" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <h3 style={{ color: "#fff", fontSize: "16px", fontWeight: "600" }}>🚨 Blocked by AI Fraud Detection</h3>
            <p style={{ color: "#71717a", fontSize: "12px", marginTop: "4px" }}>Claims rejected in real-time by XGBoost model · Zero payout sent · Auto-polled every 10s</p>
          </div>
          <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", padding: "6px 12px", borderRadius: "8px", fontSize: "11px", color: "#ef4444", display: "flex", alignItems: "center", gap: "6px", fontWeight: "700" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#ef4444", boxShadow: "0 0 6px #ef4444" }}></div>
            {blockedClaims.length} BLOCKED
          </div>
        </div>
        {blockedClaims.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <p style={{ color: "#22c55e", fontSize: "14px", fontWeight: "600" }}>✅ No blocked claims — system clean</p>
            <p style={{ color: "#4b5563", fontSize: "12px", marginTop: "4px" }}>Use "Simulate Fraud" in System Triggers to generate a blocked claim for the demo</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #1f2937", color: "#9ca3af", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px" }}>
                  <th style={{ padding: "12px 14px", fontWeight: "600" }}>Worker</th>
                  <th style={{ padding: "12px 14px", fontWeight: "600" }}>Phone</th>
                  <th style={{ padding: "12px 14px", fontWeight: "600" }}>City</th>
                  <th style={{ padding: "12px 14px", fontWeight: "600" }}>Trigger</th>
                  <th style={{ padding: "12px 14px", fontWeight: "600" }}>XGBoost Score</th>
                  <th style={{ padding: "12px 14px", fontWeight: "600" }}>Payout</th>
                  <th style={{ padding: "12px 14px", fontWeight: "600" }}>Time</th>
                </tr>
              </thead>
              <tbody>
                {blockedClaims.map((c, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid #1f2937", background: "rgba(239,68,68,0.02)" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.05)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.02)"}>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: "rgba(239,68,68,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ef4444", fontSize: "12px", fontWeight: "700" }}>
                          {(c.worker.name || "?").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ color: "#fff", fontWeight: "600", fontSize: "13px" }}>{c.worker.name}</div>
                          <div style={{ color: "#6b7280", fontSize: "10px" }}>{c.worker.planName}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "12px 14px", color: "#a1a1aa", fontSize: "12px", fontFamily: "monospace" }}>{c.worker.phone}</td>
                    <td style={{ padding: "12px 14px", color: "#a1a1aa", fontSize: "13px" }}>{c.worker.city}</td>
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{ background: "rgba(59,130,246,0.1)", color: "#60a5fa", padding: "3px 8px", borderRadius: "5px", fontSize: "11px", fontWeight: "600" }}>{c.triggerType}</span>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{ background: "rgba(239,68,68,0.12)", color: "#ef4444", padding: "4px 10px", borderRadius: "6px", fontSize: "13px", fontWeight: "800" }}>
                        {c.fraudScore.toFixed(1)} / 100
                      </span>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "700" }}>🚫 BLOCKED · Rs.0</span>
                    </td>
                    <td style={{ padding: "12px 14px", color: "#6b7280", fontSize: "11px" }}>
                      {new Date(c.createdAt).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// =============================================
// Predictive Analysis Page Component (API-connected)
// =============================================
function PredictiveAnalysisPage({ cardStyle }) {
  const [selectedState, setSelectedState] = useState("Karnataka");
  const [selectedCity, setSelectedCity] = useState("Bengaluru");
  const [predictions, setPredictions] = useState([]);
  const [heatmap, setHeatmap] = useState({ heat: 0, rain: 0, aqi: 0, flood: 0 });
  const [alertMsg, setAlertMsg] = useState("");
  const [loading, setLoading] = useState(true);

  const statesAndCities = {
    "Karnataka": ["Bengaluru", "Mysuru", "Hubli", "Mangaluru"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik"],
    "Delhi": ["New Delhi", "Noida", "Gurgaon", "Faridabad"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem"],
    "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Siliguri"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
    "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar"]
  };

  useEffect(() => {
    setLoading(true);
    const API = process.env.REACT_APP_API_URL || "http://localhost:5000";
    Promise.all([
      fetch(`${API}/admin/predictions/${encodeURIComponent(selectedCity)}`).then(r => r.json()),
      fetch(`${API}/admin/fraud-stats`).then(r => r.json())
    ]).then(([predData, fraudData]) => {
      setPredictions(predData.predictions || []);
      setHeatmap(predData.heatmap || { heat: 0, rain: 0, aqi: 0, flood: 0 });
      setAlertMsg(predData.alert || "");
      
      
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [selectedCity]);

  const riskFactors = [
    { label: "Heat Index", value: heatmap.heat || 0, color: "#ef4444" },
    { label: "Rainfall", value: heatmap.rain || 0, color: "#3b82f6" },
    { label: "Air Quality", value: heatmap.aqi || 0, color: "#8b5cf6" },
    { label: "Flood Risk", value: heatmap.flood || 0, color: "#0284c7" },
  ];


  const selectStyle = {
    background: "#111827", border: "1px solid #1f2937", color: "#fff",
    padding: "8px 12px", borderRadius: "8px", fontSize: "13px", outline: "none", cursor: "pointer", fontFamily: "inherit"
  };

  return (
    <div style={{ padding: "32px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#fff", letterSpacing: "-0.5px" }}>Predictive Analysis</h1>
        <p style={{ color: "#9ca3af", marginTop: "4px" }}>Real-time weather forecast data from Open-Meteo and OpenAQ APIs.</p>
      </div>


      <div style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <div>
            <h3 style={{ color: "#fff", fontSize: "16px", fontWeight: "600" }}>Zone-Wise Risk Heatmap</h3>
            <p style={{ color: "#71717a", fontSize: "12px", marginTop: "4px" }}>Live environmental data from Open-Meteo API</p>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <select value={selectedState} onChange={(e) => { setSelectedState(e.target.value); setSelectedCity(statesAndCities[e.target.value][0]); }} style={selectStyle}>
              {Object.keys(statesAndCities).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} style={selectStyle}>
              {(statesAndCities[selectedState] || []).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
          {riskFactors.map((factor, idx) => {
            const intensity = Math.round(factor.value * 100);
            const bgOpacity = factor.value * 0.25;
            return (
              <div key={idx} style={{
                background: `rgba(${factor.color === "#ef4444" ? "239,68,68" : factor.color === "#3b82f6" ? "59,130,246" : factor.color === "#8b5cf6" ? "139,92,246" : "2,132,199"}, ${bgOpacity})`,
                border: `1px solid ${factor.color}30`, borderRadius: "14px", padding: "20px", textAlign: "center", transition: "all 0.3s ease"
              }}>
                <p style={{ color: "#9ca3af", fontSize: "11px", fontWeight: "600", letterSpacing: "1px", marginBottom: "8px" }}>{factor.label.toUpperCase()}</p>
                <h3 style={{ fontSize: "32px", fontWeight: "800", color: factor.color, lineHeight: "1", marginBottom: "8px" }}>{intensity}%</h3>
                <div style={{ width: "100%", height: "6px", borderRadius: "3px", background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                  <div style={{ width: `${intensity}%`, height: "100%", borderRadius: "3px", background: factor.color, transition: "width 0.5s ease" }}></div>
                </div>
                <p style={{ color: factor.value > 0.7 ? "#ef4444" : factor.value > 0.4 ? "#f59e0b" : "#22c55e", fontSize: "11px", fontWeight: "600", marginTop: "8px" }}>
                  {factor.value > 0.7 ? "CRITICAL" : factor.value > 0.4 ? "MODERATE" : "SAFE"}
                </p>
              </div>
            );
          })}
        </div>

        {alertMsg && (
          <div style={{ padding: "16px 20px", borderRadius: "12px", background: "linear-gradient(135deg, rgba(243,117,0,0.06), rgba(239,68,68,0.06))", border: "1px solid rgba(243,117,0,0.15)", display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(243,117,0,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f37500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            </div>
            <div>
              <p style={{ color: "#f37500", fontSize: "13px", fontWeight: "700", marginBottom: "4px" }}>AI ANALYSIS - {selectedCity}, {selectedState}</p>
              <p style={{ color: "#d4d4d8", fontSize: "13px", lineHeight: "1.6" }}>{alertMsg}</p>
            </div>
          </div>
        )}
      </div>

      <div style={{ marginBottom: "32px", marginTop: "32px" }}>
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div>
              <h3 style={{ color: "#fff", fontSize: "16px", fontWeight: "600" }}>Next Week Disruption Forecast</h3>
              <p style={{ color: "#71717a", fontSize: "12px", marginTop: "4px" }}>7-day weather forecast for {selectedCity}</p>
            </div>
            <div style={{ background: "rgba(243,117,0,0.08)", border: "1px solid rgba(243,117,0,0.2)", padding: "5px 10px", borderRadius: "6px", fontSize: "10px", color: "#f37500", fontWeight: "700", letterSpacing: "0.5px" }}>
              LIVE FORECAST
            </div>
          </div>
          {loading ? <p style={{ color: "#6b7280" }}>Fetching forecast...</p> : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {predictions.map((p, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 12px", borderRadius: "10px", background: p.probability > 60 ? "rgba(239,68,68,0.04)" : "transparent", border: p.probability > 60 ? "1px solid rgba(239,68,68,0.1)" : "1px solid transparent" }}>
                  <span style={{ fontSize: "18px", width: "28px", textAlign: "center" }}>{p.icon}</span>
                  <span style={{ color: "#e5e7eb", fontSize: "13px", fontWeight: "600", width: "120px" }}>{p.trigger}</span>
                  <div style={{ flex: 1, height: "6px", borderRadius: "3px", background: "#1f2937", overflow: "hidden" }}>
                    <div style={{ width: `${p.probability}%`, height: "100%", borderRadius: "3px", background: p.probability > 60 ? "#ef4444" : p.probability > 30 ? "#f59e0b" : "#22c55e", transition: "width 0.6s ease" }}></div>
                  </div>
                  <span style={{ color: p.probability > 60 ? "#ef4444" : p.probability > 30 ? "#f59e0b" : "#22c55e", fontSize: "13px", fontWeight: "700", width: "40px", textAlign: "right" }}>{p.probability}%</span>
                  <span style={{ color: "#6b7280", fontSize: "11px", width: "50px", textAlign: "right" }}>ETA {p.eta}</span>
                </div>
              ))}
            </div>
          )}
          {alertMsg && (
            <div style={{ marginTop: "16px", padding: "12px 16px", borderRadius: "10px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <span style={{ color: "#ef4444", fontSize: "16px", marginTop: "1px" }}>⚠️ </span>
              <div>
                <p style={{ color: "#ef4444", fontSize: "12px", fontWeight: "700", marginBottom: "2px" }}>AI DISRUPTION ANALYSIS</p>
                <p style={{ color: "#fca5a5", fontSize: "12px", lineHeight: "1.5" }}>{alertMsg}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// =============================================
// System Trigger Page Component (API-connected)
// =============================================
function SystemTriggerPage({ cardStyle }) {
  const [triggers, setTriggers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchedAt, setFetchedAt] = useState("");
  const [selectedCity, setSelectedCity] = useState("Bengaluru");
  const [editingId, setEditingId] = useState(null);
  const [editThreshold, setEditThreshold] = useState("");
  const [firingId, setFiringId] = useState(null);
  const [fireToast, setFireToast] = useState(null);
  // Fraud simulation
  const [workers, setWorkers] = useState([]);
  const [fraudWorkerId, setFraudWorkerId] = useState("");
  const [fraudTrigger, setFraudTrigger] = useState("Heavy Rain");
  const [simFraudLoading, setSimFraudLoading] = useState(false);

  const cities = ["Bengaluru", "Mumbai", "New Delhi", "Chennai", "Kolkata", "Hyderabad", "Ahmedabad", "Pune"];

  // Load workers for the fraud simulation picker
  useEffect(() => {
    const API = process.env.REACT_APP_API_URL || "http://localhost:5000";
    fetch(`${API}/admin/workers`)
      .then(r => r.json())
      .then(data => {
        const withPlan = data.filter(w => w.planName);
        setWorkers(withPlan);
        if (withPlan.length > 0) setFraudWorkerId(withPlan[0]._id);
      })
      .catch(() => {});
  }, []);

  const handleSimulateFraud = async () => {
    if (!fraudWorkerId) return;
    setSimFraudLoading(true);
    try {
      const API = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const res = await fetch(`${API}/claims/test-fraud`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: fraudWorkerId, triggerType: fraudTrigger })
      });
      const data = await res.json();
      // 403 is expected — it means fraud was detected and blocked correctly
      setFireToast({
        success: false,
        msg: `🚨 FRAUD DETECTED & BLOCKED! XGBoost Score: ${data.fraudScore?.toFixed(1)} / 100 · Payout: Rs.0 · Check Fraud Detection page.`
      });
    } catch (e) {
      setFireToast({ success: false, msg: "❌ Could not reach backend." });
    } finally {
      setSimFraudLoading(false);
      setTimeout(() => setFireToast(null), 6000);
    }
  };

  const handleFireTrigger = async (trigger) => {
    setFiringId(trigger.id);
    try {
      const res = await fetch("http://localhost:5000/trigger/fire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ triggerType: trigger.name === "Strike / Curfew" ? "Strike" : trigger.name, city: selectedCity, hoursLost: 3 })
      });
      const data = await res.json();
      if (res.ok) {
        setFireToast({ success: true, msg: `✅ ${data.claimsProcessed} claim(s) auto-processed in ${selectedCity}! Payouts sent.` });
      } else {
        setFireToast({ success: false, msg: `⚠️ ${data.message}` });
      }
    } catch (e) {
      setFireToast({ success: false, msg: "❌ Could not reach backend." });
    } finally {
      setFiringId(null);
      setTimeout(() => setFireToast(null), 4000);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/admin/trigger-status?city=${encodeURIComponent(selectedCity)}`)
      .then(res => res.json())
      .then(data => {
        setTriggers(data.triggers || []);
        setFetchedAt(data.fetchedAt || "");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedCity]);

  const handleEdit = (trigger) => {
    setEditingId(trigger.id);
    setEditThreshold(trigger.threshold.toString());
  };

  const handleSave = (id) => {
    setTriggers(prev => prev.map(t => {
      if (t.id === id) {
        const newThreshold = parseFloat(editThreshold) || t.threshold;
        const newStatus = t.currentValue >= newThreshold ? "TRIGGERED" : t.currentValue >= newThreshold * 0.7 ? "Warning" : t.status === "Inactive" ? "Inactive" : "Normal";
        return { ...t, threshold: newThreshold, status: newStatus };
      }
      return t;
    }));
    setEditingId(null);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "TRIGGERED": return { bg: "rgba(239,68,68,0.1)", color: "#ef4444", dot: "#ef4444" };
      case "Warning": return { bg: "rgba(245,158,11,0.1)", color: "#f59e0b", dot: "#f59e0b" };
      case "Inactive": return { bg: "rgba(107,114,128,0.1)", color: "#6b7280", dot: "#6b7280" };
      default: return { bg: "rgba(34,197,94,0.1)", color: "#22c55e", dot: "#22c55e" };
    }
  };

  const timeSince = fetchedAt ? `${Math.round((Date.now() - new Date(fetchedAt).getTime()) / 1000)}s ago` : "-";

  const selectStyle = {
    background: "#111827", border: "1px solid #1f2937", color: "#fff",
    padding: "8px 12px", borderRadius: "8px", fontSize: "13px", outline: "none", cursor: "pointer", fontFamily: "inherit"
  };

  return (
    <div style={{ padding: "32px" }}>
      <div style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#fff", letterSpacing: "-0.5px" }}>System Triggers</h1>
          <p style={{ color: "#9ca3af", marginTop: "4px" }}>Live data from Open-Meteo and OpenAQ APIs for {selectedCity}.</p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} style={selectStyle}>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <div style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", padding: "6px 10px", borderRadius: "8px", fontSize: "11px", color: "#22c55e", display: "flex", alignItems: "center", gap: "6px", fontWeight: "600", letterSpacing: "0.5px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e" }}></div>
            LIVE
          </div>
        </div>
      </div>

      <div style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <div>
            <h3 style={{ color: "#fff", fontSize: "16px", fontWeight: "600" }}>Trigger Configuration Panel</h3>
            <p style={{ color: "#71717a", fontSize: "12px", marginTop: "4px" }}>Real-time values  - Edit thresholds to recalibrate</p>
          </div>
          {!loading && (
            <div style={{ display: "flex", gap: "8px" }}>
              <span style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "600" }}>
                {triggers.filter(t => t.status === "Normal" || t.status === "Inactive").length} Normal
              </span>
              <span style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "600" }}>
                {triggers.filter(t => t.status === "Warning").length} Warning
              </span>
              <span style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "600" }}>
                {triggers.filter(t => t.status === "TRIGGERED").length} Triggered
              </span>
            </div>
          )}
        </div>

        {loading ? <p style={{ color: "#6b7280", textAlign: "center", padding: "40px 0" }}>Fetching live data for {selectedCity}...</p> : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #1f2937", color: "#9ca3af", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>
                  <th style={{ padding: "16px", fontWeight: "600" }}>Trigger</th>
                  <th style={{ padding: "16px", fontWeight: "600" }}>Parameter</th>
                  <th style={{ padding: "16px", fontWeight: "600" }}>Threshold</th>
                  <th style={{ padding: "16px", fontWeight: "600" }}>Current Value</th>
                  <th style={{ padding: "16px", fontWeight: "600" }}>Status</th>
                  <th style={{ padding: "16px", fontWeight: "600" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {triggers.map((trigger) => {
                  const statusStyle = getStatusStyle(trigger.status);
                  const utilization = Math.min((trigger.currentValue / trigger.threshold) * 100, 100);
                  const isEditing = editingId === trigger.id;
                  return (
                    <tr key={trigger.id} style={{ borderBottom: "1px solid #1f2937", transition: "background 0.2s ease" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                      <td style={{ padding: "16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <span style={{ fontSize: "20px" }}>{trigger.icon}</span>
                          <span style={{ color: "#fff", fontWeight: "600", fontSize: "13px" }}>{trigger.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: "16px", color: "#a1a1aa", fontSize: "13px" }}>{trigger.parameter}</td>
                      <td style={{ padding: "16px" }}>
                        {isEditing ? (
                          <input type="number" value={editThreshold} onChange={(e) => setEditThreshold(e.target.value)}
                            style={{ background: "#1f2937", border: "1px solid #374151", color: "#fff", padding: "6px 10px", borderRadius: "6px", width: "80px", fontSize: "13px", outline: "none", fontFamily: "inherit" }} autoFocus />
                        ) : (
                          <span style={{ color: "#f37500", fontWeight: "700", fontSize: "14px" }}>{trigger.threshold}</span>
                        )}
                      </td>
                      <td style={{ padding: "16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span style={{ color: "#fff", fontWeight: "600", fontSize: "13px" }}>{trigger.currentValue}</span>
                          <div style={{ width: "60px", height: "5px", borderRadius: "3px", background: "#1f2937", overflow: "hidden" }}>
                            <div style={{ width: `${utilization}%`, height: "100%", borderRadius: "3px", background: utilization > 80 ? "#ef4444" : utilization > 50 ? "#f59e0b" : "#22c55e", transition: "width 0.4s ease" }}></div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "16px" }}>
                        <span style={{ background: statusStyle.bg, color: statusStyle.color, padding: "5px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "5px" }}>
                          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: statusStyle.dot, boxShadow: `0 0 6px ${statusStyle.dot}` }}></div>
                          {trigger.status}
                        </span>
                      </td>
                      <td style={{ padding: "16px" }}>
                        {isEditing ? (
                          <div style={{ display: "flex", gap: "6px" }}>
                            <span onClick={() => handleSave(trigger.id)} style={{ cursor: "pointer", background: "rgba(34,197,94,0.1)", color: "#22c55e", padding: "5px 12px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", border: "1px solid rgba(34,197,94,0.2)" }}>Save</span>
                            <span onClick={() => setEditingId(null)} style={{ cursor: "pointer", background: "rgba(107,114,128,0.1)", color: "#6b7280", padding: "5px 12px", borderRadius: "6px", fontSize: "11px", fontWeight: "700" }}>Cancel</span>
                          </div>
                        ) : (
                          <div style={{ display: "flex", gap: "6px" }}>
                            <span onClick={() => handleEdit(trigger)} style={{ cursor: "pointer", background: "rgba(59,130,246,0.1)", color: "#3b82f6", padding: "5px 12px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", border: "1px solid rgba(59,130,246,0.2)" }}>Edit ✎</span>
                            <span
                              onClick={() => !firingId && handleFireTrigger(trigger)}
                              style={{ cursor: firingId === trigger.id ? "not-allowed" : "pointer", background: "rgba(239,68,68,0.12)", color: "#ef4444", padding: "5px 12px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", border: "1px solid rgba(239,68,68,0.25)", opacity: firingId === trigger.id ? 0.6 : 1 }}
                            >
                              {firingId === trigger.id ? "Firing..." : "🔴 Fire"}
                            </span>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid #1f2937", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#6b7280", fontSize: "12px" }}>{triggers.length} triggers configured  - Data source: Open-Meteo + OpenAQ</span>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <span style={{ color: "#6b7280", fontSize: "12px" }}>Last fetch:</span>
            <span style={{ color: "#22c55e", fontSize: "12px", fontWeight: "600" }}>{timeSince}</span>
          </div>
        </div>
      </div>

      {/* ── SIMULATE FRAUD CARD ── */}
      <div style={{ ...cardStyle, marginTop: "24px", borderTop: "3px solid #ef4444" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
          <div>
            <h3 style={{ color: "#fff", fontSize: "16px", fontWeight: "600" }}>🧪 Simulate Fraud Claim</h3>
            <p style={{ color: "#71717a", fontSize: "12px", marginTop: "4px" }}>
              Forces <code style={{ background: "#1f2937", padding: "1px 5px", borderRadius: "4px", color: "#f59e0b", fontSize: "11px" }}>gps_mock=1</code> into the XGBoost model to guarantee a high fraud score and claim block. Payout = Rs.0.
            </p>
          </div>
          <span style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", padding: "4px 10px", borderRadius: "6px", fontSize: "10px", fontWeight: "700", letterSpacing: "0.5px" }}>DEMO TOOL</span>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "flex-end", flexWrap: "wrap" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ color: "#9ca3af", fontSize: "11px", fontWeight: "600", letterSpacing: "0.5px", textTransform: "uppercase" }}>Worker</span>
            <select value={fraudWorkerId} onChange={e => setFraudWorkerId(e.target.value)}
              style={{ background: "#111827", border: "1px solid #374151", color: "#fff", padding: "10px 14px", borderRadius: "8px", fontSize: "13px", outline: "none", cursor: "pointer", fontFamily: "inherit", minWidth: "200px" }}>
              {workers.length === 0
                ? <option value="">No workers with plans found</option>
                : workers.map(w => <option key={w._id} value={w._id}>{w.name} ({w.city})</option>)
              }
            </select>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ color: "#9ca3af", fontSize: "11px", fontWeight: "600", letterSpacing: "0.5px", textTransform: "uppercase" }}>Trigger Type</span>
            <select value={fraudTrigger} onChange={e => setFraudTrigger(e.target.value)}
              style={{ background: "#111827", border: "1px solid #374151", color: "#fff", padding: "10px 14px", borderRadius: "8px", fontSize: "13px", outline: "none", cursor: "pointer", fontFamily: "inherit" }}>
              {["Heavy Rain", "Extreme Heat", "AQI Spike", "Strike", "Flood"].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <button
            onClick={handleSimulateFraud}
            disabled={simFraudLoading || !fraudWorkerId}
            style={{
              background: simFraudLoading ? "rgba(239,68,68,0.05)" : "rgba(239,68,68,0.12)",
              border: "1px solid rgba(239,68,68,0.4)", color: "#ef4444",
              padding: "10px 20px", borderRadius: "8px", fontSize: "13px", fontWeight: "700",
              cursor: simFraudLoading || !fraudWorkerId ? "not-allowed" : "pointer",
              fontFamily: "inherit", opacity: simFraudLoading ? 0.7 : 1, letterSpacing: "0.5px"
            }}
          >
            {simFraudLoading ? "⏳ Detecting..." : "🚨 Simulate Fraud Claim"}
          </button>
        </div>
        <div style={{ marginTop: "16px", padding: "12px 16px", borderRadius: "8px", background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.1)" }}>
          <p style={{ color: "#6b7280", fontSize: "12px" }}>
            ℹ️ This will call <code style={{ background: "#1f2937", padding: "1px 5px", borderRadius: "4px", color: "#60a5fa", fontSize: "11px" }}>POST /claims/test-fraud</code> with the selected worker.
            The XGBoost model will return a fraud score &gt;75 → claim is saved as <strong style={{ color: "#ef4444" }}>blocked</strong> (Rs.0 payout) → visible in Fraud Detection page within 10s.
          </p>
        </div>
      </div>

      {/* Fire Toast Notification */}
      {fireToast && (
        <div style={{
          position: "fixed", bottom: "32px", right: "32px", zIndex: 9999,
          background: fireToast.success ? "rgba(17,24,39,0.98)" : "rgba(17,24,39,0.98)",
          border: `1px solid ${fireToast.success ? "rgba(34,197,94,0.4)" : "rgba(245,158,11,0.4)"}`,
          borderLeft: `4px solid ${fireToast.success ? "#22c55e" : "#f59e0b"}`,
          borderRadius: "12px", padding: "16px 24px",
          color: fireToast.success ? "#22c55e" : "#f59e0b",
          fontSize: "14px", fontWeight: "600",
          boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
          maxWidth: "420px", lineHeight: "1.5",
          animation: "slideIn 0.3s ease"
        }}>
          {fireToast.msg}
        </div>
      )}
      <style>{`@keyframes slideIn { from { transform: translateX(40px); opacity:0; } to { transform: translateX(0); opacity:1; } }`}</style>
    </div>
  );
}


export default function Dashboard() {
  const [activePage, setActivePage] = useState('dashboard');
  
  // Dashboard State
  const [stats, setStats] = useState({
    totalWorkers: 0,
    totalPaidOut: 0,
    totalClaims: 0,
    totalPremiums: 0,
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
      const API = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const [statsRes, claimsRes] = await Promise.all([
        fetch(`${API}/admin/stats`),
        fetch(`${API}/admin/claims`)
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
  const currentTotalPremiumVolume = stats.totalPremiums || (stats.activePlans * 79);

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



  // CSV Export logic
  const handleExportTable = () => {
    if (!liveClaims || liveClaims.length === 0) return;
    
    const headers = ["Worker Name", "Worker Phone", "Disruption", "Zone", "Fraud Score", "Payout Amount", "Status", "Time"];
    const rows = liveClaims.map(claim => [
      claim.userId?.name || "Unknown",
      claim.userId?.phone || "Unknown",
      claim.triggerType,
      claim.userId?.city || "Unknown",
      claim.fraudScore || 0,
      claim.payoutAmount,
      claim.status,
      new Date(claim.createdAt).toLocaleString('en-IN')
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(v => `"${v}"`).join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `GigWare_Claims_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
                    {loading ? "..." : `Rs.${formatRs(currentTotalPremiumVolume)}`}
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
                  <span style={{ color: "#ef4444", fontSize: "11px", fontWeight: "700", background: "rgba(239, 68, 68, 0.1)", padding: "4px 8px", borderRadius: "6px", marginBottom: "2px" }}>Rs.{formatRs(stats.totalPaidOut)} Paid</span>
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
                    <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={val => `Rs.${Math.floor(val/1000)}k`} />
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
                <div onClick={handleExportTable} style={{ cursor: "pointer", background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '8px 14px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', border: '1px solid rgba(59, 130, 246, 0.2)', textTransform: "uppercase", letterSpacing: "1px" }}>
                  Export Table {"\u2192"}
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
                              {claim.fraudScore !== undefined ? (
                                <span style={{ 
                                  color: claim.fraudScore > 75 ? "#ef4444" : claim.fraudScore >= 40 ? "#f59e0b" : "#22c55e", 
                                  fontWeight: "600" 
                                }}>
                                  {claim.fraudScore > 75 ? "High Risk" : claim.fraudScore >= 40 ? "Medium" : "Low Risk" } ({100 - claim.fraudScore}% Trust)
                                </span>
                              ) : (
                                <span style={{ color: "#22c55e", fontWeight: "600" }}>Low (98% Trust)</span>
                              )}
                            </td>
                            <td style={{ padding: "16px", color: "#fff", fontWeight: "700" }}>
                              Rs.{claim.payoutAmount}
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
                    {loading ? "..." : `Rs.${formatRs(liveDisruptionFeed.reduce((sum, item) => sum + item.payout, 0))}`}
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

              {/* ORACLE CONSENSUS VERIFICATION NODE */}
              <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                <div style={{ flex: 1, background: 'rgba(34, 197, 94, 0.05)', border: '1px solid rgba(34, 197, 94, 0.2)', padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 10px #22c55e' }}></div>
                  <div>
                    <p style={{ color: '#22c55e', fontSize: '11px', fontWeight: '800', letterSpacing: '0.5px' }}>NODE 1: SATELLITE ORACLE</p>
                    <p style={{ color: '#d4d4d8', fontSize: '13px', marginTop: '2px', fontWeight: "500" }}>Open-Meteo Trigger Confirmed</p>
                  </div>
                </div>
                <div style={{ flex: 1, background: 'rgba(34, 197, 94, 0.05)', border: '1px solid rgba(34, 197, 94, 0.2)', padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 10px #22c55e' }}></div>
                  <div>
                    <p style={{ color: '#22c55e', fontSize: '11px', fontWeight: '800', letterSpacing: '0.5px' }}>NODE 2: PASSIVE SWARM TELEMETRY</p>
                    <p style={{ color: '#d4d4d8', fontSize: '13px', marginTop: '2px', fontWeight: "500" }}>Avg Zone Velocity Dropped 43%</p>
                  </div>
                </div>
                <div style={{ flex: 1, background: 'rgba(34, 197, 94, 0.05)', border: '1px solid rgba(34, 197, 94, 0.2)', padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 10px #22c55e' }}></div>
                  <div>
                    <p style={{ color: '#22c55e', fontSize: '11px', fontWeight: '800', letterSpacing: '0.5px' }}>NODE 3: ANTI-SPOOF TRUTH</p>
                    <p style={{ color: '#d4d4d8', fontSize: '13px', marginTop: '2px', fontWeight: "500" }}>0% Mock GPS Flags Detected</p>
                  </div>
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
                            Rs.{formatRs(item.payout)}
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
        
        {/* WORKERS PAGE */}
        {activePage === 'workers' && (
          <WorkersPage loading={loading} stats={stats} cardStyle={cardStyle} formatRs={formatRs} />
        )}

        {/* LIVE CLAIMS PAGE */}
        {activePage === 'live-claims' && (
          <LiveClaimsPage cardStyle={cardStyle} />
        )}

        {/* FRAUD DETECTION PAGE */}
        {activePage === 'fraud' && (
          <FraudDetectionPage cardStyle={cardStyle} />
        )}

        {/* PREDICTIVE ANALYSIS PAGE */}
        {activePage === 'predictive' && (
          <PredictiveAnalysisPage cardStyle={cardStyle} />
        )}

        {/* SYSTEM TRIGGER PAGE */}
        {activePage === 'system-trigger' && (
          <SystemTriggerPage cardStyle={cardStyle} />
        )}
        
      </div>
    </div>
  );
}
