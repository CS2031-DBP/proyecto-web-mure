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
        'color1':'#8E3356',
        'color2':'#C6466A',
        'color3':'#7A8841',
        'color4':'#3D502E',
        'gradient1': '#c7486c', 
        'gradient2': '#b94267', 
        'gradient3': '#aa3d62', 
        'gradient4': '#9c385c', 
        'gradient5': '#8e3356', 
      },
    },
  },
  plugins: [],
}

