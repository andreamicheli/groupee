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
      "t-green": "#28DDB1",
      "t-green-hover": "#00deb2",
      "t-green-active": "#008062",
    },
    fontFamily: {
      poppins: ["Poppins", "sans-serif"],
    },
    extend: {
      animation: {
        "light-bounce": "lightBounce 1s ease-in-out infinite",
      },
      keyframes: {
        lightBounce: {
          "0%, 100%": {
            transform: "translateY(0)",
          },
          "50%": {
            transform: "translateY(-10px)", // Adjust height as needed
          },
        },
      },
    },
  },
  plugins: [],
};
