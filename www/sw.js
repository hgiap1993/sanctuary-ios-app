/**
 * ============================================================================
 * THE TWELVE SACRED VESSELS — OFFLINE SERVICE WORKER (PWA + iOS CACHE)
 * ============================================================================
 * Ensures 100% offline capability for all 365+ Words of Jesus Christ,
 * Web Audio Sanctuary Harp/Rain synthesizers, and Sacred Vessels UI.
 */

const CACHE_NAME = "sacred-vessels-sanctuary-v1.2";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./ios-storekit-bridge.js",
  "./privacy-terms.html",
  "./appstore-kit.html"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {});
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request)
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            networkResponse.type === "basic"
          ) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => caches.match("./index.html"));
    })
  );
});
