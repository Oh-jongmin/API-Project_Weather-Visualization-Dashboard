# 🌦️ 기상 정보 시각화 대시보드 (Weather Visualization Dashboard)

> 사용자의 위치 기반 날씨 데이터를 지도와 차트로 시각화하여 제공하는 웹 대시보드 프로젝트입니다.

## 📌 주요 기능

- ✅ 사용자 위치 기반으로 현재 지역 자동 감지
- ✅ 실시간 날씨 데이터 시각화 (Open-Meteo API 활용)
- ✅ 지도 위에 날씨 상태 마커로 시각화 (Leaflet.js)
- ✅ 시간대별 날씨 예보를 카드 형태로 제공
- ✅ 날씨 예보별 시각화 마커 애니메이션
- ✅ 차트 기반 온도/풍속 시계열 시각화 (Chart.js)
- ✅ 지역 선택 기능으로 서울, 부산, 대구 등 조회 가능
- ✅ 산불 정보 페이지와 분리된 UI로 확장 가능
- ✅ 사용자 경험을 고려한 반응형 디자인 + 인터랙션

---

## 🌐 기술 스택

| 분류      | 기술                              |
|-----------|-----------------------------------|
| Backend   | Python, Flask                     |
| Frontend  | HTML/CSS, JavaScript              |
| 지도      | Leaflet.js + OpenStreetMap        |
| 차트      | Chart.js                          |
| API       | [Open-Meteo](https://open-meteo.com/) 날씨 API |
| 기타      | Geolocation API, JSON, Bootstrap 등 |

---

## 📂 프로젝트 구조

📁 weather-visualization ├── app.py # Flask 백엔드 서버 ├── templates/ │ ├── map.html # 기상 정보 페이지 │ └── fires_map_korea.html # 산불 정보 페이지 (분리된 UI) ├── static/ │ ├── js/ │ │ ├── map.js # 날씨 지도 스크립트 │ │ ├── chart.js # 차트 시각화 스크립트 │ │ └── fires_map_korea.js # 산불 지도 스크립트 │ └── css/ │ └── style.css # 스타일시트

## 🗺️ 페이지 구성

### 1. 기상 정보 시각화 페이지 (`/map`)
- 실시간 날씨 정보 지도 위 시각화
- 지역 선택, 시간별 예보 카드, 날씨 상태별 아이콘 표시
- 온도/풍속 차트 포함

### 2. 산불 정보 시각화 페이지 (`/fires`)
- NASA FIRMS API 연동
- 대한민국 기준 산불 시각화
- 🔥 신뢰도 및 밝기별 필터 기능
- 🔄 기상 정보 페이지로 이동 가능 버튼

---

## 📡 사용 API

- Open-Meteo - 날씨 예보 및 현재 기온, 풍속, 강수량 데이터
- NASA FIRMS - 산불 정보 (위성 기반)
- OpenStreetMap + Leaflet - 지도 시각화
- Chart.js - 날씨 시계열 차트

---

## 🧠 배운 점
- 실시간 데이터 API 처리 및 오류 핸들링
- 사용자 위치 기반 지도 중심 이동 및 마커 표시
- Leaflet.js와 Chart.js 연동을 통한 데이터 시각화 경험
- Flask 기반 웹 서버 구성 및 템플릿 관리
- 확장 가능한 모듈형 프론트엔드 구성 방식

---

💡 향후 확장 아이디어
- 🌫️ 대기오염 정보 시각화 (OpenWeatherMap API)
- 📦 캐싱 및 API 요청 최적화
- 📱 모바일 반응형 대응
- 🧭 위치 기반 푸시 알림 연동

---

## ⚙️ 실행 방법

```bash
# 1. 프로젝트 클론
git clone https://github.com/your-username/weather-visualization.git
cd weather-visualization

# 2. 가상환경 설정 및 패키지 설치
python -m venv venv
source venv/bin/activate  # (Windows는 venv\Scripts\activate)
pip install -r requirements.txt

# 3. 서버 실행
python app.py

# 4. 접속 확인
http://localhost:5000  
