const CACHE_NAME = 'v1';

// Archivos a cachear
const cacheAssets = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png',
  '/styles.css', // Agrega tus archivos de estilo
  '/app.js',     // Agrega tu archivo JS
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(cacheAssets);
    })
  );
});

// Manejo de solicitudes fetch
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Responde con el recurso en caché o realiza una solicitud de red
      return response || fetch(event.request);
    })
  );
});

// Actualización del Service Worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME]; // Lista de caches permitidos
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Elimina caches antiguos
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});