'use client';

import Link from 'next/link';
import {
  Activity, Trash2, Zap, Globe2, MessageSquareText, Users, Wind,
  ArrowRight, Shield, Cpu, Database, GitBranch, ChevronRight, Sparkles,
} from 'lucide-react';

const MODULES = [
  { icon: Trash2,           label: 'Smart Waste',   desc: 'CV fill-level detection, AI routing & 6hr predictions', color: '#059669', bg: '#D1FAE5', href: '/waste', img: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=600&h=300' },
  { icon: Zap,              label: 'Smart Energy',  desc: 'Occupancy-based HVAC, anomaly detection & solar opt.',  color: '#D97706', bg: '#FEF3C7', href: '/energy', img: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&q=80&w=600&h=300' },
  { icon: Globe2,           label: 'Digital Twin',  desc: '3D city simulation, festival scenario & real-time sync', color: '#5B5EF4', bg: '#E0E1FF', href: '/twin', img: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&q=80&w=600&h=300' },
  { icon: MessageSquareText,label: 'AI Copilot',   desc: 'RAG-grounded LLM using real Open-Meteo sensor data',    color: '#0891B2', bg: '#CFFAFE', href: '/copilot', img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600&h=300' },
  { icon: Users,            label: 'Citizen Layer', desc: 'Gamification, YOLOv11 CV rewards & leaderboard',        color: '#EA580C', bg: '#FFF7ED', href: '/citizens', img: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=600&h=300' },
  { icon: Wind,             label: 'AirSense',      desc: 'Real AQI from Open-Meteo · IoT mesh · Noise analytics', color: '#E11D48', bg: '#FFE4E6', href: '/airsense', img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=600&h=300' },
];

const STATS = [
  { value: '247', label: 'Active Sensors', suffix: '' },
  { value: '98.2', label: 'System Uptime', suffix: '%' },
  { value: '1,240', label: 'CO₂ Saved/Day', suffix: 'kg' },
  { value: '78', label: 'Sustainability Score', suffix: '/100' },
];

const TECH = [
  { icon: Cpu,       label: 'YOLOv11 Edge AI',     desc: 'On-device CV waste classification' },
  { icon: Database,  label: 'RAG Knowledge Base',   desc: 'Open-Meteo + sensor-grounded LLM' },
  { icon: GitBranch, label: 'LSTM + XGBoost',       desc: '6-12hr ahead predictions' },
  { icon: Shield,    label: 'Open-Meteo APIs',      desc: 'Live AQI, weather & solar — free' },
];

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--grad-bg)', backgroundAttachment: 'fixed' }}>
      {/* ── NAV ── */}
      <nav
        style={{
          position: 'sticky', top: 0, zIndex: 50,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 56px', height: 68,
          background: 'rgba(255,255,255,0.75)',
          backdropFilter: 'blur(32px) saturate(200%)',
          WebkitBackdropFilter: 'blur(32px) saturate(200%)',
          borderBottom: '1px solid rgba(255,255,255,0.90)',
          boxShadow: '0 1px 20px rgba(15,23,42,0.07)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 12,
            background: 'linear-gradient(135deg, #5B5EF4, #10B981)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(91,94,244,0.40)',
            flexShrink: 0,
          }}>
            <Activity size={19} color="#fff" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.15, letterSpacing: '-0.03em' }}>ArcLight AI</div>
            <div style={{ fontSize: 9.5, fontWeight: 800, color: 'var(--indigo)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>v2.0 URBAN OS</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
          <div style={{ display: 'flex', gap: 32 }}>
            {['Modules', 'Technology', 'About'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`}
                style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={e => { (e.target as any).style.color = 'var(--indigo)'; }}
                onMouseLeave={e => { (e.target as any).style.color = 'var(--text-secondary)'; }}
              >
                {item}
              </a>
            ))}
          </div>
          <Link href="/dashboard" className="btn btn-primary">
            Launch OS <ArrowRight size={15} />
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ minHeight: '92vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Unsplash Background */}
        <div style={{ 
          position: 'absolute', inset: 0, 
          backgroundImage: 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2400")',
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'blur(2px) contrast(1.1) brightness(1.2)',
          opacity: 0.8
        }} />
        {/* Overlay gradient to keep text readable */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.6) 100%)' }} />

        <div style={{ position: 'relative', maxWidth: 1200, margin: '0 auto', padding: '80px 56px', textAlign: 'center', width: '100%', zIndex: 1 }}>
          {/* Main Hero Card */}
          <div className="glass-panel" style={{ padding: '80px 60px', maxWidth: 900, margin: '0 auto', boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}>
            {/* Pill */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 32,
              padding: '8px 20px', borderRadius: 99,
              background: 'rgba(255,255,255,0.80)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(91,94,244,0.20)',
              boxShadow: '0 4px 20px rgba(91,94,244,0.10)',
            }}>
              <span className="dot dot-live" style={{ width: 7, height: 7 }} />
              <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--indigo)' }}>
                247 Sensors Active · Real Open-Meteo Data · City AI Online
              </span>
            </div>

            {/* Headline */}
            <h1 style={{
              fontWeight: 900, lineHeight: 1.05, marginBottom: 24, letterSpacing: '-0.04em',
              fontSize: 'clamp(3.2rem, 6vw, 5.5rem)',
              color: 'var(--text-primary)',
            }}>
              The AI Brain<br />
              <span className="gradient-text-brand">of Your City</span>
            </h1>

            <p style={{ maxWidth: 580, margin: '0 auto 44px', lineHeight: 1.75, fontSize: 18.5, color: 'var(--text-secondary)', fontWeight: 400 }}>
              ArcLight AI 2.0 unifies Waste, Energy, Air Quality, and Citizen data into
              one living Digital Twin — powered by real-time AI and open data APIs.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center', marginBottom: 20 }}>
              <Link href="/dashboard" className="btn btn-primary" style={{ fontSize: 16, padding: '14px 36px' }}>
                Open Command Center <ArrowRight size={17} />
              </Link>
              <Link href="/airsense" className="btn btn-secondary" style={{ fontSize: 16, padding: '14px 36px' }}>
                <Sparkles size={16} />
                View Live AQI Data
              </Link>
            </div>
          </div>

          {/* Stats - moved outside the main hero card */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, maxWidth: 740, margin: '40px auto 0' }}>
            {STATS.map(s => (
              <div key={s.label} className="card" style={{ padding: '20px 12px', textAlign: 'center', background: 'rgba(255,255,255,0.85)' }}>
                <div className="gradient-text-brand" style={{ fontSize: 32, fontWeight: 900, lineHeight: 1, letterSpacing: '-0.04em', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  {s.value}
                  <span style={{ fontSize: 17, fontWeight: 700 }}>{s.suffix}</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6, fontWeight: 600, lineHeight: 1.3 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MODULES ── */}
      <section id="modules" style={{ padding: '100px 56px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 18,
              padding: '5px 16px', borderRadius: 99,
              background: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.20)',
              fontSize: 10.5, fontWeight: 800, letterSpacing: '0.10em', color: 'var(--emerald)',
            }}>
              6 INTELLIGENCE MODULES
            </div>
            <h2 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.04em', marginBottom: 18, lineHeight: 1.1 }}>
              Every City System,<br /><span className="gradient-text-indigo">AI-Powered</span>
            </h2>
            <p style={{ fontSize: 17, color: 'var(--text-secondary)', maxWidth: 540, margin: '0 auto', lineHeight: 1.75 }}>
              Real-time monitoring, 6–12 hour predictions, and autonomous response — connected through a city-wide sensor mesh.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 24 }}>
            {MODULES.map(mod => {
              const Icon = mod.icon;
              return (
                <Link key={mod.label} href={mod.href} className="card card-hover"
                  style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none', padding: 0 }}
                >
                  {/* Image Cover */}
                  <div style={{ width: '100%', height: 160, position: 'relative', overflow: 'hidden' }}>
                    <img 
                      src={mod.img} 
                      alt={mod.label}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)' }} />
                    <div style={{ position: 'absolute', bottom: 14, left: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
                       <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                         <Icon size={18} style={{ color: mod.color }} />
                       </div>
                       <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>{mod.label}</h3>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div style={{ padding: 22, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 20 }}>{mod.desc}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 700, color: mod.color }}>
                      Open Module <ChevronRight size={14} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TECHNOLOGY ── */}
      <section id="technology" style={{ padding: '100px 56px', background: 'rgba(255,255,255,0.50)', backdropFilter: 'blur(16px)', position: 'relative', zIndex: 1, borderTop: '1px solid rgba(255,255,255,0.80)', borderBottom: '1px solid rgba(255,255,255,0.80)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.04em', marginBottom: 14, lineHeight: 1.1 }}>
              Production-Grade Tech Stack
            </h2>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)' }}>Edge AI · Open data APIs · Temporal forecasting · Real-time streaming</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16, marginBottom: 44 }}>
            {TECH.map(t => {
              const Icon = t.icon;
              return (
                <div key={t.label} className="card" style={{ padding: 22, display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--indigo-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: 'var(--shadow-sm)' }}>
                    <Icon size={22} style={{ color: 'var(--indigo)' }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--text-primary)', marginBottom: 3, letterSpacing: '-0.01em' }}>{t.label}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>{t.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {['Next.js 15','FastAPI','PyTorch','YOLOv11','LSTM','XGBoost','Open-Meteo API','OR-Tools VRP','PostgreSQL + PostGIS','Redis','Kafka','MQTT','Recharts','Docker','TypeScript'].map(tech => (
              <span key={tech} className="chip">{tech}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="about" style={{ padding: '100px 56px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 820, margin: '0 auto', textAlign: 'center' }}>
          <div className="glass-panel" style={{ padding: '72px 56px' }}>
            <div style={{
              width: 64, height: 64, borderRadius: 18,
              background: 'linear-gradient(135deg, #5B5EF4, #10B981)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 28px',
              boxShadow: '0 8px 32px rgba(91,94,244,0.35)',
            }}>
              <Activity size={28} color="#fff" />
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.04em', marginBottom: 18, lineHeight: 1.1 }}>
              Build the <span className="gradient-text-brand">Sustainable City</span>
            </h2>
            <p style={{ fontSize: 17, color: 'var(--text-secondary)', marginBottom: 40, lineHeight: 1.75, maxWidth: 500, margin: '0 auto 40px' }}>
              Every sensor reading, every AI prediction, every citizen report — moving toward measurable sustainability impact.
            </p>
            <Link href="/dashboard" className="btn btn-primary" style={{ fontSize: 17, padding: '16px 44px', display: 'inline-flex' }}>
              Launch ArcLight OS <ArrowRight size={19} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding: '32px 56px', borderTop: '1px solid rgba(255,255,255,0.80)', background: 'rgba(255,255,255,0.50)', backdropFilter: 'blur(16px)', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg, #5B5EF4, #10B981)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={15} color="#fff" />
            </div>
            <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>ArcLight AI 2.0</span>
          </div>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Urban Sustainability Intelligence OS · Built for city-scale impact</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="dot dot-live" style={{ width: 6, height: 6 }} />
            <span style={{ fontSize: 12.5, color: 'var(--emerald)', fontWeight: 700 }}>All systems operational</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

