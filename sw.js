/* Meetwoyou Service Worker - v7 (network-first for HTML, stale-while-revalidate for assets) */
const CACHE = 'meetwoyou-v7';
const SHELL = [
  './', './index.html', './dashboard.html', './messenger.html',
  './admin.html', './privacy.html', './terms.html', './about.html',
  './site.webmanifest', './manifest.json',
  './favicon.svg', './apple-touch-icon.png',
  './web-app-manifest-192x192.png', './web-app-manifest-512x512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL).catch(()=>{})));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Never cache Firebase / Cloudinary / Google APIs / ipapi
  if (/firebase|firestore|googleapis|gstatic|cloudinary|ipapi|ipify/i.test(url.hostname)) return;

  // HTML — network-first (always fresh app shell)
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
    e.respondWith(
      fetch(req).then(r => { caches.open(CACHE).then(c => c.put(req, r.clone())); return r; })
                .catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
    );
    return;
  }

  // Assets — stale-while-revalidate
  e.respondWith(
    caches.match(req).then(cached => {
      const fresh = fetch(req).then(r => {
        if (r && r.status === 200) caches.open(CACHE).then(c => c.put(req, r.clone()));
        return r;
      }).catch(() => cached);
      return cached || fresh;
    })
  );
});

self.addEventListener('message', e => { if (e.data === 'SKIP_WAITING') self.skipWaiting(); });
