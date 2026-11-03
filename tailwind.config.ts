import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bmkg: {
          dark: "#0b1120",
          card: "#0f172a",
          border: "#1e293b",
          primary: "#0284c7",
          danger: "#ef4444",
          warning: "#f59e0b",
          success: "#10b981",
        },
      },
      animation: {
        'radar': 'radar 2.5s infinite linear',
        'pulse-glow': 'pulseGlow 2s infinite ease-in-out',
        'siren': 'sirenFlash 0.8s infinite',
      },
      keyframes: {
        radar: {
          '0%': { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(2.4)', opacity: '0' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.9' },
        },
        sirenFlash: {
          '0%, 100%': { backgroundColor: 'rgba(239, 68, 68, 0.2)' },
          '50%': { backgroundColor: 'rgba(239, 68, 68, 0.4)' },
        }
      },
    },
  },
  plugins: [],
};
export default config;
