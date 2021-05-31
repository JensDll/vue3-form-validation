module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true
  },
  purge: [],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      ...require('tailwindcss/colors')
    }
  },
  variants: {
    extend: {
      margin: ['first', 'last']
    }
  },
  plugins: []
};
