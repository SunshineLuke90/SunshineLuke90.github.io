import '@esri/calcite-components/dist/components/calcite-button';
import '@esri/calcite-components/dist/components/calcite-action-bar';
import '@arcgis/map-components/components/arcgis-map';
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

view.when(() => {
    const layer = view.map.layers.getItemAt(0);
    layer.queryFeatures().then(function (results) {
        // prints an array of all the features in the service to the console
        console.log(results.features);
    });
    console.log(layer)


    if (!mapElement.ready) {
        mapElement.addEventListener("arcgisViewReadyChange", handleMapReady, {
            once: true,
        });
    } else {
        handleMapReady();
    }

    async function handleMapReady() {
        // Change the default highlight option color to white
        view.highlights = [{
            name: "default",
            color: "white"
        }];

        mapElement.addEventListener("arcgisViewPointerDown", eventHandler);
        mapElement.addEventListener("arcgisViewPointerMove", eventHandler);


        const layerView = await view.whenLayerView(layer);

        let highlight, currentName;

        async function eventHandler(event) {
            // only include graphics from hurricanes layer in the hitTest
            const opts = {
                include: layer,
            };
            // the hitTest() checks to see if any graphics from the hurricanesLayer
            // intersect the x, y coordinates of the pointer
            const response = await view.hitTest(event.detail, opts);
            if (!response.results.length) {
                // no results returned from hittest, remove previous highlights
                highlight?.remove();
                document.getElementById("chart").innerHTML = `GEOID: <br> Category: <br> Speed:`;
                return;
            }

            // the topmost graphic from the hurricanes layer and display attribute
            // values from the graphic to the user
            const graphic = response.results[0].graphic;

            const attributes = graphic.attributes;
            const objectid = attributes.OBJECTID;
            console.log(graphic.attributes)
            console.log(attributes);
            console.log(objectid)

            // update the hurricanes info div
            //document.getElementById("info").innerHTML = setupHurricaneInfoDiv(attributes);

            // highlight all features belonging to the same hurricane as the feature
            // returned from the hitTest
            const query = layerView.createQuery();
            query.where = `OBJECTID = '${objectid}'`;
            layerView.queryObjectIds(query).then((ids) => {
                highlight?.remove();
                highlight = layerView.highlight(ids);
                currentName = objectid;
            });
        }
    }
})