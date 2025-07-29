/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F9F5F0',
        sage: {
          50: '#f6f7f4',
          100: '#e9ebe5',
          200: '#d4d8cd',
          400: '#a3ad93',
          600: '#8A9B6E',
          700: '#6b7a56',
          800: '#556144',
          900: '#475238',
        },
        peach: '#FFD3B5',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'serif'],
        sans: ['Lato', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'float-delayed': 'float 3s ease-in-out infinite 1.5s',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
};