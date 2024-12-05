import { defineNuxtRouteMiddleware, navigateTo } from '#imports'
import { WHITELABEL_ID, lang } from '~/composables/globalData'

export default defineNuxtRouteMiddleware(async (to, from) => {
  console.log('Middleware running, path:', to.path);
  
  // Only handle promotion pages without trailing slash
  if (to.path.startsWith('/promotion/') && !to.path.endsWith('/')) {
    console.log('Processing promotion path');
    try {
      const slug = to.params.slug as string;
      console.log('Checking promotion:', slug, 'WHITELABEL_ID:', WHITELABEL_ID, 'lang:', lang.value);
      
      // Try to fetch the promotion data first
      const url = `https://casino-promotions-api.tech1960.workers.dev/promotion/${slug}?brandId=${WHITELABEL_ID}&lang=${lang.value || 'IE'}`;
      console.log('Fetching URL:', url);
      
      const response = await fetch(url);
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Promotion data:', data);
        console.log('Redirecting to:', to.path + '/');
        return navigateTo(to.path + '/', { redirectCode: 301 })
      } else {
        const errorText = await response.text();
        console.log('Promotion not found:', errorText);
      }
    } catch (error) {
      console.error('Error in middleware:', error);
    }
  } else {
    console.log('Path not processed by middleware');
  }
}) 