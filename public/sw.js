// Service worker for the clinic app.
// Scaffolded from the pwa-development skill (stale-while-revalidate, no silent skipWaiting).
// App-like advice was: cache the shell, keep user data fresh.
// This build precaches only the shell (offline page, manifest, icons) and
// runtime-caches pages with stale-while-revalidate. Hashed static files are cache-first.
// next-pwa is not used: Next 16 dev runs on Turbopack, so that webpack plugin never registers a worker.

const SHELL_CACHE = "clinic-shell-v2";
const PAGE_CACHE = "clinic-pages-v2";
const STATIC_CACHE = "clinic-static-v2";
const CURRENT_CACHES = [SHELL_CACHE, PAGE_CACHE, STATIC_CACHE];

const PRECACHE_URLS = [
  "/offline.html",
  "/manifest.webmanifest",
  "/icon-192.png",
  "/icon-512.png",
  "/icon-maskable-512.png",
  "/apple-touch-icon.png",
];

const OFFLINE_FALLBACK = "/offline.html";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(PRECACHE_URLS)),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter((name) => /^clinic-(shell|pages|static)-v\d+$/.test(name) && !CURRENT_CACHES.includes(name))
            .map((name) => caches.delete(name)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (
    url.pathname.includes("webpack-hmr") ||
    url.pathname.includes("turbopack-hmr") ||
    url.pathname.endsWith("/sw.js")
  ) {
    return;
  }

  if (isStaticAsset(url, request)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  event.respondWith(staleWhileRevalidate(event, request));
});

function isStaticAsset(url, request) {
  if (request.destination === "image" || request.destination === "font") {
    return true;
  }
  return /\.(?:png|jpg|jpeg|svg|gif|webp|ico|woff2?)$/.test(url.pathname);
}

async function trimCache(cache, maxEntries) {
  const keys = await cache.keys();
  if (keys.length <= maxEntries) return;
  await cache.delete(keys[0]);
}

async function cacheFirst(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request, { ignoreVary: true });
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      await cache.put(request, response.clone());
      await trimCache(cache, 60);
    }
    return response;
  } catch {
    return new Response("", { status: 503, statusText: "Service Unavailable" });
  }
}

async function staleWhileRevalidate(event, request) {
  const cache = await caches.open(PAGE_CACHE);
  const cached = await cache.match(request, { ignoreVary: true });
  const update = fetch(request)
    .then(async (response) => {
      if (response && response.ok) {
        await cache.put(request, response.clone());
        await trimCache(cache, 50);
      }
      return response;
    })
    .catch(() => null);

  if (cached) {
    event.waitUntil(update.then(() => undefined));
    return cached;
  }

  const fresh = await update;
  if (fresh) return fresh;

  if (request.mode === "navigate") {
    const shell = await caches.open(SHELL_CACHE);
    const offline = await shell.match(OFFLINE_FALLBACK);
    if (offline) return offline;
  }

  return new Response("Offline", {
    status: 503,
    statusText: "Service Unavailable",
  });
}
