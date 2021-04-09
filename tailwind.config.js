const colors = require(`tailwindcss/colors`)

// tailwind.config.js
module.exports = {
  darkMode: `class`,
  purge: [`./pages/**/*.{js,ts,jsx,tsx}`, `./components/**/*.{js,ts,jsx,tsx}`],
  theme: {
    extend: {
      colors: {
        primary: colors.green,
        'dark-gray': {
          100: `#eeeeee`,
          200: `#e0e0e0`,
          300: `#bdbdbd`,
          400: `#9e9e9e`,
          500: `#757575`,
          600: `#616161`,
          700: `#424242`,
          800: `#212121`,
          900: `#111111`,
        },
      },
    },
  },
  plugins: [require(`@tailwindcss/forms`)],
}
