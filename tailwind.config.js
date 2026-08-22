/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#070A12',
          900: '#0B0F19',
          800: '#111726',
          700: '#1A2236',
          600: '#243049',
          500: '#334155',
        },
        cyber: {
          50: '#E8F8FF',
          100: '#C2ECFF',
          200: '#8FD9FF',
          300: '#54C2FF',
          400: '#22A8FF',
          500: '#0B8DE8',
          600: '#006FC4',
        },
        lime: {
          300: '#B6FF6A',
          400: '#8FFF3C',
          500: '#5EE32B',
          600: '#3DBA12',
        },
        ember: {
          300: '#FFB07A',
          400: '#FF8A4C',
          500: '#FF6A1A',
          600: '#E04E00',
        },
        danger: {
          300: '#FF8A8A',
          400: '#FF5C5C',
          500: '#F23B3B',
          600: '#C81E1E',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(34,168,255,0.55)',
        'glow-lime': '0 0 40px -8px rgba(143,255,60,0.5)',
        'glow-danger': '0 0 40px -8px rgba(255,92,92,0.5)',
        glass: '0 8px 40px -12px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)',
      },
      backgroundImage: {
        'grid-dots': 'radial-gradient(circle at 1px 1px, rgba(120,160,220,0.12) 1px, transparent 0)',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-22px) rotate(6deg)' },
        },
        'float-slow': {
          '0%,100%': { transform: 'translateY(0) translateX(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-30px) translateX(14px) rotate(-8deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.8)', opacity: '0.7' },
          '100%': { transform: 'scale(2.4)', opacity: '0' },
        },
        'spin-slow': {
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        float: 'float 7s ease-in-out infinite',
        'float-slow': 'float-slow 11s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
        'pulse-ring': 'pulse-ring 2.4s ease-out infinite',
        'spin-slow': 'spin-slow 18s linear infinite',
      },
    },
  },
  plugins: [],
};
