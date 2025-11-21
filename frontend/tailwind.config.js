/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB', // Warna Biru Khas 
        secondary: '#1E293B', // Warna Gelap Elegan
      }
    },
  },
  plugins: [],
}