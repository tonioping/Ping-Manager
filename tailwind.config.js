
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#0f172a', // Slate 900
          light: '#334155',
        },
        accent: {
          DEFAULT: '#f97316', // Orange 500
          hover: '#ea580c',
        }
      }
    },
  },
  plugins: [],
}
