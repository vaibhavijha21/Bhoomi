// --- Global Data Store (Dummy Data for different years) ---
const yearData = {
    '2015': {
        stats: {
            urbanArea: '10,000',
            greenCover: '9,000',
            waterBodies: '1,800',
            populationDensity: '350'
        },
        landUse: {
            labels: ['Urban', 'Green', 'Water', 'Barren'],
            data: [25, 35, 15, 25]
        },
        developmentTrend: [65, 59, 80, 81, 56, 55, 60, 75, 82, 90, 95]
    },
    '2020': {
        stats: {
            urbanArea: '11,200',
            greenCover: '8,500',
            waterBodies: '1,650',
            populationDensity: '400'
        },
        landUse: {
            labels: ['Urban', 'Green', 'Water', 'Barren'],
            data: [30, 30, 15, 25]
        },
        developmentTrend: [65, 59, 80, 81, 56, 55, 60, 75, 82, 90, 95]
    },
    '2025': {
        stats: {
            urbanArea: '12,500',
            greenCover: '8,200',
            waterBodies: '1,500',
            populationDensity: '450'
        },
        landUse: {
            labels: ['Urban', 'Green', 'Water', 'Barren'],
            data: [35, 25, 10, 30]
        },
        developmentTrend: [65, 59, 80, 81, 56, 55, 60, 75, 82, 90, 95]
    }
};

// --- DOM Elements ---
const slider = document.getElementById('yearSlider');
const images = document.querySelectorAll('.image-layer');
const statsTitle = document.getElementById('statsTitle');
const urbanAreaElem = document.getElementById('urbanArea');
const greenCoverElem = document.getElementById('greenCover');
const waterBodiesElem = document.getElementById('waterBodies');
const populationDensityElem = document.getElementById('populationDensity');
const yearLabels = document.getElementById('yearLabels');

// --- Chart Instances ---
let landUseChartInstance;
let developmentTrendChartInstance;

// --- Helper Functions ---
function getYearFromSliderValue(value) {
    const years = ['2015', '2020', '2025'];
    return years[value - 1];
}

function updateYearLabels(currentYear) {
    Array.from(yearLabels.children).forEach(span => {
        if (span.dataset.year === currentYear) {
            span.classList.add('text-primary', 'font-bold');
            span.classList.remove('text-gray-500');
        } else {
            span.classList.add('text-gray-500');
            span.classList.remove('text-primary', 'font-bold');
        }
    });
}

function updateDashboard(sliderValue) {
    const currentYear = getYearFromSliderValue(sliderValue);
    const dataForYear = yearData[currentYear];

    images.forEach((img, index) => {
        img.style.opacity = (index === sliderValue - 1) ? '1' : '0';
    });

    statsTitle.textContent = `Area Statistics Overview (${currentYear})`;
    urbanAreaElem.innerHTML = `${dataForYear.stats.urbanArea} <span class="text-sm font-medium text-gray-500">sq km</span>`;
    greenCoverElem.innerHTML = `${dataForYear.stats.greenCover} <span class="text-sm font-medium text-gray-500">sq km</span>`;
    waterBodiesElem.innerHTML = `${dataForYear.stats.waterBodies} <span class="text-sm font-medium text-gray-500">sq km</span>`;
    populationDensityElem.innerHTML = `${dataForYear.stats.populationDensity} <span class="text-sm font-medium text-gray-500">per sq km</span>`;

    landUseChartInstance.data.labels = dataForYear.landUse.labels;
    landUseChartInstance.data.datasets[0].data = dataForYear.landUse.data;
    landUseChartInstance.update();

    const years = ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'];
    const index = years.indexOf(currentYear);
    developmentTrendChartInstance.data.labels = years.slice(0, index + 1);
    developmentTrendChartInstance.data.datasets[0].data = dataForYear.developmentTrend.slice(0, index + 1);
    developmentTrendChartInstance.update();

    updateYearLabels(currentYear);
}

// --- Event Listeners ---
slider.addEventListener('input', (event) => {
    updateDashboard(event.target.value);
});

// --- Initial Load ---
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Charts
    initializeCharts();
    updateDashboard(slider.value);
});

// --- Chart Initializations ---
function initializeCharts() {
    // Land Use Chart (Pie Chart)
    const landUseCtx = document.getElementById('landUseChart').getContext('2d');
    landUseChartInstance = new Chart(landUseCtx, {
        type: 'pie',
        data: {
            labels: yearData['2015'].landUse.labels,
            datasets: [{
                data: yearData['2015'].landUse.data,
                backgroundColor: [
                    'rgb(74, 144, 226)',
                    'rgb(80, 196, 118)',
                    'rgb(245, 166, 35)',
                    'rgb(149, 165, 166)'
                ],
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#4a5568'
                    }
                },
                title: {
                    display: false
                }
            },
            elements: {
                arc: {
                    borderWidth: 0
                }
            }
        }
    });

    // Development Trend Chart (Line Chart)
    const developmentCtx = document.getElementById('developmentTrendChart').getContext('2d');
    developmentTrendChartInstance = new Chart(developmentCtx, {
        type: 'line',
        data: {
            labels: ['2015'],
            datasets: [{
                label: 'Urbanization Index',
                data: [yearData['2015'].developmentTrend[0]],
                fill: true,
                borderColor: 'rgb(74, 144, 226)',
                backgroundColor: 'rgba(74, 144, 226, 0.2)',
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: false
                }
            },
            scales: {
                x: {
                    grid: {
                        color: '#e2e8f0'
                    },
                    ticks: {
                        color: '#64748b'
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#e2e8f0'
                    },
                    ticks: {
                        color: '#64748b'
                    }
                }
            }
        }
    });
}