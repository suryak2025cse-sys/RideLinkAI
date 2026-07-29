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
        darkbg: '#060813',
        darkcard: 'rgba(15, 23, 42, 0.65)',
        brandBlue: '#6366f1',
        brandPurple: '#a855f7',
        brandCyan: '#06b6d4',
        brandEmerald: '#10b981',
        brandPink: '#ec4899',
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'glow-indigo': '0 0 35px -5px rgba(99, 102, 241, 0.35)',
        'glow-emerald': '0 0 35px -5px rgba(16, 185, 129, 0.35)',
        'glow-purple': '0 0 35px -5px rgba(168, 85, 247, 0.35)',
        'glass': '0 20px 50px rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'aurora-mesh': 'radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.25) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(168, 85, 247, 0.2) 0px, transparent 50%), radial-gradient(at 50% 100%, rgba(6, 182, 212, 0.15) 0px, transparent 50%)',
      }
    },
  },
  plugins: [],
}
