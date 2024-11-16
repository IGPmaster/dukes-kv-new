/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'signup-gradient': 'linear-gradient(305deg, rgba(187, 187, 187, 1) 0%, rgba(238, 238, 238, 1) 100%)',
        'login-gradient': 'linear-gradient(305deg, rgba(255, 196, 0, 1) 0%, rgba(255, 255, 0, 1) 100%)',
      },
      colors: {
        primary: '#f2e8b9',
        secondary: '#3f1b3c',
        primary_bg: '#3A1D3A',
        secondary_bg: '#F6C745',
        tertiary_dark: '#040404',
    },
  },
  plugins: [],
  important: true,
}
}