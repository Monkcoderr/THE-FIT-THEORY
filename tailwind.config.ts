import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // ─── Nike storefront palette (light) ───
        nike: {
          ink: '#111111',
          canvas: '#ffffff',
          cloud: '#f5f5f5',
          charcoal: '#39393b',
          ash: '#4b4b4d',
          mute: '#707072',
          stone: '#9e9ea0',
          hairline: '#cacacb',
          'hairline-soft': '#e5e5e5',
          sale: '#d30005',
          'sale-deep': '#780700',
          success: '#007d48',
          'success-bright': '#1eaa52',
          info: '#1151ff',
        },
        // ─── Brand gradient (premium athletic accent) ───
        brand: {
          from: '#FF512F',
          to: '#F09819',
        },
        // ─── Vercel admin palette (dark-on-light + ink) ───
        vercel: {
          ink: '#171717',
          body: '#4d4d4d',
          mute: '#888888',
          hairline: '#ebebeb',
          'hairline-strong': '#a1a1a1',
          canvas: '#ffffff',
          'canvas-soft': '#fafafa',
          'canvas-soft-2': '#f5f5f5',
          link: '#0070f3',
          'link-deep': '#0761d1',
          success: '#0070f3',
          error: '#ee0000',
          'error-deep': '#c50000',
          warning: '#f5a623',
          'warning-deep': '#ab570a',
          violet: '#7928ca',
          cyan: '#50e3c2',
          'cyan-deep': '#29bc9b',
        },
        // ─── Admin dark surface (the CRM uses a dark shell) ───
        admin: {
          bg: '#000000',
          surface: '#0a0a0a',
          'surface-2': '#111111',
          border: '#262626',
          'border-soft': '#1f1f1f',
          text: '#ededed',
          'text-soft': '#a1a1a1',
          mute: '#737373',
          blue: '#0070f3',
          'blue-hover': '#3291ff',
          green: '#50e3c2',
          amber: '#f5a623',
          red: '#ff4444',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      fontSize: {
        'display-campaign': ['clamp(3rem, 8vw, 6rem)', { lineHeight: '0.9', fontWeight: '700' }],
        'heading-xl': ['2rem', { lineHeight: '1.2', fontWeight: '500' }],
        'heading-lg': ['1.5rem', { lineHeight: '1.2', fontWeight: '500' }],
      },
      borderRadius: {
        nike: '30px',
        'nike-md': '24px',
      },
      maxWidth: {
        nike: '1440px',
        vercel: '1400px',
      },
      spacing: {
        section: '48px',
        'touch': '44px',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
        'fade-in': 'fade-in 0.2s ease-out',
        'slide-up': 'slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scale-in 0.15s ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
