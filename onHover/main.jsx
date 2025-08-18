import '@esri/calcite-components/dist/components/calcite-button';
import '@esri/calcite-components/dist/components/calcite-action-bar';
import '@arcgis/map-components/components/arcgis-map';
import { Chart, CategoryScale, LinearScale, BarController, BarElement, Title, Legend, Tooltip } from 'chart.js';
import { disableZooming } from "./components/disableZoom";

const mapElement = document.querySelector("arcgis-map");
const view = mapElement.view;
disableZooming(view);
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Title, Legend, Tooltip)
Chart.defaults.color = "#FFFFFF"
Chart.defaults.font.family = "'Noto Sans', sans-serif"

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
/*
const demographicFields = {
    NAME: "Name",
    P0120002: "Male Population",
    P0120026: "Female Population",
};
*/
const femaleFields = ["P0120027", "P0120028", "P0120029", "F1519", "F2025", "P0120035", "P0120036", "P0120037", "P0120038", "P0120039", "P0120040", "P0120041", "F6064", "F6569", "P0120046", "P0120047", "P0120048", "P0120049"]
const maleFields = ["P0120003", "P0120004", "P0120005", "M1519", "M2024", "P0120011", "P0120012", "P0120013", "P0120014", "P0120015", "P0120016", "P0120017", "M6064", "M6569", "P0120022", "P0120023", "P0120024", "P0120025"]
const demographicFields = {
    NAME: "Name",
    P0120003: "Male 0-4",
    P0120004: "Male 5-9",
    P0120005: "Male 10-14",
    M1519: "Male 15-19",
    M2024: "Male 20-24",
    P0120011: "Male 25-29",
    P0120012: "Male 30-34",
    P0120013: "Male 35-39",
    P0120014: "Male 40-44",
    P0120015: "Male 45-49",
    P0120016: "Male 50-54",
    P0120017: "Male 55-59",
    M6064: "Male 60-64",
    M6569: "Male 65-69",
    P0120022: "Male 70-74",
    P0120023: "Male 75-79",
    P0120024: "Male 80-84",
    P0120025: "Male 85+",
    P0120027: "Female 0-4",
    P0120028: "Female 5-9",
    P0120029: "Female 10-14",
    F1519: "Female 15-19",
    F2025: "Female 20-24",
    P0120035: "Female 25-29",
    P0120036: "Female 30-34",
    P0120037: "Female 35-39",
    P0120038: "Female 40-44",
    P0120039: "Female 45-49",
    P0120040: "Female 50-54",
    P0120041: "Female 55-59",
    F6064: "Female 60-64",
    F6569: "Female 65-69",
    P0120046: "Female 70-74",
    P0120047: "Female 75-79",
    P0120048: "Female 80-84",
    P0120049: "Female 85+"
}

let highlight, currentId, pchart, rchart

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
            const FID = hitGraphic.attributes.FID;

            if (highlight && currentId === FID) {
                return;
            }

            // highlight all features belonging to the same demographic as the feature
            // returned from the hitTest
            const query = layer.createQuery();
            query.where = `FID = '${FID}'`;
            query.outFields = ["NAME", "FID", "P0120049", "P0120048", "P0120047", "P0120046", "F6569", "F6064", "P0120041", "P0120040", "P0120039", "P0120038", "P0120037", "P0120036", "P0120035", "F2025", "F1519", "P0120029", "P0120028", "P0120027", "P0120025", "P0120024", "P0120023", "P0120022", "M6569", "M6064", "P0120017", "P0120016", "P0120015", "P0120014", "P0120013", "P0120012", "P0120011", "M2024", "M1519", "P0120005", "P0120004", "P0120003"];
            query.returnGeometry = false;

            const featureSet = await layer.queryFeatures(query);

            if (featureSet.features.length > 0) {
                const graphic = featureSet.features[0];
                currentId = graphic.attributes.FID;
                highlight?.remove();
                highlight = layerView.highlight(graphic);
                document.getElementById("chart").innerHTML = queryData(graphic.attributes);

            }

            function queryData(attributes) {

                //Preparation for using the chart for data display. 
                // First need to optimize dataset to be able to provide data more cleanly.
                const femaleAgeData = []
                const maleAgeData = []

                for (let key in attributes) {
                    if (femaleFields.includes(key)) {
                        femaleAgeData.push(attributes[key])
                    }
                    else if (maleFields.includes(key)) {
                        maleAgeData.push(-Math.abs(attributes[key]))
                    }
                }
                updateChart([femaleAgeData, maleAgeData])

                const htmls = Object.keys(demographicFields)
                    .map((name) => {
                        if (attributes[name] != null) {
                            const html = `<div>${demographicFields[name]}: <b>${attributes[name]}</b><div>`;
                            return html;
                        }
                        return "";
                    })
                    .filter((html) => html !== "");
                return htmls.join("");
            }


            function updateChart(newData) {
                const [femaleAgeData, maleAgeData] = newData;

                if (!pchart) {
                    const canvasElement = document.getElementById("chart");
                    pchart = new Chart(canvasElement.getContext("2d"), {
                        type: "bar",
                        data: {
                            labels: [
                                "85+",
                                "80-84",
                                "75-79",
                                "70-74",
                                "65-69",
                                "60-64",
                                "55-59",
                                "50-54",
                                "45-49",
                                "40-44",
                                "35-39",
                                "30-34",
                                "25-29",
                                "20-24",
                                "15-19",
                                "10-14",
                                "5-9",
                                "0-4",
                            ],
                            datasets: [
                                {
                                    label: "Female",
                                    barThickness: 10,
                                    backgroundColor: "#B266FF",
                                    borderColor: "#7F00FF",
                                    borderWidth: 0.25,
                                    data: femaleAgeData,
                                },
                                {
                                    label: "Male",
                                    barThickness: 10,
                                    backgroundColor: "#0080FF",
                                    borderColor: "#004C99",
                                    borderWidth: 0.25,
                                    data: maleAgeData,
                                },
                            ],
                        },
                        options: {
                            plugins: {
                                title: {
                                    display: true,
                                    position: 'top',
                                    text: "Population Pyramid"
                                },
                                legend: {
                                    display: true,
                                    position: "bottom",
                                    title: {
                                        display: true,
                                    },
                                },
                                tooltip: {
                                    callbacks: {
                                        label: (tooltipItem) => {
                                            return `${tooltipItem.dataset.label}: ${numberWithCommas(Math.abs(tooltipItem.parsed.x))}`;
                                        },
                                    },
                                }
                            },
                            indexAxis: "y",
                            responsive: true,
                            scales: {
                                x: {
                                    title: {
                                        display: true,
                                        text: "Population"
                                    },
                                    ticks: {
                                        callback: (value) => numberWithCommas(Math.abs(parseInt(value))),
                                    }
                                },
                                y: {
                                    title: {
                                        display: true,
                                        text: "Age Group"
                                    },
                                    stacked: true,
                                },
                            },
                            maintainAspectRatio: false,
                        },
                    });

                } else {
                    pchart.data.datasets[0].data = femaleAgeData;
                    pchart.data.datasets[1].data = maleAgeData;
                    pchart.update();
                }
            }
            function numberWithCommas(value) {
                return (value || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
        }
    }
})