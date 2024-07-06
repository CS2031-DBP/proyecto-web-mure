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
        'color1': '#8E3356',
        'color2': '#C6466A',
        'color3': '#7A8841',
        'color4': '#3D502E',
        'gradient1': '#d3486c',
        'gradient2': '#b94267',
        'gradient3': '#aa3d62',
        'gradient4': '#9c385c',
        'gradient5': '#8e3356',
        'crema1': '#fffdf0', // nuevo tono de crema
        'crema2': '#faf8e5', // nuevo tono de crema
        'crema3': '#f4f2da', // nuevo tono de crema
        'crema4': '#eeedd0', // nuevo tono de crema
        'crema5': '#4e4446  ', // nuevo tono de crema
        'dark-charcoal': '#333333',
        'custom-purple-1': '#855995',
        'custom-purple-2': '#89538d',
        'custom-purple-3': '#8d477c',
        'custom-purple-4': '#8f4273',
        'prueba': '#a53b60',
        'verde': '#3BA580'
      },
    },
  },
  plugins: [],
}
