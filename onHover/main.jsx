import "../styles.css";
import "../calcite.css"

import { MapNoZoom } from "./components/MapNoZoom";

import '@esri/calcite-components/dist/components/calcite-button';
import '@esri/calcite-components/dist/components/calcite-action-bar';
import '@esri/calcite-components/dist/components/calcite-shell';
import '@arcgis/map-components/components/arcgis-map'
import '@arcgis/map-components/components/arcgis-zoom'
import '@arcgis/map-components/components/arcgis-legend'


document.querySelector("map").addEventListener("arcgisViewReadyChange", (event) => {
    const { thing } = event.target.map
    thing.view
});
const domNode = document.getElementById("map");

const root = createRoot(domNode);

root.render(
    <MapNoZoom container="map" map_id="d5dda743788a4b0688fe48f43ae7beb9"></MapNoZoom>
)