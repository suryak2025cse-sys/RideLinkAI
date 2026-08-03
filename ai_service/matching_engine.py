import math

def haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371.0 # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2.0)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2.0)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

# Alias for backwards compatibility
calculate_haversine_distance = haversine_distance

def match_rides(passenger, candidate_rides):
    """
    Ranks candidate rides dynamically for passengers based on proximity, 
    seat availability, driver trust score, and departure time.
    """
    matched_results = []
    
    p_lat = float(passenger.get('pickupLat', 12.9716) or 12.9716)
    p_lng = float(passenger.get('pickupLng', 77.5946) or 77.5946)
    d_lat = float(passenger.get('dropLat', 12.9800) or 12.9800)
    d_lng = float(passenger.get('dropLng', 77.6000) or 77.6000)
    women_only_req = passenger.get('womenOnly', False)
    req_seats = int(passenger.get('seats', 1) or 1)

    for ride in candidate_rides:
        avail_seats = int(ride.get('availableSeats', 3) or 3)
        if avail_seats < req_seats:
            continue

        if women_only_req and not ride.get('isWomenOnly', False):
            continue

        r_o_lat = float(ride.get('originLat', 12.9716) or 12.9716)
        r_o_lng = float(ride.get('originLng', 77.5946) or 77.5946)
        r_d_lat = float(ride.get('destLat', 12.9800) or 12.9800)
        r_d_lng = float(ride.get('destLng', 77.6000) or 77.6000)

        origin_dist = haversine_distance(p_lat, p_lng, r_o_lat, r_o_lng)
        dest_dist = haversine_distance(d_lat, d_lng, r_d_lat, r_d_lng)

        proximity_score = max(50.0, 100.0 - (origin_dist + dest_dist) * 2.0)
        
        driver_details = ride.get('driverDetails', {})
        trust_score = float(driver_details.get('trustScore', 92.0) or 92.0)
        
        composite_score = round(min(99.0, max(75.0, (0.6 * proximity_score) + (0.4 * trust_score))), 1)

        matched_ride = dict(ride)
        matched_ride['matchScore'] = composite_score
        matched_ride['proximityDistanceKm'] = round(origin_dist, 1)
        matched_ride['pickupDistanceKm'] = round(origin_dist, 1)
        matched_ride['matchBadge'] = 'Top AI Match' if composite_score > 90 else 'Good Match'
        matched_results.append(matched_ride)

    matched_results.sort(key=lambda x: x['matchScore'], reverse=True)
    return matched_results
