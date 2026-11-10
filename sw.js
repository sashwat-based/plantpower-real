/*
 * PlantPower service worker
 * Uses paths relative to its registration scope, so it works both at
 * https://username.github.io/ and at GitHub project URLs such as
 * https://username.github.io/repository-name/.
 */

const CACHE_PREFIX = "plantpower-cache-";
const CACHE_NAME = `${CACHE_PREFIX}v1`;

const APP_ROOT = new URL("./", self.registration.scope);
const MANIFEST_URL = new URL("manifest.webmanifest", self.registration.scope);

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll([APP_ROOT.href, MANIFEST_URL.href]))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Do not intercept non-GET requests or requests to other origins.
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  // For page navigations, prefer the latest online page and fall back offline.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(APP_ROOT.href, copy));
          }
          return response;
        })
        .catch(async () => {
          return (await caches.match(request)) ||
                 (await caches.match(APP_ROOT.href)) ||
                 Response.error();
        })
    );
    return;
  }

  // For same-origin app files, use the cache when available.
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  );
});
