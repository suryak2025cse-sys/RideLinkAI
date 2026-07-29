from flask import Flask, request, jsonify
from flask_cors import CORS
from matching_engine import match_rides
from trust_score_engine import compute_trust_score
from demand_prediction import predict_community_demand
from route_optimizer import optimize_ride_route

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "OK", "service": "RideLink AI Microservice", "version": "1.0.0"})

@app.route('/matchRide', methods=['POST'])
def match_ride_endpoint():
    try:
        data = request.get_json() or {}
        passenger_request = data.get('passengerRequest', {})
        candidate_rides = data.get('candidateRides', [])

        matches = match_rides(passenger_request, candidate_rides)
        return jsonify({
            "success": True,
            "count": len(matches),
            "recommendations": matches
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@app.route('/trustScore', methods=['POST'])
def trust_score_endpoint():
    try:
        data = request.get_json() or {}
        result = compute_trust_score(data)
        return jsonify({
            "success": True,
            "data": result
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@app.route('/predictDemand', methods=['POST'])
def predict_demand_endpoint():
    try:
        data = request.get_json() or {}
        community_id = data.get('communityId', 'CAMPUS_MAIN')
        time_of_day = data.get('timeOfDay', '09:00')
        day_of_week = data.get('dayOfWeek', 'Monday')

        prediction = predict_community_demand(community_id, time_of_day, day_of_week)
        return jsonify({
            "success": True,
            "prediction": prediction
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@app.route('/routeOptimization', methods=['POST'])
def route_optimization_endpoint():
    try:
        data = request.get_json() or {}
        origin = data.get('origin', {'lat': 12.9716, 'lng': 77.5946})
        destination = data.get('destination', {'lat': 12.9800, 'lng': 77.6000})
        waypoints = data.get('waypoints', [])

        result = optimize_ride_route(origin, destination, waypoints)
        return jsonify({
            "success": True,
            "route": result
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
