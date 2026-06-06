'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: number; // percentage change
  trendLabel?: string;
  color?: 'primary' | 'green' | 'orange' | 'warning' | 'danger';
  icon?: React.ReactNode;
  sublabel?: string;
  sparkline?: number[]; // mini chart data
  animate?: boolean;
}

const colorMap = {
  primary: { text: '#00D4FF', glow: 'rgba(0,212,255,0.1)', border: 'rgba(0,212,255,0.15)', class: '' },
  green: { text: '#00FF94', glow: 'rgba(0,255,148,0.1)', border: 'rgba(0,255,148,0.15)', class: 'metric-card-green' },
  orange: { text: '#FF6B35', glow: 'rgba(255,107,53,0.1)', border: 'rgba(255,107,53,0.15)', class: 'metric-card-orange' },
  warning: { text: '#FFB800', glow: 'rgba(255,184,0,0.1)', border: 'rgba(255,184,0,0.15)', class: 'metric-card-warning' },
  danger: { text: '#FF3D5A', glow: 'rgba(255,61,90,0.1)', border: 'rgba(255,61,90,0.15)', class: '' },
};

export default function MetricCard({
  label,
  value,
  unit,
  trend,
  trendLabel,
  color = 'primary',
  icon,
  sublabel,
  animate = true,
}: MetricCardProps) {
  const c = colorMap[color];
  const isPositive = trend && trend > 0;
  const isNegative = trend && trend < 0;

  return (
    <div
      className={`glass-card glass-card-hover metric-card ${c.class} rounded-2xl p-5 ${animate ? 'animate-slideUp' : ''}`}
      style={{ cursor: 'default' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#7A9BB5' }}>
          {label}
        </span>
        {icon && (
          <div
            className="p-2 rounded-lg"
            style={{ background: c.glow, border: `1px solid ${c.border}` }}
          >
            <span style={{ color: c.text }}>{icon}</span>
          </div>
        )}
      </div>

      {/* Value */}
      <div className="flex items-end gap-2 mb-2">
        <span
          className="font-display font-bold leading-none"
          style={{ fontSize: '2rem', color: '#E8F4FD' }}
        >
          {value}
        </span>
        {unit && (
          <span className="text-sm font-medium mb-1" style={{ color: '#7A9BB5' }}>
            {unit}
          </span>
        )}
      </div>

      {/* Trend */}
      {trend !== undefined && (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {isPositive && <TrendingUp size={13} style={{ color: '#00FF94' }} />}
            {isNegative && <TrendingDown size={13} style={{ color: '#FF3D5A' }} />}
            {!isPositive && !isNegative && <Minus size={13} style={{ color: '#7A9BB5' }} />}
            <span
              className="text-xs font-semibold"
              style={{ color: isPositive ? '#00FF94' : isNegative ? '#FF3D5A' : '#7A9BB5' }}
            >
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          </div>
          {trendLabel && (
            <span className="text-xs" style={{ color: '#7A9BB5' }}>
              {trendLabel}
            </span>
          )}
        </div>
      )}

      {/* Sublabel */}
      {sublabel && !trend && (
        <p className="text-xs" style={{ color: '#7A9BB5' }}>
          {sublabel}
        </p>
      )}

      {/* Bottom accent line */}
      <div className="mt-4 h-0.5 rounded-full" style={{ background: c.glow, border: `0.5px solid ${c.border}` }} />
    </div>
  );
}
