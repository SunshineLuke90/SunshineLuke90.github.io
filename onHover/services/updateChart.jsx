import { Chart, CategoryScale, LinearScale, BarController, BarElement, Title, Legend, Tooltip, PieController, ArcElement } from 'chart.js';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, PieController, ArcElement, Title, Legend, Tooltip)
Chart.defaults.color = "#FFFFFF"
Chart.defaults.font.family = "'Noto Sans', sans-serif"

let pchart, urbanChart, raceChart

export default function updateChart(chartData, first, isMobile = false) {
    if (!first) {
        const canvasElementPop = document.getElementById("chart");
        const canvasElementUrban = document.getElementById("urban-rural-pie")
        const canvasElementRace = document.getElementById("race-pie")
        pchart = new Chart(canvasElementPop.getContext("2d"), {
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
                        data: chartData[0],
                    },
                    {
                        label: "Male",
                        barThickness: 10,
                        backgroundColor: "#0080FF",
                        borderColor: "#004C99",
                        borderWidth: 0.25,
                        data: chartData[1],
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
                        display: isMobile ? false : true,
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
                            display: isMobile ? false : true,
                            callback: (value) => numberWithCommas(Math.abs(parseInt(value))),
                        }
                    },
                    y: {
                        title: {
                            display: isMobile ? false : true,
                            text: "Age Group"
                        },
                        ticks: {
                            display: isMobile ? false : true,
                        },
                        stacked: true,
                    },
                },
                maintainAspectRatio: false,
            },
        });

        urbanChart = new Chart(canvasElementUrban.getContext("2d"), {
            type: "doughnut",
            data: {
                labels: [
                    "Urban",
                    "Rural"
                ],
                datasets: [{
                    label: "Pop",
                    data: chartData[2],
                    backgroundColor: ["#992cc4", "#ebb41e"],
                    borderColor: ["#4f1c6b", "#ad7e0f"]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        position: 'top',
                        text: "Urban/Rural Population"
                    },
                    legend: {
                        display: true,
                        position: "bottom",
                        maxWidth: 200,
                        labels: {
                            boxWidth: 10,
                            boxHeight: 10,
                            font: {
                                size: 10
                            }
                        },
                        padding: 5
                    }
                }
            }

        });

        raceChart = new Chart(canvasElementRace.getContext("2d"), {
            type: "pie",
            data: {
                labels: [
                    "White",
                    "Black",
                    "Native American",
                    "Asian",
                    "Pacific Islander",
                    "Other",
                    "Two or More"
                ],
                datasets: [{
                    label: "Pop",
                    data: chartData[3],
                    backgroundColor: ["#3366CC", "#FF9900", "#109618", "#990099", "#DC3912", "#3B3EAC", "#808080"],
                    borderColor: "rgba(255,255,255,0.8)",
                    borderWidth: .5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 10
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        position: 'top',
                        text: "Race"
                    },
                    legend: {
                        display: true,
                        position: "bottom",
                        maxWidth: 200,
                        labels: {
                            boxWidth: 10,
                            boxHeight: 10,
                            font: {
                                size: 10
                            }
                        },
                        padding: 5
                    }
                }
            }

        });
    } else {
        pchart.data.datasets[0].data = chartData[0];
        pchart.data.datasets[1].data = chartData[1];
        pchart.update();
        urbanChart.data.datasets[0].data = chartData[2];
        urbanChart.update();
        raceChart.data.datasets[0].data = chartData[3];
        raceChart.update();
    }
    return true
}

function numberWithCommas(value) {
    return (value || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}