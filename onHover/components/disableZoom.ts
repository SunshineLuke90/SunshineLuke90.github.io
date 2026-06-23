export function disableZooming(view: any) {
    // Removes the zoom to feature option from the popup
    view.popup.actions = [];
    view.popup.viewModel = { includeDefaultActions: false };


    // stops propagation of default behavior when an event fires
    function stopEvtPropagation(event: any) {
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
    view.on("key-down", (event: any) => {
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
