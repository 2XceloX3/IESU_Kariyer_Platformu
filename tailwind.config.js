/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        iesu: {
          red: '#D32F2F', // Kırmızı
          darkRed: '#B71C1C',
          coral: '#FF6F61', // Nar Çiçeği
          lightCoral: '#FF8A80',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        serif: ['"Playfair Display"', 'Times New Roman', 'serif'],
      }
    },
  },
  plugins: [],
}
