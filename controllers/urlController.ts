// src/controllers/urlController.ts

    import { urlMappings } from "../utils/urlUtils.ts";

// Serve the homepage with the URL form
export const getHomePage = (): Response => {
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
};

// Handle URL shortening
export const shortenUrl = async (req: Request): Promise<Response> => {
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
};

// List all URLs
export const listUrls = (): Response => {
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
};

// Handle redirection
export const redirectToUrl = (shortId: string): Response | undefined => {
  const longUrl = urlMappings[shortId];
  if (longUrl) {
    return Response.redirect(longUrl, 302);
  }
  return undefined;
};

// Helper function to generate a short ID
function generateShortId(): string {
  return Math.random().toString(36).substring(2, 8);
}
