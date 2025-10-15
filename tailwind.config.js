/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "media", // automatically follows system theme
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#3b82f6",
          DEFAULT: "#2563eb",
          dark: "#1e40af",
        },
      },
    },
  },
  plugins: [],
};
