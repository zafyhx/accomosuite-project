/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {
      colors: {
        // Warna Cyan Segar
        primary: '#29D9D5', 
        'primary-dark': '#20B2AF', // Versi agak gelap untuk efek hover
        secondary: '#2D3748', // Warna teks gelap
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'], // Gunakan font Poppins
      }
    },
  },
  plugins: [],
}