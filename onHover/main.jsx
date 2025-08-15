import "../styles.css";
import "../calcite.css";

import '@esri/calcite-components/dist/components/calcite-button';
import '@esri/calcite-components/dist/components/calcite-action-bar';
import '@arcgis/map-components/components/arcgis-map';

import WebMap from "@arcgis/core/WebMap";
import MapView from '@arcgis/core/views/MapView.js';

import MapNoZoom from "./components/MapNoZoom";

const mapinfo = MapNoZoom("83e20099377244d3b995de9e6a35ee37", "map", [-92.5, 38.6], 6)



if (!mapinfo.view.ready) {
    mapinfo.view.addEventListener("arcgisViewReadyChange", handleMapReady, {
        once: true,
    });
} else {
    handleMapReady();
}
const mapLayers = mapinfo.view.layerViews.toArray()

console.log(mapLayers)
async function handleMapReady() {
    // change the default highlight option object's color to orange
    mapinfo.view.highlights.forEach((highlightOption) => {
        if (highlightOption.name === "default") {
            highlightOption.color = "orange";
        }
    });

    const layerView = await viewElement.whenLayerView(layer);

    // update layer's renderer
    const renderer = layer.renderer.clone();
    renderer.symbol.width = 4;
    renderer.symbol.color = [128, 128, 128, 0.8];
    layer.renderer = renderer;
}
