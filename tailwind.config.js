/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgColor: '#F8E8D5',
        buttonColor: '#8E3356',
        fontColor: '#000000',
        highlightColor: '#FF820E',
        inputBgColor: '#FFFDF1',
        textPrimary: '#8E3356',
        placeholderColor: '#828282',
        gradient1: '#d3486c'
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        oleo: ['Oleo Script Swash Caps', 'cursive'],
      },
    },
  },
  plugins: [],
}
