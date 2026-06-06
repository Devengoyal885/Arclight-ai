'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface MapProps {
  center: [number, number];
  zoom: number;
  markers?: Array<{
    id: string;
    position: [number, number];
    color: string;
    label: string;
    radius?: number;
  }>;
  polygons?: Array<{
    id: string;
    positions: [number, number][];
    color: string;
    fillOpacity?: number;
    label?: string;
  }>;
  height?: string;
}

export default function MapComponent({ center, zoom, markers = [], polygons = [], height = '400px' }: MapProps) {
  return (
    <div style={{ height, width: '100%', borderRadius: '20px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-white)' }}>
      <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }} zoomControl={false}>
        {/* CartoDB Positron - Premium Light Theme Map Tiles */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          maxZoom={20}
        />

        {polygons.map((poly) => (
          <Polygon
            key={poly.id}
            positions={poly.positions}
            pathOptions={{ color: poly.color, fillColor: poly.color, fillOpacity: poly.fillOpacity || 0.2, weight: 2 }}
          >
            {poly.label && (
              <Tooltip sticky>{poly.label}</Tooltip>
            )}
          </Polygon>
        ))}

        {markers.map((marker) => (
          <CircleMarker
            key={marker.id}
            center={marker.position}
            radius={marker.radius || 8}
            pathOptions={{
              color: '#fff',
              weight: 2,
              fillColor: marker.color,
              fillOpacity: 1,
            }}
          >
            <Tooltip direction="top" offset={[0, -10]} opacity={1}>
              <span style={{ fontWeight: 600 }}>{marker.label}</span>
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
