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
        maxAge: 60 * 60 // 1 hour cache
      }
    },
    '/promotion/**': { 
      ssr: true
    }
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
    },
    'nitro:config': async (nitroConfig) => {
      try {
        // Fetch active promotions
        const response = await fetch(
          'https://casino-promotions-api.tech1960.workers.dev/promotions?brandId=30&lang=IE'
        );
        if (response.ok) {
          const promotions = await response.json();
          const activePromotions = promotions.filter(promo => promo.status === 'active');
          
          // Add promotion routes to prerender
          nitroConfig.prerender.routes = [
            ...nitroConfig.prerender.routes,
            ...activePromotions.map(promo => `/promotion/${promo.slug}`)
          ];
        }
      } catch (error) {
        console.error('Error fetching promotions for prerender:', error);
      }
    }
  }
});