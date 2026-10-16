/* Apps casa · guarda las pantallas en el móvil para que abran al momento.
   Los datos (la hoja) nunca pasan por aquí: siempre van directos a Google. */
const V = 'casa-2026-10-16.3';
const FILES = ['./', 'index.html', 'inicio.html', 'menu.html', 'ocio.html', 'tareas.html', 'config.js',
  'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'apple-touch-icon.png', 'favicon-48.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(FILES.map(f => new Request(f, { cache: 'reload' })))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
/* Pantallas: se sirven de la copia del móvil al instante y, a la vez, se descarga la última versión para la próxima vez. */
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(caches.open(V).then(c => c.match(e.request, { ignoreSearch: true }).then(hit => {
    const net = fetch(e.request, { cache: 'no-cache' })
      .then(r => { if (r && r.ok) c.put(e.request, r.clone()); return r; })
      .catch(() => hit);
    return hit || net;
  })));
});
