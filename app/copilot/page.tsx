'use client';

import AppShell from '@/components/layout/AppShell';

import { fetchAllRealData } from '@/lib/api';
import {
  MessageSquareText, Send, Cpu, Database, X, Sparkles, ChevronRight, RefreshCw,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface Msg {
  role: 'user' | 'assistant';
  content: string;
  ts: Date;
  sources?: string[];
}

// Context-aware AI engine using all real city data (Gemini → Groq → OpenAI fallback)
async function generateAIResponse(messages: Msg[]): Promise<{ text: string; sources: string[] }> {
  try {
    // Fetch ALL real data simultaneously for maximum context
    const { weather, solar, airQuality, waqiStations, weeklyForecast, zones, buildings, kpis } = await fetchAllRealData();

    const criticalZones = zones.filter(z => z.fillLevel >= 80);
    const anomalies     = buildings.filter(b => b.anomaly);
    const avgFill       = Math.round(zones.reduce((s, z) => s + z.fillLevel, 0) / zones.length);

    // Rich context object with all real data sources
    const ctx = {
      timestamp:     new Date().toISOString(),
      city:          'Hyderabad, India',
      airQuality: airQuality ? {
        aqi:    airQuality.aqi,
        pm25:   airQuality.pm25,
        pm10:   airQuality.pm10,
        no2:    airQuality.no2,
        o3:     airQuality.o3,
        co:     airQuality.co,
        source: airQuality.source,
      } : null,
      waqiRealStations: waqiStations.slice(0, 4).map(s => ({
        name:   s.name,
        zone:   s.zone,
        aqi:    s.aqi,
        pm25:   s.pm25,
        source: s.source,
      })),
      weather: weather ? {
        temperature:  weather.temperature,
        apparentTemp: weather.apparentTemp,
        humidity:     weather.humidity,
        windSpeed:    weather.windSpeed,
        uvIndex:      weather.uvIndex,
        precipitation: weather.precipitation,
        visibility:   weather.visibility,
        dewPoint:     weather.dewPoint,
        source:       weather.source,
      } : null,
      solar: solar ? {
        radiation:          solar.radiation,
        directNormalIrrad:  solar.directNormalIrradiance,
        sunshineDuration:   solar.sunshine_duration,
        source:             solar.source,
      } : null,
      weeklyForecast: weeklyForecast.slice(0, 3).map(d => ({
        date:        d.date,
        maxTemp:     d.maxTemp,
        minTemp:     d.minTemp,
        precipitation: d.precipitation,
        uvIndex:     d.uvIndex,
        precipProb:  d.precipProbability,
      })),
      waste: {
        avgFill,
        criticalCount: criticalZones.length,
        criticalZones: criticalZones.map(z => ({ name: z.name, fill: z.fillLevel, type: z.type })),
        zones: zones.map(z => ({ name: z.name, fill: z.fillLevel, priority: z.priority })),
      },
      energy: {
        totalKw:       kpis?.totalEnergy ?? 0,
        totalSolarKw:  kpis?.totalSolar ?? 0,
        solarPercent:  kpis ? Math.round((kpis.totalSolar / kpis.totalEnergy) * 100) : 0,
        anomalies:     anomalies.map(b => ({ name: b.name, type: b.anomalyType })),
        buildings:     buildings.map(b => ({ name: b.name, kw: b.currentKw, solar: b.solarGen, efficiency: b.efficiency })),
      },
      cityKpis: kpis,
    };

    const res = await fetch('/api/chat', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ messages, contextData: ctx }),
    });

    if (!res.ok) throw new Error('API Error');
    const data = await res.json();

    // Indicate data sources used
    const realSources = [
      airQuality?.source === 'real' ? 'Open-Meteo AQI API' : null,
      waqiStations.some(s => s.source === 'real') ? 'WAQI Real Stations' : null,
      weather?.source === 'real' ? 'Open-Meteo Weather API' : null,
      solar?.source === 'real' ? 'Open-Meteo Solar API' : null,
      'Gemini 2.5 Flash', 'Live IoT Sensor Mesh',
    ].filter(Boolean) as string[];

    return { text: data.text || "I'm sorry, I couldn't process that request right now.", sources: realSources };
  } catch (error) {
    console.error(error);
    return { text: '⚠️ Connection to ArcLight AI core lost. Please check your network or API keys.', sources: [] };
  }
}


const QUICK = [
  'What is the current air quality?',
  'Any critical waste zones right now?',
  'How much solar energy are we generating?',
  'What is the weather doing today?',
  'Give me a full city status report',
  'Which buildings have anomalies?',
];

export default function CopilotPage() {
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: 'assistant',
      content: '## ArcLight AI Copilot — Ready\n\nI\'m connected to live sensor data including real AQI from Open-Meteo, building SCADA systems, IoT waste sensors, and weather APIs.\n\nAsk me anything about your city\'s sustainability systems.',
      ts: new Date(),
      sources: ['Open-Meteo API', 'IoT Sensor Network', 'Building SCADA'],
    },
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

  const send = async (text?: string) => {
    const msgText = text || input.trim();
    if (!msgText) return;
    
    const newMsg: Msg = { role: 'user', content: msgText, ts: new Date() };
    const newMsgs = [...msgs, newMsg];
    setMsgs(newMsgs);
    setInput('');
    setThinking(true);

    // Call the new real API
    const response = await generateAIResponse(newMsgs);

    setMsgs(prev => [
      ...prev,
      { role: 'assistant', content: response.text, ts: new Date(), sources: response.sources },
    ]);
    setThinking(false);
  };

  // Simple markdown renderer
  function renderMarkdown(text: string) {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      if (line.startsWith('## ')) return <div key={i} style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6, marginTop: i > 0 ? 8 : 0 }}>{line.slice(3)}</div>;
      if (line.startsWith('**') && line.endsWith('**')) return <div key={i} style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{line.slice(2, -2)}</div>;
      if (line.startsWith('- ')) return <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 3 }}><span style={{ color: 'var(--indigo)', flexShrink: 0 }}>·</span><span>{parseInline(line.slice(2))}</span></div>;
      if (line.startsWith('|')) return null; // skip table rows for simplicity
      if (line === '') return <div key={i} style={{ height: 6 }} />;
      return <div key={i} style={{ marginBottom: 2, lineHeight: 1.65 }}>{parseInline(line)}</div>;
    });
  }

  function parseInline(text: string) {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((p, i) => {
      if (p.startsWith('**') && p.endsWith('**')) {
        return <strong key={i} style={{ color: 'var(--text-primary)', fontWeight: 800 }}>{p.slice(2, -2)}</strong>;
      }
      return <span key={i}>{p}</span>;
    });
  }

  return (
    <AppShell title="AI Copilot" subtitle="RAG-grounded · Real sensor data · Context-aware city intelligence">
      <div style={{ display: 'flex', height: 'calc(100vh - 60px)' }}>

        {/* Sidebar panel */}
        <div
          className="sidebar"
          style={{
            width: 260,
            padding: '16px 12px',
            borderRight: '1px solid var(--border)',
            flexShrink: 0,
            overflowY: 'auto',
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>
            Quick Queries
          </div>
          <div className="space-y-1">
            {QUICK.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                disabled={thinking}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  width: '100%',
                  padding: '9px 11px',
                  borderRadius: 9,
                  border: '1px solid var(--border)',
                  background: 'rgba(255,255,255,0.4)',
                  color: 'var(--text-secondary)',
                  fontSize: 12.5,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s',
                  fontWeight: 600,
                }}
                className="hover:bg-white/80"
              >
                <ChevronRight size={11} style={{ flexShrink: 0, color: 'var(--indigo)' }} />
                {q}
              </button>
            ))}
          </div>

          <div style={{ marginTop: 20, marginBottom: 12, fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Data Sources
          </div>
          <div className="space-y-2">
            {[
              { icon: Database, label: 'Open-Meteo AQI API',  status: 'live',   color: 'var(--emerald)' },
              { icon: Database, label: 'Open-Meteo Weather',  status: 'live',   color: 'var(--emerald)' },
              { icon: Cpu,      label: 'IoT Waste Sensors',   status: 'live',   color: 'var(--emerald)' },
              { icon: Cpu,      label: 'Building SCADA',      status: 'sim',    color: 'var(--amber)' },
              { icon: Sparkles, label: 'LSTM Forecaster',     status: 'ready',  color: 'var(--indigo)' },
            ].map(({ icon: Icon, label, status, color }) => (
              <div key={label} className="flex items-center gap-2">
                <div style={{ width: 28, height: 28, borderRadius: 7, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={13} style={{ color }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11.5, color: 'var(--text-primary)', fontWeight: 600, lineHeight: 1.2 }}>{label}</div>
                </div>
                <span className={`badge ${status === 'live' ? 'badge-emerald' : status === 'sim' ? 'badge-amber' : 'badge-indigo'}`} style={{ fontSize: 8, padding: '1px 5px' }}>
                  {status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            {msgs.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: msg.role === 'user'
                      ? 'var(--grad-brand)'
                      : 'var(--grad-emerald)',
                    marginTop: 2,
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  {msg.role === 'user'
                    ? <span style={{ fontSize: 11, fontWeight: 800, color: '#fff' }}>MO</span>
                    : <Sparkles size={15} color="#fff" />}
                </div>

                {/* Bubble */}
                <div style={{ maxWidth: '75%', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div className={msg.role === 'user' ? 'chat-bubble chat-bubble-user' : 'chat-bubble chat-bubble-ai'}>
                    <div style={{ fontSize: 13.5, color: msg.role === 'user' ? '#fff' : 'var(--text-secondary)', lineHeight: 1.65, fontWeight: msg.role === 'user' ? 600 : 500 }}>
                      {renderMarkdown(msg.content)}
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)', paddingLeft: msg.role === 'user' ? 0 : 4, paddingRight: msg.role === 'user' ? 4 : 0, textAlign: msg.role === 'user' ? 'right' : 'left', fontWeight: 600 }}>
                    {msg.ts.toLocaleTimeString()}
                    {msg.sources && msg.sources.length > 0 && (
                      <span style={{ marginLeft: 8 }}>
                        {msg.sources.map(s => (
                          <span key={s} className="chip" style={{ marginLeft: 4, fontSize: 10, background: 'rgba(255,255,255,0.6)', border: '1px solid var(--border)' }}>{s}</span>
                        ))}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Thinking indicator */}
            {thinking && (
              <div className="chat-msg">
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--grad-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Sparkles size={15} color="#fff" />
                </div>
                <div className="chat-bubble chat-bubble-ai">
                  <div className="flex items-center gap-2">
                    <RefreshCw size={13} style={{ color: 'var(--indigo)', animation: 'spin 1s linear infinite' }} />
                    <span style={{ fontSize: 12.5, color: 'var(--text-muted)', fontWeight: 600 }}>Querying sensor data & generating response…</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div
            style={{
              padding: '16px 24px',
              borderTop: '1px solid var(--border)',
              background: 'rgba(255, 255, 255, 0.4)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div className="flex items-center gap-3">
              <input
                className="input"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
                placeholder="Ask about air quality, waste levels, energy, scenarios..."
                disabled={thinking}
                style={{ fontSize: 14, height: 44, background: 'rgba(255,255,255,0.9)', boxShadow: 'var(--shadow-sm)' }}
              />
              {input && (
                <button
                  onClick={() => setInput('')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: 4 }}
                >
                  <X size={14} />
                </button>
              )}
              <button
                onClick={() => send()}
                disabled={thinking || !input.trim()}
                className="btn btn-primary"
                style={{ flexShrink: 0, height: 44, paddingLeft: 20, paddingRight: 20 }}
              >
                <Send size={15} />
                Send
              </button>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8, fontWeight: 600 }}>
              Powered by real sensor data · Open-Meteo AQI · IoT mesh · LSTM forecasts
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </AppShell>
  );
}
