'use client';

import AppShell from '@/components/layout/AppShell';
import { ArcAreaChart, ArcDonutChart, ArcBarChart } from '@/components/charts/Charts';
import {
  getCityKPIs, getWasteZones, getEnergyData, getEnergyTimeSeries, getCityTimeline, getWeatherIcon,
} from '@/lib/api';
import {
  Activity, Trash2, Zap, Globe2, MessageSquareText, Users, Wind,
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Leaf, Cpu,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const MODULES = [
  { label: 'Smart Waste',      icon: Trash2,           href: '/waste',    color: '#059669', bg: '#D1FAE5', badge: 'LIVE',  desc: '8 zones · IoT fill sensors' },
  { label: 'Smart Energy',     icon: Zap,              href: '/energy',   color: '#D97706', bg: '#FEF3C7', badge: 'LIVE',  desc: '6 buildings · Solar + HVAC' },
  { label: 'Digital Twin',     icon: Globe2,           href: '/twin',     color: '#5B5EF4', bg: '#E0E1FF', badge: 'SYNC',  desc: '3D city simulation' },
  { label: 'AI Copilot',       icon: MessageSquareText,href: '/copilot',  color: '#0891B2', bg: '#CFFAFE', badge: 'RAG',   desc: 'LLM + sensor knowledge base' },
  { label: 'Citizen Layer',    icon: Users,            href: '/citizens', color: '#EA580C', bg: '#FFF7ED', badge: 'LIVE',  desc: '158 reports · CV-verified' },
  { label: 'AirSense',         icon: Wind,             href: '/airsense', color: '#E11D48', bg: '#FFE4E6', badge: 'ALERT', desc: 'Real AQI · Open-Meteo API' },
];

function KpiCard({
  label, value, unit = '', trend, trendLabel, color, bg, icon: Icon, sub,
}: {
  label: string; value: string | number; unit?: string; trend?: number; trendLabel?: string;
  color: string; bg: string; icon: any; sub?: string;
}) {
  return (
    <div className="card card-kpi kpi-card" style={{ position: 'relative', borderTop: `3px solid ${color}` }}>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value num">
        {value}
        <span style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-tertiary)' }}>{unit ? ` ${unit}` : ''}</span>
      </div>
      {trend !== undefined && (
        <div className="kpi-trend" style={{ color: trend >= 0 ? 'var(--emerald)' : 'var(--rose)' }}>
          {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(trend)}% {trendLabel}
        </div>
      )}
      {sub && <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{sub}</div>}
      <div className="kpi-icon" style={{ background: bg }}>
        <Icon size={17} style={{ color }} />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [kpis, setKpis] = useState<any>(null);
  const [zones, setZones] = useState(getWasteZones());
  const [energy] = useState(getEnergyTimeSeries(24));
  const [timeline, setTimeline] = useState(getCityTimeline());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCityKPIs().then(k => {
      setKpis(k);
      setZones(getWasteZones(k.temperature, k.precipitation));
      setTimeline(getCityTimeline(k.temperature, k.cityAqi ?? k.sustainabilityScore));
      setLoading(false);
    });
    const iv = setInterval(async () => {
      const k = await getCityKPIs();
      setKpis(k);
      setZones(getWasteZones(k.temperature, k.precipitation));
      setTimeline(getCityTimeline(k.temperature, k.cityAqi ?? k.sustainabilityScore));
    }, 30000);
    return () => clearInterval(iv);
  }, []);

  const wasteDonut = zones.length ? [
    { name: 'Low', value: zones.filter(z => z.fillLevel < 50).length, color: '#10B981' },
    { name: 'Medium', value: zones.filter(z => z.fillLevel >= 50 && z.fillLevel < 80).length, color: '#F59E0B' },
    { name: 'Critical', value: zones.filter(z => z.fillLevel >= 80).length, color: '#E11D48' },
  ] : [];

  const typeColors: Record<string, string> = { info: '#0891B2', success: '#059669', warning: '#D97706', danger: '#E11D48' };

  return (
    <AppShell title="Command Center" subtitle="Real-time city sustainability intelligence — ArcLight AI 2.0">
      <div className="p-6 space-y-5">

        {/* Alert */}
        {kpis?.criticalZones > 0 && (
          <div className="alert alert-warn">
            <AlertTriangle size={15} style={{ color: 'var(--amber)', flexShrink: 0, marginTop: 1 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--amber)' }}>
                {kpis.criticalZones} Critical Waste Zone{kpis.criticalZones > 1 ? 's' : ''}
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 2 }}>
                Collection vehicles dispatched. Avg fill: {kpis.avgFillLevel}%
              </div>
            </div>
            <Link href="/waste" className="btn btn-secondary" style={{ fontSize: 12, padding: '5px 14px', marginLeft: 'auto', flexShrink: 0 }}>
              View →
            </Link>
          </div>
        )}

        {/* KPI Row 1 */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>
            City Intelligence Overview
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {loading ? (
              [1,2,3,4].map(i => (
                <div key={i} className="card" style={{ height: 120 }}>
                  <div className="skeleton" style={{ height: '100%', borderRadius: 18 }} />
                </div>
              ))
            ) : (
              <>
                <KpiCard label="Sustainability Score" value={kpis?.sustainabilityScore ?? '--'} unit="/100" trend={2.4}  trendLabel="vs yesterday" color="#5B5EF4" bg="#E0E1FF" icon={Activity} />
                <KpiCard label="CO₂ Saved Today"      value={(kpis?.co2Saved ?? 0).toLocaleString()} unit="kg"  trend={8.1}  trendLabel="vs last week" color="#059669" bg="#D1FAE5" icon={Leaf} />
                <KpiCard label="Solar Generated"      value={(kpis?.solarGeneration ?? 0).toLocaleString()} unit="kW" trend={3.7}  trendLabel="vs baseline" color="#D97706" bg="#FEF3C7" icon={Zap} />
                <KpiCard label="Waste Recycled"       value={kpis?.wasteRecycled ?? '--'}  unit="%" trend={-1.2} trendLabel="vs target"   color="#EA580C" bg="#FFF7ED" icon={Trash2} />
              </>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <KpiCard label="Active Sensors"   value={kpis?.activeSensors ?? '247'} sub="City-wide IoT mesh"          color="#0891B2" bg="#CFFAFE" icon={Cpu}      />
            <KpiCard label="Temperature"      value={kpis?.temperature ? `${kpis.temperature}°C` : '--'} sub="Open-Meteo · Real weather"  color="#E11D48" bg="#FFE4E6" icon={Activity} />
            <KpiCard label="Humidity"         value={kpis?.humidity ? `${kpis.humidity}%` : '--'}  sub="Real-time measurement"      color="#7C3AED" bg="#EDE9FE" icon={Activity} />
            <KpiCard label="Trees Equivalent" value={(kpis?.treesEquivalent ?? 4800).toLocaleString()} sub="CO₂ offset this month"   color="#059669" bg="#D1FAE5" icon={Leaf}      />
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Energy Consumption</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>24h city-wide kW</div>
              </div>
              <span className="badge badge-amber">FORECAST</span>
            </div>
            <ArcAreaChart data={energy} dataKey="consumption" xKey="time" color="#D97706" unit=" kW" height={150} name="Consumption" />
          </div>
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Solar Generation</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>All buildings combined</div>
              </div>
              <span className="badge badge-emerald"><span className="dot dot-live" style={{ width: 4, height: 4 }} />LIVE</span>
            </div>
            <ArcAreaChart data={energy} dataKey="solar" xKey="time" color="#059669" unit=" kW" height={150} name="Solar" />
          </div>
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Waste Distribution</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>By fill level</div>
              </div>
            </div>
            <ArcDonutChart data={wasteDonut} centerLabel="Zones" centerValue={`${zones.length}`} height={150} innerRadius={44} outerRadius={70} />
            <div className="flex justify-center gap-4 mt-2">
              {wasteDonut.map(d => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color }} />
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modules + Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>
              Module Status
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {MODULES.map((mod) => {
                const Icon = mod.icon;
                return (
                  <Link
                    key={mod.label}
                    href={mod.href}
                    className="card card-hover"
                    style={{ padding: 18, display: 'block', textDecoration: 'none', borderLeft: `3px solid ${mod.color}` }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: mod.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-xs)' }}>
                        <Icon size={16} style={{ color: mod.color }} />
                      </div>
                      <span
                        className={`badge badge-${mod.badge === 'ALERT' ? 'rose' : mod.badge === 'LIVE' ? 'emerald' : mod.badge === 'SYNC' ? 'indigo' : 'cyan'}`}
                        style={{ fontSize: 8.5 }}
                      >
                        {mod.badge}
                      </span>
                    </div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 3 }}>{mod.label}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{mod.desc}</div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="dot dot-live" />
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Live Activity Feed</div>
            </div>
            <div style={{ maxHeight: 330, overflowY: 'auto' }} className="space-y-0">
              {timeline.map((event, i) => {
                const color = typeColors[event.type];
                return (
                  <div key={i} style={{ display: 'flex', gap: 10, paddingBottom: 12, marginBottom: 12, borderBottom: i < timeline.length - 1 ? '1px solid rgba(99,102,241,0.08)' : 'none' }}>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', flexShrink: 0, marginTop: 1, background: `${color}15`, border: `1.5px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {event.type === 'danger'  && <AlertTriangle size={11} style={{ color }} />}
                      {event.type === 'warning' && <AlertTriangle size={11} style={{ color }} />}
                      {event.type === 'success' && <CheckCircle size={11} style={{ color }} />}
                      {event.type === 'info'    && <Activity size={11} style={{ color }} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, color: 'var(--text-primary)', lineHeight: 1.4, marginBottom: 3 }}>{event.msg}</div>
                      <div style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>
                        <span className="badge badge-gray" style={{ fontSize: 8.5, padding: '1px 5px', marginRight: 4 }}>{event.module}</span>
                        {event.time}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Zone bar */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Waste Zone Fill Levels</div>
              <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>All 8 monitored zones · Threshold at 80%</div>
            </div>
            <Link href="/waste" className="btn btn-secondary" style={{ fontSize: 12, padding: '6px 14px' }}>Full View →</Link>
          </div>
          <ArcBarChart
            data={zones.map(z => ({ name: z.id, fill: z.fillLevel }))}
            xKey="name"
            bars={[{ key: 'fill', color: '#5B5EF4', label: 'Fill %' }]}
            unit="%" height={160}
          />
        </div>

      </div>
    </AppShell>
  );
}
