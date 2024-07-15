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
        gradient1: '#d3486c',
        profilePink:'#d7556d',
        atColor: '#5BB8D5',
        atColor2: '#5C98C3',
        navbarHover: '#bf4167',
        navbarFocus: '#8A2E50',
        buttonColorPl: '#C5205A'
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        oleo: ['Oleo Script Swash Caps', 'cursive'],
      },
    },
  },
  plugins: [],
}
