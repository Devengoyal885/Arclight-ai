import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ArcLight AI 2.0 — Urban Sustainability Intelligence OS',
  description: 'City-scale sustainability intelligence platform with Smart Waste, Energy, Digital Twin, AI Copilot, Citizen Participation, and AirSense modules.',
  keywords: 'smart city, sustainability, AI, IoT, urban intelligence, waste management, energy optimization',
  authors: [{ name: 'ArcLight AI Team' }],
  openGraph: {
    title: 'ArcLight AI 2.0',
    description: 'Urban Sustainability Intelligence OS',
    type: 'website',
  },
};

export const viewport: Viewport = {
  maximumScale: 1,
  themeColor: '#050A14',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <link href="https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css" rel="stylesheet" />
      </head>
      <body style={{ background: '#050A14', margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
