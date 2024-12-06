export default defineNuxtConfig({
  ssr: true,
  router: {
    trailingSlash: false
  },
  nitro: {
    preset: 'cloudflare-pages',
    output: {
      dir: '.output',
      publicDir: '.output/public'
    },
    prerender: {
      failOnError: false,
      crawlLinks: true,
      routes: [
        '/',
        '/blog',
        '/promotion'
      ]
    },
    routeRules: {
      '/api/promotion/**': {
        proxy: 'https://casino-promotions-api.tech1960.workers.dev/api/promotion/**'
      }
    }
  },
  experimental: {
    payloadExtraction: false
  },
  routeRules: {
    '/': { prerender: true },
    '/blog': { prerender: true },
    '/promotion': { prerender: true },
    '/blog/**': { 
      ssr: true,
      cache: {
        maxAge: 60 * 60
      }
    },
    '/promotion/**': {
      ssr: true
    }
  },
  // Rest of your config stays the same
  css: ['~/assets/main.css'],
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
      htmlAttrs: {
        lang: 'en'
      }
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },
 hooks: {
    'app:created': async () => {
      await loadTranslations()
    }
  },
  // Add runtime config for API URL
  runtimeConfig: {
    public: {
      promotionsWorkerUrl: process.env.PROMOTIONS_WORKER_URL
    }
  }
});