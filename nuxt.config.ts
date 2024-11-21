export default defineNuxtConfig({
  ssr: true,
  nitro: {
    preset: 'cloudflare-pages',
    output: {
      dir: '.output',
      publicDir: '.output/public'
    },
    prerender: {
      fallback: true,
      crawlLinks: true,
      routes: [] // Remove dynamic routes like '/blog'
    },
    public: {
      baseURL: '/' // Use '/' for root deployment
    }
  },
  routeRules: {
    '/**': { isr: true }, // Default for most pages
    '/blog/**': { ssr: true, swr: true, swrTTL: 60 } // Dynamic rendering
  },
  router: {
    trailingSlash: false // Ensure no redirect loops from trailing slashes
  },
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
  }
});
