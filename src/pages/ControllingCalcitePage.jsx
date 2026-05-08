import { useEffect } from 'react';
import Extent from '@arcgis/core/geometry/Extent';
import '@arcgis/map-components/components/arcgis-map';
import '@arcgis/map-components/components/arcgis-zoom';
import { AlertPanel } from '../../controllingCalcite/components/AlertPanel';
import '../../controllingCalcite/controllingCalcite.css';

export default function ControllingCalcitePage() {
    useEffect(() => {
        const mapElement = document.getElementById('calcite-map');
        if (!mapElement) {
            return;
        }

        const view = mapElement.view;
        if (!view || typeof view.when !== 'function') {
            return;
        }

        let isDisposed = false;

        view.when(() => {
            if (isDisposed) {
                return;
            }

            view.extent = new Extent({
                xmin: -96.0,
                ymin: 35.7,
                xmax: -88.9,
                ymax: 40.9,
            });
        });

        return () => {
            isDisposed = true;
        };
    }, []);

    return (
        <>
            <h2 className="project-title">Taking control over Calcite Design</h2>
            <section className="row">
                <arcgis-map
                    id="calcite-map"
                    className="map"
                    item-id="cddcd2af269640fd8ee2ffa859309937"
                    center="-92.5, 38.6"
                    zoom="6"
                >
                    <arcgis-zoom id="zoom" layout="horizontal"></arcgis-zoom>
                </arcgis-map>
                <div className="react-div">
                    <AlertPanel areaCode="MO" />
                </div>
            </section>
            <section className="description-text">
                <h3 className="header-text">About this project</h3>
                <p className="body-text">
                    This project is a showcase of how calcite components and the ArcGIS Javascript SDK
                    can be adjusted to completely change the visual identity of the components. The
                    components in this page, and throughout this website are being adjusted to conform to
                    this websites visual identity, with soft rounded corners, overlapping elements, and a
                    dark color scheme.
                    <br />
                    <br />
                    The map displays Watches, Warnings and Advisories from the National Weather Service.
                    The features within the map are set to update every 5 minutes. However, when looking
                    for real-time updates on a monitoring website, especially with the short term nature
                    of some warnings like tornado or flash flood warnings, 5 minutes is not quick enough.
                    <br />
                    <br />
                    The panel to the right of the map sends API requests directly to the National Weather
                    Service, fetching active severe and extreme alerts every 30 seconds. In addition, the
                    side panel allows the user to turn on an audio alert for new alerts. If the user
                    unmutes an alert, a sound will play until the user mutes the alert again.
                </p>
            </section>
        </>
    );
}
