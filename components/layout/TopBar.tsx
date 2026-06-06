'use client';

import { useEffect, useState } from 'react';
import { Bell, RefreshCw, Search } from 'lucide-react';

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export default function TopBar({ title, subtitle }: TopBarProps) {
  const [time, setTime] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => { setRefreshing(false); window.location.reload(); }, 800);
  };

  return (
    <header
      style={{
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
        background: 'rgba(255,255,255,0.80)',
        backdropFilter: 'blur(32px) saturate(200%)',
        WebkitBackdropFilter: 'blur(32px) saturate(200%)',
        borderBottom: '1px solid rgba(255,255,255,0.90)',
        boxShadow: '0 1px 16px rgba(15,23,42,0.06)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        flexShrink: 0,
      }}
    >
      {/* Left */}
      <div>
        <h1 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: 11.5, color: 'var(--text-muted)', lineHeight: 1.3, marginTop: 1 }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Live Clock */}
        <div
          className="mono flex items-center gap-2 px-3 py-1.5 rounded-xl"
          style={{
            background: 'rgba(255,255,255,0.80)',
            border: '1px solid rgba(99,102,241,0.14)',
            fontSize: 12.5,
            color: 'var(--text-secondary)',
            boxShadow: 'var(--shadow-xs)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <span className="dot dot-live" style={{ width: 5, height: 5 }} />
          {time}
        </div>

        {/* Search */}
        <div className="relative hidden md:block">
          <Search size={13} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            className="input"
            placeholder="Search..."
            style={{ width: 200, paddingLeft: 32, height: 38, fontSize: 13, borderRadius: 10 }}
          />
        </div>

        {/* Refresh */}
        <button
          onClick={handleRefresh}
          style={{
            background: 'rgba(255,255,255,0.80)',
            border: '1px solid rgba(99,102,241,0.14)',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: 10,
            color: 'var(--text-muted)',
            display: 'flex',
            boxShadow: 'var(--shadow-xs)',
            transition: 'all 0.18s',
          }}
          title="Refresh data"
        >
          <RefreshCw size={14} style={{ animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }} />
        </button>

        {/* Notifications */}
        <button
          style={{
            position: 'relative',
            background: 'rgba(255,255,255,0.80)',
            border: '1px solid rgba(99,102,241,0.14)',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: 10,
            color: 'var(--text-muted)',
            display: 'flex',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <Bell size={16} />
          <span style={{
            position: 'absolute', top: 5, right: 5,
            width: 7, height: 7, borderRadius: '50%',
            background: 'var(--rose)',
            border: '1.5px solid white',
          }} />
        </button>

        {/* Live badge */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
          style={{
            background: 'linear-gradient(135deg, rgba(5,150,105,0.10) 0%, rgba(16,185,129,0.07) 100%)',
            border: '1px solid rgba(5,150,105,0.22)',
            fontSize: 11,
            fontWeight: 700,
            color: 'var(--emerald)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <span className="dot dot-live" style={{ width: 5, height: 5 }} />
          LIVE
        </div>

        {/* Avatar */}
        <div
          style={{
            width: 34, height: 34,
            background: 'linear-gradient(135deg, #5B5EF4, #10B981)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 800, color: '#fff',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(91,94,244,0.35)',
            flexShrink: 0,
          }}
        >
          MO
        </div>
      </div>
    </header>
  );
}
