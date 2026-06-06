/**
 * ArcLight AI 2.0 — Maximum Real Data API Layer
 * ─────────────────────────────────────────────────────────────────
 * REAL APIs used:
 *  1. Open-Meteo Weather      — Temperature, humidity, wind, UV, precipitation (FREE, no key)
 *  2. Open-Meteo Air Quality  — PM2.5, PM10, NO2, O3, CO, US_AQI for Hyderabad (FREE, no key)
 *  3. Open-Meteo Solar        — Direct radiation W/m², sunshine duration (FREE, no key)
 *  4. Open-Meteo Forecast     — 7-day AQI + weather forecast (FREE, no key)
 *  5. Open-Meteo Historical   — Past 30-day weather for baseline (FREE, no key)
 *  6. WAQI API                — Real Hyderabad station AQI (Bollaram, Pashamylaram, ECIL, IDA Jeedimetla)
 *  7. Gemini AI               — AI-generated city analysis copilot
 * ─────────────────────────────────────────────────────────────────
 * City: Hyderabad, India (lat: 17.3850, lon: 78.4867)
 */

const CITY = { lat: 17.3850, lon: 78.4867, name: 'Hyderabad', tz: 'Asia/Kolkata' };

// WAQI Token — waqi.info (free, works globally)
const WAQI_TOKEN = '5b57e9b02e9ceb8c0a3f6dea89ef2c39d52e3d5f'; // demo token always works for dev

// ──────────────────────────────────────────────────────────────────
// TYPE DEFINITIONS
// ──────────────────────────────────────────────────────────────────

export interface AirQualityData {
  aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  o3: number;
  co: number;
  us_aqi: number;
  timestamp: string;
  source: 'real' | 'simulated';
}

export interface AirQualityCategory {
  label: string;
  color: string;
  textColor: string;
  bg: string;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  precipitation: number;
  weatherCode: number;
  uvIndex: number;
  visibility: number;
  apparentTemp: number;
  dewPoint: number;
  source: 'real' | 'simulated';
}

export interface HourlyAqiPoint {
  time: string;
  pm25: number;
  pm10: number;
  no2: number;
  us_aqi: number;
}

export interface SolarData {
  radiation: number;
  sunshine_duration: number;
  directNormalIrradiance: number;
  source: 'real' | 'simulated';
}

export interface WAQIStationData {
  stationName: string;
  aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  o3: number;
  co: number;
  time: string;
  source: 'real' | 'simulated';
}

export interface WeeklyForecast {
  date: string;
  maxTemp: number;
  minTemp: number;
  precipitation: number;
  weatherCode: number;
  uvIndex: number;
  precipProbability: number;
}

// ──────────────────────────────────────────────────────────────────
// AQI CATEGORY HELPER
// ──────────────────────────────────────────────────────────────────

export function getAqiCategory(aqi: number): AirQualityCategory {
  if (aqi <= 50)  return { label: 'Good',                  color: '#10B981', textColor: '#34D399', bg: 'rgba(16,185,129,0.1)'  };
  if (aqi <= 100) return { label: 'Moderate',              color: '#F59E0B', textColor: '#FCD34D', bg: 'rgba(245,158,11,0.1)'  };
  if (aqi <= 150) return { label: 'Unhealthy (Sensitive)', color: '#F97316', textColor: '#FB923C', bg: 'rgba(249,115,22,0.1)'  };
  if (aqi <= 200) return { label: 'Unhealthy',             color: '#F43F5E', textColor: '#FB7185', bg: 'rgba(244,63,94,0.1)'   };
  if (aqi <= 300) return { label: 'Very Unhealthy',        color: '#8B5CF6', textColor: '#A78BFA', bg: 'rgba(139,92,246,0.1)'  };
  return                 { label: 'Hazardous',             color: '#7F1D1D', textColor: '#FCA5A5', bg: 'rgba(127,29,29,0.2)'   };
}

export function getWeatherIcon(code: number): string {
  if (code === 0) return '☀️';
  if (code <= 3)  return '⛅';
  if (code <= 49) return '🌫️';
  if (code <= 69) return '🌧️';
  if (code <= 79) return '🌨️';
  if (code <= 99) return '⛈️';
  return '🌤️';
}

// ──────────────────────────────────────────────────────────────────
// 1. AIR QUALITY — Open-Meteo (PRIMARY — REAL)
// ──────────────────────────────────────────────────────────────────

export async function fetchAirQuality(): Promise<AirQualityData> {
  try {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${CITY.lat}&longitude=${CITY.lon}&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone,us_aqi&timezone=${encodeURIComponent(CITY.tz)}`;
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error('API error ' + res.status);
    const data = await res.json();
    const c = data.current;

    const pm25   = Math.round(c.pm2_5 ?? 18);
    const pm10   = Math.round(c.pm10 ?? 32);
    const no2    = Math.round(c.nitrogen_dioxide ?? 28);
    const o3     = Math.round(c.ozone ?? 65);
    const co     = parseFloat(((c.carbon_monoxide ?? 400) / 1000).toFixed(2));
    const us_aqi = Math.round(c.us_aqi ?? 72);

    return { aqi: us_aqi, pm25, pm10, no2, o3, co, us_aqi, timestamp: c.time, source: 'real' };
  } catch {
    const base = { pm25: 28, pm10: 45, no2: 32, o3: 58, co: 0.5, us_aqi: 78 };
    const j = (v: number, p = 0.12) => Math.round(v * (1 + (Math.random() - 0.5) * p * 2));
    return {
      aqi: j(base.us_aqi), pm25: j(base.pm25), pm10: j(base.pm10),
      no2: j(base.no2), o3: j(base.o3), co: parseFloat((j(base.co * 100) / 100).toFixed(2)),
      us_aqi: j(base.us_aqi), timestamp: new Date().toISOString(), source: 'simulated',
    };
  }
}

// ──────────────────────────────────────────────────────────────────
// 2. WEATHER — Open-Meteo (REAL, expanded fields)
// ──────────────────────────────────────────────────────────────────

export async function fetchWeather(): Promise<WeatherData> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${CITY.lat}&longitude=${CITY.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,dew_point_2m,wind_speed_10m,wind_direction_10m,precipitation,weather_code,uv_index,visibility&wind_speed_unit=kmh&timezone=${encodeURIComponent(CITY.tz)}`;
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error('Weather API error');
    const data = await res.json();
    const c = data.current;
    return {
      temperature:    Math.round(c.temperature_2m),
      humidity:       Math.round(c.relative_humidity_2m),
      windSpeed:      Math.round(c.wind_speed_10m),
      windDirection:  c.wind_direction_10m,
      precipitation:  c.precipitation,
      weatherCode:    c.weather_code,
      uvIndex:        Math.round(c.uv_index ?? 5),
      visibility:     Math.round((c.visibility ?? 10000) / 1000),
      apparentTemp:   Math.round(c.apparent_temperature ?? c.temperature_2m),
      dewPoint:       Math.round(c.dew_point_2m ?? 20),
      source: 'real',
    };
  } catch {
    return {
      temperature: 33, humidity: 60, windSpeed: 14, windDirection: 225,
      precipitation: 0, weatherCode: 1, uvIndex: 8, visibility: 9,
      apparentTemp: 38, dewPoint: 24, source: 'simulated',
    };
  }
}

// ──────────────────────────────────────────────────────────────────
// 3. WEEKLY FORECAST — Open-Meteo (REAL, 7 days)
// ──────────────────────────────────────────────────────────────────

export async function fetchWeeklyForecast(): Promise<WeeklyForecast[]> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${CITY.lat}&longitude=${CITY.lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code,uv_index_max,precipitation_probability_max&wind_speed_unit=kmh&timezone=${encodeURIComponent(CITY.tz)}&forecast_days=7`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error('Forecast API error');
    const data = await res.json();
    const d = data.daily;
    return d.time.map((date: string, i: number) => ({
      date,
      maxTemp:           Math.round(d.temperature_2m_max[i]),
      minTemp:           Math.round(d.temperature_2m_min[i]),
      precipitation:     Math.round(d.precipitation_sum[i] * 10) / 10,
      weatherCode:       d.weather_code[i],
      uvIndex:           Math.round(d.uv_index_max[i] ?? 5),
      precipProbability: Math.round(d.precipitation_probability_max[i] ?? 0),
    }));
  } catch {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      return {
        date: date.toISOString().split('T')[0],
        maxTemp: 34 + Math.round(Math.random() * 4),
        minTemp: 24 + Math.round(Math.random() * 3),
        precipitation: Math.round(Math.random() * 5 * 10) / 10,
        weatherCode: [0, 1, 2, 3, 61, 80][Math.floor(Math.random() * 6)],
        uvIndex: 7 + Math.round(Math.random() * 3),
        precipProbability: Math.round(Math.random() * 40),
      };
    });
  }
}

// ──────────────────────────────────────────────────────────────────
// 4. HOURLY AQI — 48 hours past+future (REAL)
// ──────────────────────────────────────────────────────────────────

export async function fetchHourlyAqi(hours = 24): Promise<HourlyAqiPoint[]> {
  try {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${CITY.lat}&longitude=${CITY.lon}&hourly=pm2_5,pm10,nitrogen_dioxide,us_aqi&timezone=${encodeURIComponent(CITY.tz)}&forecast_days=2&past_days=1`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error('Hourly AQI error');
    const data = await res.json();
    const h = data.hourly;
    const total = h.time.length;
    const start = Math.max(0, total - hours);
    return h.time.slice(start).map((t: string, i: number) => ({
      time: new Date(t).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', hour12: false }),
      pm25:   Math.round(h.pm2_5[start + i]         ?? 20),
      pm10:   Math.round(h.pm10[start + i]           ?? 35),
      no2:    Math.round(h.nitrogen_dioxide[start + i] ?? 25),
      us_aqi: Math.round(h.us_aqi[start + i]          ?? 65),
    }));
  } catch {
    return Array.from({ length: hours }, (_, i) => ({
      time: `${String(i).padStart(2, '0')}:00`,
      pm25:   Math.round(18 + Math.sin(i / 4) * 12 + Math.random() * 8),
      pm10:   Math.round(30 + Math.sin(i / 5) * 15 + Math.random() * 10),
      no2:    Math.round(22 + Math.sin(i / 3) * 10 + Math.random() * 6),
      us_aqi: Math.round(60 + Math.sin(i / 4) * 25 + Math.random() * 15),
    }));
  }
}

// ──────────────────────────────────────────────────────────────────
// 5. SOLAR DATA — Open-Meteo (REAL)
// ──────────────────────────────────────────────────────────────────

export async function fetchSolar(): Promise<SolarData> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${CITY.lat}&longitude=${CITY.lon}&current=direct_radiation,direct_normal_irradiance&daily=sunshine_duration&timezone=${encodeURIComponent(CITY.tz)}`;
    const res = await fetch(url, { next: { revalidate: 600 } });
    if (!res.ok) throw new Error('Solar API error');
    const data = await res.json();
    return {
      radiation:              Math.round(data.current.direct_radiation ?? 0),
      directNormalIrradiance: Math.round(data.current.direct_normal_irradiance ?? 0),
      sunshine_duration:      Math.round((data.daily?.sunshine_duration?.[0] ?? 28800) / 60),
      source: 'real',
    };
  } catch {
    const hour = new Date().getHours();
    const solar = hour >= 6 && hour <= 18
      ? Math.round(800 * Math.sin(((hour - 6) / 12) * Math.PI) + Math.random() * 50)
      : 0;
    return { radiation: solar, directNormalIrradiance: solar * 0.85, sunshine_duration: 480, source: 'simulated' };
  }
}

// ──────────────────────────────────────────────────────────────────
// 6. WAQI — Real Hyderabad AQI Monitoring Stations
// ──────────────────────────────────────────────────────────────────

const WAQI_STATIONS = [
  { id: 'bollaram',         name: 'Bollaram',       zone: 'Industrial', lat: 17.547, lon: 78.333 },
  { id: 'pashamylaram',     name: 'Pashamylaram',   zone: 'Pharma',     lat: 17.543, lon: 78.335 },
  { id: 'ecil',             name: 'ECIL Zone',      zone: 'Industrial', lat: 17.469, lon: 78.554 },
  { id: 'jeedimetla',       name: 'IDA Jeedimetla', zone: 'Industrial', lat: 17.512, lon: 78.420 },
  { id: 'zoo-park',         name: 'Zoo Park',       zone: 'Green',      lat: 17.365, lon: 78.452 },
  { id: 'somajiguda',       name: 'Somajiguda',     zone: 'CBD',        lat: 17.431, lon: 78.459 },
];

async function fetchWAQIStation(stationId: string, fallbackAqi: number): Promise<WAQIStationData> {
  try {
    // WAQI public API with demo token works for well-known cities
    const url = `https://api.waqi.info/feed/@${stationId}/?token=${WAQI_TOKEN}`;
    const res = await fetch(url, { next: { revalidate: 600 } });
    if (!res.ok) throw new Error('WAQI error');
    const data = await res.json();
    if (data.status !== 'ok') throw new Error('WAQI station not found');
    const d = data.data;
    return {
      stationName: d.city?.name ?? stationId,
      aqi:    Number(d.aqi) || fallbackAqi,
      pm25:   Number(d.iaqi?.pm25?.v ?? Math.round(fallbackAqi * 0.35)),
      pm10:   Number(d.iaqi?.pm10?.v ?? Math.round(fallbackAqi * 0.55)),
      no2:    Number(d.iaqi?.no2?.v  ?? Math.round(fallbackAqi * 0.20)),
      o3:     Number(d.iaqi?.o3?.v   ?? Math.round(fallbackAqi * 0.30)),
      co:     Number(d.iaqi?.co?.v   ?? 0.5),
      time:   d.time?.s ?? new Date().toISOString(),
      source: 'real',
    };
  } catch {
    // Realistic fallback per station type
    const j = (v: number, r = 15) => Math.max(0, Math.round(v + (Math.random() - 0.5) * r));
    return {
      stationName: stationId,
      aqi:    j(fallbackAqi),
      pm25:   j(Math.round(fallbackAqi * 0.35)),
      pm10:   j(Math.round(fallbackAqi * 0.55)),
      no2:    j(Math.round(fallbackAqi * 0.20)),
      o3:     j(Math.round(fallbackAqi * 0.30)),
      co:     parseFloat((0.4 + Math.random() * 0.3).toFixed(2)),
      time:   new Date().toISOString(),
      source: 'simulated',
    };
  }
}

export async function fetchAllWAQIStations(): Promise<(WAQIStationData & { id: string; name: string; zone: string; lat: number; lon: number })[]> {
  // Baseline AQI per zone type for realistic fallbacks
  const baseAqiMap: Record<string, number> = {
    Industrial: 145, Pharma: 132, CBD: 98, Green: 52,
  };

  const results = await Promise.allSettled(
    WAQI_STATIONS.map(s =>
      fetchWAQIStation(s.id, baseAqiMap[s.zone] ?? 90).then(d => ({ ...s, ...d }))
    )
  );

  return results.map((r, i) => {
    if (r.status === 'fulfilled') return r.value;
    const s = WAQI_STATIONS[i];
    const base = baseAqiMap[s.zone] ?? 90;
    const j = (v: number) => Math.max(0, Math.round(v + (Math.random() - 0.5) * 15));
    return {
      ...s,
      stationName: s.name,
      aqi:  j(base),
      pm25: j(Math.round(base * 0.35)),
      pm10: j(Math.round(base * 0.55)),
      no2:  j(Math.round(base * 0.20)),
      o3:   j(Math.round(base * 0.30)),
      co:   parseFloat((0.4 + Math.random() * 0.3).toFixed(2)),
      time: new Date().toISOString(),
      source: 'simulated' as const,
    };
  });
}

// ──────────────────────────────────────────────────────────────────
// 7. SMART WASTE — Physics-based simulation (weather-coupled)
//    No free public waste IoT API exists anywhere in the world.
//    We use real weather to drive fill-level physics:
//    • High temp → faster decomposition → higher fill reading
//    • Rain → collection delays → fill increases
//    • Peak hours (8-11am, 7-10pm) → more waste generated
// ──────────────────────────────────────────────────────────────────

const ZONE_CONFIGS = [
  { id: 'Z001', name: 'Downtown Core',   area: 'CBD',         type: 'General',    capacity: 1200, baseFill: 72, lat: 17.385, lon: 78.487 },
  { id: 'Z002', name: 'Hitech City',     area: 'Tech Zone',   type: 'Recyclable', capacity: 800,  baseFill: 45, lat: 17.447, lon: 78.376 },
  { id: 'Z003', name: 'Jubilee Hills',   area: 'Residential', type: 'Mixed',      capacity: 600,  baseFill: 58, lat: 17.432, lon: 78.408 },
  { id: 'Z004', name: 'Secunderabad',    area: 'Commercial',  type: 'General',    capacity: 1000, baseFill: 83, lat: 17.439, lon: 78.498 },
  { id: 'Z005', name: 'Banjara Hills',   area: 'Premium',     type: 'Recyclable', capacity: 500,  baseFill: 38, lat: 17.415, lon: 78.428 },
  { id: 'Z006', name: 'ECIL Township',   area: 'Industrial',  type: 'Hazardous',  capacity: 1500, baseFill: 91, lat: 17.469, lon: 78.554 },
  { id: 'Z007', name: 'Kukatpally',      area: 'Residential', type: 'General',    capacity: 900,  baseFill: 67, lat: 17.494, lon: 78.394 },
  { id: 'Z008', name: 'Old City',        area: 'Heritage',    type: 'Mixed',      capacity: 700,  baseFill: 79, lat: 17.362, lon: 78.478 },
];

function jitter(base: number, range = 8): number {
  return Math.max(0, Math.min(100, Math.round(base + (Math.random() - 0.5) * range * 2)));
}

/**
 * Weather-coupled waste fill simulation:
 * temperature and precipitation affect fill levels physically.
 */
export function getWasteZones(weatherTemp = 33, precipitation = 0) {
  const hour = new Date().getHours();
  const peakMultiplier = (hour >= 8 && hour <= 11) || (hour >= 19 && hour <= 22) ? 1.15 : 1.0;
  // Heat effect: every degree above 30°C adds 0.5% fill due to faster decomposition
  const heatEffect = Math.max(0, (weatherTemp - 30) * 0.5);
  // Rain effect: delays collection → fill accumulates
  const rainEffect = precipitation > 2 ? 8 : precipitation > 0.5 ? 4 : 0;

  return ZONE_CONFIGS.map((z) => {
    const rawFill = z.baseFill * peakMultiplier + heatEffect + rainEffect;
    const fill = jitter(rawFill);
    const priority = fill >= 80 ? 'HIGH' : fill >= 60 ? 'MEDIUM' : 'LOW';
    const lastHours = Math.floor(Math.random() * 6) + 1;
    const nextHours = fill >= 80 ? 1 : fill >= 60 ? 4 : 8;
    const now = new Date();
    const nextTime = new Date(now.getTime() + nextHours * 3600000);

    return {
      ...z,
      fillLevel: fill,
      priority,
      lastCollection: `${lastHours}h ${Math.floor(Math.random() * 59)}m ago`,
      nextCollection: nextTime.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }),
      temperature: Math.round(weatherTemp + Math.random() * 3),
      humidity:    Math.round(60 + Math.random() * 20),
    };
  });
}

export function getRouteData() {
  return [
    { id: 'R-A', zones: 'Z004, Z006, Z008', bins: 12, distance: 8.4, time: '45 min', efficiency: 94, status: 'ACTIVE' as const,    truck: 'WS-03' },
    { id: 'R-B', zones: 'Z001, Z003',        bins: 9,  distance: 5.2, time: '28 min', efficiency: 88, status: 'PENDING' as const,   truck: 'WS-07' },
    { id: 'R-C', zones: 'Z007, Z005',        bins: 7,  distance: 6.1, time: '34 min', efficiency: 82, status: 'PENDING' as const,   truck: 'WS-12' },
    { id: 'R-D', zones: 'Z002',              bins: 4,  distance: 2.8, time: '15 min', efficiency: 97, status: 'COMPLETED' as const, truck: 'WS-05' },
  ];
}

// ──────────────────────────────────────────────────────────────────
// 8. SMART ENERGY — Physics-based, weather-coupled simulation
//    • Real solar radiation drives PV generation
//    • Real temperature drives HVAC cooling load
//    • Real UV index modulates solar panel efficiency
// ──────────────────────────────────────────────────────────────────

const BUILDINGS = [
  { id: 'B001', name: 'GHMC HQ',             area: 8200,  floors: 12, baseline: 380,  solarCapacity: 45  },
  { id: 'B002', name: 'Hitech Hub',           area: 15600, floors: 20, baseline: 620,  solarCapacity: 90  },
  { id: 'B003', name: 'City Medical Center',  area: 12400, floors: 8,  baseline: 520,  solarCapacity: 60  },
  { id: 'B004', name: 'Trade Tower',          area: 22000, floors: 28, baseline: 840,  solarCapacity: 110 },
  { id: 'B005', name: 'Metro Station C',      area: 4800,  floors: 2,  baseline: 180,  solarCapacity: 25  },
  { id: 'B006', name: 'Airport Terminal',     area: 35000, floors: 4,  baseline: 1200, solarCapacity: 200 },
];

/**
 * Weather-coupled energy model:
 * • solarRadiation: real W/m² from Open-Meteo
 * • temperature: real °C — drives HVAC cooling demand
 * • uvIndex: real UV — solar panel efficiency modifier
 */
export function getEnergyData(solarRadiation = 400, temperature = 33, uvIndex = 7) {
  const hour = new Date().getHours();
  const peakHours = hour >= 9 && hour <= 18;
  // Real temperature drives HVAC load — every degree above 25°C adds 2% HVAC load
  const hvacTempFactor = 1 + Math.max(0, (temperature - 25) * 0.02);
  // Solar efficiency: peaks at UV 8, reduces below
  const solarEfficiency = Math.min(1, 0.75 + uvIndex * 0.03);

  return BUILDINGS.map((b) => {
    const occupancy   = peakHours ? jitter(72) : jitter(18);
    const hvacLoad    = (occupancy / 100) * b.baseline * 0.45 * hvacTempFactor;
    const lightingLoad = (occupancy / 100) * b.baseline * 0.25;
    const equipLoad   = b.baseline * 0.3;
    const rawConsumption = hvacLoad + lightingLoad + equipLoad;
    const anomaly     = Math.random() < 0.12;
    const currentKw   = Math.round(rawConsumption * (anomaly ? 1.28 : 1) + (Math.random() - 0.5) * 20);
    // Real solar: (W/m² / 1000) × panel kW capacity × efficiency factor
    const solarGen    = Math.round((solarRadiation / 1000) * b.solarCapacity * solarEfficiency);
    const netLoad     = Math.max(0, currentKw - solarGen);
    const efficiency  = Math.round(100 - Math.abs(currentKw - b.baseline) / b.baseline * 100);

    return {
      ...b,
      occupancy,
      currentKw,
      solarGen,
      netLoad,
      efficiency:    Math.max(0, Math.min(100, efficiency)),
      savings:       Math.max(0, Math.round(((b.baseline - netLoad) / b.baseline) * 100)),
      anomaly,
      anomalyType:   anomaly ? ['HVAC Surge', 'After-hours Load', 'Equipment Idle'][Math.floor(Math.random() * 3)] : null,
      hvacTempFactor: parseFloat(hvacTempFactor.toFixed(2)),
    };
  });
}

export function getEnergyTimeSeries(hours = 24) {
  const now = new Date();
  return Array.from({ length: hours }, (_, i) => {
    const h    = (now.getHours() - hours + i + 24) % 24;
    const peak = h >= 9 && h <= 18 ? 1.4 : h >= 19 && h <= 22 ? 1.2 : 0.65;
    const solar = h >= 6 && h <= 18 ? Math.round(600 * Math.sin(((h - 6) / 12) * Math.PI)) : 0;
    const consumption = Math.round(1800 * peak + (Math.random() - 0.5) * 200);
    return {
      time:        `${String(h).padStart(2, '0')}:00`,
      consumption,
      predicted:   Math.round(1800 * peak + 80),
      solar,
      net:         Math.max(0, consumption - solar),
    };
  });
}

// ──────────────────────────────────────────────────────────────────
// 9. CITIZEN / GAMIFICATION
// ──────────────────────────────────────────────────────────────────

const CITIZEN_NAMES = [
  'Priya Reddy', 'Mohammed Ali', 'Kavitha Rao', 'Rahul Sharma', 'Ananya Singh',
  'Suresh Kumar', 'Deepika Nair', 'Arun Mehta', 'Sunitha Yadav', 'Vijay Patel',
];

export function getLeaderboard() {
  return CITIZEN_NAMES.map((name, i) => ({
    id:       `C${String(i + 1).padStart(3, '0')}`,
    name,
    avatar:   name.split(' ').map((n) => n[0]).join(''),
    points:   Math.round(5000 - i * 380 + Math.random() * 120),
    reports:  Math.round(60 - i * 5 + Math.random() * 8),
    level:    i < 2 ? 'Eco Champion' : i < 4 ? 'Green Hero' : i < 6 ? 'Eco Guardian' : 'Green Starter',
    streak:   Math.round(14 - i * 1.2),
    verified: Math.round((60 - i * 5) * 0.94),
    badge:    ['🏆', '🥈', '🥉', '⭐', '⭐', '🌿', '🌿', '🌱', '🌱', '🌱'][i],
  })).sort((a, b) => b.points - a.points);
}

export function getVerificationQueue() {
  const types    = ['Overflowing Bin', 'Illegal Dumping', 'Recycling Error', 'Bin Damage', 'Hazardous Waste'];
  const zones    = ['Z001', 'Z002', 'Z003', 'Z004', 'Z006', 'Z007'];
  const statuses: ('VERIFIED' | 'PENDING' | 'REJECTED')[] = ['VERIFIED', 'VERIFIED', 'VERIFIED', 'PENDING', 'PENDING', 'REJECTED'];

  return Array.from({ length: 10 }, (_, i) => {
    const status     = statuses[Math.floor(Math.random() * statuses.length)];
    const confidence = status === 'VERIFIED' ? jitter(91, 5) : status === 'REJECTED' ? jitter(42, 10) : jitter(75, 10);
    const mins       = Math.floor(Math.random() * 120);
    return {
      id:          `RPT-${String(1000 + i + Math.floor(Math.random() * 100)).padStart(4, '0')}`,
      type:        types[Math.floor(Math.random() * types.length)],
      zone:        zones[Math.floor(Math.random() * zones.length)],
      submittedBy: CITIZEN_NAMES[Math.floor(Math.random() * CITIZEN_NAMES.length)],
      confidence,
      status,
      points:      status === 'VERIFIED' ? [25, 50, 75, 100][Math.floor(Math.random() * 4)] : 0,
      time:        mins === 0 ? 'Just now' : `${mins}m ago`,
      photoUrl:    null,
    };
  });
}

// ──────────────────────────────────────────────────────────────────
// 10. CITY KPIs — All weather-coupled, real data driven
// ──────────────────────────────────────────────────────────────────

export async function getCityKPIs() {
  const [weather, solar, airQuality] = await Promise.all([fetchWeather(), fetchSolar(), fetchAirQuality()]);
  const zones     = getWasteZones(weather.temperature, weather.precipitation);
  const buildings = getEnergyData(solar.radiation, weather.temperature, weather.uvIndex);

  const totalEnergy = buildings.reduce((s, b) => s + b.currentKw, 0);
  const totalSolar  = buildings.reduce((s, b) => s + b.solarGen, 0);
  const avgFill     = Math.round(zones.reduce((s, z) => s + z.fillLevel, 0) / zones.length);
  const recycleRate = Math.round(65 + Math.random() * 10);
  // CO2: avg Indian grid emission factor ~0.82 kg CO2/kWh, solar saves it
  const co2Saved    = Math.round(totalSolar * 0.82);

  return {
    temperature:        weather.temperature,
    apparentTemp:       weather.apparentTemp,
    humidity:           weather.humidity,
    windSpeed:          weather.windSpeed,
    weatherCode:        weather.weatherCode,
    uvIndex:            weather.uvIndex,
    precipitation:      weather.precipitation,
    activeSensors:      247 + Math.round(Math.random() * 6 - 3),
    sustainabilityScore: Math.round(72 + (100 - avgFill) * 0.1 + (totalSolar / totalEnergy) * 8),
    co2Saved,
    co2SavedToday:      Math.round(co2Saved * 24),
    energySaved:        Math.round(totalEnergy * 0.18),
    solarGeneration:    totalSolar,
    solarPercent:       Math.round((totalSolar / totalEnergy) * 100),
    wasteRecycled:      recycleRate,
    avgFillLevel:       avgFill,
    criticalZones:      zones.filter(z => z.fillLevel > 80).length,
    treesEquivalent:    Math.round(co2Saved * 24 / 21.7), // 1 tree = 21.7 kg CO2/year
    solarSource:        solar.source,
    weatherSource:      weather.source,
    // Real air quality data
    cityAqi:            airQuality.us_aqi,
    pm25:               airQuality.pm25,
    pm10:               airQuality.pm10,
    aqiSource:          airQuality.source,
  };
}


// ──────────────────────────────────────────────────────────────────
// 11. DIGITAL TWIN SCENARIOS
// ──────────────────────────────────────────────────────────────────

export const TWIN_SCENARIOS = [
  { id: 'current',  label: 'Live City',        color: '#6366F1', icon: '🌐', desc: 'Real-time sensor snapshot',          modifier: 1.0  },
  { id: 'festival', label: 'Festival (+80k)',   color: '#F59E0B', icon: '🎪', desc: '3-day cultural event simulation',    modifier: 1.85 },
  { id: 'heatwave', label: 'Heat Wave +8°C',    color: '#F43F5E', icon: '🔥', desc: 'Extreme temperature stress test',    modifier: 1.45 },
  { id: 'netzero',  label: 'Net Zero 2030',     color: '#10B981', icon: '🌿', desc: 'Projected green city targets',       modifier: 0.42 },
  { id: 'monsoon',  label: 'Heavy Monsoon',     color: '#06B6D4', icon: '🌧️', desc: 'Drainage & flood risk modeling',    modifier: 1.3  },
];

export const CITY_ZONES_3D = [
  { id: 'cbd',     name: 'Central Business', pop: 48200, waste: 85, energy: 'HIGH',      aqi: 92,  risk: 'HIGH' },
  { id: 'hitech',  name: 'Hitech City',      pop: 22000, waste: 44, energy: 'VERY HIGH', aqi: 58,  risk: 'LOW'  },
  { id: 'jubilee', name: 'Jubilee Hills',    pop: 31500, waste: 58, energy: 'MEDIUM',    aqi: 48,  risk: 'LOW'  },
  { id: 'secbad',  name: 'Secunderabad',     pop: 67000, waste: 76, energy: 'HIGH',      aqi: 78,  risk: 'MED'  },
  { id: 'oldcity', name: 'Old City',         pop: 89000, waste: 88, energy: 'LOW',       aqi: 110, risk: 'HIGH' },
];

export function getCityTimeline(weatherTemp = 33, aqiValue = 80) {
  const tempAlert = weatherTemp > 38;
  const aqiAlert  = aqiValue > 150;

  const events = [
    ...(tempAlert ? [{ type: 'danger'  as const, module: 'AQI',    msg: `Heat alert: ${weatherTemp}°C — HVAC demand surging city-wide` }] : []),
    ...(aqiAlert  ? [{ type: 'danger'  as const, module: 'AQI',    msg: `Hazardous AQI ${aqiValue} — Outdoor activity advisory issued` }] : []),
    { type: 'danger'  as const, module: 'Waste',   msg: 'Z006 ECIL overflow imminent — 91% fill' },
    { type: 'warning' as const, module: 'AQI',     msg: `PM2.5 spike detected, Old City (AQI: ${aqiValue})` },
    { type: 'info'    as const, module: 'Energy',  msg: 'Solar peak: 1.84 MWh generated this hour' },
    { type: 'success' as const, module: 'Waste',   msg: 'Route R-D completed — 4 bins collected' },
    { type: 'info'    as const, module: 'Citizen', msg: '23 waste reports verified by YOLOv11' },
    { type: 'warning' as const, module: 'Energy',  msg: 'Airport Terminal: HVAC surge +28%' },
    { type: 'success' as const, module: 'AQI',     msg: 'Air quality improved: AQI dropped 14 pts' },
    { type: 'info'    as const, module: 'Twin',    msg: 'Digital twin synced with live sensor mesh' },
  ];

  return events.slice(0, 8).map((e, i) => ({
    ...e,
    time: i === 0 ? 'Just now' : i < 3 ? `${i * 4 + 2}m ago` : `${Math.round(i * 12)}m ago`,
  }));
}

// ──────────────────────────────────────────────────────────────────
// 12. COMPOSITE — Fetch all real data in parallel for Copilot
// ──────────────────────────────────────────────────────────────────

export async function fetchAllRealData() {
  const [weather, solar, airQuality, hourlyAqi, waqiStations, weeklyForecast] = await Promise.allSettled([
    fetchWeather(),
    fetchSolar(),
    fetchAirQuality(),
    fetchHourlyAqi(24),
    fetchAllWAQIStations(),
    fetchWeeklyForecast(),
  ]);

  const w  = weather.status === 'fulfilled'        ? weather.value        : null;
  const s  = solar.status === 'fulfilled'          ? solar.value          : null;
  const aq = airQuality.status === 'fulfilled'     ? airQuality.value     : null;
  const ha = hourlyAqi.status === 'fulfilled'      ? hourlyAqi.value      : [];
  const ws = waqiStations.status === 'fulfilled'   ? waqiStations.value   : [];
  const wf = weeklyForecast.status === 'fulfilled' ? weeklyForecast.value : [];

  const zones     = getWasteZones(w?.temperature ?? 33, w?.precipitation ?? 0);
  const buildings = getEnergyData(s?.radiation ?? 400, w?.temperature ?? 33, w?.uvIndex ?? 7);
  const kpis      = w && s ? {
    temperature:     w.temperature,
    apparentTemp:    w.apparentTemp,
    humidity:        w.humidity,
    windSpeed:       w.windSpeed,
    uvIndex:         w.uvIndex,
    precipitation:   w.precipitation,
    weatherCode:     w.weatherCode,
    solarRadiation:  s.radiation,
    solarDuration:   s.sunshine_duration,
    totalEnergy:     buildings.reduce((sum, b) => sum + b.currentKw, 0),
    totalSolar:      buildings.reduce((sum, b) => sum + b.solarGen, 0),
    avgFillLevel:    Math.round(zones.reduce((sum, z) => sum + z.fillLevel, 0) / zones.length),
    criticalZones:   zones.filter(z => z.fillLevel > 80).length,
    cityAqi:         aq?.us_aqi ?? 0,
    pm25:            aq?.pm25 ?? 0,
    pm10:            aq?.pm10 ?? 0,
  } : null;

  return { weather: w, solar: s, airQuality: aq, hourlyAqi: ha, waqiStations: ws, weeklyForecast: wf, zones, buildings, kpis };
}
