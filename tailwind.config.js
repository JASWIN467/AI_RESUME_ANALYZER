/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#f0f0ff',
          100: '#e5e3ff',
          200: '#cdc9ff',
          300: '#b09ffe',
          400: '#9373fb',
          500: '#7c52f7',
          600: '#6d32ed',
          700: '#5e22d9',
          800: '#4e1db5',
          900: '#421b93',
          950: '#280e62',
        },
        surface: {
          50:  '#f8f8fc',
          100: '#f0f0f8',
          200: '#e4e3f2',
          300: '#cccbe0',
          400: '#b0afc8',
          500: '#9694b0',
          600: '#827e98',
          700: '#6c6880',
          800: '#585569',
          900: '#494758',
          950: '#0f0e1a',
        },
        dark: {
          100: '#1a1828',
          200: '#14121f',
          300: '#0f0e1a',
          400: '#0a0912',
          500: '#060509',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(124, 82, 247, 0.3)',
        'glow-lg': '0 0 40px rgba(124, 82, 247, 0.25)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
}
