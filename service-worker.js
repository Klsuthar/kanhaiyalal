const CACHE_NAME = 'kls-portfolio-v2';
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
    './icon/icon-192.png',
    './icon/icon-512.png',
    './manifest.json'
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

// Fetch Event - Stale-While-Revalidate Strategy
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                const fetchPromise = fetch(event.request).then((networkResponse) => {
                    // Update cache with new version
                    if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, responseToCache);
                        });
                    }
                    return networkResponse;
                }).catch(() => {
                    // Network failed
                    // If we have a cached response, it's already returned below, but if 'cachedResponse' was null, this catch might be needed.
                    // However, in this pattern, we usually return cachedResponse || fetchPromise.
                });

                // Return cached response immediately if available, otherwise wait for network
                return cachedResponse || fetchPromise;
            })
    );
});
