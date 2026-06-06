// lib/simulators/index.ts
// Real-time data simulators for ArcLight AI 2.0
// All data is procedurally generated with realistic noise injection

// =====================================================
// UTILITY: Noise injection
// =====================================================
export const noise = (base: number, variance: number): number =>
  Math.round((base + (Math.random() - 0.5) * 2 * variance) * 10) / 10;

export const clamp = (val: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, val));

export const formatTime = (date: Date = new Date()): string =>
  date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

// =====================================================
// WASTE SIMULATOR
// =====================================================
export const wasteZones = [
  { id: 'Z001', name: 'Downtown Core', lat: 40.7128, lng: -74.006, capacity: 500, type: 'General', priority: 'HIGH' },
  { id: 'Z002', name: 'Riverside District', lat: 40.7282, lng: -74.0776, capacity: 350, type: 'Recycling', priority: 'MEDIUM' },
  { id: 'Z003', name: 'Market Square', lat: 40.7489, lng: -73.9680, capacity: 420, type: 'Organic', priority: 'HIGH' },
  { id: 'Z004', name: 'Tech Hub', lat: 40.7614, lng: -73.9776, capacity: 300, type: 'General', priority: 'LOW' },
  { id: 'Z005', name: 'Arts Quarter', lat: 40.7282, lng: -73.9942, capacity: 280, type: 'Recycling', priority: 'MEDIUM' },
  { id: 'Z006', name: 'North Gate', lat: 40.7831, lng: -73.9712, capacity: 460, type: 'General', priority: 'HIGH' },
  { id: 'Z007', name: 'Harbor Front', lat: 40.7020, lng: -74.0160, capacity: 390, type: 'Organic', priority: 'MEDIUM' },
  { id: 'Z008', name: 'University Row', lat: 40.7282, lng: -73.9590, capacity: 320, type: 'Recycling', priority: 'LOW' },
];

export function generateWasteLevels() {
  return wasteZones.map((zone) => ({
    ...zone,
    fillLevel: clamp(noise(60, 30), 5, 100),
    temperature: noise(24, 5),
    lastCollection: `${Math.floor(Math.random() * 8) + 1}h ago`,
    nextCollection: `${Math.floor(Math.random() * 6) + 1}h`,
    weeklyTrend: noise(-5, 15),
  }));
}

export function generateWasteTimeSeries(points = 24) {
  let val = 45;
  return Array.from({ length: points }, (_, i) => {
    val = clamp(val + noise(0, 8), 20, 95);
    const h = (new Date().getHours() - points + i + 24) % 24;
    return { time: `${String(h).padStart(2, '0')}:00`, fill: Math.round(val), collections: Math.random() > 0.7 ? 1 : 0 };
  });
}

export function generateRouteData() {
  return [
    { route: 'Route A', bins: 12, distance: 8.4, time: '42 min', efficiency: 94, status: 'ACTIVE' },
    { route: 'Route B', bins: 9, distance: 6.1, time: '31 min', efficiency: 87, status: 'ACTIVE' },
    { route: 'Route C', bins: 15, distance: 11.2, time: '58 min', efficiency: 79, status: 'PENDING' },
    { route: 'Route D', bins: 7, distance: 5.0, time: '26 min', efficiency: 96, status: 'COMPLETED' },
    { route: 'Route E', bins: 11, distance: 9.3, time: '49 min', efficiency: 82, status: 'PENDING' },
  ];
}

// =====================================================
// ENERGY SIMULATOR
// =====================================================
export const energyBuildings = [
  { id: 'B001', name: 'City Hall', zone: 'Government', baseline: 245, floors: 8, area: 12400 },
  { id: 'B002', name: 'Innovation Hub', zone: 'Tech', baseline: 380, floors: 15, area: 28000 },
  { id: 'B003', name: 'Central Library', zone: 'Public', baseline: 120, floors: 3, area: 6800 },
  { id: 'B004', name: 'Medical Center', zone: 'Healthcare', baseline: 520, floors: 12, area: 45000 },
  { id: 'B005', name: 'Trade Center', zone: 'Commercial', baseline: 890, floors: 40, area: 85000 },
  { id: 'B006', name: 'University Campus', zone: 'Education', baseline: 340, floors: 5, area: 32000 },
];

export function generateEnergyData() {
  const hour = new Date().getHours();
  const peakFactor = hour >= 9 && hour <= 18 ? 1.3 : hour >= 19 && hour <= 22 ? 1.1 : 0.7;
  return energyBuildings.map((b) => ({
    ...b,
    currentKw: Math.round(noise(b.baseline * peakFactor, b.baseline * 0.15)),
    occupancy: clamp(noise(hour >= 9 && hour <= 18 ? 72 : 20, 20), 0, 100),
    efficiency: clamp(noise(83, 10), 50, 99),
    anomaly: Math.random() < 0.15,
    savings: Math.round(noise(12, 8)),
  }));
}

export function generateEnergyTimeSeries(points = 24) {
  return Array.from({ length: points }, (_, i) => {
    const h = (new Date().getHours() - points + i + 24) % 24;
    const base = h >= 9 && h <= 18 ? 680 : h >= 19 && h <= 22 ? 520 : 310;
    return {
      time: `${String(h).padStart(2, '0')}:00`,
      consumption: Math.round(noise(base, 60)),
      predicted: Math.round(noise(base * 0.92, 40)),
      solar: h >= 7 && h <= 19 ? Math.round(noise((h >= 12 ? 180 : 60), 30)) : 0,
    };
  });
}

export function generateEnergyHeatmap() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);
  return days.map((day) => ({
    day,
    data: hours.map((hour) => ({
      hour,
      value: Math.round(noise(
        parseInt(hour) >= 9 && parseInt(hour) <= 18 ? 75 : 35,
        20
      )),
    })),
  }));
}

// =====================================================
// AIR QUALITY SIMULATOR
// =====================================================
export const airSensors = [
  { id: 'S001', name: 'Central Park', lat: 40.7829, lng: -73.9654, type: 'AQI+Noise' },
  { id: 'S002', name: 'Highway Junction', lat: 40.7505, lng: -73.9940, type: 'AQI' },
  { id: 'S003', name: 'Industrial Zone', lat: 40.7022, lng: -74.0120, type: 'AQI+Noise' },
  { id: 'S004', name: 'School District', lat: 40.7282, lng: -73.9590, type: 'AQI' },
  { id: 'S005', name: 'Market Area', lat: 40.7489, lng: -73.9680, type: 'Noise' },
  { id: 'S006', name: 'Waterfront', lat: 40.7020, lng: -74.0160, type: 'AQI+Noise' },
];

const aqiCategories = [
  { max: 50, label: 'Good', color: '#00FF94' },
  { max: 100, label: 'Moderate', color: '#FFB800' },
  { max: 150, label: 'Unhealthy (Sensitive)', color: '#FF6B35' },
  { max: 200, label: 'Unhealthy', color: '#FF3D5A' },
  { max: 300, label: 'Very Unhealthy', color: '#A855F7' },
];

export function getAqiCategory(aqi: number) {
  return aqiCategories.find((c) => aqi <= c.max) || aqiCategories[aqiCategories.length - 1];
}

export function generateAirData() {
  return airSensors.map((s) => {
    const aqi = Math.round(noise(65, 40));
    const noiseLevel = Math.round(noise(58, 20));
    return {
      ...s,
      aqi: clamp(aqi, 10, 250),
      aqiCategory: getAqiCategory(aqi),
      pm25: Math.round(noise(18, 10) * 10) / 10,
      pm10: Math.round(noise(35, 15) * 10) / 10,
      no2: Math.round(noise(42, 20) * 10) / 10,
      o3: Math.round(noise(55, 25) * 10) / 10,
      noiseDb: clamp(noiseLevel, 35, 95),
      temperature: Math.round(noise(26, 4) * 10) / 10,
      humidity: Math.round(noise(60, 15)),
      windSpeed: Math.round(noise(12, 8) * 10) / 10,
      status: aqi > 150 ? 'ALERT' : aqi > 100 ? 'WARNING' : 'GOOD',
    };
  });
}

export function generateAirTimeSeries(points = 24) {
  return Array.from({ length: points }, (_, i) => {
    const h = (new Date().getHours() - points + i + 24) % 24;
    const rush = (h >= 7 && h <= 9) || (h >= 17 && h <= 19);
    return {
      time: `${String(h).padStart(2, '0')}:00`,
      aqi: Math.round(noise(rush ? 95 : 55, 20)),
      pm25: Math.round(noise(rush ? 28 : 14, 8) * 10) / 10,
      noise: Math.round(noise(rush ? 72 : 52, 12)),
    };
  });
}

// =====================================================
// CITIZEN SIMULATOR
// =====================================================
export const citizens = [
  { id: 'C001', name: 'Arjun Patel', avatar: 'AP', points: 4820, level: 'Eco Champion', badges: 12, reports: 34 },
  { id: 'C002', name: 'Sofia Chen', avatar: 'SC', points: 4210, level: 'Green Hero', badges: 9, reports: 28 },
  { id: 'C003', name: 'Malik Johnson', avatar: 'MJ', points: 3890, level: 'Green Hero', badges: 11, reports: 22 },
  { id: 'C004', name: 'Priya Sharma', avatar: 'PS', points: 3340, level: 'Eco Guardian', badges: 7, reports: 19 },
  { id: 'C005', name: 'Lucas Meyer', avatar: 'LM', points: 2980, level: 'Eco Guardian', badges: 6, reports: 15 },
  { id: 'C006', name: 'Aisha Okafor', avatar: 'AO', points: 2450, level: 'Green Starter', badges: 4, reports: 12 },
  { id: 'C007', name: 'Diego Rivera', avatar: 'DR', points: 2120, level: 'Green Starter', badges: 3, reports: 9 },
  { id: 'C008', name: 'Mei Zhang', avatar: 'MZ', points: 1890, level: 'Newcomer', badges: 2, reports: 7 },
];

export function generateCitizenActivity() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    return {
      day: dayName,
      reports: Math.round(noise(45, 20)),
      verified: Math.round(noise(38, 15)),
      points: Math.round(noise(1200, 400)),
    };
  });
}

export function generateVerificationQueue() {
  const types = ['Overflowing bin', 'Illegal dumping', 'Recycling error', 'Hazardous waste', 'Littering'];
  const zones = ['Downtown', 'Riverside', 'Market Square', 'Tech Hub', 'Arts Quarter'];
  return Array.from({ length: 6 }, (_, i) => ({
    id: `VQ${String(i + 1).padStart(3, '0')}`,
    type: types[Math.floor(Math.random() * types.length)],
    zone: zones[Math.floor(Math.random() * zones.length)],
    submittedBy: citizens[Math.floor(Math.random() * citizens.length)].name,
    confidence: Math.round(noise(82, 15)),
    status: ['PENDING', 'VERIFIED', 'REJECTED'][Math.floor(Math.random() * 3)] as string,
    time: `${Math.floor(Math.random() * 60)} min ago`,
    points: Math.round(noise(120, 60)),
  }));
}

// =====================================================
// CITY OVERVIEW (for dashboard)
// =====================================================
export function generateCityKPIs() {
  return {
    sustainabilityScore: Math.round(noise(78, 5)),
    co2Saved: Math.round(noise(1240, 80)),
    energySaved: Math.round(noise(3420, 200)),
    wasteRecycled: Math.round(noise(67, 8)),
    activeSensors: Math.round(noise(247, 10)),
    citizenReports: Math.round(noise(158, 30)),
    aqiAvg: Math.round(noise(62, 15)),
    treesEquivalent: Math.round(noise(4820, 200)),
  };
}

export function generateCityTimeline() {
  return [
    { time: '08:42', type: 'warning', msg: 'Bin Z003 at 92% capacity — collection dispatched' },
    { time: '08:38', type: 'success', msg: 'Route B completed — 9 bins collected' },
    { time: '08:25', type: 'danger', msg: 'AQI spike at Highway Junction: 148 (Unhealthy)' },
    { time: '08:15', type: 'info', msg: 'Solar generation peak: 186 kW from Trade Center' },
    { time: '07:55', type: 'success', msg: '34 citizen reports verified by CV AI' },
    { time: '07:40', type: 'warning', msg: 'Energy anomaly detected at Medical Center — auto-corrected' },
    { time: '07:22', type: 'info', msg: 'Digital Twin sync complete — 3 new scenarios modeled' },
  ];
}
