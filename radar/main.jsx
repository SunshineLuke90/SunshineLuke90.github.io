import '@esri/calcite-components/dist/components/calcite-button';
import '@esri/calcite-components/dist/components/calcite-action-bar';
import '@arcgis/map-components/components/arcgis-map';
import '@arcgis/map-components/components/arcgis-legend';

import Extent from "@arcgis/core/geometry/Extent.js";
import WebTileLayer from "@arcgis/core/layers/WebTileLayer.js";
import MapImageLayer from "@arcgis/core/layers/MapImageLayer.js";
import WMSLayer from "@arcgis/core/layers/WMSLayer.js";
import esriRequest from "@arcgis/core/request";


// Simple radar animation using RainViewer public tiles.
// Strategy: fetch available radar frames, create a WebTileLayer per frame,
// add them to the map, and cycle visibility to produce an animation loop.

document.addEventListener("DOMContentLoaded", async () => {
    // prefer selecting by id (radar-map) in case the page has multiple maps
    const mapElement = document.querySelector("#radar-map") || document.querySelector("arcgis-map");
    if (!mapElement) {
        console.error("No <arcgis-map> element found on page.");
        return;
    }
    const view = mapElement.view;

    // small on-page status to surface errors / loading
    const statusEl = document.createElement("div");
    statusEl.id = "radar-status";
    statusEl.style.position = "fixed";
    statusEl.style.right = "12px";
    statusEl.style.bottom = "12px";
    statusEl.style.padding = "6px 10px";
    statusEl.style.background = "rgba(0,0,0,0.6)";
    statusEl.style.color = "#fff";
    statusEl.style.fontSize = "12px";
    statusEl.style.borderRadius = "6px";
    statusEl.style.zIndex = 9999;
    statusEl.textContent = "Radar: loading...";
    document.body.appendChild(statusEl);

    view.when(async () => {
        // keep the existing center/zoom from the <arcgis-map> element; optionally set an extent
        // view.extent = new Extent({ xmin: -160, ymin: 18, xmax: -153, ymax: 21 }); // example for Hawaii

        // Try to use the official nowCOAST MapServer (NWS/NOAA) as the radar source.
        // Note: nowCOAST services are time-enabled; depending on CORS and access policies the
        // service may be accessible or blocked from client-side requests. If it fails,
        // we'll surface a helpful message in the status element.
        // We'll prefer the geoserver WMS endpoint you provided because it supports time-enabled
        // base reflectivity mosaics. We will parse the GetCapabilities to find available times
        // and then animate by updating the WMS TIME parameter on the layer.
        const wmsBase = "https://nowcoast.noaa.gov/geoserver/observations/weather_radar/ows";
        const layerName = "base_reflectivity_mosaic";

        // try to fetch GetCapabilities and parse available times for the target layer
        try {
            // use esriRequest for consistent request headers (CORS behaves like fetch)
            const capsResp = await esriRequest(`${wmsBase}?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities`, {
                responseType: "text",
            });
            const parser = new DOMParser();
            const xml = parser.parseFromString(capsResp.data, "application/xml");

            // find the Layer node with matching Name
            const layers = xml.getElementsByTagNameNS("http://www.opengis.net/wms", "Layer");
            let targetLayer = null;
            for (let i = 0; i < layers.length; i++) {
                const nameNode = layers[i].getElementsByTagNameNS("http://www.opengis.net/wms", "Name")[0];
                if (nameNode && nameNode.textContent === layerName) {
                    targetLayer = layers[i];
                    break;
                }
            }

            // Create the WMSLayer (showing the base reflectivity mosaic)
            const wms = new WMSLayer({
                url: wmsBase,
                title: "nowCOAST Radar (WMS)",
                sublayers: [{ name: layerName }],
                opacity: 0.75,
                visible: true,
            });

            view.map.add(wms);
            statusEl.textContent = "Radar: WMS layer added";

            // --- Controls UI: play/pause, slider, timestamp ---
            const controls = document.createElement("div");
            controls.id = "radar-controls";
            controls.style.position = "fixed";
            controls.style.left = "12px";
            controls.style.bottom = "12px";
            controls.style.padding = "8px";
            controls.style.background = "rgba(0,0,0,0.6)";
            controls.style.color = "#fff";
            controls.style.borderRadius = "6px";
            controls.style.zIndex = 9999;
            controls.style.display = "flex";
            controls.style.gap = "8px";
            controls.style.alignItems = "center";

            const playBtn = document.createElement("button");
            playBtn.textContent = "Play";
            playBtn.style.padding = "6px 10px";
            playBtn.style.cursor = "pointer";

            const slider = document.createElement("input");
            slider.type = "range";
            slider.min = "0";
            slider.max = "0"; // will set later
            slider.value = "0";
            slider.style.width = "260px";

            const tsLabel = document.createElement("div");
            tsLabel.textContent = "—";
            tsLabel.style.minWidth = "160px";
            tsLabel.style.fontSize = "12px";

            controls.appendChild(playBtn);
            controls.appendChild(slider);
            controls.appendChild(tsLabel);
            document.body.appendChild(controls);

            // If the capabilities list includes a Dimension or Extent with time values, parse them
            let times = [];
            if (targetLayer) {
                // try to find Dimension or Extent elements with name="time"
                const dims = targetLayer.getElementsByTagNameNS("http://www.opengis.net/wms", "Dimension");
                for (let i = 0; i < dims.length; i++) {
                    const dim = dims[i];
                    const name = dim.getAttribute("name");
                    if (name && name.toLowerCase() === "time") {
                        const text = dim.textContent.trim();
                        // time can be a comma-separated list or an interval like start/end/period
                        if (text.indexOf(",") !== -1) times = text.split(",").map((s) => s.trim());
                        else times = [text];
                        break;
                    }
                }
                // also look for <Extent name="time"> elements
                if (times.length === 0) {
                    const exts = targetLayer.getElementsByTagNameNS("http://www.opengis.net/wms", "Extent");
                    for (let i = 0; i < exts.length; i++) {
                        const ext = exts[i];
                        const name = ext.getAttribute("name");
                        if (name && name.toLowerCase() === "time") {
                            const text = ext.textContent.trim();
                            if (text.indexOf(",") !== -1) times = text.split(",").map((s) => s.trim());
                            else times = [text];
                            break;
                        }
                    }
                }
            }

            // If we didn't get a list of times but the WMS is time-enabled, we can still let it render the latest
            if (!times || times.length === 0) {
                console.debug("WMS capabilities did not include explicit times for layer; rendering latest available image.");
                statusEl.textContent = "Radar: WMS layer (latest) added";
                return;
            }

            // The times array may be huge; pick the last N times for animation
            const frames = times.slice(-30); // keep more frames for user control
            statusEl.textContent = `Radar: ${frames.length} time frames available`;

            // Service Worker registration & prefetching of WMS GetMap frames
            // This will attempt to register the SW at /sw-radar.js and then prefetch
            // a GetMap URL for each frame into the Cache API so the service worker
            // can serve cached responses during animation.
            (function () {
                const SW_PATH = '/radar/sw-radar.js';
                const CACHE_NAME = 'radar-wms-v1';

                async function registerAndPrefetch() {
                    if (!('serviceWorker' in navigator) || !('caches' in window)) {
                        console.debug('ServiceWorker or Cache API not available in this browser');
                        return;
                    }

                    try {
                        // register relative to the current document so it works on project pages
                        const swUrl = new URL('sw-radar.js', location.href).href;
                        await navigator.serviceWorker.register(swUrl, { scope: './' });
                        console.debug('Service worker registered:', swUrl);
                    } catch (e) {
                        console.debug('Service worker registration failed:', e);
                    }

                    function buildGetMapUrl(time) {
                        // Build a GetMap URL that matches the WMSLayer requests so the SW
                        // can intercept and cache them. Uses the current view extent/size.
                        try {
                            const extent = view.extent;
                            const bbox = [extent.xmin, extent.ymin, extent.xmax, extent.ymax].join(',');
                            const width = Math.max(256, view.width || 1024);
                            const height = Math.max(256, view.height || 1024);
                            const params = new URLSearchParams({
                                SERVICE: 'WMS',
                                VERSION: '1.3.0',
                                REQUEST: 'GetMap',
                                LAYERS: layerName,
                                STYLES: '',
                                CRS: 'EPSG:3857',
                                BBOX: bbox,
                                WIDTH: String(width),
                                HEIGHT: String(height),
                                FORMAT: 'image/png',
                                TRANSPARENT: 'true',
                                TIME: time,
                            });
                            return `${wmsBase}?${params.toString()}`;
                        } catch (err) {
                            console.debug('Failed to build GetMap URL for prefetch:', err);
                            return null;
                        }
                    }

                    function canonicalizeWmsUrl(rawUrl) {
                        try {
                            const u = new URL(rawUrl);
                            // drop ephemeral cache-busting params (e.g. _ts) and any param starting with '_'
                            const params = Array.from(u.searchParams.entries()).filter(([k]) => !k.startsWith('_'));
                            params.sort((a, b) => a[0].localeCompare(b[0]) || a[1].localeCompare(b[1]));
                            const qp = params.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
                            return `${u.origin}${u.pathname}?${qp}`;
                        } catch (e) {
                            return rawUrl;
                        }
                    }

                    try {
                        const cache = await caches.open(CACHE_NAME);
                        statusEl.textContent = `Radar: caching ${frames.length} frames...`;
                        for (let i = 0; i < frames.length; i++) {
                            const url = buildGetMapUrl(frames[i]);
                            if (!url) continue;
                            const key = canonicalizeWmsUrl(url);
                            try {
                                // request as CORS; some responses may be opaque and have zero length — avoid caching those
                                const resp = await fetch(url, { mode: 'cors', credentials: 'omit' });
                                if (!resp) continue;
                                // if response is opaque (type === 'opaque') it may have zero-length body due to CORS; skip caching opaque responses
                                if (resp.type === 'opaque') {
                                    console.debug('Prefetch: opaque response, skipping cache for', url);
                                    continue;
                                }
                                if (!resp.ok) {
                                    console.debug('Prefetch: non-ok response, skipping', url, resp.status);
                                    continue;
                                }
                                // ensure there is a non-zero body by reading a small slice (blob) — avoids caching empty responses
                                const blob = await resp.clone().blob();
                                if (!blob || blob.size === 0) {
                                    console.debug('Prefetch: empty body, skipping', url);
                                    continue;
                                }
                                await cache.put(key, resp.clone());
                            } catch (fetchErr) {
                                console.debug('Prefetch failed for', url, fetchErr);
                            }
                        }
                        statusEl.textContent = `Radar: cached ${frames.length} frames`;
                    } catch (cacheErr) {
                        console.debug('Caching frames failed:', cacheErr);
                    }
                }

                // start registration and prefetch in background
                registerAndPrefetch();
            })();

            // wire slider
            slider.max = String(Math.max(0, frames.length - 1));
            slider.value = String(frames.length - 1); // default to latest

            // animation state
            let idx = frames.length - 1; // start at latest
            let intervalId = null;
            const frameDelay = 100;

            function applyFrame(i) {
                if (!frames || frames.length === 0) return;
                const t = frames[i];
                try {
                    wms.setCustomParameters({ TIME: t });
                } catch (e) {
                    try {
                        wms.customParameters = { TIME: t };
                    } catch (err) {
                        console.debug("Failed to set WMS TIME parameter:", err);
                    }
                }
                // force the layer to refresh so the new TIME parameter is requested immediately
                try {
                    if (typeof wms.refresh === 'function') wms.refresh();
                } catch (e) {
                    console.debug('WMS refresh failed:', e);
                }
                slider.value = String(i);
                // display human-friendly timestamp where possible
                try {
                    const dt = new Date(t);
                    if (!isNaN(dt.getTime())) tsLabel.textContent = dt.toLocaleString();
                    else tsLabel.textContent = t;
                } catch (e) {
                    tsLabel.textContent = t;
                }
            }

            function startAnimation() {
                if (intervalId) return;
                playBtn.textContent = "Pause";
                intervalId = setInterval(() => {
                    idx = (idx + 1) % frames.length;
                    applyFrame(idx);
                }, frameDelay);
            }

            function stopAnimation() {
                if (!intervalId) return;
                clearInterval(intervalId);
                intervalId = null;
                playBtn.textContent = "Play";
            }

            // wire controls
            playBtn.addEventListener("click", () => {
                if (intervalId) stopAnimation();
                else startAnimation();
            });

            slider.addEventListener("input", (ev) => {
                const val = Number(ev.target.value);
                idx = val;
                applyFrame(idx);
                // pause animation when user drags the slider
                stopAnimation();
            });

            // apply initial (latest) frame
            applyFrame(idx);
        } catch (err) {
            console.error("Error creating WMS layer from nowCOAST:", err);
            statusEl.textContent = "Radar: WMS layer error or not accessible";
            // fallback: attempt the earlier MapImageLayer approach (may still be blocked)
            try {
                const nowcoastUrl = "https://nowcoast.noaa.gov/arcgis/rest/services/nowcoast/radar_meteo_imagery_nexrad_time/MapServer";
                const nowLayer = new MapImageLayer({
                    url: nowcoastUrl,
                    id: "nowcoast-radar",
                    opacity: 0.75,
                    visible: true,
                });
                view.map.add(nowLayer);
                statusEl.textContent = "Radar: nowCOAST MapImageLayer added as fallback";
            } catch (e) {
                console.error("Fallback MapImageLayer failed:", e);
            }
        }
    });
});

