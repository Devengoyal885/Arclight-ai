'use client';

import AppShell from '@/components/layout/AppShell';
import { AlertTriangle, CheckCircle, Info, Zap, Wind, Trash2, Globe2, Users, Bell } from 'lucide-react';
import { useState } from 'react';

const ALERTS = [
  { id: 1, type: 'danger',  title: 'AQI Alert — Highway Junction',      msg: 'PM2.5 at 148 μg/m³ (Unhealthy). Sensitive groups advisory issued. Wind dispersion expected in 2 hours.', time: '8m ago',   module: 'AirSense', icon: Wind  },
  { id: 2, type: 'warning', title: 'Bin Z006 at 91% capacity',           msg: 'ECIL Township overflow risk. Collection vehicle WS-03 dispatched. ETA 12 minutes.', time: '12m ago',  module: 'Waste',    icon: Trash2 },
  { id: 3, type: 'warning', title: 'Energy anomaly — Airport Terminal', msg: 'Isolation Forest detected +34% HVAC deviation. Auto-correction applied, saving ₹4,200/hr.', time: '25m ago',  module: 'Energy',   icon: Zap   },
  { id: 4, type: 'info',    title: 'Digital Twin sync complete',          msg: '5 scenario models updated. Festival scenario projects 85% waste fill peak at 18:00.', time: '1h ago',    module: 'Twin',     icon: Globe2 },
  { id: 5, type: 'success', title: '149 citizen reports verified',        msg: 'YOLOv11 CV classification complete with 94.3% accuracy. 7,450 points awarded.', time: '2h ago',    module: 'Citizens', icon: Users  },
  { id: 6, type: 'success', title: 'Route R-D collection complete',       msg: '4 bins collected in Hitech City. Efficiency: 97%. Next route in 35 minutes.', time: '3h ago',    module: 'Waste',    icon: Trash2 },
];

const TYPE_STYLE = {
  danger:  { border: '#F43F5E', bg: 'rgba(244,63,94,0.06)',  color: '#FB7185',  icon: '#F43F5E' },
  warning: { border: '#F59E0B', bg: 'rgba(245,158,11,0.06)', color: '#FCD34D',  icon: '#F59E0B' },
  info:    { border: '#06B6D4', bg: 'rgba(6,182,212,0.06)',  color: '#22D3EE',  icon: '#06B6D4' },
  success: { border: '#10B981', bg: 'rgba(16,185,129,0.06)', color: '#34D399',  icon: '#10B981' },
};

const FILTERS = ['all', 'danger', 'warning', 'info', 'success'];

export default function AlertsPage() {
  const [filter, setFilter] = useState('all');
  const filtered = ALERTS.filter(a => filter === 'all' || a.type === filter);

  return (
    <AppShell title="System Alerts" subtitle="City-wide alert management and notification center">
      <div className="p-6 space-y-5">

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '7px 16px',
                borderRadius: 9,
                border: `1px solid ${filter === f ? 'var(--indigo)' : 'var(--border)'}`,
                background: filter === f ? 'rgba(99,102,241,0.1)' : 'transparent',
                color: filter === f ? 'var(--indigo-2)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 500,
                textTransform: 'capitalize',
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Danger',  count: ALERTS.filter(a => a.type === 'danger').length,  color: '#F43F5E' },
            { label: 'Warning', count: ALERTS.filter(a => a.type === 'warning').length, color: '#F59E0B' },
            { label: 'Info',    count: ALERTS.filter(a => a.type === 'info').length,    color: '#06B6D4' },
            { label: 'Success', count: ALERTS.filter(a => a.type === 'success').length, color: '#10B981' },
          ].map(({ label, count, color }) => (
            <div key={label} className="card" style={{ padding: 16, borderTop: `2px solid ${color}`, textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color, letterSpacing: '-0.03em' }}>{count}</div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Alert list */}
        <div className="space-y-3">
          {filtered.map((a) => {
            const s = (TYPE_STYLE as any)[a.type];
            const Icon = a.icon;
            return (
              <div
                key={a.id}
                style={{
                  display: 'flex',
                  gap: 14,
                  padding: '14px 18px',
                  borderRadius: 12,
                  borderLeft: `3px solid ${s.border}`,
                  background: s.bg,
                  border: `1px solid ${s.border}20`,
                  borderLeftWidth: 3,
                }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 9, background: `${s.icon}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={16} style={{ color: s.icon }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="flex items-center gap-2 mb-1">
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: s.color }}>{a.title}</div>
                    <span className="badge badge-gray" style={{ fontSize: 9 }}>{a.module}</span>
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{a.msg}</div>
                </div>
                <div style={{ flexShrink: 0, fontSize: 11.5, color: 'var(--text-tertiary)', paddingTop: 2 }}>{a.time}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
