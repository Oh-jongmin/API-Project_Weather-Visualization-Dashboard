from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("map.html")

@app.route("/fires")
def fire_map():
    return render_template("fires_map_korea.html")

@app.route("/api/weather")
def get_weather():
    lat = request.args.get("lat", default=37.57, type=float)
    lon = request.args.get("lon", default=126.98, type=float)

    try:
        url = (
            f"https://api.open-meteo.com/v1/forecast?"
            f"latitude={lat}&longitude={lon}&hourly=temperature_2m,precipitation,wind_speed_10m"
        )
        res = requests.get(url)
        raw = res.json()

        result = []
        for i in range(len(raw["hourly"]["time"])):
            result.append({
                "time": raw["hourly"]["time"][i],
                "temperature": raw["hourly"]["temperature_2m"][i],
                "precipitation": raw["hourly"]["precipitation"][i],
                "wind": raw["hourly"]["wind_speed_10m"][i],
                "alerts": []
            })

        for r in result:
            if r["wind"] >= 10:
                r["alerts"].append("💨 강풍 주의")
            if r["precipitation"] >= 0.5:
                r["alerts"].append("☔ 우산 챙기세요")
            if r["temperature"] >= 25:
                r["alerts"].append("🔥 폭염 주의")

        return jsonify({ "data": result })

    except Exception as e:
        return jsonify({ "error": str(e) }), 500

if __name__ == "__main__":
    app.run(debug=True)
