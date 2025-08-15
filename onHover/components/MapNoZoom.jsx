import WebMap from "@arcgis/core/WebMap";
import MapView from '@arcgis/core/views/MapView.js'

function disableZooming(view) {
    // Removes the zoom action on the popup
    view.popup.actions = [];

    // stops propagation of default behavior when an event fires
    function stopEvtPropagation(event) {
        event.stopPropagation();
    }

    // exlude the zoom widget from the default UI
    view.ui.components = [];

    // disable mouse wheel scroll zooming on the view
    view.on("mouse-wheel", stopEvtPropagation);

    // disable zooming via double-click on the view
    view.on("double-click", stopEvtPropagation);

    // disable zooming out via double-click + Control on the view
    view.on("double-click", ["Control"], stopEvtPropagation);

    // disables pinch-zoom and panning on the view
    view.on("drag", stopEvtPropagation);

    // disable the view's zoom box to prevent the Shift + drag
    // and Shift + Control + drag zoom gestures.
    view.on("drag", ["Shift"], stopEvtPropagation);
    view.on("drag", ["Shift", "Control"], stopEvtPropagation);

    // prevents zooming with the + and - keys
    view.on("key-down", (event) => {
        const prohibitedKeys = [
            "+",
            "-",
            "Shift",
            "_",
            "=",
            "ArrowUp",
            "ArrowDown",
            "ArrowRight",
            "ArrowLeft",
        ];
        const keyPressed = event.key;
        if (prohibitedKeys.indexOf(keyPressed) !== -1) {
            event.stopPropagation();
        }
    });

    return view;
}

export default function MapNoZoom(mapId, containerId, center, zoom) {
    const map = new WebMap({
        portalItem: {
            // autocasts as new PortalItem()
            id: mapId,
        },
    });

    const view = new MapView({
        container: containerId,
        map: map,
        center: center,
        zoom: zoom,
        ui: {
            components: ["attribution"],
        },
        constraints: {
            rotationEnabled: false,
        },
        popup: {
            dockEnabled: true,
            dockOptions: {
                position: "top-left",
                breakpoint: false,
            },
        },
    });
    view.when(disableZooming)
    return { view: view, map: map };
}