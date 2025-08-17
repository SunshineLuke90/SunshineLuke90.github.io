import '@esri/calcite-components/dist/components/calcite-button';
import '@esri/calcite-components/dist/components/calcite-action-bar';
import '@arcgis/map-components/components/arcgis-map';
import { Chart } from 'chart.js';
import { disableZooming } from "./components/disableZoom";

const mapElement = document.querySelector("arcgis-map");
const view = mapElement.view;
disableZooming(view);

view.popup.dockOptions = {
    // Disable the dock button so users cannot undock the popup
    buttonEnabled: false,
    // Dock the popup when the size of the view is less than or equal to 600x1000 pixels
    breakpoint: {
        width: 600,
        height: 1000
    },
    position: "top-left"
};

// fields used to display demographics info
const demographicFields = {
    NAME: "Name",
    P0120002: "Male Population",
    P0120026: "Female Population",
};

let highlight, currentId

view.highlights = [{
    name: "default",
    color: "white"
}];

view.when(() => {
    const layer = view.map.layers.getItemAt(0);

    if (!mapElement.ready) {
        mapElement.addEventListener("arcgisViewReadyChange", handleMapReady, {
            once: true,
        });
    } else {
        handleMapReady();
    }

    async function handleMapReady() {
        // Change the default highlight option color to white

        mapElement.addEventListener("arcgisViewPointerDown", eventHandler);
        mapElement.addEventListener("arcgisViewPointerMove", eventHandler);

        const layerView = await view.whenLayerView(layer);

        async function eventHandler(event) {
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
                currentId = null;
                document.getElementById("chart").innerHTML = `Name: <br> Male Population: <br> Female Population:`;
                return;
            }

            // the topmost graphic from the demographics layer and display attribute
            // values from the graphic to the user
            const hitGraphic = response.results[0].graphic;
            const objectId = hitGraphic.attributes.OBJECTID;

            if (highlight && currentId === objectId) {
                return;
            }

            // highlight all features belonging to the same demographic as the feature
            // returned from the hitTest
            const query = layer.createQuery();
            query.where = `OBJECTID = '${objectId}'`;
            query.outFields = ["NAME", "P0120002", "P0120026", "OBJECTID"];
            query.returnGeometry = false;

            const featureSet = await layer.queryFeatures(query);

            if (featureSet.features.length > 0) {
                const graphic = featureSet.features[0];
                currentId = graphic.attributes.OBJECTID;
                highlight?.remove();
                highlight = layerView.highlight(graphic);
                document.getElementById("chart").innerHTML = setupChartDiv(graphic.attributes);
            }

            function setupChartDiv(attributes) {
                let isFirst = true;
                /* 
                //Preparation for using the chart for data display. 
                // First need to optimize dataset to be able to provide data more cleanly.
                console.log(attributes)
                const femaleAgeData = []
                const maleAgeData = []

                for (let key in attributes) {
                    if (key.includes("26")) {
                        femaleAgeData.push(attributes[key])
                    }
                    else if (key.includes("0002")) {
                        maleAgeData.push(attributes[key])
                    }
                }
                console.log(femaleAgeData)
                console.log(maleAgeData)
                */
                const htmls = Object.keys(demographicFields)
                    .map((name) => {
                        if (attributes[name] != null) {
                            const html = `<div>${demographicFields[name]}: <b>${attributes[name]}</b><div>`;
                            isFirst = false;
                            return html;
                        }
                        return "";
                    })
                    .filter((html) => html !== "");
                return htmls.join("");
            }

        }
    }
})