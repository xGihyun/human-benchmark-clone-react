/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      gridTemplateRows: {
        "8-90px": "repeat(8, minmax(90px, 90px))"
      },
      gridTemplateColumns: {
        "10-90px": "repeat(10, minmax(90px, 90px))"
      }
    },
  },
  plugins: [],
}
