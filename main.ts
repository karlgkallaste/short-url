import { serve } from "https://deno.land/std@0.200.0/http/server.ts";

// In-memory store for URL mappings
const urlMappings: Record<string, string> = {};

// Helper function to generate a short ID
function generateShortId(): string {
  return Math.random().toString(36).substring(2, 8);
}

// HTTP server
const handler = async (req: Request): Promise<Response> => {
  const { pathname, searchParams } = new URL(req.url);

  // Serve the homepage with a form
  if (pathname === "/" && req.method === "GET") {
    return new Response(
      `
        <html>
          <body>
            <h1>URL Shortener</h1>
            <form method="POST" action="/shorten">
              <input type="url" name="url" placeholder="Enter URL" required />
              <button type="submit">Shorten</button>
            </form>
          </body>
        </html>
      `,
      { headers: { "Content-Type": "text/html" } }
    );
  }

  // Handle URL shortening
  if (pathname === "/shorten" && req.method === "POST") {
    const formData = await req.formData();
    const longUrl = formData.get("url")?.toString();

    if (!longUrl) {
      return new Response("Invalid URL", { status: 400 });
    }

    const shortId = generateShortId();
    urlMappings[shortId] = longUrl;

    return new Response(
      `Short URL created: <a href="/${shortId}">/${shortId}</a>`,
      { headers: { "Content-Type": "text/html" } }
    );
  }

  if (pathname === "/list" && req.method === "GET") {
    // Generate an HTML page showing all URL mappings
    const urlList = Object.entries(urlMappings)
      .map(
        ([shortId, longUrl]) =>
          `<li><a href="/${shortId}">/${shortId}</a> → ${longUrl}</li>`
      )
      .join("");
  
    return new Response(
      `
        <html>
          <body>
            <h1>All Shortened URLs</h1>
            <ul>
              ${urlList || "<li>No URLs have been shortened yet.</li>"}
            </ul>
            <a href="/">Go back to Home</a>
          </body>
        </html>
      `,
      { headers: { "Content-Type": "text/html" } }
    );
  }
  

  // Handle redirection
  const shortId = pathname.slice(1); // Remove leading slash
  const longUrl = urlMappings[shortId];
  if (longUrl) {
    return Response.redirect(longUrl, 302);
  }

  // 404 Not Found
  return new Response("Not Found", { status: 404 });
};

// Start the server
console.log("Server running on http://localhost:8000");
await serve(handler, { port: 8000 });
