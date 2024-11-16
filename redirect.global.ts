// middleware/redirect.global.ts
export default defineNuxtRouteMiddleware((to, from) => {
  // Check if this is a direct page load (no from.path) and it's a blog post
  if (!from.path && to.path.startsWith('/blog/')) {
    console.log('Direct access to blog post:', to.path)
  }
})