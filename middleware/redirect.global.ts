// middleware/redirect.global.ts
import { defineNuxtRouteMiddleware, navigateTo } from '#imports'

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Only handle promotion pages without trailing slash
  if (to.path.startsWith('/promotion/') && !to.path.endsWith('/')) {
    try {
      const slug = to.params.slug as string;
      // Try to fetch the promotion data first
      const response = await fetch(
        `https://casino-promotions-api.tech1960.workers.dev/promotion/${slug}?brandId=30&lang=IE`
      );
      
      if (response.ok) {
        // Data exists, redirect to same URL with trailing slash
        return navigateTo(to.path + '/', { redirectCode: 301 })
      }
    } catch (error) {
      console.error('Error checking promotion:', error);
    }
  }
})