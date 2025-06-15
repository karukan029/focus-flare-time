export default {
  async fetch(request: Request, env: any, ctx: ExecutionContext): Promise<Response> {
    try {
      // Get the URL from the request
      const url = new URL(request.url);
      
      // Handle API routes or other dynamic content here if needed
      // For now, we'll serve static assets
      
      // For SPA routing, serve index.html for non-asset requests
      if (!url.pathname.includes('.') && url.pathname !== '/') {
        // This is likely a React Router route, serve index.html
        const indexRequest = new Request(new URL('/index.html', request.url), request);
        return env.ASSETS.fetch(indexRequest);
      }
      
      // For all other requests (assets), proxy to static assets
      return env.ASSETS.fetch(request);
    } catch (error) {
      return new Response('Internal Server Error', { status: 500 });
    }
  },
} satisfies ExportedHandler<any>;