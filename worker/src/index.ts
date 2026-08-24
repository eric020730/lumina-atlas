const SITE_PREFIX = "/lumina-atlas";
const UPSTREAM_ORIGIN = "https://eric020730.github.io";

const FORWARDED_REQUEST_HEADERS = [
  "accept",
  "accept-language",
  "if-modified-since",
  "if-none-match",
  "range",
] as const;

export default {
  async fetch(request): Promise<Response> {
    const incomingUrl = new URL(request.url);
    const isSitePath =
      incomingUrl.pathname === SITE_PREFIX ||
      incomingUrl.pathname.startsWith(`${SITE_PREFIX}/`);

    // The route pattern ends in a wildcard so it also matches query strings.
    // Preserve any similarly named path on the existing root application.
    if (!isSitePath) {
      return fetch(request);
    }

    if (incomingUrl.pathname === SITE_PREFIX) {
      incomingUrl.pathname = `${SITE_PREFIX}/`;
      return Response.redirect(incomingUrl.toString(), 308);
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: { Allow: "GET, HEAD" },
      });
    }

    const upstreamUrl = new URL(
      `${incomingUrl.pathname}${incomingUrl.search}`,
      UPSTREAM_ORIGIN,
    );
    const upstreamHeaders = new Headers();

    for (const headerName of FORWARDED_REQUEST_HEADERS) {
      const headerValue = request.headers.get(headerName);
      if (headerValue) upstreamHeaders.set(headerName, headerValue);
    }

    const upstreamResponse = await fetch(
      new Request(upstreamUrl, {
        method: request.method,
        headers: upstreamHeaders,
        redirect: "follow",
      }),
    );
    const responseHeaders = new Headers(upstreamResponse.headers);

    responseHeaders.delete("set-cookie");
    responseHeaders.set("X-Content-Type-Options", "nosniff");
    responseHeaders.set("Referrer-Policy", "strict-origin-when-cross-origin");
    responseHeaders.set("X-Lumina-Origin", "github-pages");

    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers: responseHeaders,
    });
  },
} satisfies ExportedHandler;
