const CACHE_NAME = "techniker-pro-v3";

const FILES = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./storage.js",
  "./data.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", event => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES);
    })
  );
});

self.addEventListener("activate", event => {

  event.waitUntil(
    caches.keys().then(keys => {

      return Promise.all(
        keys.map(key => {

          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }

        })
      );

    }).then(() => self.clients.claim())
  );

});

self.addEventListener("fetch", event => {

  event.respondWith(

    fetch(event.request)
      .then(response => {

        const copy = response.clone();

        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, copy);
        });

        return response;

      })
      .catch(() => caches.match(event.request))

  );

});