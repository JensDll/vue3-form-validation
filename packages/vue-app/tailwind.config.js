module.exports = {
  purge: ['index.html', 'src/**/*.vue'],
  darkMode: false,
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      ...require('tailwindcss/colors')
    },
    extend: {
      fontFamily: {
        body: ["'Montserrat', sans-serif"]
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: [require('@tailwindcss/forms')]
}
