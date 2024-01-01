var staticCacheName = "django-pwa-v" + new Date().getTime();
var filesToCache = [
    '/static/assets/apple-splash-640-1136.jpg',
    '/static/assets/apple-splash-750-1334.jpg',
    '/static/assets/backpack_map.jpg',
    '/static/assets/manifest-icon-192.maskable.png',
    '/static/assets/city.jpg',
    '/static/assets/manifest-icon-512.maskable.png',
    '/static/assets/think.jpg',  
    '/static/assets/tree_bike.jpg',
    '/static/assets/woman_bike.jpg',
    '/static/script.js',
    '/static/style.css',
    '/',
    'subscriptions/',
    'offline/'
];


self.addEventListener("install", event => {
    this.skipWaiting();
    event.waitUntil(
        caches.open(staticCacheName)
            .then(cache => {
                return cache.addAll(filesToCache);
            })
    )
});


self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(cacheName => (cacheName.startsWith("django-pwa-")))
                    .filter(cacheName => (cacheName !== staticCacheName))
                    .map(cacheName => caches.delete(cacheName))
            );
        })
    );
});


self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
            .catch(() => {
                return caches.match('/offline/');
            })
    )
});