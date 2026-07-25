// Network-first with cache fallback: a fresh deploy reaches the phone on the
// next online open, and with no signal the last good copy still loads.
const CACHE = 'fkh-capture-v1'
self.addEventListener('install', function () { self.skipWaiting() })
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()) })
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return
  e.respondWith(
    fetch(e.request)
      .then(function (res) {
        const copy = res.clone()
        caches.open(CACHE).then(function (c) { c.put(e.request, copy) })
        return res
      })
      .catch(function () { return caches.match(e.request) })
  )
})
