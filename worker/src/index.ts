const SITE_PREFIX = "/beauty";
const LEGACY_SITE_PREFIX = "/lumina-atlas";

export default {
  async fetch(request, env): Promise<Response> {
    const incomingUrl = new URL(request.url);
    const isSitePath =
      incomingUrl.pathname === SITE_PREFIX ||
      incomingUrl.pathname.startsWith(`${SITE_PREFIX}/`);
    const isLegacySitePath =
      incomingUrl.pathname === LEGACY_SITE_PREFIX ||
      incomingUrl.pathname.startsWith(`${LEGACY_SITE_PREFIX}/`);

    if (!isSitePath && !isLegacySitePath) {
      return new Response("Not Found", { status: 404 });
    }

    if (isLegacySitePath) {
      const legacySuffix = incomingUrl.pathname.slice(LEGACY_SITE_PREFIX.length);
      incomingUrl.pathname = `${SITE_PREFIX}${legacySuffix || "/"}`;
      return Response.redirect(incomingUrl.toString(), 308);
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

    const assetUrl = new URL(request.url);
    assetUrl.pathname = incomingUrl.pathname.slice(SITE_PREFIX.length) || "/";

    const assetResponse = await env.ASSETS.fetch(
      new Request(assetUrl, {
        method: request.method,
        headers: request.headers,
      }),
    );
    const responseHeaders = new Headers(assetResponse.headers);

    responseHeaders.set("X-Content-Type-Options", "nosniff");
    responseHeaders.set("Referrer-Policy", "strict-origin-when-cross-origin");
    responseHeaders.set("X-Lumina-Origin", "cloudflare-assets");

    return new Response(assetResponse.body, {
      status: assetResponse.status,
      statusText: assetResponse.statusText,
      headers: responseHeaders,
    });
  },
} satisfies ExportedHandler<Env>;
