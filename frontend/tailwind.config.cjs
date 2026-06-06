/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FFF8F3',
          100: '#FFEAD9',
          200: '#FFD1AF',
          300: '#FFB580',
          400: '#FF9651',
          500: '#FF7A2E',
          600: '#E65A00',
          700: '#CC4D00',
          800: '#A33D00',
          900: '#7A2E00',
        },
        guming: {
          orange: '#FF7A2E',
          brown: '#8B4513',
          cream: '#FFF8F0',
          bg: '#F5F5F5',
          card: '#FFFFFF',
          price: '#FF4D4F',
          success: '#52C41A',
          text: '#1A1A1A',
          sub: '#999999',
          border: '#F0F0F0',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'PingFang SC',
          'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue',
          'Helvetica', 'Arial', 'sans-serif',
        ],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '20px',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0,0,0,0.06)',
        'card-lg': '0 4px 16px rgba(0,0,0,0.08)',
        'float': '0 6px 20px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
};