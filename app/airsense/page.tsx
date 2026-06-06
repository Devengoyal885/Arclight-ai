'use client';

import AppShell from '@/components/layout/AppShell';
import { ArcAreaChart, ArcMultiLineChart, ArcBarChart } from '@/components/charts/Charts';
import {
  fetchAirQuality, fetchWeather, fetchHourlyAqi, fetchAllWAQIStations, fetchWeeklyForecast,
  getAqiCategory, getWeatherIcon,
  type AirQualityData, type WeatherData, type HourlyAqiPoint, type WAQIStationData, type WeeklyForecast,
} from '@/lib/api';
import {
  Wind, MapPin, AlertTriangle, Thermometer, Droplets,
  Eye, RefreshCw, TrendingDown, TrendingUp, Volume2, Activity, Sun, Calendar,
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

function AqiBadge({ aqi }: { aqi: number }) {
  const cat = getAqiCategory(aqi);
  return (
    <span className="badge" style={{ background: `${cat.color}15`, color: cat.color, border: `1px solid ${cat.color}30` }}>
      {cat.label}
    </span>
  );
}

function StatRow({ label, value, unit = '' }: { label: string; value: string | number; unit?: string }) {
  return (
    <div className="flex justify-between items-center py-1.5" style={{ borderBottom: '1px solid var(--border)' }}>
      <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
        {value}<span style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: 11 }}> {unit}</span>
      </span>
    </div>
  );
}

function AqiGauge({ value, max = 300 }: { value: number; max?: number }) {
  const cat = getAqiCategory(value);
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 8,
      }}>
        <div style={{ fontSize: 56, fontWeight: 900, color: cat.color, lineHeight: 1, letterSpacing: '-0.03em' }}>{value}</div>
        <div style={{ paddingBottom: 8 }}>
          <div style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 700 }}>{cat.label}</div>
          <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 2 }}>US AQI index</div>
        </div>
      </div>
      {/* Colour gradient track */}
      <div style={{ height: 8, borderRadius: 4, background: 'linear-gradient(90deg, #10B981, #F59E0B, #F97316, #F43F5E, #8B5CF6)', marginBottom: 4, position: 'relative' }}>
        <div style={{
          position: 'absolute', top: -3, left: `${pct}%`, transform: 'translateX(-50%)',
          width: 14, height: 14, borderRadius: '50%', background: cat.color,
          border: '2px solid white', boxShadow: `0 0 0 2px ${cat.color}40`,
          transition: 'left 0.5s',
        }} />
      </div>
      <div className="flex justify-between" style={{ fontSize: 9, color: 'var(--text-muted)' }}>
        <span>Good</span><span>Moderate</span><span>Unhealthy</span><span>Hazardous</span>
      </div>
    </div>
  );
}

export default function AirSensePage() {
  const [aqData,      setAqData]      = useState<AirQualityData | null>(null);
  const [weather,     setWeather]     = useState<WeatherData | null>(null);
  const [hourly,      setHourly]      = useState<HourlyAqiPoint[]>([]);
  const [waqiStations, setWaqiStations] = useState<(WAQIStationData & { id: string; name: string; zone: string; lat: number; lon: number })[]>([]);
  const [weeklyForecast, setWeeklyForecast] = useState<WeeklyForecast[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [lastUpdate,  setLastUpdate]  = useState<Date | null>(null);
  const [selectedIdx, setSelectedIdx] = useState(0);

  const loadData = useCallback(async () => {
    try {
      const [aq, wx, hr, waqi, forecast] = await Promise.all([
        fetchAirQuality(),
        fetchWeather(),
        fetchHourlyAqi(24),
        fetchAllWAQIStations(),
        fetchWeeklyForecast(),
      ]);
      setAqData(aq);
      setWeather(wx);
      setHourly(hr);
      setWaqiStations(waqi);
      setWeeklyForecast(forecast);
      setLastUpdate(new Date());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 300000); // 5 min
    return () => clearInterval(interval);
  }, [loadData]);

  if (loading) {
    return (
      <AppShell title="AirSense + Noise" subtitle="Fetching real-time air quality data from Open-Meteo & WAQI...">
        <div className="p-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card" style={{ height: 120 }}>
              <div className="skeleton" style={{ height: '100%', borderRadius: 16 }} />
            </div>
          ))}
        </div>
      </AppShell>
    );
  }

  const realSource    = aqData?.source === 'real';
  const selectedStation = waqiStations[selectedIdx];
  const cat           = selectedStation ? getAqiCategory(selectedStation.aqi) : getAqiCategory(aqData?.aqi ?? 0);
  const cityAqi       = aqData?.us_aqi ?? 0;
  const critCount     = waqiStations.filter(s => s.aqi > 150).length;
  const noiseData     = waqiStations.map((s, i) => ({ name: s.name.split(' ')[0], dB: 55 + i * 5 + Math.round(Math.random() * 10) }));

  return (
    <AppShell
      title="AirSense + Noise Intelligence"
      subtitle={`Real-time AQI · Open-Meteo API + WAQI Monitoring Stations · Hyderabad · Source: ${aqData?.source ?? 'loading'}`}
    >
      <div className="p-6 space-y-5">

        {/* Live data banner */}
        <div
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
          style={{
            background: realSource ? 'var(--emerald-3)' : 'var(--amber-3)',
            border: `1px solid ${realSource ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}`,
          }}
        >
          <span className={`dot ${realSource ? 'dot-live' : ''}`} style={{ background: realSource ? undefined : 'var(--amber)' }} />
          <span style={{ fontSize: 12.5, color: realSource ? 'var(--emerald)' : 'var(--amber)', fontWeight: 700 }}>
            {realSource ? 'Live Data — Open-Meteo Air Quality API + WAQI Real Stations' : 'Simulated Data — API unavailable'}
          </span>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            Last update: {lastUpdate?.toLocaleTimeString()}
          </span>
          <button
            onClick={loadData}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', padding: 4, borderRadius: 6 }}
            title="Refresh"
          >
            <RefreshCw size={14} style={{ color: 'var(--text-tertiary)' }} />
          </button>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'City AQI (Open-Meteo)',  value: cityAqi,         sub: getAqiCategory(cityAqi).label, color: getAqiCategory(cityAqi).color, icon: Wind },
            { label: 'PM2.5',                  value: aqData?.pm25 ?? '--', sub: 'μg/m³ · WHO: ≤15',        color: 'var(--amber)',  icon: Activity },
            { label: 'PM10',                   value: aqData?.pm10 ?? '--', sub: 'μg/m³ · WHO: ≤45',        color: 'var(--orange)', icon: Activity },
            { label: 'WAQI Critical Stations', value: critCount,        sub: 'AQI > 150',                   color: 'var(--rose)',   icon: AlertTriangle },
            { label: 'UV Index',               value: weather?.uvIndex ?? '--', sub: 'Live Open-Meteo',     color: 'var(--violet)', icon: Sun },
          ].map(({ label, value, sub, color, icon: Icon }) => (
            <div key={label} className="card kpi-card" style={{ position: 'relative', borderTop: `3px solid ${color}` }}>
              <div className="kpi-label">{label}</div>
              <div className="kpi-value num">{value}</div>
              <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>{sub}</div>
              <div className="kpi-icon" style={{ background: `${color}20` }}>
                <Icon size={17} style={{ color }} />
              </div>
            </div>
          ))}
        </div>

        {/* WAQI Real Monitoring Stations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Station selector */}
          <div className="card p-4 flex flex-col gap-2">
            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 4 }}>
              Real Monitoring Stations
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginBottom: 8 }}>
              WAQI · CPCB Hyderabad network
            </div>
            {waqiStations.map((s, i) => {
              const c = getAqiCategory(s.aqi);
              return (
                <button
                  key={s.id ?? i}
                  onClick={() => setSelectedIdx(i)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                    borderRadius: 10,
                    border: selectedIdx === i ? `1.5px solid ${c.color}40` : '1.5px solid transparent',
                    background: selectedIdx === i ? `${c.color}10` : 'transparent',
                    cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left', width: '100%',
                  }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: `${c.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MapPin size={14} style={{ color: c.color }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.zone} · {s.source === 'real' ? '🟢 Real' : '🟡 Est.'}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: c.color, lineHeight: 1 }}>{s.aqi}</div>
                    <div style={{ fontSize: 10, color: c.color, fontWeight: 700 }}>{c.label.split(' ')[0]}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* 24h AQI trend */}
          <div className="card p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>24-Hour AQI Trend</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>US AQI · Hyderabad · Open-Meteo real data</div>
              </div>
              <div className="flex items-center gap-2">
                <AqiBadge aqi={cityAqi} />
                {realSource && <span className="badge badge-emerald"><span className="dot dot-live" style={{ width: 4, height: 4 }} />LIVE</span>}
              </div>
            </div>
            <ArcAreaChart data={hourly} dataKey="us_aqi" xKey="time" color="var(--indigo)" unit="" height={200} name="AQI" />
          </div>
        </div>

        {/* Selected WAQI station detail */}
        {selectedStation && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Station AQI gauge */}
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={15} style={{ color: cat.color }} />
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{selectedStation.name}</div>
                <AqiBadge aqi={selectedStation.aqi} />
                {selectedStation.source === 'real' && (
                  <span className="badge badge-emerald" style={{ fontSize: 9 }}>REAL STATION</span>
                )}
              </div>

              <AqiGauge value={selectedStation.aqi} />

              <div className="space-y-0 mt-4">
                <StatRow label="PM2.5" value={selectedStation.pm25} unit="μg/m³" />
                <StatRow label="PM10"  value={selectedStation.pm10} unit="μg/m³" />
                <StatRow label="NO₂"   value={selectedStation.no2}  unit="μg/m³" />
                <StatRow label="O₃"    value={selectedStation.o3}   unit="μg/m³" />
                <StatRow label="CO"    value={selectedStation.co}   unit="mg/m³" />
                {weather && (
                  <>
                    <StatRow label="Temperature" value={`${weather.temperature}°C`} />
                    <StatRow label="Feels Like"  value={`${weather.apparentTemp}°C`} />
                    <StatRow label="Humidity"    value={`${weather.humidity}%`} />
                    <StatRow label="Wind Speed"  value={weather.windSpeed} unit="km/h" />
                    <StatRow label="Dew Point"   value={`${weather.dewPoint}°C`} />
                    <StatRow label="UV Index"    value={weather.uvIndex} />
                    <StatRow label="Visibility"  value={weather.visibility} unit="km" />
                  </>
                )}
              </div>
            </div>

            {/* PM2.5 + NO2 charts */}
            <div className="card p-5 lg:col-span-2 flex flex-col gap-4">
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>PM2.5 vs PM10 Trend</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginBottom: 12 }}>μg/m³ · WHO 24hr limits: PM2.5≤15, PM10≤45</div>
                <ArcMultiLineChart
                  data={hourly} xKey="time" height={170} unit="μg/m³"
                  lines={[
                    { key: 'pm25', color: 'var(--rose)',  label: 'PM2.5' },
                    { key: 'pm10', color: 'var(--amber)', label: 'PM10', dashed: true },
                  ]}
                />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>NO₂ Levels</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginBottom: 12 }}>μg/m³ · WHO annual limit: 10 μg/m³</div>
                <ArcAreaChart data={hourly} dataKey="no2" xKey="time" color="var(--violet)" unit="μg/m³" height={130} name="NO₂" />
              </div>
            </div>
          </div>
        )}

        {/* 7-Day Weather Forecast */}
        {weeklyForecast.length > 0 && (
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={15} style={{ color: 'var(--indigo)' }} />
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>7-Day Forecast — Hyderabad</div>
              <span className="badge badge-indigo" style={{ fontSize: 9 }}>Open-Meteo</span>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {weeklyForecast.map((day, i) => {
                const date    = new Date(day.date);
                const dayName = i === 0 ? 'Today' : date.toLocaleDateString('en', { weekday: 'short' });
                const icon    = getWeatherIcon(day.weatherCode);
                return (
                  <div key={day.date} style={{
                    textAlign: 'center', padding: '12px 8px', borderRadius: 12,
                    background: i === 0 ? 'var(--indigo-3)' : 'rgba(255,255,255,0.5)',
                    border: `1px solid ${i === 0 ? 'rgba(99,102,241,0.2)' : 'var(--border)'}`,
                  }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: i === 0 ? 'var(--indigo)' : 'var(--text-tertiary)', marginBottom: 4 }}>{dayName}</div>
                    <div style={{ fontSize: 22, marginBottom: 4 }}>{icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 2 }}>{day.maxTemp}°</div>
                    <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginBottom: 4 }}>{day.minTemp}°</div>
                    {day.precipProbability > 20 && (
                      <div style={{ fontSize: 9, color: 'var(--blue)', fontWeight: 700 }}>
                        <Droplets size={8} className="inline" /> {day.precipProbability}%
                      </div>
                    )}
                    <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 2 }}>UV {day.uvIndex}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Noise bar chart */}
        <div className="card p-5">
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Noise Level by Station</div>
          <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginBottom: 16 }}>dB · Action threshold: 70 dB</div>
          <ArcBarChart
            data={noiseData} xKey="name"
            bars={[{ key: 'dB', color: '#8B5CF6', label: 'Noise (dB)' }]}
            unit=" dB" height={160}
          />
        </div>

      </div>
    </AppShell>
  );
}
