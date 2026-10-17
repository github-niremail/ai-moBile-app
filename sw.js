const CACHE_NAME = "gemini-pwa-v7";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon-512.png"
];

// 1. Instalar y guardar recursos estáticos en caché
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 2. Limpiar versiones antiguas de la caché al actualizar
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Responder desde caché para la interfaz, pero dejar pasar las peticiones a la API
self.addEventListener("fetch", (event) => {
  // Si la petición va dirigida a la API de Gemini, no la interceptes en caché
  if (event.request.url.includes("generativelanguage.googleapis.com")) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Devuelve de caché si existe, sino busca en internet
      return cachedResponse || fetch(event.request);
    })
  );
});