const CACHE_NAME = 'kls-portfolio-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './css/base.css',
    './css/components.css',
    './css/layout.css',
    './css/sections.css',
    './css/responsive.css',
    './css/hero-animation.css',
    './components/school-service.css',
    './components/business-service.css',
    './js/navigation.js',
    './js/animations.js',
    './js/hero-animation.js',
    './js/pwa-handler.js',
    './icon/fav/fav32.ico',
    './icon/fav/fav128.ico',
    './icon/fav/fav512.ico'
];

// Install Event - Cache Assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch Event - Serve from Cache, then Network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached response if found
                if (response) {
                    return response;
                }
                // Otherwise fetch from network
                return fetch(event.request);
            })
    );
});
