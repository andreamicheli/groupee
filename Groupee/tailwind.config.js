/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    colors: {
      transparent: "transparent",
      black: "#000",
      white: "#fff",
      "t-light": "#FAF0E8",
      "t-dark": "#1F4545",
      "t-orange": "#FF6433",
      "t-orange-hover": "#FF4D00",
      "t-orange-active": "#992400", // 50% brightness of #FF6433
      "t-blue": "#00FFFF",
      "t-green": "#00FFC2",
      "t-green-hover": "#00E88F",
      "t-green-active": "#008062",
    },
    fontFamily: {
      poppins: ["Poppins", "sans-serif"],
    },
    extend: {},
  },
  plugins: [],
};
