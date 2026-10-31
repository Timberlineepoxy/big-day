// Big Day service worker: lets the app open with no signal.
const SHELL = 'bigday-shell-v2';
const MEDIA = 'bigday-media-v1';
const FILES = ['./', 'index.html', 'app.js', 'art.js', 'holidays.js', 'music.js', 'manifest.webmanifest',
  'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(SHELL).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(k => k !== SHELL && k !== MEDIA).map(k => caches.delete(k))
  )).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Songs stream straight from the site (phones fetch them in pieces, which can't be cached simply).
  if (url.pathname.includes('/music/')) return;

  // The app itself: get the newest version, use the saved copy when offline.
  if (url.origin === location.origin) {
    e.respondWith(caches.open(SHELL).then(c =>
      fetch(req, { cache: 'no-cache' }).then(r => { if (r.ok) c.put(req, r.clone()); return r; })
        .catch(() => c.match(req, { ignoreSearch: true }))
    ));
    return;
  }

  // Fonts: keep a copy so they show offline.
  if (/fonts\.(googleapis|gstatic)\.com/.test(url.hostname)) {
    e.respondWith(caches.open(MEDIA).then(async c => {
      const hit = await c.match(req);
      if (hit) return hit;
      const r = await fetch(req);
      if (r.ok || r.type === 'opaque') c.put(req, r.clone());
      return r;
    }));
  }
});
