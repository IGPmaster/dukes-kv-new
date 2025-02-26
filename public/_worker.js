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
      path.startsWith('/img/')
    ) {
      // Let Cloudflare Pages handle static assets
      return env.ASSETS.fetch(request);
    }

    // Special handling for blog posts
    if (path.startsWith('/blog/')) {
      // Rewrite to index.html for client-side routing to handle
      const response = await env.ASSETS.fetch(`${url.origin}/index.html`);
      return new Response(response.body, {
        headers: response.headers,
        status: 200
      });
    }

    // For all other routes, serve the SPA's index.html
    if (!path.includes('.')) {
      const response = await env.ASSETS.fetch(`${url.origin}/index.html`);
      return new Response(response.body, {
        headers: response.headers,
        status: 200
      });
    }

    // Default: let Cloudflare Pages handle the request
    return env.ASSETS.fetch(request);
  }
};
