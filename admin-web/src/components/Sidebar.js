import React, { useState } from 'react';
import './Sidebar.css';

// SVG Icons
const IconDashboard = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
);
const IconActivity = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
);
const IconLayers = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 12 12 17 22 12"></polyline><polyline points="2 17 12 22 22 17"></polyline></svg>
);
const IconZap = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
);
const IconLogout = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
);
const IconUser = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);
const IconShield = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
);
const IconTrend = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
);

export default function Sidebar({ activePage, setActivePage }) {
  const [managementOpen, setManagementOpen] = useState(true);

  // In an actual integration, log_out would wipe out session states and redirect to login
  const handleLogout = () => {
    window.location.reload(); 
  };

  return (
    <div className="sidebar-container">
      <div className="sidebar-top">
        <div className="brand-header">
          <div className="brand-logo">
            <div className="brand-logo-icon">G</div>
            <div className="brand-logo-text">GigWare</div>
          </div>
          <div className="brand-subtitle">ADMIN CONSOLE</div>
        </div>

        <div className="sidebar-nav">
          <div 
            className={`sidebar-item ${activePage === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActivePage('dashboard')}
          >
            <div className="sidebar-item-inner">
              <IconDashboard />
              <span>DASHBOARD</span>
            </div>
          </div>

          <div 
            className={`sidebar-item ${activePage === 'live-claims' ? 'active' : ''}`}
            onClick={() => setActivePage('live-claims')}
          >
            <div className="sidebar-item-inner">
              <IconActivity />
              <span>LIVE CLAIMS</span>
            </div>
          </div>

          <div 
            className="sidebar-item"
            onClick={() => setManagementOpen(!managementOpen)}
          >
            <div className="sidebar-item-inner">
              <IconLayers />
              <span>MANAGEMENT</span>
            </div>
            <span style={{ fontSize: '10px', marginLeft: 'auto' }}>{managementOpen ? '▼' : '▶'}</span>
          </div>

          {managementOpen && (
            <div className="sidebar-dropdown">
              <div 
                className={`dropdown-item ${activePage === 'workers' ? 'active' : ''}`}
                onClick={() => setActivePage('workers')}
              >
                <div className="dropdown-item-inner">
                  <IconUser />
                  <span>WORKER</span>
                </div>
              </div>
              <div 
                className={`dropdown-item ${activePage === 'fraud' ? 'active' : ''}`}
                onClick={() => setActivePage('fraud')}
              >
                <div className="dropdown-item-inner">
                  <IconShield />
                  <span>FRAUD DETECTION</span>
                </div>
              </div>
              <div 
                className={`dropdown-item ${activePage === 'predictive' ? 'active' : ''}`}
                onClick={() => setActivePage('predictive')}
              >
                <div className="dropdown-item-inner">
                  <IconTrend />
                  <span>PREDICTIVE ANALYSIS</span>
                </div>
              </div>
            </div>
          )}

          <div 
            className={`sidebar-item ${activePage === 'system-trigger' ? 'active' : ''}`}
            onClick={() => setActivePage('system-trigger')}
          >
            <div className="sidebar-item-inner">
              <IconZap />
              <span>SYSTEM TRIGGER</span>
            </div>
          </div>
        </div>
      </div>

      <div className="sidebar-bottom">
        <div className="sidebar-item logout-btn" onClick={handleLogout}>
          <div className="sidebar-item-inner">
            <IconLogout />
            <span>LOG OUT</span>
          </div>
        </div>
      </div>
    </div>
  );
}