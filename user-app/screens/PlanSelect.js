import React, { useState } from 'react';
import './PlanSelect.css';

const PLANS = [
  {
    id: 'basic',
    name: 'Basic Shield',
    price: 49,
    features: [
      'Rain + Extreme Heat coverage',
      'Up to 3 days/week',
      'Cap: Rs.1,500/week',
    ],
    pill: null,
  },
  {
    id: 'standard',
    name: 'Standard Shield',
    price: 79,
    features: [
      'Rain + Heat + AQI + Flood + Strike',
      'Up to 5 days/week',
      'Cap: Rs.2,500/week',
    ],
    pill: 'BEST VALUE',
  },
  {
    id: 'full',
    name: 'Full Shield',
    price: 99,
    features: [
      'All triggers covered',
      'Up to 7 days/week',
      'Cap: Rs.3,500/week',
      'Instant payout',
    ],
    pill: null,
  },
];

export default function PlanSelect({ workerId, onPlanSelected }) {
  const [selected, setSelected] = useState('standard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const selectedPlan = PLANS.find((p) => p.id === selected);

  async function handleActivate() {
    if (!selectedPlan) return;

    setError(null);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/select-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workerId,
          planName: selectedPlan.name,
          weeklyPremium: selectedPlan.price,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        onPlanSelected(data);
      } else {
        setError(data.message || 'Failed to activate plan.');
      }
    } catch (err) {
      setError('Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="plan-page">
      {/* Wordmark */}
      <div className="plan-wordmark">GigWare</div>

      {/* Header */}
      <div className="plan-header">
        <h1 className="plan-heading">Pick your shield.</h1>
        <p className="plan-subtext">Weekly coverage. Cancel anytime.</p>
      </div>

      <div className="plan-divider"></div>

      {/* Zone Risk Bar */}
      <div className="zone-risk">
        <div className="zone-risk-label">Zone Risk Score — Bengaluru South</div>
        <div className="zone-risk-track">
          <div className="zone-risk-fill"></div>
        </div>
        <div className="zone-risk-row">
          <span className="zone-risk-score">38 / 100 — Low Risk</span>
          <span className="zone-risk-note">Your premium is Rs.12 lower than average zone</span>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="plan-cards">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`plan-card ${selected === plan.id ? 'selected' : ''}`}
            onClick={() => setSelected(plan.id)}
          >
            <div className="plan-card-left">
              <div className="plan-card-name-row">
                <h3 className="plan-card-name">{plan.name}</h3>
                {plan.pill && <span className="plan-pill">{plan.pill}</span>}
              </div>
              <ul className="plan-card-features">
                {plan.features.map((f, i) => (
                  <li key={i} className="plan-card-feature">{f}</li>
                ))}
              </ul>
            </div>
            <div className="plan-card-right">
              <div className="plan-card-price">Rs.{plan.price}</div>
              <div className="plan-card-period">/week</div>
            </div>
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="plan-error">
          <span className="plan-error-text">{error}</span>
        </div>
      )}

      {/* Bottom Sticky Bar */}
      <div className="plan-bottom-bar">
        <div className="plan-bottom-inner">
          <div className="plan-bottom-info">
            <span className="plan-bottom-name">{selectedPlan?.name}</span>
            <span className="plan-bottom-price">Rs.{selectedPlan?.price}/week</span>
          </div>
          <button
            className="plan-activate-btn"
            onClick={handleActivate}
            disabled={loading}
          >
            {loading ? 'Activating...' : 'Activate Shield →'}
          </button>
        </div>
      </div>
    </div>
  );
}
