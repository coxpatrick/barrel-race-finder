/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Western-inspired palette
        saddle: {
          50:  '#fdf8f0',
          100: '#f9edda',
          200: '#f2d9af',
          300: '#e8bf7c',
          400: '#dc9f4a',
          500: '#cc7f28',
          600: '#b5631e',
          700: '#954a1a',
          800: '#793c1c',
          900: '#64331a',
          950: '#371809',
        },
        dust: {
          50:  '#faf7f2',
          100: '#f2ece0',
          200: '#e6d9c0',
          300: '#d5bf97',
          400: '#c09f6a',
          500: '#b0864d',
          600: '#9a6f40',
          700: '#7f5836',
          800: '#694930',
          900: '#573d2a',
          950: '#2f1f14',
        },
        mesa: {
          50:  '#fff5f0',
          100: '#ffe8dc',
          200: '#ffd0ba',
          300: '#ffaf8a',
          400: '#ff8050',
          500: '#ff5a24',
          600: '#f03c0a',
          700: '#c72e08',
          800: '#9e270e',
          900: '#80240f',
          950: '#450f04',
        },
        prairie: {
          50:  '#f5f7f0',
          100: '#e8ecdc',
          200: '#d2dabc',
          300: '#b3c193',
          400: '#94a86c',
          500: '#798d51',
          600: '#5e6f3e',
          700: '#4b5733',
          800: '#3e472c',
          900: '#353d27',
          950: '#1b2012',
        },
        leather: '#8B4513',
        cream: '#FFF8F0',
        charcoal: '#1C1C1C',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Source Serif 4"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-in': 'slideIn 0.5s ease-out forwards',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
