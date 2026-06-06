'use client';

import AppShell from '@/components/layout/AppShell';
import { Bell, Database, Cpu, Save } from 'lucide-react';
import { useState } from 'react';

const SECTIONS = [
  {
    icon: Bell, label: 'Notifications', color: '#F59E0B',
    desc: 'Configure alert thresholds and notification channels',
    fields: [
      { name: 'AQI Alert Threshold', value: '100', type: 'number', unit: 'AQI' },
      { name: 'Waste Fill Alert', value: '80', type: 'number', unit: '%' },
      { name: 'Energy Anomaly Sensitivity', value: '25', type: 'number', unit: '%' },
    ],
  },
  {
    icon: Database, label: 'Data Sources', color: '#6366F1',
    desc: 'Manage sensor connections and data refresh rates',
    fields: [
      { name: 'Sensor Refresh Rate', value: '6', type: 'number', unit: 'sec' },
      { name: 'Historical Data Retention', value: '365', type: 'number', unit: 'days' },
      { name: 'AQI API City Lat', value: '17.3850', type: 'text', unit: '°' },
      { name: 'AQI API City Lon', value: '78.4867', type: 'text', unit: '°' },
    ],
  },
  {
    icon: Cpu, label: 'AI Models', color: '#10B981',
    desc: 'Configure ML model parameters and thresholds',
    fields: [
      { name: 'LSTM Forecast Horizon', value: '6', type: 'number', unit: 'hours' },
      { name: 'CV Confidence Threshold', value: '80', type: 'number', unit: '%' },
      { name: 'Isolation Forest Contamination', value: '0.1', type: 'text', unit: 'rate' },
    ],
  },
];

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AppShell title="Settings" subtitle="System configuration · API endpoints · AI model parameters">
      <div className="p-6 space-y-5" style={{ maxWidth: 800 }}>
        {SECTIONS.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.label} className="card p-6">
              <div className="flex items-center gap-3 mb-5">
                <div style={{ width: 36, height: 36, borderRadius: 9, background: `${section.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={16} style={{ color: section.color }} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{section.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 1 }}>{section.desc}</div>
                </div>
              </div>
              <div className="space-y-3">
                {section.fields.map((f) => (
                  <div key={f.name} className="flex items-center justify-between gap-4">
                    <label style={{ fontSize: 13, color: 'var(--text-secondary)', flex: 1 }}>{f.name}</label>
                    <div className="flex items-center gap-2">
                      <input
                        className="input"
                        style={{ maxWidth: 120, textAlign: 'right', fontSize: 13 }}
                        defaultValue={f.value}
                        type={f.type}
                      />
                      <span style={{ fontSize: 12, color: 'var(--text-tertiary)', width: 40 }}>{f.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <button
          onClick={handleSave}
          className="btn btn-primary"
        >
          <Save size={15} />
          {saved ? 'Saved!' : 'Save Settings'}
        </button>
      </div>
    </AppShell>
  );
}
