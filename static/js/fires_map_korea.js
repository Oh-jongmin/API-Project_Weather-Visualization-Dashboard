
let map;
let markers = [];

function initMap(centerLat = 36.5, centerLon = 127.8) {
    map = L.map('map').setView([centerLat, centerLon], 7);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18
    }).addTo(map);
}

function clearMarkers() {
    markers.forEach(m => map.removeLayer(m));
    markers = [];
}

function getColor(confidence) {
    if (confidence > 80) return 'red';
    if (confidence > 50) return 'orange';
    return 'yellow';
}

function loadFireData(days = 7) {
    clearMarkers();
    fetch(`/api/fires?days=${days}`)
        .then(res => res.json())
        .then(data => {
            data.forEach(fire => {
                const marker = L.circleMarker([fire.latitude, fire.longitude], {
                    radius: 8,
                    color: getColor(fire.confidence),
                    fillOpacity: 0.8
                }).addTo(map);
                marker.bindPopup(`🔥 <b>${fire.acq_date} ${fire.acq_time}</b><br/>
                                  신뢰도: ${fire.confidence}<br/>
                                  밝기: ${fire.brightness}`);
                markers.push(marker);
            });
        });
}

document.addEventListener("DOMContentLoaded", () => {
    initMap();

    const filterSelect = document.getElementById("filterSelect");
    if (filterSelect) {
        filterSelect.addEventListener("change", () => {
            const days = parseInt(filterSelect.value);
            loadFireData(days);
        });
    }

    const goWeatherBtn = document.getElementById("goWeatherBtn");
    if (goWeatherBtn) {
        goWeatherBtn.addEventListener("click", () => {
            window.location.href = "/";
        });
    }

    loadFireData(7); // 기본 7일
});