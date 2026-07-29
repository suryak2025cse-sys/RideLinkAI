from matching_engine import calculate_haversine_distance

def optimize_ride_route(origin, destination, waypoints):
    """
    Optimizes multi-stop route order to minimize total travel distance and time.
    """
    if not waypoints:
        dist = calculate_haversine_distance(origin['lat'], origin['lng'], destination['lat'], destination['lng'])
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
        # Nearest neighbor greedy routing
        nearest = min(unvisited, key=lambda wp: calculate_haversine_distance(current_pos[0], current_pos[1], wp['lat'], wp['lng']))
        dist = calculate_haversine_distance(current_pos[0], current_pos[1], nearest['lat'], nearest['lng'])
        total_dist += dist
        current_pos = (nearest['lat'], nearest['lng'])
        ordered_waypoints.append(nearest)
        unvisited.remove(nearest)

    # Final leg to destination
    final_leg = calculate_haversine_distance(current_pos[0], current_pos[1], destination['lat'], destination['lng'])
    total_dist += final_leg

    est_minutes = int(total_dist * 2.2 + len(waypoints) * 3) # 3 mins stop time per pickup
    co2_saved = round(total_dist * 0.14 * len(waypoints), 2)

    return {
        "orderedWaypoints": ordered_waypoints,
        "totalDistanceKm": round(total_dist, 2),
        "estimatedTimeMinutes": est_minutes,
        "co2SavedKg": co2_saved
    }
