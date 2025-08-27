const CACHE_NAME = 'radar-wms-v1';

self.addEventListener('install', (event) => {
    // activate immediately
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

// Intercept WMS GetMap requests for the nowCOAST geoserver and serve cached responses when available
self.addEventListener('fetch', (event) => {
    const url = event.request.url;
    // Only handle GET requests and WMS GetMap calls
    if (event.request.method !== 'GET') return;
    if (url.indexOf('/geoserver/observations/weather_radar/ows') === -1) return;
    // simple heuristic to match GetMap calls
    if (url.toLowerCase().indexOf('request=getmap') === -1) return;

    // helper: normalize a WMS GetMap URL to a canonical key using origin+path + LAYERS + TIME
    function normalizeWmsKey(rawUrl) {
        try {
            const u = new URL(rawUrl);
            const params = u.searchParams;
            const layers = params.get('LAYERS') || params.get('layers') || '';
            const time = params.get('TIME') || params.get('time') || '';
            // canonicalize to origin + pathname + ?LAYERS=...&TIME=...
            return `${u.origin}${u.pathname}?LAYERS=${encodeURIComponent(layers)}&TIME=${encodeURIComponent(time)}`;
        } catch (e) {
            return rawUrl;
        }
    }
    // Use a tolerant cache lookup: try exact match first, then try to find
    // a cached entry that matches host+path and key WMS params (LAYERS and TIME).
    event.respondWith((async () => {
        const cache = await caches.open(CACHE_NAME);
        // 1) exact match
        const exact = await cache.match(event.request);
        if (exact) {
            // console.debug('[sw-radar] cache exact match', event.request.url);
            return exact;
        }

        // 1b) normalized lookup
        try {
            const normalizedKey = normalizeWmsKey(event.request.url);
            const normMatch = await cache.match(normalizedKey);
            if (normMatch) {
                // console.debug('[sw-radar] cache normalized match', normalizedKey, 'for', event.request.url);
                return normMatch;
            }
        } catch (e) {
            // ignore
        }

        // 2) tolerant match: parse request URL params and compare against cached keys
        try {
            const reqUrl = new URL(event.request.url);
            const reqParams = reqUrl.searchParams;
            const reqLayers = reqParams.get('LAYERS') || reqParams.get('layers') || '';
            const reqTime = reqParams.get('TIME') || reqParams.get('time') || '';

            const keys = await cache.keys();
            for (const k of keys) {
                try {
                    const kUrl = new URL(k.url);
                    // ensure same origin + path
                    if (kUrl.origin !== reqUrl.origin) continue;
                    if (kUrl.pathname !== reqUrl.pathname) continue;

                    const kParams = kUrl.searchParams;
                    const kLayers = kParams.get('LAYERS') || kParams.get('layers') || '';
                    const kTime = kParams.get('TIME') || kParams.get('time') || '';

                    // match layers and time exactly; ignore other params like WIDTH/HEIGHT/FORMAT order
                    if (kLayers === reqLayers && kTime === reqTime) {
                        const cached = await cache.match(k);
                        if (cached) {
                            // console.debug('[sw-radar] cache tolerant match', k.url, 'for', event.request.url);
                            return cached;
                        }
                    }
                } catch (inner) {
                    // ignore malformed cached key
                    continue;
                }
            }
        } catch (parseErr) {
            // if URL parsing fails, continue to network fetch
            console.debug('[sw-radar] URL parse error in SW fetch handler', parseErr);
        }

        // 3) fallback to network and store the result in cache for future lookups
        try {
            const resp = await fetch(event.request);
            if (resp && resp.ok) {
                // store with the original request as the key
                cache.put(event.request, resp.clone()).catch((e) => {
                    console.debug('[sw-radar] cache.put failed', e);
                });
                // also store a normalized key (origin+path + LAYERS + TIME) to improve matching
                try {
                    const normalizedKey = normalizeWmsKey(event.request.url);
                    const normalizedRequest = new Request(normalizedKey, { method: 'GET' });
                    cache.put(normalizedRequest, resp.clone()).catch((e) => {
                        console.debug('[sw-radar] cache.put(normalized) failed', e);
                    });
                } catch (normErr) {
                    console.debug('[sw-radar] normalized cache.put failed', normErr);
                }
            }
            return resp;
        } catch (e) {
            // final fallback to any cached entry that might exist
            const fallback = await cache.match(event.request);
            if (fallback) return fallback;
            return new Response('Service unavailable', { status: 503 });
        }
    })());
});
