/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        accent: "#14b8a6",
        accentSoft: "#99f6e4",
      },
    },
  },
  plugins: [],
};
