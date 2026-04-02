/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        'cs-bg-base': '#08080c',
        'cs-bg-surface': '#0f0f15',
        'cs-bg-elevated': '#16161f',
        'cs-bg-overlay': '#1c1c28',
        'cs-accent': '#4f8ff7',
        'cs-accent-hover': '#3a7ce6',
        'cs-text-primary': '#f0f0f3',
        'cs-text-secondary': '#9394a1',
        'cs-text-tertiary': '#5c5d6e',
        'cs-risk-low': '#10b981',
        'cs-risk-medium': '#f59e0b',
        'cs-risk-high': '#f97316',
        'cs-risk-critical': '#ef4444',
        'cs-border': 'rgba(255,255,255,0.06)',
      },
    },
  },
  plugins: [],
}
