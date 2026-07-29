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
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb', // Primary Blue
          700: '#1d4ed8',
          900: '#1e3a8a'
        },
        slatebg: '#f8fafc',
        cardbg: '#ffffff',
        accentPink: '#ec4899',
        emeraldSuccess: '#10b981',
        amberWarning: '#f59e0b',
        roseError: '#ef4444'
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        xs: ['0.875rem', { lineHeight: '1.25rem' }],   // 14px
        sm: ['0.9375rem', { lineHeight: '1.375rem' }], // 15px
        base: ['1rem', { lineHeight: '1.5rem' }],      // 16px Body minimum
        lg: ['1.125rem', { lineHeight: '1.75rem' }],   // 18px Button / Subheadings
        xl: ['1.25rem', { lineHeight: '1.75rem' }],    // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }],     // 24px Heading
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],// 30px Heading
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],  // 36px Main Banner Heading
      },
      borderRadius: {
        '2xl': '1rem', // 16px rounded corners
        '3xl': '1.5rem'
      },
      boxShadow: {
        soft: '0 2px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
        card: '0 4px 20px -2px rgba(0, 0, 0, 0.06)',
        blueGlow: '0 4px 20px rgba(37, 99, 235, 0.2)'
      }
    },
  },
  plugins: [],
}
