/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'custom-1333': '1333px',
      },
      backdropBlur: {
        'xl': '24px',
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'pulse-slow': 'pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float-slow 12s ease-in-out infinite',
        'spin-slow': 'spin-slow 15s linear infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-position': '0% 50%',
          },
          '50%': {
            'background-position': '100% 50%',
          },
        },
        'pulse-slow': {
          '0%, 100%': {
            opacity: '0.2',
          },
          '50%': {
            opacity: '0.3',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
        'float-slow': {
          '0%, 100%': {
            transform: 'translateY(0) rotate(0deg)',
          },
          '33%': {
            transform: 'translateY(-15px) rotate(2deg)',
          },
          '66%': {
            transform: 'translateY(-7px) rotate(-2deg)',
          },
        },
        'spin-slow': {
          from: {
            transform: 'rotate(0deg)',
          },
          to: {
            transform: 'rotate(360deg)',
          },
        },
        shimmer: {
          to: {
            'background-position': '200% center',
          },
        },
      },
    },
  },
  plugins: [],
}