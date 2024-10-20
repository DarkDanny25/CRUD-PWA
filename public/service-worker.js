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

// Escuchar el evento de sincronización en el Service Worker
self.addEventListener('sync', function(event) {
  if (event.tag === 'sync-requests') { // El tag debe coincidir con el que registraste
    event.waitUntil(syncRequestsWithServer()); // Llama a la función que sincroniza las solicitudes
  }
});

// Función para sincronizar las solicitudes guardadas en IndexedDB
async function syncRequestsWithServer() {
  const allRequests = await getAllRequests(); // Obtener todas las solicitudes de IndexedDB

  for (const request of allRequests) {
    const { url, data, method, id } = request;

    try {
      // Usar fetch para realizar la solicitud al servidor
      const response = await fetch(url, {
        method: method,
        body: data,
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        // Si la solicitud fue exitosa, eliminarla de IndexedDB
        await deleteRequest(id);
      }
    } catch (error) {
      console.error('Error al sincronizar la solicitud:', error);
      // Puedes decidir si hacer reintentos aquí o dejar que el evento sync lo maneje en la próxima reconexión
    }
  }
}

// Importar las funciones de IndexedDB
importScripts('/idb.js');