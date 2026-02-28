/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

module.exports = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "tif-logo-blue": "#0997D5",
        "tif-logo-black": "#000000",
        "tif-blue": "#899CFA",
        "tif-lavender": "#8A79FE",
        "tif-pink": "#B78B9F",
        "tif-grey": "#F2F2F3",
      },
      keyframes: {
        arDetectFloorGuide: {
          "0%": { transform: "translateX(-100px) translateY(0px)" },
          "25%": { transform: "translateX(0px) translateY(-20px)" },
          "50%": { transform: "translateX(100px) translateY(0px)" },
          "75%": { transform: "translateX(0px) translateY(20px)" },
          "100%": { transform: "translateX(-100px) translateY(0px)" },
        },
      },
      animation: {
        arDetectFloorGuide: "arDetectFloorGuide 5s ease-in-out both infinite",
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-hide": {
          /* IE and Edge */
          "-ms-overflow-style": "none",

          /* Firefox */
          "scrollbar-width": "none",

          /* Safari and Chrome */
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
      });
    }),
  ],
};
