'use client';

import AppShell from '@/components/layout/AppShell';
import { TWIN_SCENARIOS, CITY_ZONES_3D, getEnergyData, getWasteZones } from '@/lib/api';
import { ArcRadarChart, ArcBarChart, ArcAreaChart } from '@/components/charts/Charts';
import MapWrapper from '@/components/MapWrapper';
import { Globe2, Zap, Trash2, Wind, Thermometer, Activity, RefreshCw, Play } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function TwinPage() {
  const [scenarioId, setScenarioId] = useState('current');
  const [simulating, setSimulating] = useState(false);
  const [tick, setTick] = useState(0);

  const scenario = TWIN_SCENARIOS.find(s => s.id === scenarioId) ?? TWIN_SCENARIOS[0];
  const m = scenario.modifier;

  const baseZones = getWasteZones();
  const baseBuildings = getEnergyData(400);
  const totalEnergy = Math.round(baseBuildings.reduce((s, b) => s + b.currentKw, 0) * m);
  const totalSolar = Math.round(baseBuildings.reduce((s, b) => s + b.solarGen, 0) * (scenarioId === 'netzero' ? 2.5 : m * 0.8));
  const avgFill = Math.round(baseZones.reduce((s, z) => s + z.fillLevel, 0) / baseZones.length * m);
  const simAqi = Math.round(68 * m);
  const simTemp = scenarioId === 'heatwave' ? 40 : scenarioId === 'monsoon' ? 26 : 32;

  const radarData = [
    { subject: 'Energy',       value: Math.min(100, Math.round(100 - (totalEnergy - 6000) / 200)) },
    { subject: 'Waste',        value: Math.min(100, Math.round(100 - avgFill)) },
    { subject: 'Air Quality',  value: Math.min(100, Math.round(100 - simAqi * 0.4)) },
    { subject: 'Solar',        value: Math.min(100, Math.round((totalSolar / totalEnergy) * 100)) },
    { subject: 'Citizen',      value: 72 },
    { subject: 'Resilience',   value: scenarioId === 'netzero' ? 98 : Math.round(80 - (m - 1) * 40) },
  ];

  const timelineData = Array.from({ length: 12 }, (_, i) => ({
    hour: `${String(7 + i).padStart(2, '0')}:00`,
    energy: Math.round(totalEnergy * (0.7 + Math.sin(i / 4) * 0.3 + Math.random() * 0.1)),
    waste:  Math.round(avgFill * (1 + Math.random() * 0.1)),
    aqi:    Math.round(simAqi * (0.9 + Math.random() * 0.2)),
  }));

  const runSimulation = () => {
    setSimulating(true);
    let i = 0;
    const iv = setInterval(() => { setTick(t => t + 1); i++; if (i >= 5) { clearInterval(iv); setSimulating(false); } }, 400);
  };

  return (
    <AppShell title="Digital Twin" subtitle="3D city simulation · Scenario modeling · LSTM-powered · Real-time sync">
      <div className="p-6 space-y-5">

        {/* Scenario selector */}
        <div className="card p-4">
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>
            Simulation Scenarios
          </div>
          <div className="flex flex-wrap gap-3">
            {TWIN_SCENARIOS.map((s) => (
              <button
                key={s.id}
                onClick={() => setScenarioId(s.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 16px',
                  borderRadius: 10,
                  border: `1px solid ${scenarioId === s.id ? s.color : 'var(--border)'}`,
                  background: scenarioId === s.id ? `${s.color}15` : 'rgba(255,255,255,0.6)',
                  color: scenarioId === s.id ? s.color : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  fontWeight: scenarioId === s.id ? 800 : 600,
                  fontSize: 13,
                }}
                className={scenarioId !== s.id ? 'hover:bg-white/80' : ''}
              >
                <span>{s.icon}</span>
                <div style={{ textAlign: 'left' }}>
                  <div>{s.label}</div>
                  <div style={{ fontSize: 10, fontWeight: 500, color: scenarioId === s.id ? `${s.color}` : 'var(--text-tertiary)' }}>{s.desc}</div>
                </div>
              </button>
            ))}
            <button
              onClick={runSimulation}
              disabled={simulating}
              className="btn btn-primary"
              style={{ marginLeft: 'auto', height: 60, alignSelf: 'center' }}
            >
              {simulating ? <RefreshCw size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Play size={15} />}
              {simulating ? 'Running...' : 'Run Sim'}
            </button>
          </div>
        </div>

        {/* 3D map placeholder + KPIs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Map */}
          <div className="card lg:col-span-2" style={{ minHeight: 320, position: 'relative', overflow: 'hidden' }}>
            <div
              className="map-container"
              style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}
            >
              {/* REAL MAP COMPONENT */}
              <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
                <MapWrapper
                  center={[17.42, 78.47]} // Hyderabad center
                  zoom={12}
                  height="100%"
                  polygons={CITY_ZONES_3D.map(z => {
                    const fillPct = Math.min(100, Math.round(z.waste * m));
                    const col = fillPct >= 80 ? '#E11D48' : fillPct >= 60 ? '#D97706' : '#059669';
                    
                    // Approximate coordinates around Hyderabad based on zone
                    const baseLat = 17.42 + (Math.random() - 0.5) * 0.1;
                    const baseLng = 78.47 + (Math.random() - 0.5) * 0.1;
                    const size = 0.015;
                    
                    return {
                      id: z.id,
                      positions: [
                        [baseLat, baseLng],
                        [baseLat + size, baseLng],
                        [baseLat + size, baseLng + size],
                        [baseLat, baseLng + size]
                      ],
                      color: col,
                      fillOpacity: 0.3,
                      label: `${z.name} - Waste: ${fillPct}% | AQI: ${Math.round(z.aqi * m)}`
                    };
                  })}
                  markers={baseBuildings.slice(0, 5).map((b, i) => ({
                    id: b.id,
                    position: [17.42 + (Math.random() - 0.5) * 0.1, 78.47 + (Math.random() - 0.5) * 0.1],
                    color: '#5B5EF4',
                    label: `${b.name} - ${Math.round(b.currentKw * m)}kW`,
                    radius: 6
                  }))}
                />
              </div>

              <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 10 }}>
                <div style={{
                  padding: '8px 14px', borderRadius: 10,
                  background: `${scenario.color}15`, border: `1px solid ${scenario.color}35`,
                  fontSize: 13, fontWeight: 800, color: scenario.color,
                }}>
                  {scenario.icon} {scenario.label}
                </div>
              </div>
              <div style={{ position: 'absolute', bottom: 16, right: 16, zIndex: 10, display: 'flex', gap: 8 }}>
                {[
                  { color: 'var(--emerald)', label: 'Low Risk' },
                  { color: 'var(--amber)', label: 'Medium' },
                  { color: 'var(--rose)', label: 'Critical' },
                ].map(({ color, label }) => (
                  <div key={label} className="flex items-center gap-1.5" style={{ padding: '4px 10px', borderRadius: 6, background: 'rgba(255,255,255,0.9)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-xs)' }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: color }} />
                    <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 600 }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Radar */}
          <div className="card p-5">
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>City Health Radar</div>
            <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginBottom: 4 }}>Scenario: {scenario.label}</div>
            <ArcRadarChart data={radarData} color={scenario.color} height={220} />
            <div className="space-y-1 mt-2">
              {radarData.map(d => (
                <div key={d.subject} className="flex items-center gap-2">
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)', width: 80, fontWeight: 600 }}>{d.subject}</div>
                  <div className="progress-track" style={{ flex: 1 }}>
                    <div
                      className="progress-fill"
                      style={{
                        width: `${d.value}%`,
                        background: d.value >= 70 ? 'var(--grad-emerald)' : d.value >= 40 ? 'var(--grad-amber)' : 'var(--grad-rose)',
                      }}
                    />
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 700, width: 32, textAlign: 'right' }}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Simulation KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Sim Energy', value: `${totalEnergy.toLocaleString()} kW`, color: 'var(--amber)', bg: 'var(--amber-3)', icon: Zap },
            { label: 'Sim Solar',  value: `${totalSolar.toLocaleString()} kW`,  color: 'var(--emerald)', bg: 'var(--emerald-3)', icon: Activity },
            { label: 'Sim Waste',  value: `${avgFill}%`,                        color: avgFill > 70 ? 'var(--rose)' : 'var(--indigo)', bg: avgFill > 70 ? 'var(--rose-3)' : 'var(--indigo-3)', icon: Trash2 },
            { label: 'Sim AQI',    value: simAqi,                               color: simAqi > 150 ? 'var(--rose)' : simAqi > 100 ? 'var(--amber)' : 'var(--emerald)', bg: simAqi > 150 ? 'var(--rose-3)' : simAqi > 100 ? 'var(--amber-3)' : 'var(--emerald-3)', icon: Wind },
          ].map(({ label, value, color, bg, icon: Icon }) => (
            <div key={label} className="card kpi-card" style={{ position: 'relative', borderTop: `3px solid ${color}` }}>
              <div className="kpi-label">{label}</div>
              <div className="kpi-value num">{value}</div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 600 }}>{scenario.label}</div>
              <div className="kpi-icon" style={{ background: bg }}><Icon size={17} style={{ color }} /></div>
            </div>
          ))}
        </div>

        {/* Timeline forecast */}
        <div className="card p-5">
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>12-Hour Simulation Timeline</div>
          <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginBottom: 16 }}>
            Scenario: {scenario.label} · LSTM + Physics hybrid model · {simulating ? 'Running...' : 'Ready'}
          </div>
          <ArcAreaChart data={timelineData} dataKey="energy" xKey="hour" color={scenario.color} unit=" kW" height={180} name="Simulated Energy" />
        </div>

        {/* Zone comparison */}
        <div className="card p-5">
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Zone Impact — {scenario.label}</div>
          <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginBottom: 16 }}>Waste fill level projection under this scenario</div>
          <ArcBarChart
            data={CITY_ZONES_3D.map(z => ({
              name: z.name.split(' ')[0],
              fill: Math.min(100, Math.round(z.waste * m)),
              aqi: Math.round(z.aqi * m * 0.5),
            }))}
            xKey="name"
            bars={[
              { key: 'fill', color: scenario.color, label: 'Waste Fill %' },
            ]}
            unit="%"
            height={160}
          />
        </div>

      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </AppShell>
  );
}
