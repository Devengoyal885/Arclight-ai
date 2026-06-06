'use client';

import AppShell from '@/components/layout/AppShell';
import { getLeaderboard, getVerificationQueue } from '@/lib/api';
import { ArcBarChart } from '@/components/charts/Charts';
import {
  Users, Trophy, Camera, CheckCircle, XCircle, Clock,
  Star, Flame, TrendingUp, Award,
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function CitizensPage() {
  const [leaders] = useState(getLeaderboard());
  const [queue, setQueue] = useState(getVerificationQueue());

  useEffect(() => {
    const interval = setInterval(() => setQueue(getVerificationQueue()), 8000);
    return () => clearInterval(interval);
  }, []);

  const verified = queue.filter(q => q.status === 'VERIFIED').length;
  const pending  = queue.filter(q => q.status === 'PENDING').length;
  const rejected = queue.filter(q => q.status === 'REJECTED').length;

  const activityData = [
    { day: 'Mon', reports: 142, points: 6800 },
    { day: 'Tue', reports: 178, points: 8200 },
    { day: 'Wed', reports: 156, points: 7100 },
    { day: 'Thu', reports: 203, points: 9400 },
    { day: 'Fri', reports: 228, points: 10500 },
    { day: 'Sat', reports: 194, points: 8900 },
    { day: 'Sun', reports: 158, points: 7300 },
  ];

  const levelColors: Record<string, string> = {
    'Eco Champion': 'var(--amber)',
    'Green Hero':   'var(--indigo)',
    'Eco Guardian': 'var(--emerald)',
    'Green Starter':'var(--text-tertiary)',
  };

  const levelBg: Record<string, string> = {
    'Eco Champion': 'var(--amber-3)',
    'Green Hero':   'var(--indigo-3)',
    'Eco Guardian': 'var(--emerald-3)',
    'Green Starter':'rgba(148,163,184,0.1)',
  };

  return (
    <AppShell title="Citizen Participation Layer" subtitle="Gamification · YOLOv11 CV verification · Community engagement · Leaderboard">
      <div className="p-6 space-y-5">

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Active Citizens',   value: 892,     color: 'var(--indigo)', bg: 'var(--indigo-3)', icon: Users,    sub: 'This month' },
            { label: 'Total Reports',     value: '1,259', color: 'var(--emerald)', bg: 'var(--emerald-3)', icon: Camera,   sub: 'CV-verified: 94%' },
            { label: 'Points Awarded',    value: '58.4K', color: 'var(--amber)', bg: 'var(--amber-3)', icon: Trophy,   sub: 'This week' },
            { label: 'Avg Streak',        value: '7.2',   color: 'var(--rose)', bg: 'var(--rose-3)', icon: Flame,    sub: 'Days active' },
          ].map(({ label, value, color, bg, icon: Icon, sub }) => (
            <div key={label} className="card kpi-card" style={{ position: 'relative', borderTop: `3px solid ${color}` }}>
              <div className="kpi-label">{label}</div>
              <div className="kpi-value num">{value}</div>
              <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', fontWeight: 600 }}>{sub}</div>
              <div className="kpi-icon" style={{ background: bg }}><Icon size={17} style={{ color }} /></div>
            </div>
          ))}
        </div>

        {/* Leaderboard + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Leaderboard */}
          <div className="card lg:col-span-2">
            <div className="flex items-center justify-between p-5" style={{ borderBottom: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Community Leaderboard</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>Top eco-warriors this month</div>
              </div>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--amber-3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Trophy size={18} style={{ color: 'var(--amber)' }} />
              </div>
            </div>
            <div>
              {leaders.slice(0, 8).map((c, i) => (
                <div
                  key={c.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '12px 20px',
                    borderBottom: i < 7 ? '1px solid var(--border)' : 'none',
                    background: i === 0 ? 'var(--amber-3)' : i === 1 ? 'var(--indigo-3)' : 'transparent',
                  }}
                >
                  {/* Rank */}
                  <div style={{ width: 28, textAlign: 'center', flexShrink: 0 }}>
                    {i < 3
                      ? <span style={{ fontSize: 18 }}>{c.badge}</span>
                      : <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-tertiary)' }}>#{i + 1}</span>}
                  </div>

                  {/* Avatar */}
                  <div
                    style={{
                      width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                      background: i < 3 ? `linear-gradient(135deg, ${(levelColors as any)[c.level]}, ${(levelColors as any)[c.level]}CC)` : `linear-gradient(135deg, #94A3B8, #CBD5E1)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 800, color: '#fff',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    {c.avatar}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)' }}>{c.name}</div>
                    <div className="flex items-center gap-2" style={{ marginTop: 2 }}>
                      <span
                        className="badge"
                        style={{
                          fontSize: 9, padding: '1px 6px',
                          background: (levelBg as any)[c.level],
                          color: (levelColors as any)[c.level],
                          border: `1px solid ${(levelColors as any)[c.level]}30`,
                        }}
                      >
                        {c.level}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>
                        <Flame size={10} className="inline mr-0.5" style={{ color: 'var(--rose)' }} />{c.streak} day streak
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div style={{ display: 'flex', gap: 20, flexShrink: 0 }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)' }}>{c.reports}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-tertiary)', fontWeight: 600 }}>reports</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 15, fontWeight: 900, color: 'var(--amber)' }}>{c.points.toLocaleString()}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-tertiary)', fontWeight: 600 }}>points</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity chart */}
          <div className="card p-5">
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Weekly Activity</div>
            <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginBottom: 16 }}>Reports & points this week</div>
            <ArcBarChart
              data={activityData}
              xKey="day"
              bars={[{ key: 'reports', color: 'var(--indigo)', label: 'Reports' }]}
              unit=" reports"
              height={160}
            />
            <div style={{ marginTop: 16, padding: '12px 14px', borderRadius: 10, background: 'var(--emerald-3)', border: '1px solid rgba(16,185,129,0.15)' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--emerald)', marginBottom: 8 }}>Impact This Week</div>
              {[
                ['Bins reported', '1,259'],
                ['Emergency dispatches', '23'],
                ['Overflow prevented', '8 bins'],
                ['CO₂ saved', '1.2 tonnes'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between" style={{ fontSize: 12, marginTop: 5 }}>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{k}</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CV Verification queue */}
        <div className="card">
          <div className="flex items-center justify-between p-5" style={{ borderBottom: '1px solid var(--border)' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>YOLOv11 Verification Queue</div>
              <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>
                CV-powered photo verification · {verified} verified · {pending} pending · {rejected} rejected
              </div>
            </div>
            <div className="flex gap-3">
              <span className="badge badge-emerald">{verified} Verified</span>
              <span className="badge badge-amber">{pending} Pending</span>
              <span className="badge badge-rose">{rejected} Rejected</span>
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  {['Report ID', 'Type', 'Zone', 'Submitted By', 'Confidence', 'Points', 'Status', 'Time'].map(h => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {queue.map((r) => {
                  const statusColor = r.status === 'VERIFIED' ? 'var(--emerald)' : r.status === 'REJECTED' ? 'var(--rose)' : 'var(--amber)';
                  const StatusIcon = r.status === 'VERIFIED' ? CheckCircle : r.status === 'REJECTED' ? XCircle : Clock;
                  return (
                    <tr key={r.id}>
                      <td><span className="mono" style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>{r.id}</span></td>
                      <td style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)' }}>{r.type}</td>
                      <td><span className="badge badge-gray" style={{ fontSize: 10 }}>{r.zone}</span></td>
                      <td style={{ fontSize: 12.5, fontWeight: 500 }}>{r.submittedBy}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="progress-track" style={{ width: 60 }}>
                            <div
                              className="progress-fill"
                              style={{
                                width: `${r.confidence}%`,
                                background: r.confidence >= 85 ? 'var(--grad-emerald)' : r.confidence >= 60 ? 'var(--grad-amber)' : 'var(--grad-rose)',
                              }}
                            />
                          </div>
                          <span style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 700 }}>{r.confidence}%</span>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 800, color: r.points > 0 ? 'var(--amber)' : 'var(--text-tertiary)', fontSize: 13 }}>
                          {r.points > 0 ? `+${r.points}` : '—'}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-1.5">
                          <StatusIcon size={14} style={{ color: statusColor, flexShrink: 0 }} />
                          <span style={{ fontSize: 12, color: statusColor, fontWeight: 700 }}>{r.status}</span>
                        </div>
                      </td>
                      <td style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>{r.time}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AppShell>
  );
}
