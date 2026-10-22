/**
 * ============================================================================
 * THE TWELVE SACRED VESSELS — NETWORK-FIRST SERVICE WORKER + CLOUDFLARE PUSH (v4.6)
 * ============================================================================
 * 1. Network-First caching for instant updates + 100% offline fallback.
 * 2. Full W3C Web Push (VAPID) handler (`push` + `notificationclick` + `periodicsync`)
 *    for lock-screen Morning & Evening Prayer Bells via Cloudflare Workers.
 */

const CACHE_NAME = "sacred-vessels-sanctuary-v5.3";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-512.png",
  "./icon-192.png",
  "./ios-storekit-bridge.js"
];

const OFFLINE_DAILY_BLESSINGS = [
  {
    title: "⚱️ Morning Sanctuary Bell — John 14:27",
    body: "“Peace I leave with you; my peace I give to you.” Tap to break your Sacred Vessel & hear the Angel pray.",
    url: "./?from_push=morning"
  },
  {
    title: "⚱️ Jesus's Word for Your Heart — Matthew 11:28",
    body: "“Come to me, all who labor and are heavy laden, and I will give you rest.” Tap to open your daily vessel.",
    url: "./?from_push=morning"
  },
  {
    title: "⚱️ You Are Never Alone Today — Matthew 28:20",
    body: "“Behold, I am with you always, to the end of the age.” Tap to receive your daily blessing.",
    url: "./?from_push=morning"
  },
  {
    title: "⚱️ Walk in His Light Today — John 8:12",
    body: "“I am the light of the world. Whoever follows me will not walk in darkness.” Tap to break a Sacred Vessel.",
    url: "./?from_push=morning"
  },
  {
    title: "⚱️ Release Every Worry Today — Matthew 6:34",
    body: "“Therefore do not be anxious about tomorrow.” Tap to hear the Angel read Jesus's Word aloud.",
    url: "./?from_push=morning"
  }
];

function getFallbackBlessing() {
  const dayIdx = Math.floor(Date.now() / 86400000) % OFFLINE_DAILY_BLESSINGS.length;
  return OFFLINE_DAILY_BLESSINGS[dayIdx];
}

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {});
    })
  );
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
  if (event.request.url.includes("translate.google") || event.request.url.includes("/api/push/")) return;

  event.respondWith(
    fetch(event.request)
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
      .catch(() =>
        caches.match(event.request).then((cached) => cached || caches.match("./index.html"))
      )
  );
});

// ============================================================================
// LAYER 1: CLOUDFLARE WEB PUSH (VAPID) LOCK-SCREEN NOTIFICATION HANDLER
// ============================================================================
self.addEventListener("push", (event) => {
  event.waitUntil(
    (async () => {
      let payload = null;

      // 1. Try reading direct push payload if sent with body
      if (event.data) {
        try {
          payload = event.data.json();
        } catch (e) {
          const txt = event.data.text();
          if (txt) {
            payload = {
              title: "⚱️ Sanctuary: Jesus Daily Prayer",
              body: txt,
              url: "./?from_push=1"
            };
          }
        }
      }

      // 2. If woken up by lightweight Cloudflare VAPID ping, fetch latest daily blessing from Worker
      if (!payload) {
        try {
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), 3000);
          const res = await fetch("./api/push/latest", {
            signal: controller.signal,
            cache: "no-store"
          });
          clearTimeout(timer);
          if (res && res.ok) {
            const data = await res.json();
            if (data && data.notification) {
              payload = data.notification;
            }
          }
        } catch (e) {}
      }

      // 3. Guaranteed offline fallback
      if (!payload) {
        payload = getFallbackBlessing();
      }

      const title = payload.title || "⚱️ Sanctuary: Your Sacred Vessel is Ready";
      const options = {
        body: payload.body || "Tap here to strike a Sacred Vessel and hear the Angel read Jesus's Word today.",
        icon: payload.icon || "./icon-192.png",
        badge: payload.badge || "./icon-192.png",
        tag: payload.tag || "sanctuary-daily-prayer",
        renotify: true,
        requireInteraction: false,
        vibrate: [120, 60, 180],
        data: {
          url: payload.url || "./?from_push=1"
        },
        actions: [
          { action: "open_vessel", title: "⚱️ Break Sacred Vessel" },
          { action: "open_sleep", title: "🌙 Night Sleep Mode" }
        ]
      };

      await self.registration.showNotification(title, options);
    })()
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  let targetUrl = (event.notification.data && event.notification.data.url) || "./?from_push=1";
  if (event.action === "open_sleep") {
    targetUrl = "./?from_push=sleep";
  }

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) {
          client.postMessage({
            type: "SANCTUARY_PUSH_CLICK",
            action: event.action || "open_vessel",
            url: targetUrl
          });
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});

self.addEventListener("periodicsync", (event) => {
  if (event.tag === "sanctuary-daily-bell") {
    event.waitUntil(
      (async () => {
        const fb = getFallbackBlessing();
        await self.registration.showNotification(fb.title, {
          body: fb.body,
          icon: "./icon-192.png",
          badge: "./icon-192.png",
          tag: "sanctuary-periodic-bell",
          data: { url: fb.url }
        });
      })()
    );
  }
});
