/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
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
          DEFAULT: '#050816', // Fond ultra sombre
          card: '#0a0f24',    // Fond des cartes
          sidebar: '#02040a', // Fond sidebar
        },
        accent: {
          DEFAULT: '#d946ef', // Magenta/Fuchsia
          neon: '#22d3ee',    // Cyan
          orange: '#f97316',  // Orange historique (pour compatibilité)
        }
      },
      boxShadow: {
        'neon-purple': '0 0 20px rgba(217, 70, 239, 0.2)',
        'neon-cyan': '0 0 20px rgba(34, 211, 238, 0.2)',
      }
    },
  },
  plugins: [],
}