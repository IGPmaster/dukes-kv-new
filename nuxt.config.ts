export default defineNuxtConfig({
  ssr: true,
  devtools: { enabled: false },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts'
  ],
  googleFonts: {
    families: {
      Poppins: [300, 400, 500, 600, 700],
      Roboto: [100, 200, 300, 400, 500, 600, 700]
    },
    display: 'swap',
    prefetch: true,
    preconnect: true,
    preload: true,
    download: true,
    base64: false
  },
  nitro: {
    preset: 'cloudflare-pages',
    prerender: {
      routes: ['/'],
      ignore: [
        '/blog/**'
      ]
    }
  },
  routeRules: {
    '/': { prerender: true },
    '/blog/**': { 
      ssr: true,
      swr: false
    }
  },
  experimental: {
    payloadExtraction: false,
    inlineSSRStyles: false,
    renderJsonPayloads: true
  },
  router: {
    options: {
      strict: false
    }
  },
  css: ['~/assets/main.css'],

  app: {
    head: {
      title: 'Dukes Casino - Your Casino!',
      meta: [
        { name: 'description', content: "Enjoy seamless mobile gaming with Dukes Casino's mobile slots." }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/bd-faviconV2.png' },
        { 
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/icon?family=Material+Icons'
        }
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },

  hooks: {
    'app:created': async () => {
      await loadTranslations()
    }
  },
  build: {
    transpile: ['vue']
  },
  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://your-site.com'
    }
  }
});