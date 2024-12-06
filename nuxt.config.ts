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
        '/promotions'  // Changed from /promotion to /promotions
      ]
    },
    // Add proxy configuration for API
    routeRules: {
      '/promotion/**': { 
        ssr: true,
        swr: true,
        maxAge: 0 // Disable caching for now while debugging
      }
    }
  },
  experimental: {
    payloadExtraction: false
  },
  routeRules: {
    '/': { prerender: true },
    '/blog': { prerender: true },
    '/promotion': { prerender: true },  // Changed from /promotion
    '/blog/**': { 
      ssr: true,
      cache: {
        maxAge: 60 * 60 // 1 hour cache
      }
    },
    '/promotion/**': {  // Changed from /promotion/**
      ssr: true,
      // Add SWR (stale-while-revalidate) for better performance
      cache: {
        swr: true,
        maxAge: 60 * 10 // 10 minutes cache
      }
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