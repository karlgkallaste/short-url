// src/routes.ts

import { getHomePage, shortenUrl, listUrls, redirectToUrl } from "./controllers/urlController.ts";

export const router = async (req: Request): Promise<Response> => {
  const { pathname } = new URL(req.url);

  // Serve the homepage
  if (pathname === "/" && req.method === "GET") {
    return getHomePage();
  }

  // Handle URL shortening
  if (pathname === "/shorten" && req.method === "POST") {
    return shortenUrl(req);
  }

  // Handle listing all URLs
  if (pathname === "/list" && req.method === "GET") {
    return listUrls();
  }

  // Handle redirection
  const shortId = pathname.slice(1); // Remove leading slash
  const redirectResponse = redirectToUrl(shortId);
  if (redirectResponse) {
    return redirectResponse;
  }

  // 404 Not Found
  return new Response("Not Found", { status: 404 });
};
