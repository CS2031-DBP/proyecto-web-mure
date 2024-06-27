/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'spotify-gray': '#1e1e1e',
        'spotify-black': '#000000',
      },
    },
  },
  plugins: [],
}

