'use client';

import AppShell from '@/components/layout/AppShell';

import { ArcAreaChart, ArcDonutChart, ArcBarChart } from '@/components/charts/Charts';
import MapWrapper from '@/components/MapWrapper';
import { getWasteZones, getRouteData, fetchWeather } from '@/lib/api';
import { useState, useEffect } from 'react';
import {
  Trash2, MapPin, Truck, AlertTriangle, CheckCircle, Clock, RefreshCw,
  TrendingDown, Flame, Navigation, Cpu, Thermometer, Droplets,
} from 'lucide-react';

function FillBar({ value, threshold = 80 }: { value: number; threshold?: number }) {
  const color = value >= threshold ? 'var(--rose)' : value >= 60 ? 'var(--amber)' : 'var(--emerald)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div className="progress-track" style={{ flex: 1 }}>
        <div
          className="progress-fill"
          style={{
            width: `${value}%`,
            background: value >= threshold
              ? 'var(--grad-rose)'
              : value >= 60
                ? 'var(--grad-amber)'
                : 'var(--grad-emerald)',
          }}
        />
      </div>
      <span style={{ fontSize: 12.5, fontWeight: 700, color, minWidth: 36, textAlign: 'right' }}>{value}%</span>
    </div>
  );
}

export default function WastePage() {
  const [zones, setZones] = useState(getWasteZones());
  const [routes] = useState(getRouteData());
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [weatherTemp, setWeatherTemp] = useState(33);
  const [weatherRain, setWeatherRain] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    // Fetch real weather first, then couple to waste zones
    fetchWeather().then(w => {
      setWeatherTemp(w.temperature);
      setWeatherRain(w.precipitation);
      setZones(getWasteZones(w.temperature, w.precipitation));
    });
    const interval = setInterval(() => {
      setZones(getWasteZones(weatherTemp, weatherRain));
      setLastUpdate(new Date());
      setTick(t => t + 1);
    }, 6000);
    return () => clearInterval(interval);
  }, [weatherTemp, weatherRain]);


  const avgFill = Math.round(zones.reduce((s, z) => s + z.fillLevel, 0) / zones.length);
  const critical = zones.filter(z => z.fillLevel >= 80);
  const ok = zones.filter(z => z.fillLevel < 50);

  const trendData = Array.from({ length: 24 }, (_, i) => ({
    time: `${String(i).padStart(2, '0')}:00`,
    fill: Math.round(45 + Math.sin((i / 24) * Math.PI * 2) * 20 + Math.random() * 8),
  }));

  const donutData = [
    { name: 'Low', value: ok.length, color: '#10B981' },
    { name: 'Medium', value: zones.filter(z => z.fillLevel >= 50 && z.fillLevel < 80).length, color: '#F59E0B' },
    { name: 'Critical', value: critical.length, color: '#E11D48' },
  ];

  return (
    <AppShell
      title="Smart Waste Intelligence"
      subtitle="CV fill-level detection · IoT sensors · AI route optimization · 6h predictions"
    >
      <div className="p-6 space-y-5">

        {/* Weather coupling banner */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl" style={{ background: 'var(--emerald-3)', border: '1px solid rgba(16,185,129,0.2)' }}>
          <span className="dot dot-live" />
          <span style={{ fontSize: 12.5, color: 'var(--emerald)', fontWeight: 700 }}>
            Live Weather-Coupled Simulation — Open-Meteo API
          </span>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            <Thermometer size={11} className="inline mr-1" />{weatherTemp}°C
            {weatherRain > 0 && <span className="ml-2"><Droplets size={11} className="inline mr-1" />{weatherRain}mm rain — fill levels elevated</span>}
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 'auto' }}>
            Heat effect: +{Math.max(0, (weatherTemp - 30) * 0.5).toFixed(1)}% fill/zone
          </span>
        </div>

        {/* Critical alert */}

        {critical.length > 0 && (
          <div className="alert alert-danger">
            <Flame size={15} style={{ color: 'var(--rose)', flexShrink: 0, marginTop: 1 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--rose)' }}>
                {critical.length} Zone{critical.length > 1 ? 's' : ''} Critical — Overflow Risk
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 2 }}>
                {critical.map(z => z.name).join(' · ')} — Collection dispatched
              </div>
            </div>
          </div>
        )}

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Avg Fill Level',    value: `${avgFill}%`, color: avgFill >= 70 ? '#E11D48' : '#059669', bg: avgFill >= 70 ? '#FFE4E6' : '#D1FAE5', icon: Trash2, sub: 'City-wide average' },
            { label: 'Critical Zones',    value: critical.length, color: '#E11D48', bg: '#FFE4E6', icon: AlertTriangle, sub: '>80% capacity' },
            { label: 'Zones OK',          value: ok.length,       color: '#059669', bg: '#D1FAE5', icon: CheckCircle,   sub: '<50% capacity' },
            { label: 'Collections Today', value: routes.filter(r => r.status === 'COMPLETED').length * 3 + 14, color: '#5B5EF4', bg: '#E0E1FF', icon: Truck, sub: 'Next: Route A in 8m' },
          ].map(({ label, value, color, bg, icon: Icon, sub }) => (
            <div key={label} className="card kpi-card" style={{ position: 'relative', borderTop: `3px solid ${color}` }}>
              <div className="kpi-label">{label}</div>
              <div className="kpi-value num">{value}</div>
              <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>{sub}</div>
              <div className="kpi-icon" style={{ background: bg }}><Icon size={17} style={{ color }} /></div>
            </div>
          ))}
        </div>

        {/* Live Map */}
        <div className="card p-1" style={{ height: 350 }}>
          <MapWrapper
            center={[17.42, 78.47]}
            zoom={12}
            height="100%"
            markers={zones.map(z => {
              const col = z.fillLevel >= 80 ? '#E11D48' : z.fillLevel >= 60 ? '#D97706' : '#059669';
              // Generate stable pseudo-random coordinate based on name
              const hash = z.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
              const lat = 17.42 + (Math.sin(hash) * 0.08);
              const lng = 78.47 + (Math.cos(hash) * 0.08);
              return {
                id: z.id,
                position: [lat, lng],
                color: col,
                label: `${z.name}: ${z.fillLevel}% Full`,
                radius: z.fillLevel >= 80 ? 10 : 7
              };
            })}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="card p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>24-Hour Fill Level Trend</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>Average across all monitored zones · Auto-refresh 6s</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="badge badge-emerald"><span className="dot dot-live" style={{ width: 4, height: 4 }} />LIVE IOT</span>
                <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Updated {lastUpdate.toLocaleTimeString()}</span>
              </div>
            </div>
            <ArcAreaChart data={trendData} dataKey="fill" xKey="time" color="#5B5EF4" unit="%" height={200} name="Fill Level" />
          </div>

          <div className="card p-5">
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Zone Distribution</div>
            <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginBottom: 12 }}>Zones by capacity level</div>
            <ArcDonutChart data={donutData} centerLabel="Total Zones" centerValue={`${zones.length}`} height={160} innerRadius={44} outerRadius={72} />
            <div className="space-y-1 mt-3">
              {donutData.map((d) => (
                <div key={d.name} className="flex justify-between items-center" style={{ fontSize: 12 }}>
                  <div className="flex items-center gap-2">
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{d.name}</span>
                  </div>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{d.value} zones</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Zone table */}
        <div className="card">
          <div className="flex items-center justify-between p-5" style={{ borderBottom: '1px solid rgba(99,102,241,0.1)' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Zone Status — Live Feed</div>
              <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>All {zones.length} zones monitored · Threshold at 80%</div>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw size={13} style={{ color: 'var(--text-tertiary)' }} />
              <span style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>Auto-refresh 6s</span>
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  {['Zone', 'Type', 'Fill Level', 'Priority', 'Last Collect', 'Next Collect', 'Temp'].map(h => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {zones.map((z) => {
                  return (
                    <tr key={z.id}>
                      <td>
                        <div className="flex items-center gap-2">
                          <MapPin size={12} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 13 }}>{z.name}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{z.id} · {z.area}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${z.type === 'Hazardous' ? 'badge-rose' : z.type === 'Recyclable' ? 'badge-emerald' : 'badge-gray'}`} style={{ fontSize: 10 }}>
                          {z.type}
                        </span>
                      </td>
                      <td style={{ minWidth: 160 }}>
                        <FillBar value={z.fillLevel} />
                      </td>
                      <td>
                        <span
                          className={`badge ${z.priority === 'HIGH' ? 'badge-rose' : z.priority === 'MEDIUM' ? 'badge-amber' : 'badge-emerald'}`}
                        >
                          {z.priority}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-1.5">
                          <Clock size={11} style={{ color: 'var(--text-tertiary)' }} />
                          <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>{z.lastCollection}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: 12.5, color: 'var(--text-primary)', fontWeight: 700 }}>{z.nextCollection}</div>
                      </td>
                      <td>
                        <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>{z.temperature}°C</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Route optimization */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>AI Route Optimization</div>
              <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>OR-Tools VRP · Fuel minimization · Dynamic rerouting</div>
            </div>
            <span className="badge badge-indigo"><Cpu size={10} />OR-TOOLS VRP</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {routes.map((r) => {
              const statusColor = r.status === 'ACTIVE' ? 'var(--indigo)' : r.status === 'COMPLETED' ? 'var(--emerald)' : 'var(--amber)';
              const badgeClass = r.status === 'ACTIVE' ? 'badge-indigo' : r.status === 'COMPLETED' ? 'badge-emerald' : 'badge-amber';
              return (
                <div
                  key={r.id}
                  className="card"
                  style={{ padding: 16, borderLeft: `4px solid ${statusColor}` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: 15 }}>{r.id}</div>
                    <span className={`badge ${badgeClass}`}>
                      {r.status}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 10 }}>Zones: {r.zones}</div>
                  <div className="space-y-1.5">
                    {[
                      { icon: Trash2,     label: 'Bins',       value: r.bins },
                      { icon: Navigation, label: 'Distance',   value: `${r.distance} km` },
                      { icon: Clock,      label: 'ETA',        value: r.time },
                      { icon: Truck,      label: 'Truck',      value: r.truck },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="flex justify-between items-center" style={{ fontSize: 12 }}>
                        <div className="flex items-center gap-1.5" style={{ color: 'var(--text-tertiary)' }}>
                          <Icon size={11} />
                          {label}
                        </div>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{value}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <div className="flex justify-between" style={{ fontSize: 11, marginBottom: 4 }}>
                      <span style={{ color: 'var(--text-tertiary)' }}>Efficiency</span>
                      <span style={{ color: statusColor, fontWeight: 800 }}>{r.efficiency}%</span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${r.efficiency}%`, background: statusColor }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fill level bar chart */}
        <div className="card p-5">
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Fill Level by Zone</div>
          <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginBottom: 16 }}>Current snapshot · Red threshold at 80%</div>
          <ArcBarChart
            data={zones.map(z => ({ id: z.id, fill: z.fillLevel }))}
            xKey="id"
            bars={[{ key: 'fill', color: '#5B5EF4', label: 'Fill %' }]}
            unit="%"
            height={160}
          />
        </div>

      </div>
    </AppShell>
  );
}
