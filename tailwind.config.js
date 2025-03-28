/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4A5568',
        secondary: '#718096',
        accent: {
          blue: '#38B2AC',
          green: '#68D391',
          coral: '#F56565',
          gold: '#fbb130',
          teal: '#1ad3bb',
          slate: '#718096',
        },
        blue: {
          '50': '#E6FFFA',
          '100': '#B2F5EA',
          '200': '#81E6D9',
          '300': '#4FD1C5',
          '400': '#38B2AC',
          '500': '#319795',
          '600': '#2C7A7B',
          '700': '#285E61',
          '800': '#234E52',
          '900': '#1D4044',
        },
        mauve: {
          '3': '#d7c1cb',
          '4': '#b79aa8',
          '5': '#916a7a',
          '6': '#735365',
          '7': '#5c4251',
          '8': '#46323F',
          '9': '#2E212A',
          '10': '#1F1620',
          '11': '#4A3A42',
          '12': '#261E23',
        },
        gold: {
          '4': '#fed27f',
          '5': '#fcbc49',
          '7': '#d99618',
          '11': '#8c5e05',
        },
        background: '#F7FAFC',
        content: '#FFFFFF',
        border: '#E2E8F0',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
} 