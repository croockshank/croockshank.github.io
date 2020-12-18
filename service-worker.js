importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js"
);

if (workbox) {
  workbox.precaching.precacheAndRoute([
    { url: "index.html", revision: 1 },
    { url: "nav.html", revision: 1 },
    { url: "/js/api.js", revision: 1 },
    { url: "/js/materialize.min.js", revision: 1 },
    { url: "/js/nav.js", revision: 1 },
    { url: "/js/idb.js", revision: 1 },
    { url: "/js/db.helper.js", revision: 1 },
    { url: "/js/push.js", revision: 1 },
    { url: "/css/style.css", revision: 1 },
    { url: "/css/materialize.min.css", revision: 1 },
    { url: "/src/images/logo.webp", revision: 1 },
    { url: "/src/images/champion.webp", revision: 1 },
    { url: "/src/images/jerseys/manutd-goalkeeper-home.webp", revision: 1 },
    { url: "/src/images/jerseys/manutd-home.webp", revision: 1 },
    { url: "/src/images/icons/icon-72x72.png", revision: 1 },
    { url: "/src/images/icons/icon-96x96.png", revision: 1 },
    { url: "/src/images/icons/icon-128x128.png", revision: 1 },
    { url: "/src/images/icons/icon-144x144.png", revision: 1 },
    { url: "/src/images/icons/icon-152x152.png", revision: 1 },
    { url: "/src/images/icons/icon-192x192.png", revision: 1 },
    { url: "/src/images/icons/icon-384x384.png", revision: 1 },
    { url: "/src/images/icons/icon-512x512.png", revision: 1 },
    { url: "/src/images/icons/icon-img.png", revision: 1 }
  ]);

  workbox.routing.registerRoute(
    new RegExp("/pages/"),
    workbox.strategies.staleWhileRevalidate({
      cacheName: "pages-cache",
      cacheExpiration: {
        maxAgeSeconds: 24 * 60 * 60
      }
    })
  );

  workbox.routing.registerRoute(
    new RegExp("https://api.football-data.org/v2/"),
    workbox.strategies.staleWhileRevalidate({
      cacheName: "api-fetch-cache",
      cacheExpiration: {
        maxAgeSeconds: 24 * 60 * 60
      }
    })
  );
}else{
  console.log("Workbox failed to load")
}

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
