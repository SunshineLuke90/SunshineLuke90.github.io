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

            // wire slider
            slider.max = String(Math.max(0, frames.length - 1));
            slider.value = String(frames.length - 1); // default to latest

            // animation state
            let idx = frames.length - 1; // start at latest
            let intervalId = null;
            const frameDelay = 300;

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

