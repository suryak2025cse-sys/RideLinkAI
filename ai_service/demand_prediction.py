import random

def predict_community_demand(community_id, time_of_day, day_of_week):
    """
    Predicts demand hotspots and estimated ride surge / demand index (1.0 to 3.0)
    for a given community, campus, or corporate hub.
    """
    # Peak hours: 08:00 - 10:00 AM and 17:00 - 19:30 PM
    hour = int(time_of_day.split(':')[0]) if isinstance(time_of_day, str) and ':' in time_of_day else 9
    
    is_peak = (8 <= hour <= 10) or (17 <= hour <= 19)
    is_weekend = day_of_week in ['Saturday', 'Sunday']

    base_demand = 1.8 if is_peak else 1.1
    if is_weekend:
        base_demand *= 0.8

    demand_multiplier = round(base_demand + random.uniform(-0.15, 0.25), 2)
    demand_level = "HIGH" if demand_multiplier > 1.6 else "MEDIUM" if demand_multiplier > 1.2 else "LOW"

    # Heatmap zones for campus/corporate hub
    hotspots = [
        {"zoneName": "Central Library / North Gate", "lat": 12.9716, "lng": 77.5946, "demandWeight": 0.85},
        {"zoneName": "Tech Park Building 4 - Main Bay", "lat": 12.9800, "lng": 77.6000, "demandWeight": 0.95},
        {"zoneName": "Hostel Block C - Commuter Hub", "lat": 12.9650, "lng": 77.5900, "demandWeight": 0.70},
        {"zoneName": "Metro Station Interchange", "lat": 12.9750, "lng": 77.6100, "demandWeight": 0.90}
    ]

    return {
        "communityId": community_id,
        "demandMultiplier": demand_multiplier,
        "demandLevel": demand_level,
        "expectedRidesNextHour": int(demand_multiplier * 42),
        "recommendedDriverSurgeBonusPct": int((demand_multiplier - 1.0) * 20),
        "hotspots": hotspots
    }
