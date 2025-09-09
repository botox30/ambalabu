// Service Worker for mObywatel PWA
const CACHE_NAME = 'mobywatel-v1';
const urlsToCache = [
  '/',
  '/login.html',
  '/home.html',
  '/assets/main.css',
  '/assets/home.css',
  '/assets/logo.png',
  '/assets/main.js',
  '/assets/auth-check.js',
  '/manifest.json'
];

// Install event - cache resources
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
      .catch(function(error) {
        console.log('Cache install failed:', error);
      })
  );
  self.skipWaiting();
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
      .catch(function() {
        // If both cache and network fail, return offline page
        if (event.request.mode === 'navigate') {
          return caches.match('/login.html');
        }
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});