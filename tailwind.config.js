const { colors } = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");

module.exports = {
  content: ["./**/*.html", "./assets/**/*.js"],
  theme: {
    extend: {
      colors: {
        blue: {
          300: "#bfdbfe",
          600: "#8fbdd3",
          900: "#2c2e83",
        },
        brown: {
          300: "#e4d1b9",
          600: "#A0522D",
          900: "#8B4513",
          950: "#5c3d2e",
        },
        brand: {
          navy: "#0B1926",
          navyDark: "#071018",
          navyCard: "#132638",
          dark: "#141210",
          charcoal: "#1A1715",
          gold: "#C5A880",
          goldHover: "#D8BD98",
          cream: "#F8F6F2",
          creamSoft: "#F2EFE9",
          borderLight: "#E5DFD6",
          borderDark: "rgba(255, 255, 255, 0.14)",
        },
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities, theme }) {
      const colors = theme("colors");
      const newUtilities = {};

      // generowanie klas text-border-[color]
      function generate(colorGroup, prefix = "") {
        for (const [key, value] of Object.entries(colorGroup)) {
          if (typeof value === "string") {
            newUtilities[`.tb-${prefix}${key}`] = {
              "--tb-color": value,
            };
          } else {
            generate(value, `${prefix}${key}-`);
          }
        }
      }

      generate(colors);

      addUtilities(newUtilities, ["responsive"]);
    }),
    require("tailwind-scrollbar"),
  ],
};
