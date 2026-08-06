/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#FBF9F5',
          100: '#F7F4EF',
          200: '#F0EBE2',
          300: '#E8E0D4',
        },
        sage: {
          600: '#1F3A32',
          700: '#295144',
          800: '#163028',
        },
        accent: {
          400: '#D4BC8A',
          500: '#C9A86A',
          600: '#B89355',
        },
        nude: {
          50: '#faf6f2',
          100: '#f5ebe4',
          200: '#ecd9ca',
          300: '#e0c2ac',
          400: '#d4a98c',
          500: '#c8906e',
          600: '#b87a5c',
          700: '#9a6249',
          800: '#7d4f3c',
          900: '#5e3d2e',
        },
        cream: {
          50: '#fdfbf7',
          100: '#faf5ee',
          200: '#f5ebe0',
          300: '#efddca',
          400: '#e8cbae',
        },
        gold: {
          50: '#fbf8f0',
          100: '#f6eed5',
          200: '#ecd9a8',
          300: '#ddbf78',
          400: '#cda44f',
          500: '#bd8e36',
          600: '#a3772d',
          700: '#825d27',
          800: '#6a4a24',
          900: '#543c22',
        },
        ink: {
          50: '#f6f6f5',
          100: '#e8e7e5',
          200: '#d1d0cd',
          300: '#b0afa9',
          400: '#888680',
          500: '#6b6963',
          600: '#54524d',
          700: '#45433f',
          800: '#3a3935',
          900: '#1a1a1a',
          950: '#0d0d0d',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'wider-2': '0.2em',
        'wider-3': '0.3em',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-up': 'fadeUp 0.7s ease-out forwards',
        'slide-in': 'slideIn 0.4s ease-out forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
