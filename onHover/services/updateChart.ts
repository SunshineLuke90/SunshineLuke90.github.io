import { Chart, CategoryScale, LinearScale, BarController, BarElement, Title, Legend, Tooltip, PieController, ArcElement } from 'chart.js';

export type HoverChartData = [number[], number[], number[], number[]];

Chart.register(BarController, BarElement, CategoryScale, LinearScale, PieController, ArcElement, Title, Legend, Tooltip);
Chart.defaults.color = "#FFFFFF";
Chart.defaults.font.family = "'Noto Sans', sans-serif";

let pchart: Chart<'bar'> | undefined;
let urbanChart: Chart<'doughnut'> | undefined;
let raceChart: Chart<'pie'> | undefined;

function getContext(id: string): CanvasRenderingContext2D | null {
    const canvas = document.getElementById(id) as HTMLCanvasElement | null;
    return canvas?.getContext('2d') ?? null;
}

export function destroyCharts () {
    pchart?.destroy();
    urbanChart?.destroy();
    raceChart?.destroy();
    pchart = undefined;
    urbanChart = undefined;
    raceChart = undefined;
}

export default function updateChart (chartData: HoverChartData, first: boolean, isMobile = false): boolean {
    if (!first) {
        const canvasContextPop = getContext('chart');
        const canvasContextUrban = getContext('urban-rural-pie');
        const canvasContextRace = getContext('race-pie');

        if (!canvasContextPop || !canvasContextUrban || !canvasContextRace) {
            return first;
        }

        pchart = new Chart(canvasContextPop, {
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
                            callback: (value: string | number) => {
                                const numeric = typeof value === 'number' ? value : Number.parseInt(value, 10);
                                return numberWithCommas(Math.abs(numeric));
                            },
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

        urbanChart = new Chart(canvasContextUrban, {
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
                        }
                    }
                }
            }

        });

        raceChart = new Chart(canvasContextRace, {
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
                        }
                    }
                }
            }

        });
    } else {
        if (!pchart || !urbanChart || !raceChart) {
            return false;
        }
        pchart.data.datasets[0].data = chartData[0];
        pchart.data.datasets[1].data = chartData[1];
        pchart.update();
        urbanChart.data.datasets[0].data = chartData[2];
        urbanChart.update();
        raceChart.data.datasets[0].data = chartData[3];
        raceChart.update();
    }
    return true;
}

function numberWithCommas (value: number | string): string {
    return (value || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}