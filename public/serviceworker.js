const CACHE_NAME = "version-1";
const urlsToCache = ["index.html", "offline.html"];

const self = this;

// Install SW
self.addEventListener("install", (e) => {
  const preCache = async () => {
    const cache = await caches.open(CACHE_NAME);

    console.log("Opened cache");
    return cache.addAll(urlsToCache);
  };

  e.waitUntil(preCache());

  //   e.waitUntil(caches.open(CACHE_NAME)).then((cache) => {
  //     console.log("Opened cache");

  //     return cache.addAll(urlsToCache);
  //   });
});

// Listen for requests
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then(() => {
      return fetch(e.request).catch(() => caches.match("offline.html"));
    })
  );
});

// Activate the SW
self.addEventListener("activate", (e) => {
  const cacheWhitelist = [];
  cacheWhitelist.push(CACHE_NAME);

  const cached = async () => {
    const cacheNames = await caches.keys();
    if (cacheNames) {
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    }
  };

  e.waitUntil(cached());
});
