// আরাফাত শপ — অফলাইনে চালানোর জন্য সার্ভিস ওয়ার্কার
// অ্যাপের ফাইল আপডেট করলে নিচের সংস্করণ নম্বর বাড়িয়ে দিন (v5 → v6)
const CACHE = 'arafat-shop-v5';
const SHELL = ['./', 'index.html', 'manifest.json',
  'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'apple-touch-icon.png'];

self.addEventListener('install', e => {
  // একটা ফাইল না পেলেও যেন ইনস্টল আটকে না যায়
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.allSettled(SHELL.map(u => c.add(u))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// নেটওয়ার্ক আগে (নতুন সংস্করণ পেতে), না পেলে ক্যাশ থেকে
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const u = e.request.url;
  // গুগল শিট সিঙ্কের অনুরোধ (গোপন কোডসহ) কখনো ক্যাশ হবে না
  if (u.includes('script.google.com') || u.includes('googleusercontent.com')) return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        if (res && (res.ok || res.type === 'opaque')) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return res;
      })
      .catch(() => caches.match(e.request).then(r => r || caches.match('index.html')))
  );
});
