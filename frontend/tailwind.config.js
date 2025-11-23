/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {

    extend: {

      colors: {

        primary: '#29D9D5', 
        'primary-dark': '#20B2AF', 
        secondary: '#2D3748',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 5s linear infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },

  plugins: [],
}