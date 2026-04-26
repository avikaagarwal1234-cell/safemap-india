import fs from 'fs'
import { execSync } from 'child_process'

const repoUrl = execSync('git config --get remote.origin.url').toString().trim()
  .replace('git@github.com:', 'https://github.com/')
  .replace('.git', '')

const readme = `# ■■ SafeMap India

> Anonymous Incident Reporting & Real-time Safety Mapping System for India

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://safemap-india.vercel.app)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-black)](https://vercel.com)

---

## ■ Problem Statement

Millions of harassment and safety incidents happen across India every day — on buses, streets, markets, and colleges. **Most go unreported** because victims fear judgment, distrust authorities, or don't know how to report anonymously. There is no safe, zero-identity way to say "this place is dangerous."

## ■ Our Solution

SafeMap India is a **100% anonymous** safety awareness platform that combines:
- Real-time community incident reports (no login, no personal data)
- Historical crime data from NCRB (India's official crime bureau)
- An interactive heatmap showing India's safety landscape

---

## ■ Features

| Feature | Description |
|---|---|
| ■■ Interactive Safety Map | Leaflet + OpenStreetMap heatmap with live incident markers |
| ■ Anonymous Reporting | 4-step form, zero personal data collected |
| ■ NCRB Historical Data | 2018–2022 city-wise crime statistics from data.gov.in |
| ■ Live Location Tracking | Auto-detects user city, shows nearby incidents |
| ■ Admin Dashboard | Password-protected stats, charts, reports table, CSV export |
| ■ Alert System | Notifies when 3+ incidents cluster in 1km radius |
| ■ Analytics View | Bar, pie, and line charts for trend analysis |
| ■ Real-time Updates | Supabase Realtime — new reports appear in <1 second |
| ■ Mobile Responsive | Fully responsive, tested on 375px |

---

## ■■ Tech Stack

| Technology | Purpose |
|---|---|
| React 18 + Vite | Frontend framework with modern tooling |
| Tailwind CSS | Utility-first styling |
| Supabase | PostgreSQL database + Realtime subscriptions |
| Leaflet.js + OpenStreetMap | Free, India-accurate interactive maps |
| Recharts | Admin analytics charts |
| Vercel | Automatic deployment (free tier) |
| NCRB / data.gov.in | Official India crime data source |

---

## ■ Getting Started

### Prerequisites
- Node.js v18 or higher
- Supabase account (free at supabase.com)
- Git

### Installation
\`\`\`bash
git clone ${repoUrl}.git
cd safemap-india
npm install
\`\`\`

### Environment Setup
Create \`.env.local\` in the root directory:
\`\`\`env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
ADMIN_PASSWORD=safemapadmin2025
\`\`\`

### Database Setup
Run this SQL in your Supabase SQL Editor:
\`\`\`sql
CREATE TABLE incidents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  incident_type TEXT NOT NULL,
  description TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  city TEXT,
  state TEXT,
  severity INTEGER DEFAULT 1 CHECK (severity BETWEEN 1 AND 5),
  verified BOOLEAN DEFAULT FALSE
);

CREATE TABLE ncrb_data (
  id SERIAL PRIMARY KEY,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  year INTEGER,
  crime_type TEXT,
  count INTEGER,
  crime_rate FLOAT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION
);

ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE ncrb_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can report" ON incidents FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view incidents" ON incidents FOR SELECT USING (true);
CREATE POLICY "Anyone can view ncrb" ON ncrb_data FOR SELECT USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE incidents;
\`\`\`

### Run Locally
\`\`\`bash
npm run dev
\`\`\`
Open [http://localhost:5173](http://localhost:5173)

### Import NCRB Data
\`\`\`bash
node scripts/import-ncrb.js
\`\`\`

---

## ■ Project Structure

\`\`\`
safemap-india/
├── src/
│   ├── pages/
│   │   ├── HomePage.jsx          # Landing page (hero, stats, how-it-works)
│   │   ├── MapPage.jsx           # Interactive safety map
│   │   ├── ReportPage.jsx        # Anonymous incident report form
│   │   ├── AdminPage.jsx         # Password-protected admin dashboard
│   │   ├── AboutPage.jsx         # About + privacy + emergency resources
│   │   └── DataPage.jsx          # NCRB data insights
│   ├── components/
│   │   ├── Map/                   # SafetyMap, Filters, Popups, NearMe
│   │   ├── Report/                # ReportForm multi-step wizard
│   │   ├── UI/                    # ToastContainer, CustomMarker
│   │   └── Navbar.jsx             # Navigation component
│   ├── hooks/
│   │   ├── useIncidents.js        # Supabase data + realtime
│   │   └── useAlerts.js           # Cluster detection alerts
│   └── lib/
│       └── supabase.js           # Client setup
├── scripts/
│   ├── import-ncrb.js            # NCRB data import
│   ├── seed-test-data.js         # Test data seeder
│   ├── generate-readme.js         # Auto README updater
│   └── deploy.sh                  # Auto deploy script
└── package.json
\`\`\`

---

## ■ Admin Dashboard

- **URL:** \`/admin\` 
- **Password:** Set via \`ADMIN_PASSWORD\` environment variable
- **Features:** Stats overview, reports table with verify/unverify, analytics charts, CSV export

---

## ■ Team

| Name | Role |
|---|---|
| **Aditi Garg** | Full Stack Development |
| **Yashi Goyal** | Full Stack Development |
| **Avika Agarwal** | Full Stack Development |

> Built in 48 hours for **Elite Her Hackathon**

---

## ■ Emergency Resources

| Service | Number |
|---|---|
| Emergency | **112** |
| Women Helpline | **1091** |
| Police | **100** |
| Cyber Crime | **1930** |

---

## ■ Data Sources

- **NCRB** (National Crime Records Bureau) — [data.gov.in](https://data.gov.in)
- **OpenStreetMap** — map tiles and geocoding
- **Community Reports** — anonymous user submissions

---

## ■■ Disclaimer

SafeMap India is for community awareness only and does not replace official emergency services. Always call **112** in life-threatening situations.

---

## ■ License

MIT License — Free to use, modify, and distribute.

---

*■■ SafeMap India — Making every street safer, one report at a time.*

*Last updated: ${new Date().toLocaleString('en-IN', {timeZone:'Asia/Kolkata'})} IST*
`

fs.writeFileSync('README.md', readme)
console.log('■ README.md generated!')
