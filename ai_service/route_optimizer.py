from matching_engine import haversine_distance

def optimize_ride_route(origin, destination, waypoints):
    """
    Optimizes multi-stop route order to minimize total travel distance and time.
    """
    if not waypoints:
        dist = haversine_distance(origin['lat'], origin['lng'], destination['lat'], destination['lng'])
        return {
            "orderedWaypoints": [],
            "totalDistanceKm": round(dist, 2),
            "estimatedTimeMinutes": int(dist * 2.5 + 5),
            "co2SavedKg": round(dist * 0.12, 2)
        }

    unvisited = list(waypoints)
    current_pos = (origin['lat'], origin['lng'])
    ordered_waypoints = []
    total_dist = 0.0

    while unvisited:
        nearest = min(unvisited, key=lambda wp: haversine_distance(current_pos[0], current_pos[1], wp['lat'], wp['lng']))
        dist = haversine_distance(current_pos[0], current_pos[1], nearest['lat'], nearest['lng'])
        total_dist += dist
        current_pos = (nearest['lat'], nearest['lng'])
        ordered_waypoints.append(nearest)
        unvisited.remove(nearest)

    final_leg = haversine_distance(current_pos[0], current_pos[1], destination['lat'], destination['lng'])
    total_dist += final_leg

    est_minutes = int(total_dist * 2.2 + len(waypoints) * 3)
    co2_saved = round(total_dist * 0.14 * len(waypoints), 2)

    return {
        "orderedWaypoints": ordered_waypoints,
        "totalDistanceKm": round(total_dist, 2),
        "estimatedTimeMinutes": est_minutes,
        "co2SavedKg": co2_saved
    }
