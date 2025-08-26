import '@esri/calcite-components/dist/components/calcite-button';
import '@esri/calcite-components/dist/components/calcite-action-bar';
import '@arcgis/map-components/components/arcgis-map';
import '@arcgis/map-components/components/arcgis-legend';

import Extent from "@arcgis/core/geometry/Extent.js";
import { disableZooming } from "./components/disableZoom";
import queryData from "./services/queryData";
import updateChart from "./services/updateChart";

// get map element from <arcgis-map> component
const mapElement = document.querySelector("arcgis-map");
const view = mapElement.view;
// disable map zooming and panning, effectively creating an interactive but static map
disableZooming(view);
view.popupEnabled = false; // disable the popup that appears when hovering over features
view.highlights = [{
    name: "default",
    color: "white"
}];

//fill with missouri data. Order is female, male, urban, race.
// this will be put in a priming read, and then used as a fallback whenever the user has not hovered a feature.
let missouriData = [
    [79562, 72388, 107689, 151490, 155295, 214486, 216427, 186149, 178612, 181573, 198643, 201131, 199105, 201126, 200337, 197724, 185820, 173242],
    [-43898, -53314, -87820, -130465, -165836, -199428, -206630, -180929, -175924, -179869, -196736, -200745, -201123, -209603, -207351, -207308, -195353, -181782],
    [4275663, 1879250],
    [4740335, 699840, 30518, 133377, 9730, 127942, 413171]
]
let highlight, currentId
let first = false
let selected = false

let isMobile = window.innerWidth < 800;

first = updateChart(missouriData, first, isMobile);

document.getElementById("title-panel").innerHTML = "Missouri"

view.when(() => {
    const layer = view.map.layers.getItemAt(0);
    view.extent = new Extent({
        xmin: -96.0,
        ymin: 35.7,
        xmax: -88.9,
        ymax: 40.9,
    });
    const query = layer.createQuery();
    query.outFields = ["NAME", "OBJECTID", "P0120049", "P0120048", "P0120047", "P0120046", "F6569", "F6064", "P0120041", "P0120040", "P0120039", "P0120038", "P0120037", "P0120036", "P0120035", "F2024", "F1519", "P0120029", "P0120028", "P0120027", "P0120025", "P0120024", "P0120023", "P0120022", "M6569", "M6064", "P0120017", "P0120016", "P0120015", "P0120014", "P0120013", "P0120012", "P0120011", "M2024", "M1519", "P0120005", "P0120004", "P0120003", "P0020002", "P0020003", "P0030002", "P0030003", "P0030004", "P0030005", "P0030006", "P0030007", "P0030008"];
    query.returnGeometry = false;

    if (!mapElement.ready) {
        mapElement.addEventListener("arcgisViewReadyChange", handleMapReady, {
            once: true,
        });
    } else {
        handleMapReady();
    }

    async function handleMapReady() {
        mapElement.addEventListener("arcgisViewImmediateClick", clickHandler);
        mapElement.addEventListener("arcgisViewPointerDown", moveHandler);
        mapElement.addEventListener("arcgisViewPointerMove", moveHandler);

        const layerView = await view.whenLayerView(layer);

        async function clickHandler(event) {
            const opts = {
                include: layer,
            }

            const response = await view.hitTest(event.detail, opts)

            if (response.results.length === 0) {
                highlight?.remove();
                document.getElementById("title-panel").innerHTML = "Missouri"
                first = updateChart(missouriData, first);
                currentId = null;
                selected = false;
                document.getElementById("tooltip").style.visibility = "hidden";
                return;

            }
            const hitGraphic = response.results[0].graphic;
            const OBJECTID = hitGraphic.attributes.OBJECTID;

            if (highlight && currentId === OBJECTID && selected) {
                selected = false;
                document.getElementById("tooltip").style.visibility = "hidden";
                return;
            }

            query.where = `OBJECTID = '${OBJECTID}'`;
            const featureSet = await layer.queryFeatures(query);

            if (featureSet.features.length > 0) {
                selected = true;
                const graphic = featureSet.features[0];
                currentId = graphic.attributes.OBJECTID;
                highlight?.remove();
                highlight = layerView.highlight(graphic);
                document.getElementById("title-panel").innerHTML = graphic.attributes.NAME
                const chartData = queryData(graphic.attributes);
                first = updateChart(chartData, first)
                document.getElementById("tooltip").style.visibility = "visible";
            }
        }

        async function moveHandler(event) {
            if (selected) {
                return;
            }
            // only include graphics from Demographic layer in the hitTest
            const opts = {
                include: layer,
            };
            // the hitTest() checks to see if any graphics from the Demographic Layer
            // intersect the x, y coordinates of the pointer
            const response = await view.hitTest(event.detail, opts);
            if (response.results.length === 0) {
                // no results returned from hittest, remove previous highlights
                highlight?.remove();
                if (currentId === null) {
                    document.getElementById("title-panel").innerHTML = "Missouri"
                    first = updateChart(missouriData, first)
                }
                currentId = null;
                return;
            }

            // retrieve the topmost graphic from the demographics layer and display attribute
            // values from the graphic to the user
            const hitGraphic = response.results[0].graphic;
            const OBJECTID = hitGraphic.attributes.OBJECTID;

            // If current feature is the same as previous feature, do nothing.
            if (highlight && currentId === OBJECTID) {
                return;
            }

            // highlight feature with objectid, return attribute values from the data fields. 
            query.where = `OBJECTID = '${OBJECTID}'`;
            const featureSet = await layer.queryFeatures(query);

            if (featureSet.features.length > 0) {
                const graphic = featureSet.features[0];
                currentId = graphic.attributes.OBJECTID;
                highlight?.remove();
                highlight = layerView.highlight(graphic);
                document.getElementById("title-panel").innerHTML = graphic.attributes.NAME
                const chartData = queryData(graphic.attributes);
                first = updateChart(chartData, first)
            }
        }
    }
})