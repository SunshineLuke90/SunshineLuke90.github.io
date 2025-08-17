import '@esri/calcite-components/dist/components/calcite-button';
import '@esri/calcite-components/dist/components/calcite-action-bar';
import '@arcgis/map-components/components/arcgis-map';
import { disableZooming } from "./components/disableZoom";

const mapElement = document.querySelector("arcgis-map");

mapElement.addEventListener("arcgisViewReadyChange", (event) => {
    console.log("Map component's view is ready.");
    const view = event.target.view;
    view.when(() => {
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
        console.log(view.popup)
    })

    // Apply the no-zoom logic to the component's view
    disableZooming(view);

    // Perform other map-ready actions
    handleMapInteraction(view);
});

async function handleMapInteraction(view) {
    // The view is already ready here.

    // Change the default highlight option color to orange
    view.highlightOptions = {
        color: "orange"
    };
}
