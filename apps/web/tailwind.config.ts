import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#1E7FC2',
        'primary-blue-dark': '#155E93',
        'primary-blue-light': '#EAF4FB',
        'primary-navy': '#041E42',
        'brand-green': '#7CB93E',
        'brand-green-dark': '#5C9128',
        'brand-green-light': '#F1F8E9',
        'ink': '#1A2B3C',
        'ink-muted': '#5B6B7B',
        'surface': '#FFFFFF',
        'surface-alt': '#F7FAFC',
        'warning-gold': '#F5A623',
        'error-red': '#E8483C',
        'badge-purple': '#9B6B9E',
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
      fontFamily: {
        heading: ['var(--font-poppins)', 'var(--font-sora)', 'sans-serif'],
        body: ['var(--font-inter)', 'var(--font-work-sans)', 'sans-serif'],
        mono: ['var(--font-dm-sans)', 'monospace'],
      },
      boxShadow: {
        soft: '0 4px 24px rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '24px',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-left': {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
        'fade-in-left': 'fade-in-left 1s ease-out forwards',
        'float': 'float 3.5s ease-in-out infinite',
      }
    },
  },
  plugins: [],
};
export default config;
