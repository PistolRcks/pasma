
const { nextui } = require("@nextui-org/react");

export default {
  content: [
    "./client/**/*.jsx",
    "./public/*.{html, js}", 
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [nextui()],
}
