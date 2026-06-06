'use client';

import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, ComposedChart,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

// ──────────────────────────────────────────────
// Custom Tooltip
// ──────────────────────────────────────────────

function ChartTooltip({ active, payload, label, unit = '' }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(99,102,241,0.15)',
        borderRadius: 14,
        padding: '10px 14px',
        boxShadow: '0 8px 32px rgba(15,23,42,0.14)',
        fontSize: 12.5,
      }}
    >
      <div style={{ color: 'var(--text-muted)', marginBottom: 6, fontSize: 11, fontWeight: 600 }}>{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2" style={{ marginBottom: 2 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: p.color, flexShrink: 0, boxShadow: `0 0 6px ${p.color}60` }} />
          <span style={{ color: 'var(--text-tertiary)' }}>{p.name}:</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
            {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}{unit}
          </span>
        </div>
      ))}
    </div>
  );
}

// ──────────────────────────────────────────────
// Area Chart
// ──────────────────────────────────────────────

interface AreaProps {
  data: any[];
  dataKey: string;
  xKey: string;
  color?: string;
  unit?: string;
  height?: number;
  fillOpacity?: number;
  name?: string;
}

export function ArcAreaChart({
  data, dataKey, xKey, color = '#6366F1', unit = '', height = 200, fillOpacity = 0.15, name,
}: AreaProps) {
  const gradId = `grad-${dataKey}-${Math.random().toString(36).slice(2, 7)}`;
  return (
    <div className="chart-wrap" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: -4, left: -12 }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis dataKey={xKey} tick={{ fill: 'var(--text-tertiary)', fontSize: 10.5 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
          <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 10.5 }} tickLine={false} axisLine={false} />
          <Tooltip content={<ChartTooltip unit={unit} />} cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: '4 4' }} />
          <Area
            type="monotone"
            dataKey={dataKey}
            name={name || dataKey}
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradId})`}
            dot={false}
            activeDot={{ r: 4, fill: color, stroke: 'var(--bg)', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ──────────────────────────────────────────────
// Multi-Line Chart
// ──────────────────────────────────────────────

interface MultiLineProps {
  data: any[];
  xKey: string;
  lines: { key: string; color: string; label: string; dashed?: boolean }[];
  unit?: string;
  height?: number;
}

export function ArcMultiLineChart({ data, xKey, lines, unit = '', height = 200 }: MultiLineProps) {
  return (
    <div className="chart-wrap" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 4, bottom: -4, left: -12 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis dataKey={xKey} tick={{ fill: 'var(--text-tertiary)', fontSize: 10.5 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
          <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 10.5 }} tickLine={false} axisLine={false} />
          <Tooltip content={<ChartTooltip unit={unit} />} cursor={{ stroke: 'rgba(255,255,255,0.08)', strokeWidth: 1 }} />
          {lines.map((l) => (
            <Line
              key={l.key}
              type="monotone"
              dataKey={l.key}
              name={l.label}
              stroke={l.color}
              strokeWidth={l.dashed ? 1.5 : 2}
              strokeDasharray={l.dashed ? '5 4' : undefined}
              dot={false}
              activeDot={{ r: 4, fill: l.color, stroke: 'var(--bg)', strokeWidth: 2 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ──────────────────────────────────────────────
// Bar Chart
// ──────────────────────────────────────────────

interface BarProps {
  data: any[];
  xKey: string;
  bars: { key: string; color: string; label: string }[];
  unit?: string;
  height?: number;
  stacked?: boolean;
}

export function ArcBarChart({ data, xKey, bars, unit = '', height = 200, stacked = false }: BarProps) {
  return (
    <div className="chart-wrap" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 4, bottom: -4, left: -12 }} barSize={stacked ? 24 : 14} barGap={2}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis dataKey={xKey} tick={{ fill: 'var(--text-tertiary)', fontSize: 10.5 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 10.5 }} tickLine={false} axisLine={false} />
          <Tooltip content={<ChartTooltip unit={unit} />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          {bars.map((b, i) => (
            <Bar
              key={b.key}
              dataKey={b.key}
              name={b.label}
              fill={b.color}
              radius={stacked && i === bars.length - 1 ? [4, 4, 0, 0] : stacked ? [0, 0, 0, 0] : [4, 4, 0, 0]}
              stackId={stacked ? 'stack' : undefined}
              fillOpacity={0.9}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ──────────────────────────────────────────────
// Composed (Area + Line)
// ──────────────────────────────────────────────

interface ComposedProps {
  data: any[];
  xKey: string;
  areas?: { key: string; color: string; label: string }[];
  lines?: { key: string; color: string; label: string; dashed?: boolean }[];
  bars?: { key: string; color: string; label: string }[];
  unit?: string;
  height?: number;
}

export function ArcComposedChart({ data, xKey, areas = [], lines = [], bars = [], unit = '', height = 220 }: ComposedProps) {
  return (
    <div className="chart-wrap" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 4, right: 4, bottom: -4, left: -12 }}>
          <defs>
            {areas.map((a) => (
              <linearGradient key={a.key} id={`cg-${a.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={a.color} stopOpacity={0.25} />
                <stop offset="100%" stopColor={a.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis dataKey={xKey} tick={{ fill: 'var(--text-tertiary)', fontSize: 10.5 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
          <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 10.5 }} tickLine={false} axisLine={false} />
          <Tooltip content={<ChartTooltip unit={unit} />} cursor={{ stroke: 'rgba(255,255,255,0.06)', strokeWidth: 1 }} />
          {bars.map((b) => (
            <Bar key={b.key} dataKey={b.key} name={b.label} fill={b.color} radius={[3, 3, 0, 0]} barSize={12} fillOpacity={0.8} />
          ))}
          {areas.map((a) => (
            <Area key={a.key} type="monotone" dataKey={a.key} name={a.label} stroke={a.color} strokeWidth={2} fill={`url(#cg-${a.key})`} dot={false} />
          ))}
          {lines.map((l) => (
            <Line key={l.key} type="monotone" dataKey={l.key} name={l.label} stroke={l.color} strokeWidth={l.dashed ? 1.5 : 2} strokeDasharray={l.dashed ? '5 4' : undefined} dot={false} />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

// ──────────────────────────────────────────────
// Donut / Pie
// ──────────────────────────────────────────────

interface DonutProps {
  data: { name: string; value: number; color: string }[];
  centerLabel?: string;
  centerValue?: string;
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
}

export function ArcDonutChart({
  data, centerLabel, centerValue, height = 180, innerRadius = 52, outerRadius = 80,
}: DonutProps) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            strokeWidth={0}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((d, i) => (
              <Cell key={i} fill={d.color} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload;
              return (
                <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border-2)', borderRadius: 8, padding: '8px 12px', fontSize: 12 }}>
                  <div style={{ color: d.color, fontWeight: 600 }}>{d.name}</div>
                  <div style={{ color: 'var(--text-primary)' }}>{d.value}</div>
                </div>
              );
            }}
          />
          {centerLabel && centerValue && (
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
              <tspan x="50%" dy="-8" style={{ fontSize: 22, fontWeight: 800, fill: 'var(--text-primary)' }}>
                {centerValue}
              </tspan>
              <tspan x="50%" dy="18" style={{ fontSize: 11, fill: 'var(--text-tertiary)' }}>
                {centerLabel}
              </tspan>
            </text>
          )}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// ──────────────────────────────────────────────
// Radar
// ──────────────────────────────────────────────

interface RadarProps {
  data: { subject: string; value: number }[];
  color?: string;
  height?: number;
}

export function ArcRadarChart({ data, color = '#6366F1', height = 240 }: RadarProps) {
  return (
    <div className="chart-wrap" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.07)" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} />
          <Radar name="Score" dataKey="value" stroke={color} fill={color} fillOpacity={0.15} strokeWidth={2} dot={{ r: 3, fill: color }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
