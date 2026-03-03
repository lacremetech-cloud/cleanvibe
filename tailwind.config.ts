import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // CleanVibe brand palette
        cv: {
          bg:       '#0A0A15',
          surface:  '#12122A',
          card:     '#1A1A35',
          border:   '#2A2A50',
          primary:  '#7C3AED',
          hover:    '#6D28D9',
          light:    '#A78BFA',
          muted:    '#64748B',
          text:     '#F1F5F9',
          subtle:   '#94A3B8',
        },
        // Keep slate for secondary grey elements
        slate: {
          850: '#1E293B',
          950: '#020617',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in':     'fadeIn 0.3s ease-in-out',
        'slide-up':    'slideUp 0.3s ease-out',
        'pulse-slow':  'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow':   'spin 8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'gradient-radial':   'radial-gradient(var(--tw-gradient-stops))',
        'violet-glow':       'radial-gradient(ellipse at 50% 50%, rgba(124, 58, 237, 0.15) 0%, transparent 70%)',
        'card-gradient':     'linear-gradient(135deg, rgba(124,58,237,0.1) 0%, transparent 60%)',
      },
      boxShadow: {
        'violet':     '0 0 30px rgba(124, 58, 237, 0.3)',
        'violet-lg':  '0 0 60px rgba(124, 58, 237, 0.4)',
        'card':       '0 4px 24px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
}

export default config
