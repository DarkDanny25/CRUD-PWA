import { openDB } from 'idb';

// Inicializar la base de datos IndexedDB
const dbPromise = openDB('devicesDB', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('requests')) {
      db.createObjectStore('requests', { keyPath: 'id', autoIncrement: true });
    }
  },
});

// Guardar solicitud fallida en IndexedDB
export async function saveRequestToIndexedDB(url, data, method) {
  const db = await dbPromise;
  const tx = db.transaction('requests', 'readwrite');
  await tx.store.add({
    url,
    data: JSON.stringify(data),  // Convertir el objeto a cadena JSON
    method,
  });
  await tx.done;
}

// Obtener todas las solicitudes guardadas en IndexedDB
export async function getAllRequests() {
  const db = await dbPromise;
  const tx = db.transaction('requests', 'readonly');
  const allRequests = await tx.store.getAll();
  await tx.done;
  return allRequests;
}

// Borrar solicitud de IndexedDB después de sincronizarla
export async function deleteRequest(id) {
  const db = await dbPromise;
  const tx = db.transaction('requests', 'readwrite');
  await tx.store.delete(id);
  await tx.done;
}

// Sincronizar solicitudes guardadas con el servidor
export async function syncRequestsWithServer(axiosInstance) {
  const allRequests = await getAllRequests();

  for (const request of allRequests) {
    const { url, data, method, id } = request;

    try {
      // Realizar la solicitud usando Axios
      await axiosInstance({
        method: method,
        url: url,
        data: JSON.parse(data), // Convertir de vuelta la cadena a objeto JSON
      });

      // Eliminar la solicitud de IndexedDB si se realizó con éxito
      await deleteRequest(id);
    } catch (error) {
      console.error('Error al sincronizar la solicitud:', error);
    }
  }
}