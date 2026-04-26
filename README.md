# ■■ SafeMap India

> Anonymous Incident Reporting & Real-time Safety Mapping System

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Online-green)](https://safemap-india.vercel.app) [![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/) [![Supabase](https://img.shields.io/badge/Supabase-322876)](https://supabase.com/)

## ■ Problem Statement

Every day, thousands of harassment and safety incidents happen across India — most go unreported because victims fear judgment, lack trust in authorities, or simply don't know how to report anonymously. The National Crime Records Bureau (NCRB) reports that only a fraction of actual incidents get officially recorded, leaving communities unaware of potential dangers in their areas.

Women, children, and vulnerable populations face the highest risk of underreporting due to social stigma, family pressure, and lack of safe reporting channels. This creates a dangerous information gap where people cannot make informed decisions about their safety, and authorities cannot effectively allocate resources to high-risk areas.

The existing reporting systems are fragmented, bureaucratic, and often require personal information that victims are unwilling to share. This leads to a cycle of silence where dangerous areas remain unidentified, and potential victims lack the awareness needed to protect themselves, perpetuating a cycle of preventable incidents.

## ■ Solution

SafeMap India bridges this gap by providing a zero-identity reporting platform where anyone can flag an unsafe area, report an incident, or warn the community — without sharing their name, phone number, or any personal data. Our platform combines community-submitted anonymous reports with verified historical crime data from the National Crime Records Bureau (NCRB) to provide a complete picture of safety across India's cities.

The platform uses geolocation to automatically detect the user's area and shows relevant safety data in real-time. Users can view interactive heatmaps, filter by incident type, and access emergency resources instantly. For administrators, we provide a comprehensive dashboard with analytics, data export capabilities, and moderation tools to maintain data quality.

SafeMap India empowers communities with knowledge while protecting the anonymity of reporters. By making safety information accessible and actionable, we help people make informed decisions about their daily routes, encourage more reporting through safe channels, and ultimately contribute to safer neighborhoods across India.

## ■ Features

- ■■ Real-time Interactive Safety Heatmap (Leaflet + OpenStreetMap)
- ■ NCRB Historical Crime Data (2018-2022, 18 major Indian cities)
- ■ 100% Anonymous Incident Reporting (no login, no personal data)
- ■ Live Location Tracking (auto-detect user city)
- ■ Admin Dashboard (password-protected, charts, CSV export)
- ■ Real-time Updates (Supabase Realtime)
- ■ Fully Responsive (mobile-first)
- ■ Emergency Helplines (112, 1091, 100, 1930)

## ■■ Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 14 (App Router) | Frontend framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Supabase | Database + Realtime + Auth |
| Leaflet.js + OpenStreetMap | Interactive maps (free, India-accurate) |
| Recharts | Admin analytics charts |
| Vercel | Deployment (free tier) |
| NCRB / data.gov.in | Official India crime data |

## ■ Getting Started

### Prerequisites

- Node.js v18 or higher
- A Supabase account (free at supabase.com)
- Git

### Installation

```bash
git clone https://github.com/avikaagarwal1234-cell/safemap-india.git
cd safemap-india
npm install
```

### Environment Setup

Create `.env.local` in the root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ADMIN_PASSWORD=safemapadmin2025
```

### Database Setup

Run the SQL in `supabase-setup.sql` in your Supabase SQL Editor.

### Run Locally

```bash
npm run dev
```

Open http://localhost:3000

### Import NCRB Data

```bash
node scripts/import-ncrb.js
```

## ■ Database Schema

### incidents table

```sql
CREATE TABLE incidents (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  severity INTEGER DEFAULT 3,
  verified BOOLEAN DEFAULT FALSE,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### ncrb_data table

```sql
CREATE TABLE ncrb_data (
  id SERIAL PRIMARY KEY,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL,
  total_crimes INTEGER NOT NULL,
  crime_rate DECIMAL(8, 2) NOT NULL,
  top_crimes JSONB,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL
);
```

## ■ Admin Dashboard

URL: `/admin`

Password: (set in environment variable `ADMIN_PASSWORD`)

Features: Stats overview, reports table, analytics charts, CSV export

## ■ Team

| Name | Role |
|---|---|
| Aditi Garg | Full Stack Development |
| Yashi Goyal | Full Stack Development |
| Avika Agarwal | Full Stack Development |

Built for: Elite Her Hackathon 2025

## ■ Emergency Resources

- Emergency: 112
- Women Helpline: 1091
- Police: 100
- Cyber Crime: 1930

## ■ Data Sources

- NCRB (National Crime Records Bureau) — data.gov.in
- Community-submitted anonymous reports

## ■■ Disclaimer

SafeMap India is for awareness only. Always call 112 in emergencies.

## ■ License

MIT License — Free to use and modify.

---

*SafeMap India — Making every street safer, one report at a time.*

---

**Live Statistics**: 50 incidents reported | 4/26/2026
