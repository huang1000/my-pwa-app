self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('my-pwa-cache').then(cache => {
            return cache.addAll([
                '/',
                '/index.html',
                '/style.css',
                '/app.js',
                // Add any other assets you want to cache
                '/icons/icon-192x192.png'
            ]);
        })
    );
    console.log("📥 Service Worker Installed");
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});

// ---- PUSH NOTIFICATIONS ----
self.addEventListener("push", (event) => {
  const data = event.data ? event.data.text() : "No payload";
  event.waitUntil(
    self.registration.showNotification("PWA Notification", {
      body: data,
      icon: "/icons/icon-192x192.png",
    })
  );
});

// ---- BACKGROUND SYNC ----
self.addEventListener("sync", (event) => {
  if (event.tag === "send-data") {
    event.waitUntil(
      fetch("/sync-endpoint", {
        method: "POST",
        body: JSON.stringify({ msg: "Hello from Background Sync!" }),
        headers: { "Content-Type": "application/json" },
      })
        .then(() => console.log("✅ Data sent during background sync"))
        .catch(() => console.error("❌ Sync failed, will retry"))
    );
  }
});