const CACHE_NAME = "manutd-v8";
var urlsToCache = [
  "/",
  "nav.html",
  "/pages/home.html",
  "/pages/players.html",
  "/pages/matches.html",
  "/pages/favorites.html",
  "/pages/tabs/matches.html",
  "/js/api.js",
  "/js/materialize.min.js",
  "/js/nav.js",
  "/js/idb.js",
  "/js/db.helper.js",
  "/js/push.js",
  "/css/style.css",
  "/css/materialize.min.css",
  "/src/images/logo.webp",
  "/src/images/champion.webp",
  "/src/images/jerseys/manutd-goalkeeper-home.webp",
  "/src/images/jerseys/manutd-home.webp",
  "/src/images/icons/icon-72x72.png",
  "/src/images/icons/icon-96x96.png",
  "/src/images/icons/icon-128x128.png",
  "/src/images/icons/icon-144x144.png",
  "/src/images/icons/icon-152x152.png",
  "/src/images/icons/icon-192x192.png",
  "/src/images/icons/icon-384x384.png",
  "/src/images/icons/icon-512x512.png",
  "/src/images/icons/icon-img.png",
];

self.addEventListener("install", function(event) {
  console.log("ServiceWorker: Menginstall...");

  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log("ServiceWorker: Membuka cache...");
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", function(event) {
  event.respondWith(
    caches.match(event).then(function(response) {
      // console.log("ServiceWorker: Menarik data: ", event);

      if (response) {
        return response;
      }

      var fetchRequest = event.request.clone();

      return fetch(fetchRequest).then(function(response) {
        if (!response || response.status == 200) {
          return response;
        }

        var responseToCache = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, responseToCache);
        });
        return response;
      });
    })
  );
});

self.addEventListener("activate", function(event) {
  console.log("Aktivasi service worker baru");

  event.waitUntil(
    caches.keys().then(function(cachesName) {
      return Promise.all(
        cachesName.map(function(cacheName) {
          if (cacheName != CACHE_NAME && cacheName.startsWith("manutd"))
            return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener("push", function(event) {
  var body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = "Push message no playload";
  }

  var options = {
    body: body,
    icon: "/src/images/icon/icon.webp",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date().now,
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification("Man United App", options)
  );
});
