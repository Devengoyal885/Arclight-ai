'use client';

import { AlertTriangle, Info, CheckCircle, XCircle, X } from 'lucide-react';
import { useState } from 'react';

interface AlertBannerProps {
  type: 'info' | 'success' | 'warning' | 'danger';
  title: string;
  message: string;
  dismissible?: boolean;
  timestamp?: string;
  action?: { label: string; onClick: () => void };
}

const typeConfig = {
  info: {
    icon: Info,
    bg: 'rgba(0, 212, 255, 0.08)',
    border: 'rgba(0, 212, 255, 0.25)',
    color: '#00D4FF',
    iconBg: 'rgba(0, 212, 255, 0.15)',
  },
  success: {
    icon: CheckCircle,
    bg: 'rgba(0, 255, 148, 0.08)',
    border: 'rgba(0, 255, 148, 0.25)',
    color: '#00FF94',
    iconBg: 'rgba(0, 255, 148, 0.15)',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'rgba(255, 184, 0, 0.08)',
    border: 'rgba(255, 184, 0, 0.25)',
    color: '#FFB800',
    iconBg: 'rgba(255, 184, 0, 0.15)',
  },
  danger: {
    icon: XCircle,
    bg: 'rgba(255, 61, 90, 0.08)',
    border: 'rgba(255, 61, 90, 0.25)',
    color: '#FF3D5A',
    iconBg: 'rgba(255, 61, 90, 0.15)',
  },
};

export default function AlertBanner({ type, title, message, dismissible = true, timestamp, action }: AlertBannerProps) {
  const [visible, setVisible] = useState(true);
  const config = typeConfig[type];
  const Icon = config.icon;

  if (!visible) return null;

  return (
    <div
      className="flex items-start gap-3 rounded-xl p-4 animate-slideUp"
      style={{
        background: config.bg,
        border: `1px solid ${config.border}`,
      }}
    >
      <div
        className="flex items-center justify-center rounded-lg flex-shrink-0"
        style={{ width: 32, height: 32, background: config.iconBg }}
      >
        <Icon size={16} style={{ color: config.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold" style={{ color: config.color }}>
            {title}
          </span>
          {timestamp && (
            <span className="text-xs" style={{ color: '#7A9BB5' }}>
              {timestamp}
            </span>
          )}
        </div>
        <p className="text-xs mt-0.5 leading-relaxed" style={{ color: '#7A9BB5' }}>
          {message}
        </p>
        {action && (
          <button
            onClick={action.onClick}
            className="text-xs font-semibold mt-2 underline"
            style={{ color: config.color, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            {action.label} →
          </button>
        )}
      </div>
      {dismissible && (
        <button
          onClick={() => setVisible(false)}
          className="flex-shrink-0 p-1 rounded hover:bg-white/5 transition-colors"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7A9BB5' }}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
