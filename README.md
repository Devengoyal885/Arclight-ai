# ArcLight AI 2.0 — Urban Intelligence OS

> Real-time city sustainability intelligence platform powered by AI, IoT sensors, and open data APIs.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-arclight--ai.vercel.app-5B5EF4?style=for-the-badge&logo=vercel&logoColor=white)](https://arclight-ai.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)

🌐 **Live:** [https://arclight-ai.vercel.app](https://arclight-ai.vercel.app)

  <img src="components/Screenshot 2026-06-06 174301.png" width="100%">

## 🌆 Overview

ArcLight AI 2.0 is a production-grade **Urban Operating System** that unifies city-wide data streams into a single, intelligent dashboard. It brings together Waste Management, Energy Optimization, Air Quality Monitoring, and Citizen Engagement — all in real-time.

Built with a premium **white glassmorphism UI**, it's designed to look and feel like the future of smart city governance.

---

## ✨ Features

| Module | Description |
|--------|-------------|
| 🗑️ **Smart Waste** | Computer vision fill-level detection, AI-optimized collection routing, 6-hour predictions |
| ⚡ **Smart Energy** | Occupancy-based HVAC control, solar optimization, anomaly detection |
| 🌐 **Digital Twin** | 3D city simulation, festival scenario planning, real-time IoT sync |
| 🤖 **AI Copilot** | RAG-grounded LLM with real-time sensor context, multi-provider fallback |
| 👥 **Citizen Layer** | Gamified reporting, YOLOv11 CV verification, community leaderboard |
| 💨 **AirSense** | Live AQI from WAQI API, PM2.5/PM10/NO₂ trends, 7-day weather forecast |
| 📊 **Command Center** | Unified KPI dashboard, city-wide sustainability score, live activity feed |

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 15, TypeScript, Recharts, Lucide Icons
- **Styling:** Custom Glassmorphism CSS (no Tailwind required for glass effects)
- **AI:** Gemini 2.5 Flash → Groq (Llama 3.1) → OpenAI GPT-4o Mini (fallback chain)
- **Real-Time Data:** Open-Meteo API (weather & solar), WAQI API (air quality)
- **Simulation:** Physics-based models coupled to live weather data

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Rishabhv16/arclight-ai.git
cd arclight-ai
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example file and fill in your API keys:

```bash
cp .env.example .env.local
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to run locally, or visit the live demo at [https://arclight-ai.vercel.app](https://arclight-ai.vercel.app).

---

## 🔑 Environment Variables

See [`.env.example`](.env.example) for all required variables.

| Variable | Description | Source |
|----------|-------------|--------|
| `GEMINI_API_KEYS` | Comma-separated Gemini API keys | [Google AI Studio](https://aistudio.google.com) |
| `GROQ_API_KEYS` | Comma-separated Groq API keys | [Groq Console](https://console.groq.com) |
| `OPENAI_API_KEY` | OpenAI API key (fallback) | [OpenAI Platform](https://platform.openai.com) |
| `WAQI_TOKEN` | World Air Quality Index token | [aqicn.org](https://aqicn.org/api/) |

---

## 📸 Screenshots

### Landing Page
  <img src="components/Screenshot 2026-06-06 174301.png" width="100%">

### Command Center Dashboard
Real-time KPIs, energy graphs, waste distribution, and live activity feed.

### AirSense Module
Live AQI data from real WAQI monitoring stations in Hyderabad with 24-hour trends.

---

## 📁 Project Structure

```
arclight-ai/
├── app/
│   ├── page.tsx              # Landing page with Unsplash hero
│   ├── dashboard/page.tsx    # Command Center
│   ├── airsense/page.tsx     # AirSense module (WAQI + Open-Meteo)
│   ├── waste/page.tsx        # Smart Waste module
│   ├── energy/page.tsx       # Smart Energy module
│   ├── copilot/page.tsx      # AI Copilot
│   ├── citizens/page.tsx     # Citizen Layer
│   ├── twin/page.tsx         # Digital Twin
│   ├── api/chat/route.ts     # AI provider fallback chain
│   └── globals.css           # Premium glassmorphism design system
├── components/
│   ├── layout/               # AppShell, Sidebar, TopBar
│   ├── charts/               # Recharts wrappers
│   └── ui/                   # MetricCard, AlertBanner
└── lib/
    ├── api.ts                # Open-Meteo & WAQI data fetching
    └── simulators/index.ts   # Weather-coupled physics simulations
```

---

## 🌍 Real Data Sources

- **Weather:** [Open-Meteo](https://open-meteo.com/) — Free, no API key required for basic weather
- **Air Quality:** [WAQI API](https://aqicn.org/api/) — Real monitoring stations (Bollaram, Pashamylaram, ECIL, IDA Jeedimetla, Hyderabad)
- **Images:** [Unsplash](https://unsplash.com/) — Free high-quality photography

---

## 📄 License

MIT License — feel free to use, modify, and distribute.

---

<div align="center">
  <strong>Built with ❤️ for smarter, sustainable cities</strong>
</div>
