// Service Worker pour What a tool PWA
// Version générée automatiquement lors du build - ne pas modifier manuellement
const BUILD_VERSION = '__BUILD_VERSION__'; // Sera remplacé par Vite lors du build
const CACHE_NAME = `whatatool-v${BUILD_VERSION}`;
const STATIC_CACHE = `whatatool-static-v${BUILD_VERSION}`;
const DYNAMIC_CACHE = `whatatool-dynamic-v${BUILD_VERSION}`;

// Vérifier si nous sommes en mode développement
const isDevelopment = self.location.hostname === 'localhost' && self.location.port === '5173';

// Si en développement, désactiver complètement le Service Worker
if (isDevelopment) {
  console.log('[SW] Development mode detected - Service Worker will self-destruct');
  
  // Auto-désinstallation
  self.addEventListener('install', (event) => {
    console.log('[SW] Self-unregistering in development mode');
    self.registration.unregister().then(() => {
      console.log('[SW] Successfully unregistered');
    });
    self.skipWaiting();
  });
  
  self.addEventListener('activate', (event) => {
    console.log('[SW] Activating only to unregister');
    self.clients.claim();
  });
  
  // Ne pas intercepter de requêtes
  self.addEventListener('fetch', () => {});
  
} else {
  // Code normal du Service Worker uniquement en production

// Fichiers à mettre en cache lors de l'installation
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
  '/apple-touch-icon.png',
  // Pages principales
  '/utils/mail',
  '/courriers/nouveau',
  '/courriers/liste',
  '/auth',
  // Offline fallback
  '/offline'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  // En développement, ne pas mettre en cache
  if (isDevelopment) {
    console.log('[SW] Development mode - skipping cache');
    self.skipWaiting();
    return;
  }
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static files:', error);
      })
  );
  
  // Force l'activation immédiate du nouveau service worker
  self.skipWaiting();
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Supprimer les anciens caches
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Prend le contrôle de tous les clients immédiatement
  self.clients.claim();
});

// Stratégie de mise en cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // En mode développement, ne pas intercepter les requêtes
  if (isDevelopment) {
    return;
  }
  
  // Ignorer les requêtes non-HTTP
  if (!request.url.startsWith('http')) {
    return;
  }
  
  // Ignorer les requêtes POST, PUT, DELETE (API calls)
  if (request.method !== 'GET') {
    return;
  }
  
  // Ignorer les requêtes Vite en développement (sécurité supplémentaire)
  if (url.pathname.includes('/@vite/') || 
      url.pathname.includes('/@react-refresh') ||
      url.pathname.includes('/src/') ||
      url.search.includes('?t=') ||
      url.search.includes('?import') ||
      url.pathname.endsWith('.tsx') ||
      url.pathname.endsWith('.ts') ||
      url.pathname.endsWith('.jsx') ||
      url.pathname.endsWith('.js') && url.search.includes('?t=')) {
    return;
  }
  
  // Stratégie pour les fichiers statiques (HTML, CSS, JS, images)
  if (STATIC_FILES.includes(url.pathname) || 
      request.destination === 'style' ||
      request.destination === 'script' ||
      request.destination === 'image') {
    
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        return fetch(request).then((networkResponse) => {
          // Mettre en cache la réponse pour les futures utilisations
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(STATIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        });
      }).catch(() => {
        // Fallback pour les pages HTML quand offline
        if (request.destination === 'document') {
          return caches.match('/offline') || caches.match('/index.html');
        }
      })
    );
    
    return;
  }
  
  // Stratégie pour les appels API (Network First)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          // Mettre en cache les réponses GET réussies uniquement
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Fallback vers le cache si offline
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Retourner une réponse JSON d'erreur si pas de cache
            return new Response(
              JSON.stringify({
                success: false,
                message: 'Vous êtes hors ligne. Cette fonctionnalité nécessite une connexion internet.',
                offline: true
              }),
              {
                status: 503,
                statusText: 'Service Unavailable',
                headers: {
                  'Content-Type': 'application/json'
                }
              }
            );
          });
        })
    );
    
    return;
  }
  
  // Stratégie par défaut (Cache First pour les autres ressources)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      
      return fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return networkResponse;
      });
    }).catch(() => {
      // Fallback pour les documents HTML
      if (request.destination === 'document') {
        return caches.match('/index.html');
      }
    })
  );
});

// Gestion des messages du client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ 
      version: CACHE_NAME,
      buildVersion: BUILD_VERSION,
      timestamp: Date.now()
    });
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      );
    }).then(() => {
      event.ports[0].postMessage({ success: true });
    });
  }
});

// Notification push (pour future extension)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/android-chrome-192x192.png',
      badge: '/favicon-32x32.png',
      vibrate: [100, 50, 100],
      data: data.data,
      actions: [
        {
          action: 'open',
          title: 'Ouvrir',
          icon: '/android-chrome-192x192.png'
        },
        {
          action: 'close',
          title: 'Fermer'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'What a tool', options)
    );
  }
});

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow(event.notification.data?.url || '/')
    );
  }
});

} // Fin du bloc production