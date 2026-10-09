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
        brand: {
          emerald: '#0D9488',
          emeraldDark: '#0F766E',
          emeraldLight: '#14B8A6',
          navy: '#0F172A',
          slate: '#1E293B',
          card: '#1E293B',
          bg: '#0B1120'
        }
      }
    },
  },
  plugins: [],
}
