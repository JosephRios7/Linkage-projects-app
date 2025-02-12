/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#6f2527', // Un azul claro personalizado
          DEFAULT: '#1E3A8A', // Color principal
          dark: '#102A43' // Un azul más oscuro
        },
        secondary: {
          light: '#FFE5D9', // Naranja claro
          DEFAULT: '#FF7849', // Color secundario principal
          dark: '#DB4A39' // Naranja oscuro
        },
        neutral: {
          light: '#F5F5F5',
          DEFAULT: '#A0AEC0',
          dark: '#4A5568'
        }
      }
    }
  },
  plugins: [],
};

