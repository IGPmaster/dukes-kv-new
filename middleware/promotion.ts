// middleware/promotion.ts
import { defineNuxtRouteMiddleware, navigateTo } from '#imports'

export default defineNuxtRouteMiddleware(async (to) => {
  // Only handle promotion routes
  if (!to.path.startsWith('/promotion/')) {
    return;
  }

  // Remove trailing slash if it exists
  const cleanPath = to.path.endsWith('/') ? to.path.slice(0, -1) : to.path;
  if (to.path !== cleanPath) {
    return navigateTo(cleanPath, { replace: true });
  }

  // Extract the slug from the path
  const slug = to.params.slug as string;
  if (!slug) return;

  try {
    // Always use the full API URL
    const response = await fetch(
      `https://casino-promotions-api.tech1960.workers.dev/api/promotion/${slug}?brandId=30&lang=IE`
    );

    if (!response.ok) {
      console.error('Promotion not found:', slug);
      return navigateTo('/promotions');
    }

    // Let the page render if promotion exists
    return;
  } catch (error) {
    console.error('Error fetching promotion:', error);
    return navigateTo('/promotions');
  }
});