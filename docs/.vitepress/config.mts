import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/Hackmambatest/',
  title: 'API Dev Docs',
  description: 'Tutorials and API reference for JavaScript developers',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Tutorial', link: '/tutorial' },
      { text: 'API Reference', link: '/api-reference' },
    ],
    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Overview', link: '/' },
        ],
      },
      {
        text: 'Tutorial',
        items: [
          { text: 'First API Call with Axios', link: '/tutorial' },
        ],
      },
      {
        text: 'API Reference',
        items: [
          { text: 'GitHub REST API', link: '/api-reference' },
        ],
      },
    ],
    socialLinks: [],
    footer: {
      message: 'API Dev Docs — Day 7 & Day 9',
    },
  },
})
