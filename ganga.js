// Initialize map centered on Uttarakhand
const map = L.map('map', { zoomControl: false }).setView([30.0668, 79.0193], 8);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// UI controls
L.control.zoom({ position: 'bottomright' }).addTo(map);
const scale = L.control.scale({ position: 'bottomleft' }).addTo(map);

// Base layers (optionally add satellite)
const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
const terrain = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', { attribution: '© OpenTopoMap' });

const baseLayers = { 'OSM': osm, 'Terrain': terrain };
const overlays = {};
L.control.layers(baseLayers, overlays, { position: 'topleft' }).addTo(map);

// Define a style function for the GeoJSON features
function style(feature) {
  // Use a thicker line and a different color for the main river
  if (feature.properties.name === "Ganga (Bhagirathi)") {
    return {
      color: "#00566C",
      weight: 5,
      opacity: 0.8
    };
  } else {
    // Style for tributaries
    return {
      color: "#4FC3F7",
      weight: 3,
      opacity: 0.8
    };
  }
}

// Function to handle each feature (adding popups)
function onEachFeature(feature, layer) {
  if (feature.properties && feature.properties.name) {
    layer.bindPopup("<b>" + feature.properties.name + "</b>");
  }
}

// Load the GeoJSON file and add it to the map
fetch('export.geojson')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    const rivers = L.geoJSON(data, {
      style: style,
      onEachFeature: onEachFeature,
      // NEW: Add a filter to prevent point features from being added
      filter: function(feature, layer) {
        return feature.geometry.type !== "Point";
      }
    }).addTo(map);
    overlays['Rivers'] = rivers;
  })
  .catch(error => console.error('Error loading GeoJSON data:', error));

// Demo hydrological stations
const stations = [
  { id: 'devprayag', name: 'Devprayag Station', coords: [30.1466, 78.5970], discharge: 980 },
  { id: 'rishikesh', name: 'Rishikesh Station', coords: [30.0869, 78.2676], discharge: 1210 },
  { id: 'haridwar', name: 'Haridwar Station', coords: [29.9457, 78.1642], discharge: 1380 }
];

const stationLayer = L.layerGroup(
  stations.map(s => L.marker(s.coords, { title: s.name })
    .bindPopup(`<b>${s.name}</b><br/>Discharge: ${s.discharge} m³/s`))
).addTo(map);
overlays['Stations'] = stationLayer;

// Fit bounds to data after small delay (ensures layers added)
setTimeout(() => {
  try { map.fitBounds(stationLayer.getBounds().pad(0.2)); } catch(e) {}
}, 600);
