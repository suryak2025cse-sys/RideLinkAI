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
        rapidoYellow: '#FACC15',
        rapidoYellowDark: '#EAB308',
        rapidoBlack: '#0F172A',
        rapidoBg: '#F8FAFC',
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'rapido-card': '0 4px 20px -2px rgba(15, 23, 42, 0.06)',
        'rapido-yellow': '0 8px 25px -5px rgba(250, 204, 21, 0.4)',
      }
    },
  },
  plugins: [],
}
