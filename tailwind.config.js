/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        arclight: {
          bg: '#050A14',
          surface: '#0C1628',
          card: '#0F1E35',
          primary: '#00D4FF',
          secondary: '#00FF94',
          accent: '#FF6B35',
          warning: '#FFB800',
          danger: '#FF3D5A',
          text: '#E8F4FD',
          muted: '#7A9BB5',
          border: '#1A3050',
          glow: 'rgba(0, 212, 255, 0.15)',
          'glow-green': 'rgba(0, 255, 148, 0.15)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'arclight-gradient': 'linear-gradient(135deg, #00D4FF 0%, #00FF94 100%)',
        'arclight-radial': 'radial-gradient(ellipse at top, #0C1628 0%, #050A14 70%)',
        'card-gradient': 'linear-gradient(145deg, rgba(15,30,53,0.9) 0%, rgba(12,22,40,0.95) 100%)',
        'hero-gradient': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0,212,255,0.15) 0%, transparent 60%)',
      },
      boxShadow: {
        'arclight': '0 0 30px rgba(0, 212, 255, 0.15), 0 4px 24px rgba(0, 0, 0, 0.4)',
        'arclight-hover': '0 0 50px rgba(0, 212, 255, 0.25), 0 8px 32px rgba(0, 0, 0, 0.5)',
        'green-glow': '0 0 30px rgba(0, 255, 148, 0.2)',
        'orange-glow': '0 0 20px rgba(255, 107, 53, 0.3)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'scan': 'scan 2s linear infinite',
        'data-flow': 'dataFlow 1.5s ease-in-out infinite',
        'fadeIn': 'fadeIn 0.5s ease-out',
        'slideUp': 'slideUp 0.4s ease-out',
        'slideRight': 'slideRight 0.4s ease-out',
        'spin-slow': 'spin 8s linear infinite',
        'ping-slow': 'ping 3s cubic-bezier(0,0,0.2,1) infinite',
        'count-up': 'countUp 2s ease-out',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.1)' },
          '100%': { boxShadow: '0 0 40px rgba(0, 212, 255, 0.3)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        dataFlow: {
          '0%': { opacity: '0.3', transform: 'scaleX(0.95)' },
          '50%': { opacity: '1', transform: 'scaleX(1)' },
          '100%': { opacity: '0.3', transform: 'scaleX(0.95)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        countUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
