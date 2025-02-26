// This function specifically handles blog routes
export async function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.pathname;
  
  // Log the blog request for debugging
  console.log(`[Blog Function] Processing blog request for: ${path}`);
  console.log(`[Blog Function] Path params:`, context.params);
  
  try {
    console.log(`[Blog Function] Serving SPA for blog path: ${path}`);
    
    // Fetch the index.html file
    const response = await fetch(`${url.origin}/index.html`);
    
    if (!response.ok) {
      console.error(`[Blog Function] Failed to fetch index.html: ${response.status}`);
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
        'X-Handled-By': 'Cloudflare-Function-Blog-Router'
      },
      status: 200
    });
  } catch (error) {
    console.error(`[Blog Function] Error serving blog page: ${error.message}`);
    return new Response(`Error serving blog page: ${error.message}`, { 
      status: 500 
    });
  }
} 