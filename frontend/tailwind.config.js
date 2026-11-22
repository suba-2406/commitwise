/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: '#F5F0E8',
          light: '#FAF7F2',
          dark: '#E8E1D5',
        },
        charcoal: {
          DEFAULT: '#292D2C',
          light: '#363C3B',
          dark: '#1F2221',
          darker: '#151717',
        },
        terracotta: {
          DEFAULT: '#D97745',
          hover: '#C66535',
          light: '#E69268',
        },
        sage: {
          DEFAULT: '#65A99B',
          hover: '#529688',
          light: '#86BFB4',
          dark: '#457D72',
        },
        sand: {
          DEFAULT: '#E8C99B',
          light: '#F3DFBF',
          dark: '#D8B37C',
        },
        mutedGrey: '#8A8D88',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

