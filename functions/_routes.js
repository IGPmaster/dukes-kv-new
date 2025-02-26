// This is a Cloudflare Function that handles routing for the SPA
export async function onRequest(context) {
  const request = context.request;
  const url = new URL(request.url);
  const path = url.pathname;

  // Log the request for debugging
  console.log(`[Function] Processing request for: ${path}`);

  // Check if the request is for a static asset
  if (
    path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/) ||
    path.startsWith('/assets/') ||
    path.startsWith('/images/') ||
    path.startsWith('/img/') ||
    path.startsWith('/js/') ||
    path.startsWith('/css/')
  ) {
    console.log(`[Function] Detected static asset, passing to next handler: ${path}`);
    return context.next();
  }

  // For ALL other routes, serve the SPA's index.html without redirecting
  try {
    console.log(`[Function] Serving SPA for path: ${path}`);
    
    // Fetch the index.html file
    const response = await fetch(`${url.origin}/index.html`);
    
    if (!response.ok) {
      console.error(`[Function] Failed to fetch index.html: ${response.status}`);
      return new Response(`Failed to fetch index.html: ${response.status}`, { 
        status: 500 
      });
    }
    
    const html = await response.text();
    
    // Return the index.html content but keep the original URL
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        // Very aggressive cache prevention
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        // Add a custom header to verify this function ran
        'X-Handled-By': 'Cloudflare-Function-SPA-Router'
      },
      status: 200
    });
  } catch (error) {
    console.error(`[Function] Error serving SPA: ${error.message}`);
    return new Response(`Error serving SPA: ${error.message}`, { 
      status: 500 
    });
  }
} 