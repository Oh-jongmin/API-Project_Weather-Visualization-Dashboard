const map = L.map("map").setView([37.57, 126.98], 12);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

let userLocation = [37.57, 126.98];

function getIcon(emoji = "✅") {
  return L.divIcon({
    className: "",
    html: `<div style="font-size:24px;">${emoji}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
}

function renderWeather(data, center) {
  const alertContainer = document.getElementById("alertContainer");
  alertContainer.innerHTML = "";

  const now = new Date();

  data.data.forEach((item, idx) => {
    const forecastTime = new Date(item.time);
    const diff = Math.abs(now - forecastTime);
    const within1hr = diff <= 60 * 60 * 1000;

    const div = document.createElement("div");
    div.className = "alert-box";
    div.id = `card-${idx}`;
    div.innerHTML = `
      <b>${item.time}</b><br/>
      온도: ${item.temperature}°C / 강수량: ${item.precipitation}mm / 풍속: ${item.wind}m/s<br/>
      알림: ${item.alerts.length ? item.alerts.join(" / ") : "없음"}
    `;
    alertContainer.appendChild(div);

    if (!within1hr) return;

    const angle = (idx / 12) * 2 * Math.PI;
    const radius = 0.01;
    const lat = center[0] + radius * Math.cos(angle);
    const lon = center[1] + radius * Math.sin(angle);

    let emoji = "✅";
    if (item.wind >= 10) emoji = "💨";
    else if (item.precipitation >= 0.5) emoji = "☔";
    else if (item.temperature >= 25) emoji = "🔥";

    const marker = L.marker([lat, lon], { icon: getIcon(emoji) }).addTo(map);
    marker.on("click", () => {
      map.setView([lat, lon], 14);
      document.querySelectorAll(".alert-box").forEach(c => c.classList.remove("highlight"));
      document.getElementById(`card-${idx}`).classList.add("highlight");
    });
  });
}

function fetchWeather(lat, lon) {
  fetch(`/api/weather?lat=${lat}&lon=${lon}`)
    .then(res => res.json())
    .then(data => {
      map.setView([lat, lon], 12);
      renderWeather(data, [lat, lon]);
    });
}

function reverseGeocode(lat, lon) {
  fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`)
    .then(res => res.json())
    .then(data => {
      document.getElementById("addressDisplay").textContent = "현재 위치: " + data.display_name;
    })
    .catch(() => {
      document.getElementById("addressDisplay").textContent = "주소 정보를 불러오지 못했습니다.";
    });
}

// 초기 위치 로딩
navigator.geolocation.getCurrentPosition(pos => {
  userLocation = [pos.coords.latitude, pos.coords.longitude];
  fetchWeather(userLocation[0], userLocation[1]);
  reverseGeocode(userLocation[0], userLocation[1]);
}, () => {
  fetchWeather(userLocation[0], userLocation[1]);
  reverseGeocode(userLocation[0], userLocation[1]);
});

// 🔍 지역 검색 기능
document.getElementById("searchBtn").onclick = () => {
  const query = document.getElementById("searchInput").value;
  if (!query) return;

  fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json`)
    .then(res => res.json())
    .then(results => {
      if (!results.length) {
        alert("검색 결과 없음");
        return;
      }

      const lat = parseFloat(results[0].lat);
      const lon = parseFloat(results[0].lon);
      fetchWeather(lat, lon);
      reverseGeocode(lat, lon);
      saveSearchHistory(query);
    });
};

// 📍 위치 초기화
document.getElementById("resetBtn").onclick = () => {
  fetchWeather(userLocation[0], userLocation[1]);
  reverseGeocode(userLocation[0], userLocation[1]);
};

// 🔄 자동완성 기능 + 기록 저장
function saveSearchHistory(query) {
  let history = JSON.parse(localStorage.getItem("weatherSearchHistory") || "[]");
  if (!history.includes(query)) {
    history.unshift(query);
    if (history.length > 10) history = history.slice(0, 10);
    localStorage.setItem("weatherSearchHistory", JSON.stringify(history));
  }
}

document.getElementById("searchInput").addEventListener("input", function () {
  const val = this.value.toLowerCase();
  const history = JSON.parse(localStorage.getItem("weatherSearchHistory") || "[]");
  const list = history.filter(h => h.toLowerCase().includes(val)).slice(0, 5);

  const datalist = document.getElementById("autoList");
  datalist.innerHTML = "";
  list.forEach(q => {
    const opt = document.createElement("option");
    opt.value = q;
    datalist.appendChild(opt);
  });
});