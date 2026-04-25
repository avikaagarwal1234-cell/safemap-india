/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          dark: '#1A1A6E',
        },
        purple: {
          primary: '#2E3192',
          light: '#6B6BC8',
        }
      }
    },
  },
  plugins: [],
}
