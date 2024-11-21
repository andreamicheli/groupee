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
      "t-green-transparent": "#DAFEF4FF",
      "t-green": "#28DDB1",
      "t-green-hover": "#00deb2",
      "t-green-active": "#008062",
      "t-burgundy": "#A02B2B",
      "t-burgundy-hover": "#7E1E1E",
      "t-burgundy-active": "#4F0F0F",
      "t-purple": "#6C5CE7",
      "t-purple-hover": "#4A3EBE",
      "t-purple-active": "#2B1F7D",
      "t-error": "#c75f61",
      "t-white-transparent": "#FFFFFF8A",
      unactive: "#3B8383",
      google: {
        "text-gray": "#3c4043",
        "button-blue": "#1a73e8",
        "button-blue-hover": "#5195ee",
        "button-dark": "#202124",
        "button-dark-hover": "#555658",
        "button-border-light": "#dadce0",
        "logo-blue": "#4285f4",
        "logo-green": "#34a853",
        "logo-yellow": "#fbbc05",
        "logo-red": "#ea4335",
      },
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
  plugins: [require("tailwindcss-motion")],
};
