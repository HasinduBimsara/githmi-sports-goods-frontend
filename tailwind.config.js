/** @type {import('tailwindcss').Config} */
export default {
  // THIS IS THE CRITICAL LINE FOR THE TOGGLE TO WORK
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: "#FF6363",
      },
    },
  },
  plugins: [],
};
