/* Apps casa · guarda las pantallas en el móvil para que abran al momento.
   Los datos (la hoja) nunca pasan por aquí: siempre van directos a Google. */
const V = 'casa-2026-10-18.2';
const FILES = ['./', 'index.html', 'inicio.html', 'menu.html', 'ocio.html', 'tareas.html', 'cerebro.html', 'config.js',
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

/* Notificaciones de la app: llegan aunque la app esté cerrada. Siempre se enseña una (el iPhone lo exige). */
self.addEventListener('push', e => {
  let j = {};
  try { j = e.data ? e.data.json() : {}; } catch (x) { j = { data: { title: 'Casa', body: e.data ? e.data.text() : '' } }; }
  const d = Object.assign({}, j.notification || {}, j.data || {});
  const title = d.title || 'Casa';
  const opts = { body: d.body || '', icon: 'icon-192.png', data: { url: d.url || '' }, lang: 'es' };
  if (d.tag) { opts.tag = d.tag; opts.renotify = true; }
  e.waitUntil(self.registration.showNotification(title, opts));
});
/* Al tocarla: si la app está abierta, va a Tareas; si no, la abre en Tareas. */
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || './#tareas', self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
    for (const c of cs) {
      if (c.url.indexOf(self.registration.scope) === 0 && 'focus' in c) { c.postMessage({ casaNav: (url.split('#')[1] || 'tareas') }); return c.focus(); }
    }
    return self.clients.openWindow(url);
  }));
});
