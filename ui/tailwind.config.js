/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',     // App router
    './pages/**/*.{js,ts,jsx,tsx}',   // Pages (if you use them)
    './components/**/*.{js,ts,jsx,tsx}' // Components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
