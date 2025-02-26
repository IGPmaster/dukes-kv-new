// This function specifically handles the root path
export async function onRequest(context) {
  const url = new URL(context.request.url);
  
  console.log(`[Root Function] Processing root request`);
  
  try {
    // Fetch the index.html file
    const response = await fetch(`${url.origin}/index.html`);
    
    if (!response.ok) {
      console.error(`[Root Function] Failed to fetch index.html: ${response.status}`);
      return new Response(`Failed to fetch index.html: ${response.status}`, { 
        status: 500 
      });
    }
    
    const html = await response.text();
    
    // Return the index.html content
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        // Very aggressive cache prevention
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        // Add a custom header to verify this function ran
        'X-Handled-By': 'Cloudflare-Function-Root-Router'
      },
      status: 200
    });
  } catch (error) {
    console.error(`[Root Function] Error serving root page: ${error.message}`);
    return new Response(`Error serving root page: ${error.message}`, { 
      status: 500 
    });
  }
} 