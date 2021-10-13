const colors = require('tailwindcss/colors')
delete colors.lightBlue

module.exports = {
  mode: 'jit',
  purge: ['index.html', 'src/**/*.vue'],
  darkMode: false,
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      ...colors
    },
    area: {
      test: 'grid-area: test'
    },
    extend: {
      screens: {
        xs: '411px'
      },
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
