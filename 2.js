document.addEventListener('DOMContentLoaded', () => {

    const LOCATIONS_DATA = {
        joshimath: {
            name: 'Joshimath',
            image2025: 'joshimath1.jpg',
            image2035: 'joshimath2035.jpg',
            analytics: {
                vegetationLoss: '18%',
                landslideRisk: '45%',
                soilDisplacement: '1.2M m³',
                chartData: [25, 30, 38, 45]
            }
        },
        kedarnath: {
            name: 'Kedarnath',
            image2025: 'kedarnath1.jpg',
            image2035: 'kedarnath.2035.jpg',
            analytics: {
                vegetationLoss: '25%',
                landslideRisk: '60%',
                soilDisplacement: '2.5M m³',
                chartData: [40, 48, 55, 60]
            }
        },
        sahastradhara: {
            name: 'Sahastradhara',
            image2025: 'sahastradhara1.jpg',
            image2035: 'sahastrdhara2035.jpg',
            analytics: {
                vegetationLoss: '12%',
                landslideRisk: '22%',
                soilDisplacement: '0.8M m³',
                chartData: [10, 15, 18, 22]
            }
        }
    };

    // DOM Elements ko select karo
    const imageBefore = document.getElementById('image-before');
    const imageAfter = document.getElementById('image-after');
    const locationName = document.getElementById('location-name');
    const vegetationLossValue = document.getElementById('vegetation-loss-value');
    const landslideRiskValue = document.getElementById('landslide-risk-value');
    const soilDisplacementValue = document.getElementById('soil-displacement-value');
    const locationSelector = document.getElementById('location-selector');
    const locationButtons = document.querySelectorAll('.location-btn');
    const chartCanvas = document.getElementById('risk-chart').getContext('2d');

    let riskChart;

    // Chart ko initialize karo
    function createChart(data) {
        if (riskChart) {
            riskChart.destroy();
        }
        riskChart = new Chart(chartCanvas, {
            type: 'line',
            data: {
                labels: ['2025', '2028', '2032', '2035'],
                datasets: [{
                    label: 'Landslide Risk %',
                    data: data,
                    backgroundColor: 'rgba(2, 132, 199, 0.1)', // Light Blue background
                    borderColor: 'rgba(2, 132, 199, 1)',   // Light Blue line
                    borderWidth: 2,
                    tension: 0.4,
                    pointBackgroundColor: 'rgba(2, 132, 199, 1)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        // --- CHART COLORS UPDATED FOR LIGHT THEME ---
                        grid: { color: 'rgba(0, 0, 0, 0.05)' }, // Darker grid lines
                        ticks: { color: '#4b5563' } // Darker text for axis labels
                    },
                    x: {
                        // --- CHART COLORS UPDATED FOR LIGHT THEME ---
                        grid: { color: 'rgba(0, 0, 0, 0.05)' }, // Darker grid lines
                        ticks: { color: '#4b5563' } // Darker text for axis labels
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            // --- CHART COLORS UPDATED FOR LIGHT THEME ---
                            color: '#1f2937' // Darker text for legend
                        }
                    }
                }
            }
        });
    }

    // UI ko update karne wala function
    function updateUI(locationId) {
        const data = LOCATIONS_DATA[locationId];
        if (!data) {
            console.error('Data for location not found:', locationId);
            return;
        }

        imageBefore.src = data.image2025;
        imageAfter.src = data.image2035;

        locationName.innerText = data.name;
        vegetationLossValue.innerText = data.analytics.vegetationLoss;
        landslideRiskValue.innerText = data.analytics.landslideRisk;
        soilDisplacementValue.innerText = data.analytics.soilDisplacement;

        createChart(data.analytics.chartData);
        
        locationButtons.forEach(btn => {
            btn.classList.remove('active');
            if(btn.dataset.location === locationId) {
                btn.classList.add('active');
            }
        });
    }

    // Location buttons par event listener lagao
    locationSelector.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const locationId = e.target.dataset.location;
            updateUI(locationId);
        }
    });

    // Initial page load par default data set karo
    updateUI('joshimath');
});