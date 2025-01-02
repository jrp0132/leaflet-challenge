// Create map
const map = L.map('map').setView([20, 0], 2); // Centered globally

// Add TileLayer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Earthquake Data
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
d3.json(url).then(data => {
    // Marker styles
    function styleInfo(feature) {
        return {
            radius: getRadius(feature.properties.mag),
            fillColor: getColor(feature.geometry.coordinates[2]),
            color: "#000",
            weight: 0.5,
            opacity: 1,
            fillOpacity: 0.8
        };
    }

    // Marker size based on magnitude
    function getRadius(magnitude) {
        return magnitude === 0 ? 1 : magnitude * 4;
    }

    // Marker color based on depth
    function getColor(depth) {
        return depth > 90 ? "#ff0000" :
               depth > 70 ? "#ff6600" :
               depth > 50 ? "#ffcc00" :
               depth > 30 ? "#ccff33" :
               depth > 10 ? "#66ff66" :
                            "#33ccff";
    }

    // GeoJSON Layer 
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: styleInfo,
        onEachFeature: function (feature, layer) {
            layer.bindPopup(
                `<strong>Location:</strong> ${feature.properties.place}<br>
                 <strong>Magnitude:</strong> ${feature.properties.mag}<br>
                 <strong>Depth:</strong> ${feature.geometry.coordinates[2]} km`
            );
        }
    }).addTo(map);

    // Legend
    const legend = L.control({ position: "bottomright" });

    legend.onAdd = function() {
        const div = L.DomUtil.create("div", "legend");
        const grades = [-10, 10, 30, 50, 70, 90];
        const colors = ["#33ccff", "#66ff66", "#ccff33", "#ffcc00", "#ff6600", "#ff0000"];

        div.innerHTML += "<strong>Depth (km)</strong><br>";
        for (let i = 0; i < grades.length; i++) {
            div.innerHTML +=
                `<i style="background: ${colors[i]}"></i> ${grades[i]}${grades[i + 1] ? `&ndash;${grades[i + 1]}` : "+"}<br>`;
        }
        return div;
    };

    legend.addTo(map);
});