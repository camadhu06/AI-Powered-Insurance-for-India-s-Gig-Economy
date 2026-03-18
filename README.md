# AI-Powered-Insurance-for-India-s-Gig-Economy

# 🛡️ GigWare — AI-Powered Parametric Income Insurance for India's Gig Economy

> **Guidewire DEVTrails 2026 — University Hackathon**
> *Protecting delivery workers from income loss caused by external disruptions*

---

## 📌 Problem Statement

India's platform-based delivery partners (Zomato, Swiggy, Zepto, Amazon, Flipkart, etc.) are the backbone of the digital economy. External disruptions — extreme weather, severe pollution, floods, curfews, and local strikes — can reduce their working hours and cause **20–30% monthly income loss**. These workers have no financial safety net.

**GigShield** is an AI-enabled parametric insurance platform that automatically detects disruptions, triggers claims, and pays out lost income — with zero manual intervention.

---

## 🎯 Persona Focus

**Segment: Food Delivery Partners** (Zomato / Swiggy)

| Attribute | Detail |
|---|---|
| Platform | Zomato, Swiggy |
| Work Pattern | 6–12 hrs/day, 6 days/week |
| Avg Weekly Earnings | ₹3,000 – ₹6,000 |
| Key Risk Zones | High-traffic urban corridors, flood-prone areas |
| Primary Disruptions | Heavy rain, extreme heat, air quality alerts, curfews |

---

## 🚨 Coverage Scope — Income Loss ONLY

GigShield covers **lost income** from the following parametric triggers:

| Disruption Type | Trigger Condition | Income Protection |
|---|---|---|
| **Heavy Rain** | Rainfall > 30mm/hr in the worker's zone | ₹300–₹600 per disrupted day |
| **Extreme Heat** | Temperature > 43°C for 3+ consecutive hours | ₹200–₹400 per disrupted day |
| **Severe Air Pollution** | AQI > 400 (Severe+) | ₹200–₹400 per disrupted day |
| **Flooding** | Flood alert in worker's active delivery zone | ₹400–₹700 per disrupted day |
| **Curfew / Civil Strike** | Govt-verified curfew/shutdown order | ₹300–₹600 per disrupted day |

> ⚠️ **EXCLUDED:** Health, life, accidents, vehicle repairs, and any personal medical expenses.

---

## 💰 Weekly Premium Model

Premiums are structured on a **weekly basis** to match the gig worker's earnings cycle.

```
Base Weekly Premium = ₹49 – ₹99 / week

Dynamic Adjustments (AI-Powered):
  + Zone Risk Score      (flood-prone / heat index / AQI history)
  + Seasonal Risk Factor (monsoon season surcharge)
  - Safe Zone Discount   (historically low-disruption zones: −₹5 to −₹15/week)
  - Loyalty Discount     (tenure > 3 months: −₹10/week)
```

**Tiers:**

| Plan | Weekly Premium | Weekly Coverage Cap | Disruption Days Covered |
|---|---|---|---|
| Basic Shield | ₹49 | ₹1,500 | Up to 3 days |
| Standard Shield | ₹79 | ₹2,500 | Up to 5 days |
| Full Shield | ₹99 | ₹3,500 | Up to 7 days |

---

## 🗺️ Application Architecture

### Developer Flow

```
Frontend (Mobile App / Web App)
        ↓
API Gateway / Backend Server (Node.js + Express / FastAPI)
        ↓
User & Policy Management Service
        ↓
Data Ingestion Layer
   • OpenWeatherMap API (Weather)
   • CPCB / AQI India API (Pollution)
   • Mock Traffic & Civic Alert APIs
        ↓
AI/ML Engine
   ├── Risk Scoring Model        (zone + season + history)
   ├── Fraud Detection Module    (anomaly + GPS + behavior)
   └── Impact Analysis Engine   (hours lost → income lost)
        ↓
Trigger Engine (Parametric Rules Evaluator)
        ↓
Eligibility & Validation Service
   • Active policy check
   • Location-presence verification
   • Duplicate claim guard
        ↓
Payout Engine (auto-approved if fraud score < threshold)
        ↓
Payment Gateway Integration
   • Razorpay (test mode) / UPI Simulator
        ↓
Database (PostgreSQL / Firebase)
   • Users, Policies, Claims, Disruption Logs
        ↓
Analytics & Model Retraining Pipeline
```

### User (Worker) Flow

```
1. Worker Registration
   └── Name, phone, platform, zone, avg weekly earnings

2. Premium Subscription
   └── AI calculates weekly premium → Worker selects plan → Auto-debit weekly

3. External Data Collection (Real-time)
   └── Weather APIs + AQI feeds monitor worker's active zone continuously

4. AI Risk Analysis
   └── Risk model evaluates severity + duration → Disruption confidence score

5. Disruption Detection
   └── Parametric trigger fires when threshold is crossed (e.g., rain > 30mm/hr)

6. Automatic Claim Trigger
   └── System auto-initiates claim — no manual filing required

7. AI Fraud Detection
   └── GPS check + activity log + behavioral anomaly analysis

8. Compensation Payment
   └── Funds transferred to UPI / wallet within minutes of trigger

9. Data Storage & Model Improvement
   └── Disruption + claim data feeds back into ML training pipeline
```

---

## 🤖 AI/ML Integration

### 1. Dynamic Premium Calculation
- **Model:** Gradient Boosting (XGBoost) trained on historical weather, AQI, and claim data
- **Inputs:** Worker zone, season, flood risk index, historical AQI, claim history
- **Output:** Personalized weekly premium with zone-based adjustments

### 2. Fraud Detection
- **Anomaly Detection:** Isolation Forest on claim patterns (time, frequency, amount)
- **Location Validation:** GPS coordinates cross-checked with reported disruption zone
- **Behavioral Analysis:** Active hours vs. claimed disruption window
- **Duplicate Prevention:** Policy ID + disruption event ID uniqueness check
- **GPS Spoofing Detection:** Sensor fusion + velocity plausibility checks

### 3. Impact Analysis
- **Model:** Regression model mapping disruption severity → estimated hours lost → income lost
- **Inputs:** Disruption type, severity score, worker's average hourly earning, time of day
- **Output:** Payout amount (capped at plan's weekly coverage limit)

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React Native (Mobile) / React.js (Web) |
| **Backend** | Node.js + Express.js / Python FastAPI |
| **Database** | PostgreSQL (relational) + Redis (cache) |
| **AI/ML** | Python (scikit-learn, XGBoost, pandas) |
| **Weather API** | OpenWeatherMap (free tier) |
| **AQI API** | CPCB AQI India API / OpenAQ |
| **Payment** | Razorpay (test mode) / UPI Simulator |
| **Auth** | Firebase Auth / JWT |
| **DevOps** | Docker, GitHub Actions (CI/CD) |
| **Hosting** | Render / Railway (backend), Vercel (frontend) |

---

## 🗓️ Development Roadmap

### Phase 1 — Ideation & Foundation (March 4–20)
- [x] Define persona: Zomato/Swiggy food delivery partners
- [x] Design user flows (worker + admin)
- [x] Finalize parametric trigger conditions
- [x] Define weekly premium model structure
- [x] Set up GitHub repository and project scaffold
- [ ] Build basic registration UI prototype

### Phase 2 — Automation & Protection (March 21–April 4)
- [ ] Worker registration & onboarding flow
- [ ] Insurance policy creation with weekly pricing
- [ ] Dynamic premium calculator (AI-powered)
- [ ] 3–5 automated parametric triggers (weather + AQI + mock civic API)
- [ ] Claims management module
- [ ] Zero-touch claim flow UX

### Phase 3 — Scale & Optimise (April 5–17)
- [ ] Advanced fraud detection (GPS spoofing, fake weather claims)
- [ ] Instant payout system (Razorpay sandbox / UPI simulator)
- [ ] Worker dashboard (earnings protected, weekly coverage status)
- [ ] Admin/Insurer dashboard (loss ratios, predictive analytics)
- [ ] Final 5-minute demo video
- [ ] Final pitch deck (PDF)

---

## 📂 Repository Structure

```
gigshield/
├── frontend/               # React Native / React.js app
│   ├── screens/            # Onboarding, Dashboard, Claims
│   └── components/
├── backend/                # Node.js / FastAPI server
│   ├── routes/             # API endpoints
│   ├── services/           # Policy, Claims, Payout logic
│   ├── triggers/           # Parametric rule engine
│   └── integrations/       # Weather, AQI, Payment APIs
├── ml/                     # AI/ML models
│   ├── risk_model/         # Premium calculation model
│   ├── fraud_detection/    # Anomaly & GPS fraud models
│   └── impact_analysis/    # Income loss estimation
├── database/               # Schema, migrations
├── docs/                   # Architecture diagrams, pitch deck
└── README.md
```

---

## 🏆 Key Differentiators

- **Zero-touch claims** — workers never file a claim; the system does it automatically
- **Hyper-local pricing** — premiums adjust to the worker's specific delivery zone risk profile
- **Weekly model** — aligns with gig worker earnings cycles; no monthly lock-in
- **Multi-signal fraud detection** — combines GPS, behavioral, and historical data
- **Instant payouts** — compensation transferred within minutes of a verified disruption

---

## 👥 Team

| Name | Role |
|---|---|
| [Team Member 1] | Full Stack Developer |
| [Team Member 2] | ML/AI Engineer |
| [Team Member 3] | Backend & API Integration |
| [Team Member 4] | UI/UX & Frontend |

---

## 📎 Submission Links

| Deliverable | Link |
|---|---|
| GitHub Repository | *This repo* |
| Phase 1 Demo Video (2 min) | *(To be added by March 20)* |
| Phase 2 Demo Video (2 min) | *(To be added by April 4)* |
| Final Demo Video (5 min) | *(To be added by April 17)* |
| Final Pitch Deck (PDF) | *(To be added by April 17)* |

---

> *GigShield — Because every delivery partner deserves a safety net.*
