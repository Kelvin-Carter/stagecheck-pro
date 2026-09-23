// Service Worker mínimo do LEGALMART ERP
// Objetivo: satisfazer os critérios de instalação (PWA) no Android/Chrome.
// Não faz cache agressivo de dados para não desatualizar o app -- sempre busca da rede primeiro.

const CACHE_NAME = 'legalmart-shell-v1';
const APP_SHELL = ['./index.html', './manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Network-first: tenta sempre buscar a versão mais recente da rede;
  // só usa o cache (app shell) se estiver offline.
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
