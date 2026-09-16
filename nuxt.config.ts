// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxtjs/color-mode', '@nuxtjs/i18n'],

  css: ['~/assets/css/main.css'],

  components: [
    { path: '~/components', pathPrefix: false },
    { path: '~/containers', pathPrefix: false }
  ],

  colorMode: {
    classSuffix: '',
    preference: 'dark',
    fallback: 'dark'
  },

  i18n: {
    locales: [
      { code: 'ru', name: 'Русский', file: 'ru.json' },
      { code: 'en', name: 'English', file: 'en.json' }
    ],
    defaultLocale: 'ru',
    langDir: 'locales',
    strategy: 'no_prefix'
  },

  app: {
    head: {
      title: 'Connecta — Кабинет',
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }
      ]
    }
  }
})
