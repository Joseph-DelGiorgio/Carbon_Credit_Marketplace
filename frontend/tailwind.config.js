/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#166534', // deep green
          light: '#22c55e',
          dark: '#14532d',
        },
        secondary: {
          DEFAULT: '#38bdf8', // sky blue
          light: '#7dd3fc',
          dark: '#0ea5e9',
        },
        background: '#f0fdf4',
        foreground: '#14532d',
        accent: '#fbbf24', // gold
        neutral: '#e5e7eb', // gray-200
        error: '#ef4444',
        success: '#22c55e',
      },
    },
  },
  plugins: [],
}; 