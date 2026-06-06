'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Trash2, Zap, Globe2, MessageSquareText,
  Users, Wind, Bell, Settings, HelpCircle, ChevronLeft,
  Activity, Wifi,
} from 'lucide-react';
import { useState } from 'react';

const NAV = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Command Center', badge: null },
  { href: '/waste',     icon: Trash2,          label: 'Smart Waste',    badge: 'LIVE',  badgeColor: 'emerald' },
  { href: '/energy',    icon: Zap,             label: 'Smart Energy',   badge: 'LIVE',  badgeColor: 'emerald' },
  { href: '/twin',      icon: Globe2,          label: 'Digital Twin',   badge: null },
  { href: '/copilot',   icon: MessageSquareText,label: 'AI Copilot',   badge: null },
  { href: '/citizens',  icon: Users,           label: 'Citizen Layer',  badge: null },
  { href: '/airsense',  icon: Wind,            label: 'AirSense',       badge: 'ALERT', badgeColor: 'rose' },
];

const SYSTEM = [
  { href: '/alerts',   icon: Bell,       label: 'Alerts' },
  { href: '/settings', icon: Settings,   label: 'Settings' },
  { href: '/help',     icon: HelpCircle, label: 'Help' },
];

export default function Sidebar() {
  const path = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className="sidebar"
      style={{
        width: collapsed ? 64 : 224,
        minHeight: '100vh',
        transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden',
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-4"
        style={{
          height: 64,
          borderBottom: '1px solid rgba(99,102,241,0.10)',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, #5B5EF4 0%, #10B981 100%)',
            borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 14px rgba(91,94,244,0.40)',
          }}
        >
          <Activity size={18} color="#fff" strokeWidth={2.5} />
        </div>
        {!collapsed && (
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
              ArcLight
            </div>
            <div style={{ fontSize: 9.5, fontWeight: 700, color: 'var(--indigo)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              AI 2.0 OS
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex flex-col flex-1 p-3 gap-0.5">
        {!collapsed && (
          <div className="section-label" style={{ paddingLeft: 10, paddingBottom: 4 }}>
            Modules
          </div>
        )}

        {NAV.map(({ href, icon: Icon, label, badge, badgeColor }) => {
          const isActive = path === href || (href !== '/dashboard' && path.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`nav-item ${isActive ? 'active' : ''}`}
              title={collapsed ? label : undefined}
              style={{ justifyContent: collapsed ? 'center' : undefined, padding: collapsed ? '9px 10px' : undefined }}
            >
              <Icon
                size={17}
                className="nav-icon flex-shrink-0"
                style={{ color: isActive ? 'var(--indigo)' : 'var(--text-muted)' }}
              />
              {!collapsed && (
                <>
                  <span className="flex-1 truncate" style={{ fontSize: 13.5 }}>{label}</span>
                  {badge && (
                    <span className={`badge badge-${badgeColor || 'indigo'}`} style={{ fontSize: 8.5, padding: '2px 6px' }}>
                      {badge === 'LIVE' && <span className="dot dot-live" style={{ width: 4, height: 4 }} />}
                      {badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}

        <div className="my-2" style={{ height: 1, background: 'rgba(99,102,241,0.10)' }} />

        {!collapsed && (
          <div className="section-label" style={{ paddingLeft: 10, paddingBottom: 4, paddingTop: 0 }}>
            System
          </div>
        )}
        {SYSTEM.map(({ href, icon: Icon, label }) => {
          const isActive = path === href;
          return (
            <Link
              key={href}
              href={href}
              className={`nav-item ${isActive ? 'active' : ''}`}
              title={collapsed ? label : undefined}
              style={{ justifyContent: collapsed ? 'center' : undefined, padding: collapsed ? '9px 10px' : undefined }}
            >
              <Icon size={16} className="nav-icon flex-shrink-0" style={{ color: isActive ? 'var(--indigo)' : 'var(--text-muted)' }} />
              {!collapsed && <span style={{ fontSize: 13.5 }}>{label}</span>}
            </Link>
          );
        })}

        <div className="flex-1" />

        {/* City Status */}
        {!collapsed && (
          <div
            style={{
              margin: '0 4px 8px',
              padding: '12px 14px',
              borderRadius: 14,
              background: 'linear-gradient(135deg, rgba(5,150,105,0.08) 0%, rgba(16,185,129,0.05) 100%)',
              border: '1px solid rgba(5,150,105,0.18)',
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="dot dot-live" style={{ width: 6, height: 6 }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--emerald)' }}>City Online</span>
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>247 sensors active</div>
            <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>98.2% uptime</div>
          </div>
        )}

        {/* Collapse */}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="nav-item"
          style={{ justifyContent: collapsed ? 'center' : 'flex-start', padding: collapsed ? '9px 10px' : '9px 12px', marginTop: 2 }}
        >
          <ChevronLeft
            size={15}
            style={{
              color: 'var(--text-muted)',
              transition: 'transform 0.25s',
              transform: collapsed ? 'rotate(180deg)' : 'none',
              flexShrink: 0,
            }}
          />
          {!collapsed && <span style={{ fontSize: 12.5 }}>Collapse</span>}
        </button>
      </nav>
    </aside>
  );
}
