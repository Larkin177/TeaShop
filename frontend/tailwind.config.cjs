/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#4a9e4d', light: '#7bc67e', dark: '#3d8a40' },
        accent: { DEFAULT: '#ff7a2e', light: '#ff9651' },
        price: '#e85c3a',
        cream: '#f8f5f0',
        sidebar: '#f5f0e8',
      },
      fontFamily: {
        sans: [
          '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'PingFang SC',
          'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue',
          'Helvetica', 'Arial', 'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};