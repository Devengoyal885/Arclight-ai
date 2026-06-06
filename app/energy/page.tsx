'use client';

import AppShell from '@/components/layout/AppShell';
import { ArcComposedChart, ArcAreaChart, ArcBarChart } from '@/components/charts/Charts';
import { getEnergyData, getEnergyTimeSeries, fetchSolar, fetchWeather } from '@/lib/api';
import { useState, useEffect } from 'react';
import { Zap, Building2, Sun, AlertTriangle, TrendingDown, TrendingUp, Cpu } from 'lucide-react';

export default function EnergyPage() {
  const [buildings, setBuildings] = useState(() => getEnergyData(400, 33, 7));
  const [timeSeries] = useState(() => getEnergyTimeSeries(24));
  const [solar, setSolar] = useState<{ radiation: number; sunshine_duration: number; directNormalIrradiance: number; source: string } | null>(null);
  const [weatherTemp, setWeatherTemp] = useState(33);
  const [weatherUV,   setWeatherUV]   = useState(7);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    // Fetch both solar and weather for real temperature-coupled energy model
    Promise.all([fetchSolar(), fetchWeather()]).then(([s, w]) => {
      setSolar(s);
      setWeatherTemp(w.temperature);
      setWeatherUV(w.uvIndex);
      setBuildings(getEnergyData(s.radiation, w.temperature, w.uvIndex));
    });
    const interval = setInterval(async () => {
      const [s, w] = await Promise.all([fetchSolar(), fetchWeather()]);
      setSolar(s);
      setWeatherTemp(w.temperature);
      setWeatherUV(w.uvIndex);
      setBuildings(getEnergyData(s.radiation, w.temperature, w.uvIndex));
      setLastUpdate(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const totalKw = buildings.reduce((s, b) => s + b.currentKw, 0);
  const totalSolar = buildings.reduce((s, b) => s + b.solarGen, 0);
  const avgOccupancy = Math.round(buildings.reduce((s, b) => s + b.occupancy, 0) / buildings.length);
  const avgEfficiency = Math.round(buildings.reduce((s, b) => s + b.efficiency, 0) / buildings.length);
  const anomalies = buildings.filter((b) => b.anomaly);
  const solarPercent = Math.round((totalSolar / totalKw) * 100);

  const getEffColor = (e: number) => e >= 85 ? 'var(--emerald)' : e >= 70 ? 'var(--amber)' : 'var(--rose)';
  const getEffBg = (e: number) => e >= 85 ? 'var(--emerald-3)' : e >= 70 ? 'var(--amber-3)' : 'var(--rose-3)';

  return (
    <AppShell
      title="Smart Energy Intelligence"
      subtitle={`HVAC temp-coupled: ${weatherTemp}°C · Solar: ${solar?.radiation ?? '--'} W/m² · UV: ${weatherUV} · Source: ${solar?.source ?? 'loading'}`}
    >
      <div className="p-6 space-y-5">

        {/* Solar source badge */}
        {solar?.source === 'real' && (
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl" style={{ background: 'var(--amber-3)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <Sun size={14} style={{ color: 'var(--amber)', flexShrink: 0 }} />
            <span style={{ fontSize: 12.5, color: 'var(--amber-2)', fontWeight: 700 }}>Live Solar + Weather Data — Open-Meteo API</span>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              Radiation: {solar.radiation} W/m² · DNI: {solar.directNormalIrradiance} W/m² · Sunshine today: {solar.sunshine_duration} min · Temp: {weatherTemp}°C · UV: {weatherUV}
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 'auto' }}>Updated: {lastUpdate.toLocaleTimeString()}</span>
          </div>
        )}


        {/* Anomaly alerts */}
        {anomalies.length > 0 && (
          <div className="alert alert-warn">
            <AlertTriangle size={15} style={{ color: 'var(--amber)', flexShrink: 0, marginTop: 1 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--amber-2)' }}>
                {anomalies.length} Anomaly Detected by Isolation Forest
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 2 }}>
                {anomalies.map(a => `${a.name}: ${a.anomalyType}`).join(' · ')}
              </div>
            </div>
          </div>
        )}

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Consumption', value: totalKw.toLocaleString(), unit: 'kW',  color: '#F59E0B', bg: '#FEF3C7', icon: Zap,         trend: -5.3 },
            { label: 'Solar Generated',   value: totalSolar.toLocaleString(), unit: 'kW', color: '#10B981', bg: '#D1FAE5', icon: Sun,        trend: solarPercent },
            { label: 'Avg Occupancy',     value: avgOccupancy, unit: '%',         color: '#5B5EF4', bg: '#E0E1FF', icon: Building2, trend: undefined },
            { label: 'Grid Efficiency',   value: avgEfficiency, unit: '%',        color: '#0891B2', bg: '#CFFAFE', icon: Cpu,       trend: 2.1 },
          ].map(({ label, value, unit, color, bg, icon: Icon, trend }) => (
            <div key={label} className="card kpi-card" style={{ position: 'relative', borderTop: `3px solid ${color}` }}>
              <div className="kpi-label">{label}</div>
              <div className="kpi-value num">{value}<span style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-secondary)' }}> {unit}</span></div>
              {trend !== undefined && (
                <div className="kpi-trend" style={{ color: trend >= 0 ? 'var(--emerald)' : 'var(--rose)' }}>
                  {trend >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                  {Math.abs(trend)}%
                </div>
              )}
              <div className="kpi-icon" style={{ background: bg }}><Icon size={17} style={{ color }} /></div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="card p-5">
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>24h Consumption vs Solar</div>
            <div className="flex items-center gap-3 mb-4" style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
              <span>kW · LSTM-predicted · Solar-actual</span>
              <span className="badge badge-amber" style={{ fontSize: 9 }}>LSTM MODEL</span>
            </div>
            <ArcComposedChart
              data={timeSeries}
              xKey="time"
              unit=" kW"
              height={220}
              areas={[{ key: 'consumption', color: '#F59E0B', label: 'Consumption' }]}
              lines={[
                { key: 'predicted', color: '#5B5EF4', label: 'Predicted', dashed: true },
                { key: 'solar', color: '#10B981', label: 'Solar' },
              ]}
            />
            <div className="flex gap-4 mt-2">
              {[{ color: '#F59E0B', label: 'Actual' }, { color: '#5B5EF4', label: 'Predicted' }, { color: '#10B981', label: 'Solar' }].map((l) => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div style={{ width: 12, height: 3, borderRadius: 2, background: l.color }} />
                  <span style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Net Grid Load (Demand - Solar)</div>
            <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginBottom: 16 }}>Actual grid draw after solar offset · kW</div>
            <ArcAreaChart
              data={timeSeries.slice(-12).map((t) => ({ time: t.time, net: t.net }))}
              dataKey="net"
              xKey="time"
              color="#F43F5E"
              unit=" kW"
              height={220}
              name="Net Load"
            />
          </div>
        </div>

        {/* Buildings */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Building Intelligence Dashboard</div>
              <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>Occupancy-driven HVAC · Isolation Forest anomaly detection</div>
            </div>
            <span className="badge badge-emerald"><span className="dot dot-live" style={{ width: 4, height: 4 }} />Live</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {buildings.map((b) => (
              <div
                key={b.id}
                className="card"
                style={{
                  padding: 18,
                  borderTop: b.anomaly ? '3px solid var(--rose)' : `3px solid ${getEffColor(b.efficiency)}`,
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--amber-3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Building2 size={15} style={{ color: 'var(--amber)' }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>{b.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{b.floors}F · {b.area.toLocaleString()} m²</div>
                    </div>
                  </div>
                  {b.anomaly && (
                    <span className="badge badge-rose" style={{ fontSize: 9 }}>
                      <AlertTriangle size={9} />ANOMALY
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-2 mb-3">
                  <span style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>{b.currentKw.toLocaleString()}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>kW</span>
                  <span style={{ fontSize: 11, color: 'var(--text-tertiary)', marginLeft: 'auto' }}>Base: {b.baseline}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[
                    { label: 'Occupancy',  value: `${b.occupancy}%`,  color: b.occupancy > 60 ? 'var(--amber)' : 'var(--emerald)' },
                    { label: 'Efficiency', value: `${b.efficiency}%`, color: getEffColor(b.efficiency) },
                    { label: 'Solar Gen', value: `${b.solarGen}kW`,   color: 'var(--emerald)' },
                  ].map(({ label, value, color }) => (
                    <div key={label} style={{ textAlign: 'center', padding: '8px 4px', borderRadius: 8, background: 'rgba(255,255,255,0.5)', border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginBottom: 3, fontWeight: 600 }}>{label}</div>
                      <div style={{ fontSize: 13, fontWeight: 800, color }}>{value}</div>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex justify-between" style={{ fontSize: 11, marginBottom: 4 }}>
                    <span style={{ color: 'var(--text-tertiary)' }}>Efficiency</span>
                    <span style={{ color: getEffColor(b.efficiency), fontWeight: 700 }}>{b.efficiency}%</span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${b.efficiency}%`,
                        background: b.efficiency >= 85
                          ? 'var(--grad-emerald)'
                          : b.efficiency >= 70
                            ? 'var(--grad-amber)'
                            : 'var(--grad-rose)',
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly savings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="card p-5">
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Anomaly Detection Log</div>
            <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginBottom: 16 }}>Isolation Forest ML model · Auto-corrected</div>
            <div className="space-y-2">
              {[
                { building: 'Airport Terminal', time: '08:40', type: 'HVAC Surge',       delta: '+34%', severity: 'high' },
                { building: 'Trade Tower',      time: '07:15', type: 'After-hours Load', delta: '+18%', severity: 'medium' },
                { building: 'GHMC HQ',         time: '06:30', type: 'Equipment Idle',   delta: '+9%',  severity: 'low' },
              ].map((a, i) => {
                const c = a.severity === 'high' ? 'var(--rose)' : a.severity === 'medium' ? 'var(--amber)' : 'var(--text-tertiary)';
                return (
                  <div key={i} className="flex items-center gap-3" style={{ padding: '10px 12px', borderRadius: 10, background: `rgba(255,255,255,0.6)`, border: `1px solid rgba(99,102,241,0.1)` }}>
                    <AlertTriangle size={13} style={{ color: c, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-primary)' }}>{a.building} — {a.type}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{a.time} · Auto-corrected</div>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--amber)' }}>{a.delta}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card p-5">
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Monthly Savings Progress</div>
            <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginBottom: 16 }}>AI-driven optimization vs baseline</div>
            <div className="space-y-4">
              {[
                { label: 'HVAC Optimization', current: 78, target: 100, unit: 'MWh', color: '#5B5EF4' },
                { label: 'Lighting Control',  current: 45, target: 60,  unit: 'MWh', color: '#10B981' },
                { label: 'Solar Integration', current: 32, target: 50,  unit: 'MWh', color: '#F59E0B' },
                { label: 'Peak Shaving',      current: 19, target: 30,  unit: 'MWh', color: '#8B5CF6' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between" style={{ fontSize: 12.5, marginBottom: 6 }}>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{item.label}</span>
                    <span style={{ color: item.color, fontWeight: 800 }}>{item.current}/{item.target} {item.unit}</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${(item.current / item.target) * 100}%`, background: item.color }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, padding: '12px 14px', borderRadius: 10, background: 'var(--emerald-3)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--emerald)', marginBottom: 8 }}>This Month's Impact</div>
              {[['Total saved', '174 MWh'], ['CO₂ avoided', '87.4 tonnes'], ['Cost saved', '₹14.2 Lakh']].map(([k, v]) => (
                <div key={k} className="flex justify-between" style={{ fontSize: 12, marginTop: 4 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{k}</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
