// middleware/promotion.ts
export default defineNuxtRouteMiddleware((to) => {
  if (to.path.startsWith('/promotion/')) {
    // Remove trailing slash if it exists
    const cleanPath = to.path.endsWith('/') ? to.path.slice(0, -1) : to.path;
    
    // Only redirect if we're not already on the correct path
    if (to.path !== cleanPath) {
      return navigateTo(cleanPath, { replace: true });
    }
  }
});