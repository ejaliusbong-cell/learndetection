/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        pine: {
          DEFAULT: '#114232',
          dark: '#0a291f',
          light: '#1b5e48',
          subtle: '#eaf4f0',
        },
        mint: {
          DEFAULT: '#22c55e',
          soft: '#e7f7ed',
          border: '#bbf7d0',
          accent: '#86efac',
        },
        slate: {
          850: '#1e293b',
          950: '#0f172a',
        },
        canvas: '#f4f5f7',
        surface: '#ffffff',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'clean': '0 2px 14px rgba(0, 0, 0, 0.04)',
        'clean-hover': '0 8px 24px rgba(0, 0, 0, 0.07)',
        'pine': '0 8px 20px rgba(17, 66, 50, 0.25)',
      },
    },
  },
  plugins: [],
};
