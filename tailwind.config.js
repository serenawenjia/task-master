/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#F6F6F3",
        accent: {
          primary: "#FFCD71",
          secondary: "#FFF7E8",
        },
      },
    },
  },
  plugins: [],
};
