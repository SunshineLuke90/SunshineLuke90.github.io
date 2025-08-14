export function MapNoZoom({ container, map_id }) {
    const map = new WebMap({
        portalItem: {
            id: map_id
        }
    })

    const view = new MapView({
        container: container,
        map: map,
        ui: {
            components: ['attribution'],
        },
        constraints: {
            rotationEnabled: false,
        },
    })
    view.when(disableZooming)
}





const [WebMap, MapView] = await $arcgis.import([
    "@arcgis/core/WebMap.js",
    "@arcgis/core/views/MapView.js",
]);

const map = new WebMap({
    portalItem: {
        // autocasts as new PortalItem()
        id: "d5dda743788a4b0688fe48f43ae7beb9",
    },
});

const view = new MapView({
    container: "viewDiv",
    map: map,
    ui: {
        components: ["attribution"],
    },
    constraints: {
        rotationEnabled: false,
    },
});

view.when(disableZooming);

/**
 * Disables all zoom gestures on the given view instance.
 *
 * @param {esri/views/MapView} view - The MapView instance on which to
 *                                  disable zooming gestures.
 */
function disableZooming(view) {
    // Removes the zoom action on the popup
    view.popup.actions = [];

    // stops propagation of default behavior when an event fires
    function stopEvtPropagation(event) {
        event.stopPropagation();
    }

    // exlude the zoom widget from the default UI
    view.ui.components = ["attribution"];

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