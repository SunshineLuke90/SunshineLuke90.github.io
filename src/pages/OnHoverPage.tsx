import { useEffect } from 'react';
import Extent from '@arcgis/core/geometry/Extent';
import '@arcgis/map-components/components/arcgis-map';
import '@arcgis/map-components/components/arcgis-legend';
import { disableZooming } from '../../onHover/components/disableZoom';
import queryData from '../../onHover/services/queryData';
import updateChart, { destroyCharts } from '../../onHover/services/updateChart';
import type { HoverChartData } from '../../onHover/services/updateChart';
import '../../onHover/styles.css';

const MISSOURI_DATA: HoverChartData = [
    [79562, 72388, 107689, 151490, 155295, 214486, 216427, 186149, 178612, 181573, 198643, 201131, 199105, 201126, 200337, 197724, 185820, 173242],
    [-43898, -53314, -87820, -130465, -165836, -199428, -206630, -180929, -175924, -179869, -196736, -200745, -201123, -209603, -207351, -207308, -195353, -181782],
    [4275663, 1879250],
    [4740335, 699840, 30518, 133377, 9730, 127942, 413171],
];

const OUT_FIELDS = [
    'NAME', 'OBJECTID', 'P0120049', 'P0120048', 'P0120047', 'P0120046', 'F6569', 'F6064',
    'P0120041', 'P0120040', 'P0120039', 'P0120038', 'P0120037', 'P0120036', 'P0120035',
    'F2024', 'F1519', 'P0120029', 'P0120028', 'P0120027', 'P0120025', 'P0120024', 'P0120023',
    'P0120022', 'M6569', 'M6064', 'P0120017', 'P0120016', 'P0120015', 'P0120014', 'P0120013',
    'P0120012', 'P0120011', 'M2024', 'M1519', 'P0120005', 'P0120004', 'P0120003', 'P0020002',
    'P0020003', 'P0030002', 'P0030003', 'P0030004', 'P0030005', 'P0030006', 'P0030007', 'P0030008',
];

export default function OnHoverPage () {
    useEffect(() => {
        const mapElement = document.getElementById('on-hover-map') as any;
        if (!mapElement) {
            return;
        }

        const view = mapElement.view as any;
        if (!view) {
            return;
        }

        let highlight: any;
        let currentId: any = null;
        let first = false;
        let selected = false;
        let clickHandler: ((event: any) => Promise<void>) | null = null;
        let moveHandler: ((event: any) => Promise<void>) | null = null;
        let disposed = false;

        const isMobile = window.innerWidth < 800;
        first = updateChart(MISSOURI_DATA, first, isMobile);

        const titlePanel = document.getElementById('title-panel');
        if (titlePanel) {
            titlePanel.innerHTML = 'Missouri';
        }

        disableZooming(view);
        view.popupEnabled = false;
        view.highlights = [{
            name: 'default',
            color: 'white',
        }];

        view.when(async () => {
            if (disposed) {
                return;
            }

            const layer = view.map.layers.getItemAt(0);
            view.extent = new Extent({
                xmin: -96.0,
                ymin: 35.7,
                xmax: -88.9,
                ymax: 40.9,
            });

            const query = layer.createQuery();
            query.outFields = OUT_FIELDS;
            query.returnGeometry = false;

            const handleMapReady = async () => {
                const layerView = await view.whenLayerView(layer);

                clickHandler = async (event: any) => {
                    if (disposed) {
                        return;
                    }

                    const response = await view.hitTest(event.detail, { include: layer });
                    if (response.results.length === 0) {
                        highlight?.remove();
                        const title = document.getElementById('title-panel');
                        if (title) {
                            title.innerHTML = 'Missouri';
                        }
                        first = updateChart(MISSOURI_DATA, first);
                        currentId = null;
                        selected = false;
                        const tooltip = document.getElementById('tooltip');
                        if (tooltip) {
                            tooltip.style.visibility = 'hidden';
                        }
                        return;
                    }

                    const hitGraphic = response.results[0].graphic;
                    const objectId = hitGraphic.attributes.OBJECTID;

                    if (highlight && currentId === objectId && selected) {
                        selected = false;
                        const tooltip = document.getElementById('tooltip');
                        if (tooltip) {
                            tooltip.style.visibility = 'hidden';
                        }
                        return;
                    }

                    query.where = `OBJECTID = '${objectId}'`;
                    const featureSet = await layer.queryFeatures(query);
                    if (featureSet.features.length === 0) {
                        return;
                    }

                    selected = true;
                    const graphic = featureSet.features[0];
                    currentId = graphic.attributes.OBJECTID;
                    highlight?.remove();
                    highlight = layerView.highlight(graphic);

                    const title = document.getElementById('title-panel');
                    if (title) {
                        title.innerHTML = graphic.attributes.NAME;
                    }

                    const chartData = queryData(graphic.attributes as Record<string, number>);
                    first = updateChart(chartData, first);

                    const tooltip = document.getElementById('tooltip');
                    if (tooltip) {
                        tooltip.style.visibility = 'visible';
                    }
                };

                moveHandler = async (event: any) => {
                    if (disposed || selected) {
                        return;
                    }

                    const response = await view.hitTest(event.detail, { include: layer });
                    if (response.results.length === 0) {
                        highlight?.remove();
                        if (currentId === null) {
                            const title = document.getElementById('title-panel');
                            if (title) {
                                title.innerHTML = 'Missouri';
                            }
                            first = updateChart(MISSOURI_DATA, first);
                        }
                        currentId = null;
                        return;
                    }

                    const hitGraphic = response.results[0].graphic;
                    const objectId = hitGraphic.attributes.OBJECTID;

                    if (highlight && currentId === objectId) {
                        return;
                    }

                    query.where = `OBJECTID = '${objectId}'`;
                    const featureSet = await layer.queryFeatures(query);
                    if (featureSet.features.length === 0) {
                        return;
                    }

                    const graphic = featureSet.features[0];
                    currentId = graphic.attributes.OBJECTID;
                    highlight?.remove();
                    highlight = layerView.highlight(graphic);

                    const title = document.getElementById('title-panel');
                    if (title) {
                        title.innerHTML = graphic.attributes.NAME;
                    }

                    const chartData = queryData(graphic.attributes as Record<string, number>);
                    first = updateChart(chartData, first);
                };

                mapElement.removeEventListener('arcgisViewImmediateClick', clickHandler);
                mapElement.removeEventListener('arcgisViewPointerDown', moveHandler);
                mapElement.removeEventListener('arcgisViewPointerMove', moveHandler);

                mapElement.addEventListener('arcgisViewImmediateClick', clickHandler);
                mapElement.addEventListener('arcgisViewPointerDown', moveHandler);
                mapElement.addEventListener('arcgisViewPointerMove', moveHandler);
            };

            if (!mapElement.ready) {
                mapElement.addEventListener('arcgisViewReadyChange', handleMapReady, { once: true });
            } else {
                await handleMapReady();
            }
        });

        return () => {
            disposed = true;
            highlight?.remove();

            if (clickHandler) {
                mapElement.removeEventListener('arcgisViewImmediateClick', clickHandler);
            }

            if (moveHandler) {
                mapElement.removeEventListener('arcgisViewPointerDown', moveHandler);
                mapElement.removeEventListener('arcgisViewPointerMove', moveHandler);
            }

            destroyCharts();
        };
    }, []);

    return (
        <>
            <h2 className="project-title">Working with the hover effect</h2>
            <section className="main-content">
                <div id="tooltip" className="tooltip">Click the map to change or remove selection.</div>
                <arcgis-map
                    id="on-hover-map"
                    className="map"
                    item-id="83e20099377244d3b995de9e6a35ee37"
                    center="-92.5, 38.4"
                    zoom={6}
                ></arcgis-map>
                <arcgis-legend id="legend" className="legend" reference-element="on-hover-map"></arcgis-legend>
                <div id="title-panel" className="title-panel"></div>
                <div className="pop-panel">
                    <canvas id="chart" className="chart"></canvas>
                </div>
                <div className="race-panel">
                    <canvas id="race-pie" className="race-pie"></canvas>
                </div>
                <div className="urban-rural-panel">
                    <canvas id="urban-rural-pie" className="urban-rural-pie"></canvas>
                </div>
            </section>
            <section style={{ marginTop: '20px' }}>
                <h3 className="header-text">About this project</h3>
                <p className="body-text">
                    Extending from the previous project, taking control of Calcite Components, this
                    project takes control of the drawing of a map widget, restricting the map from being
                    able to zoom, pan or scale. This enables for a more focused experience, allowing for
                    cartography decisions to be made manually, but also keeps the functionality of being
                    able to interact with a dynamic map.
                    <br />
                    <br />
                    This project focuses on the use of the hover effect, using hitTest() to watch the
                    pointer to see what feature is being hovered. This enables the webpage to dynamically
                    query the features very rapidly. The charts throughout the page are using the Charts.js
                    library, which is a robust and lightweight library for creating dynamic charts.
                    <br />
                    <br />
                    The use of population statistics in this project is a way to show that a very high
                    number of fields can be queried and displayed at the same time, without sacrificing
                    performance. The most interesting of the charts is likely the population pyramid on the
                    right side of the screen. Exploring the population pyramids of primarily Rural vs Urban
                    counties, and viewing the relationship between age statistics, male vs female
                    population, and racial makeup is a good proof of concept for using dynamic charts on
                    ArcGIS map elements.
                </p>
            </section>
        </>
    );
}
