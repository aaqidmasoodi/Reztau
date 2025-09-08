const CACHE_NAME = 'reztau-v1.0.1';

// Listen for skip waiting message
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

const urlsToCache = [
  '/',
  '/index.html',
  '/styles/main.css',
  '/components/ThemeProvider.js',
  '/components/Header.js',
  '/components/BottomNav.js',
  '/components/MenuItem.js',
  '/components/Cart.js',
  '/components/Menu.js',
  '/utils/config.js',
  '/utils/cart.js',
  '/utils/stripe.js',
  '/app.js',
  '/config/restaurant-config.json',
  '/config/theme-config.json',
  '/config/menu-data.json',
  '/config/app-config.json',
  '/manifest.json'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        
        // For online-only resources (like Stripe API), let them fail gracefully
        if (event.request.url.includes('stripe.com') || 
            event.request.url.includes('api.') ||
            event.request.method === 'POST') {
          return fetch(event.request);
        }
        
        return fetch(event.request);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
