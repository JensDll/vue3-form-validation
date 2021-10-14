// @ts-check

/**
 * @type {import('vitepress').UserConfig}
 */
module.exports = {
  title: 'Vue 3 Form Validation',
  description: 'Vue composition function for Form validation',
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/getting-started' },
      {
        text: 'GitHub',
        link: 'https://github.com/JensDll/vue3-form-validation'
      }
    ],
    sidebar: {
      '/': [
        {
          text: 'Introduction',

          children: [{ text: 'Getting Started', link: '/getting-started' }]
        }
      ]
    }
  }
}
