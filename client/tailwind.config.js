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
        darkbg: '#030712',
        darkcard: 'rgba(15, 23, 42, 0.75)',
        cyberCyan: '#00f5d4',
        cyberPurple: '#7b2cbf',
        cyberBlue: '#4361ee',
        cyberEmerald: '#10b981',
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'neon-cyan': '0 0 35px -5px rgba(0, 245, 212, 0.4)',
        'neon-purple': '0 0 35px -5px rgba(123, 44, 191, 0.4)',
        'neon-blue': '0 0 35px -5px rgba(67, 97, 238, 0.4)',
        'cyber-glass': '0 25px 60px -15px rgba(0, 0, 0, 0.8)',
      }
    },
  },
  plugins: [],
}
