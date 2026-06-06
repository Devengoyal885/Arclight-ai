'use client';

import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div style={{ height: '400px', width: '100%', borderRadius: '20px', background: 'var(--glass-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
      <div className="spinner" style={{ width: 30, height: 30, border: '3px solid var(--indigo-3)', borderTopColor: 'var(--indigo)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  ),
});

export default MapComponent;
