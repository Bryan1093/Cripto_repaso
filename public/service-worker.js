const CACHE_NAME = 'quiz-cripto-v5';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/quiz.html',
    '/css/styles.css',
    '/css/music-player.css',
    '/css/review-mode.css',
    '/js/app.js',
    '/js/music-player.js',
    '/manifest.json',
    '/assets/icons/icon-192.png',
    '/assets/icons/icon-512.png',
    '/api/questions/1',
    '/api/questions/2'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Caching app assets');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    // Skip cross-origin requests (like YouTube)
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    console.log('Serving from cache:', event.request.url);
                    return response;
                }

                return fetch(event.request).then((response) => {
                    // Don't cache if not a success response
                    if (!response || response.status !== 200) {
                        return response;
                    }

                    // Clone the response
                    const responseToCache = response.clone();

                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            console.log('Caching:', event.request.url);
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                }).catch(() => {
                    console.log('Offline - serving from cache:', event.request.url);
                    // Return offline page if available
                    if (event.request.mode === 'navigate') {
                        return caches.match('/index.html');
                    }
                });
            })
    );
});

// Background sync for quiz answers
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-answers') {
        event.waitUntil(syncAnswers());
    }
});

async function syncAnswers() {
    // This will be implemented when we add Firebase
    console.log('Syncing answers to cloud...');
}
