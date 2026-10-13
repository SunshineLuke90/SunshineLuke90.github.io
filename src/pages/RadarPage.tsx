import Radar from '../../radar/Radar';
import '../../radar/styles.css';

export default function RadarPage() {
    return (
        <>
            <h2 className="project-title">A Better Esri Radar Viewer</h2>
            <div className="content">
                <arcgis-map
                    id="radar-map"
                    className="radar-map"
                    basemap="hybrid"
                    center="-98.583, 39.83"
                    zoom={4}
                ></arcgis-map>
                <div className="radar-panel">
                    <Radar mapElementId="radar-map" />
                </div>
            </div>
            <section style={{ marginTop: '20px' }}>
                <h3 className="header-text">About this project</h3>
                <p className="body-text">
                    There are very few radar applications that work efficiently with the esri software
                    suite. The goal of this project is to use open source or free radar, and loop it on
                    a timeline while allowing developers to use their own maps and data. This application
                    uses the NOAA nowCOAST WMS layer, and caches all frames for the current view extent as
                    soon as the user is done panning and zooming, so that the radar loads near-instantly.
                    <br />
                    <br />
                    The current capabilities of the out of the box esri solutions for viewing time enabled
                    layers are incredibly slow, and require the developer to choose between viewing
                    patterns across large time periods, or viewing patterns with high temporal resolution.
                    This project shows that it is possible with some minor modifications to display a user
                    friendly and responsive timeline application. On top of being able to display a looping
                    radar using the ArcGIS Maps Javascript SDK, I have also created a custom widget for
                    Experience Builder Developer Edition, which you can use in Enterprise applications, or
                    in Developer Edition web apps. You can look at what the widget version of the looping
                    radar viewer by clicking
                    {' '}
                    <a href="https://exb.luciuscreamer.com/radartest" target="_self">this link</a>
                    <br />
                    <br />
                    One massive benefit of the way that this page works is that it will work with any time
                    enabled WMS layer, as it pre-caches images, and fetches the frames based on the time
                    slots in the WMS definition. This makes it easy to add layers in the future, or switch
                    out radar layers for other services. Using an Open Geospatial Consortium standard, this
                    ensures that the layers will be supported into the future, and the layers that will be
                    supported using this approach will be widely available.
                </p>
            </section>
        </>
    );
}
