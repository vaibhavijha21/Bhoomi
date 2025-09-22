// STEP 1: Apna Mapbox Access Token yahan daalo
mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';

// STEP 2: Map ko initialize karo
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/satellite-streets-v12',
    center: [79.0193, 30.0668], // Uttarakhand
    zoom: 9,
    pitch: 70, // 3D angle
    bearing: -20 // Thoda ghuma hua view
});

// STEP 3: Mock Data (Nakli Data)
const PREDICTION_DATA = {
    "2030": {
        "heavy_rainfall": {
            layerId: 'landslide-2030-heavy-rainfall',
            sourceId: 'landslide-2030-heavy-rainfall-source',
            imageUrl: 'assets/landslide-2030.png', // Yeh image assets folder mein honi chahiye
            coordinates: [[79.50, 30.22], [79.52, 30.22], [79.52, 30.20], [79.50, 30.20]],
            volume: "1.2M m³",
            area: "0.75 km²",
            risk: "High"
        },
        "deforestation": {
            // Aap deforestation ke liye alag se data daal sakte hain
            // Abhi ke liye same data use kar rahe hain
            layerId: 'landslide-2030-heavy-rainfall', // Same layer use kar rahe hain
            volume: "0.8M m³",
            area: "0.55 km²",
            risk: "Medium"
        }
    }
};

// STEP 4: Map ke load hone par 3D terrain aur layers add karo
map.on('load', () => {
    // 3D Terrain
    map.addSource('mapbox-dem', { type: 'raster-dem', url: 'mapbox://mapbox.mapbox-terrain-dem-v1' });
    map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });

    // Saari possible layers pehle hi add kardo aur hide kardo
    const data = PREDICTION_DATA['2030']['heavy_rainfall'];
    map.addSource(data.sourceId, { type: 'image', url: data.imageUrl, coordinates: data.coordinates });
    map.addLayer({
        id: data.layerId,
        type: 'raster',
        source: data.sourceId,
        paint: { 'raster-opacity': 0.85 },
        layout: { 'visibility': 'none' } // Shuru mein hide
    });
});

// STEP 5: HTML elements ko select karo
const yearSelect = document.getElementById('year-select');
const scenarioSelect = document.getElementById('scenario-select');
const volumeData = document.getElementById('volume-data');
const areaData = document.getElementById('area-data');
const riskData = document.getElementById('risk-data');

// STEP 6: Visualization update karne ka function
function updateVisualization() {
    const year = yearSelect.value;
    const scenario = scenarioSelect.value;

    // Pehle saari layers hide kardo
    // Agar aur layers hongi toh unhe bhi yahan hide karna padega
    Object.values(PREDICTION_DATA).forEach(yearData => {
        Object.values(yearData).forEach(scenarioData => {
            if (map.getLayer(scenarioData.layerId)) {
                map.setLayoutProperty(scenarioData.layerId, 'visibility', 'none');
            }
        });
    });

    const data = PREDICTION_DATA[year]?.[scenario];

    if (data) {
        // Sahi layer ko visible karo
        if (map.getLayer(data.layerId)) {
           map.setLayoutProperty(data.layerId, 'visibility', 'visible');
        }
        // Sidebar ka data update karo
        volumeData.innerText = data.volume;
        areaData.innerText = data.area;
        riskData.innerText = data.risk;
    } else {
        // Agar data nahi hai toh sidebar khali kardo
        volumeData.innerText = 'N/A';
        areaData.innerText = 'N/A';
        riskData.innerText = 'N/A';
    }
}

// STEP 7: Dropdowns par event listener lagao
yearSelect.addEventListener('change', updateVisualization);
scenarioSelect.addEventListener('change', updateVisualization);

// Page load par ek baar function chala do
updateVisualization();