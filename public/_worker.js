// This is a Cloudflare Worker that handles routing for the SPA
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Check if the request is for a static asset
    if (
      path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/) ||
      path.startsWith('/assets/') ||
      path.startsWith('/images/') ||
      path.startsWith('/img/') ||
      path.startsWith('/js/') ||
      path.startsWith('/css/')
    ) {
      // Let Cloudflare Pages handle static assets
      return env.ASSETS.fetch(request);
    }

    // For ALL other routes, serve the SPA's index.html without redirecting
    // This includes /blog/* paths and any other non-asset paths
    try {
      const response = await env.ASSETS.fetch(`${url.origin}/index.html`);
      
      // Return the index.html content but keep the original URL
      return new Response(response.body, {
        headers: {
          ...response.headers,
          'Content-Type': 'text/html; charset=utf-8',
          // Prevent caching to ensure fresh content
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        },
        status: 200
      });
    } catch (error) {
      return new Response(`Error serving SPA: ${error.message}`, { status: 500 });
    }
  }
};
