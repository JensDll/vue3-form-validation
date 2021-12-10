module.exports = {
  content: ['index.html', 'src/**/*.vue'],

  theme: {
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
