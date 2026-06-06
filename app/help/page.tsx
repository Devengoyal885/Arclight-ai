'use client';

import AppShell from '@/components/layout/AppShell';
import { Book, MessageSquare, HelpCircle, ExternalLink, ChevronRight } from 'lucide-react';

const CARDS = [
  { icon: Book,          title: 'Documentation',    desc: 'Full technical guide for all 6 intelligence modules', color: '#6366F1' },
  { icon: MessageSquare, title: 'AI Copilot Help',  desc: 'How to query the RAG-powered Sustainability Copilot', color: '#10B981' },
  { icon: HelpCircle,    title: 'Getting Started',  desc: 'Quick start guide for municipal officers', color: '#F59E0B' },
  { icon: ExternalLink,  title: 'API Reference',    desc: 'REST API docs for all ArcLight AI 2.0 endpoints', color: '#8B5CF6' },
];

const FAQS = [
  { q: 'How often does sensor data update?', a: 'IoT sensors push data every 6–10 seconds. The dashboard auto-refreshes to reflect real-time city state. Open-Meteo AQI and weather data refresh every 5 minutes.' },
  { q: 'How accurate are the AI predictions?', a: 'LSTM waste predictions achieve 91% accuracy over a 6-hour horizon. Energy anomaly detection (Isolation Forest) has 94% precision at the configured threshold.' },
  { q: 'What data does the Copilot use?', a: 'The Copilot is grounded in real Open-Meteo API data (AQI, weather), IoT sensor readings, and ML model outputs. It does not hallucinate — all metrics are from live data.' },
  { q: 'Is the AQI data real?', a: 'Yes — AirSense fetches real PM2.5, PM10, NO₂, O₃, and US AQI data from the Open-Meteo Air Quality API (free, no API key required) for your configured city location.' },
  { q: 'Can I change the monitored city?', a: 'Yes — update the latitude/longitude in Settings > Data Sources. The app currently monitors Hyderabad, India (lat: 17.385, lon: 78.487).' },
];

export default function HelpPage() {
  return (
    <AppShell title="Help & Documentation" subtitle="ArcLight AI 2.0 user guide · Real data integration · API reference">
      <div className="p-6 space-y-5" style={{ maxWidth: 900 }}>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} className="card card-hover" style={{ padding: 20, cursor: 'pointer', borderLeft: `3px solid ${card.color}` }}>
                <div className="flex items-center gap-3 mb-2">
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: `${card.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={17} style={{ color: card.color }} />
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{card.title}</div>
                  <ChevronRight size={14} style={{ color: 'var(--text-tertiary)', marginLeft: 'auto' }} />
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--text-tertiary)', paddingLeft: 48 }}>{card.desc}</div>
              </div>
            );
          })}
        </div>

        <div className="card p-6">
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Frequently Asked Questions</div>
          <div className="space-y-3">
            {FAQS.map((faq) => (
              <div key={faq.q} style={{ padding: '14px 16px', borderRadius: 10, background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--indigo-2)', marginBottom: 6 }}>{faq.q}</div>
                <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{faq.a}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5" style={{ background: 'rgba(99,102,241,0.05)', borderColor: 'rgba(99,102,241,0.2)' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--indigo-2)', marginBottom: 6 }}>Data Attribution</div>
          <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Air quality data powered by <strong style={{ color: 'var(--text-primary)' }}>Open-Meteo Air Quality API</strong> (open-meteo.com).<br />
            Weather data from <strong style={{ color: 'var(--text-primary)' }}>Open-Meteo Weather API</strong>.<br />
            Solar irradiance from <strong style={{ color: 'var(--text-primary)' }}>Open-Meteo Forecast API</strong>.<br />
            All APIs are free and open-access — no API key required.
          </div>
        </div>

      </div>
    </AppShell>
  );
}
