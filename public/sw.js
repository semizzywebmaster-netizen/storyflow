
/**
 * Service Worker - Phase 78 PWA Production Audit
 * Offline shell, cache strategy, update flow, stale prevention, installability
 * AI generation requires network - clearly shows offline not possible for AI
 */

const CACHE_NAME = 'ai-story-studio-v1'
const SHELL_CACHE = 'shell-v1'
const ASSETS_CACHE = 'assets-v1'

const SHELL_URLS = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/index.html',
]

const CACHE_FIRST = [
  '/assets/',
  '/icons/',
  '/images/',
]

const NETWORK_FIRST = [
  '/api/',
]

self.addEventListener('install', (event) => {
  console.log('[SW] Install')
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => {
      return cache.addAll(SHELL_URLS.map(url => new Request(url, { cache: 'reload' })))
    })
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  console.log('[SW] Activate - cleaning old caches')
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== SHELL_CACHE && key !== ASSETS_CACHE) {
            console.log('[SW] Deleting old cache:', key)
            return caches.delete(key)
          }
        })
      )
    })
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  // Skip non-GET and chrome extensions
  if (event.request.method !== 'GET' || url.protocol === 'chrome-extension:') return

  // API - network first, cache fallback, show offline notice for AI
  if (NETWORK_FIRST.some(prefix => url.pathname.startsWith(prefix))) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Don't cache failed responses
          if (!response.ok) throw new Error('Network response not ok')
          return response
        })
        .catch(() => {
          // If AI generation endpoint and offline, return clear offline message
          if (url.pathname.includes('/generations/') || url.pathname.includes('/advanced/')) {
            return new Response(
              JSON.stringify({ success: false, message: 'AI generation requires internet connection. Please reconnect.', offline: true }),
              { headers: { 'Content-Type': 'application/json' }, status: 503 }
            )
          }
          return caches.match(event.request).then(cached => cached || new Response('Offline', { status: 503 }))
        })
    )
    return
  }

  // Assets - cache first, network fallback
  if (CACHE_FIRST.some(prefix => url.pathname.startsWith(prefix))) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached
        return fetch(event.request).then((response) => {
          const clone = response.clone()
          caches.open(ASSETS_CACHE).then(cache => cache.put(event.request, clone))
          return response
        })
      })
    )
    return
  }

  // Shell - cache first, network fallback, offline page
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkFetch = fetch(event.request)
        .then((response) => {
          const clone = response.clone()
          caches.open(SHELL_CACHE).then(cache => cache.put(event.request, clone))
          return response
        })
        .catch(() => {
          // If navigation request and offline, show offline page
          if (event.request.mode === 'navigate') {
            return caches.match('/offline.html')
          }
          return new Response('Offline', { status: 503 })
        })

      return cached || networkFetch
    })
  )
})

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : { title: 'AI Story Studio', body: 'New notification' }
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge.png',
      data: data.data || {},
    })
  )
})
