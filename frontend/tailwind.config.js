/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        eshag: {
          gold: {
            50: '#fffbeb',
            100: '#fef3c7',
            200: '#fde68a',
            300: '#fcd34d',
            400: '#fbbf24',
            500: '#f59e0b',
            600: '#d97706',
            700: '#b45309',
            800: '#92400e',
            900: '#78350f',
          },
          slate: {
            800: '#1e293b',
            850: '#172033',
            900: '#0f172a',
            950: '#020617',
          },
          steel: '#334155',
          cream: '#fcfbf7',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Montserrat', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'brand': '0 10px 25px -5px rgba(217, 119, 6, 0.1), 0 8px 10px -6px rgba(217, 119, 6, 0.1)',
        'card': '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
      }
    },
  },
  plugins: [],
}