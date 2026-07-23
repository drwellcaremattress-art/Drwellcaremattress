/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#1E7FC2',
        'primary-blue-dark': '#155E93',
        'primary-blue-light': '#EAF4FB',
        'brand-green': '#7CB93E',
        'brand-green-dark': '#5C9128',
        'brand-green-light': '#F1F8E9',
        'ink': '#1A2B3C',
        'ink-muted': '#5B6B7B',
        'surface': '#FFFFFF',
        'surface-alt': '#F7FAFC',
        'warning-gold': '#F5A623',
        'error-red': '#E8483C',
      },
      fontFamily: {
        heading: ['Poppins', 'Sora', 'sans-serif'],
        body: ['Inter', 'Work Sans', 'sans-serif'],
        mono: ['DM Sans', 'monospace'],
      },
      boxShadow: {
        soft: '0 4px 24px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
}
