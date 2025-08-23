/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "320px",
        xs2: "375px",
        sm: "425px",
        sm2: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1440px",
        "3xl": "1536px",
        "4xl": "1920px",
        "5xl": "2560px",
      },
    },
  },
  plugins: [],
};
