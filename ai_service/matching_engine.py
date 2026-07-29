import math

def calculate_haversine_distance(lat1, lon1, lat2, lon2):
    """
    Calculate the great circle distance between two points 
    on the earth (specified in decimal degrees) in kilometers.
    """
    R = 6371.0 # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def compute_route_overlap(pickup_a, drop_a, pickup_b, drop_b):
    """
    Calculate approximate route similarity percentage (0-100%)
    """
    dist_pickup = calculate_haversine_distance(pickup_a[0], pickup_a[1], pickup_b[0], pickup_b[1])
    dist_drop = calculate_haversine_distance(drop_a[0], drop_a[1], drop_b[0], drop_b[1])
    
    # Overlap score inversely proportional to pickup & drop separation
    score = 100 - min(100, (dist_pickup * 10 + dist_drop * 10))
    return max(0, round(score, 2))

def match_rides(passenger_req, candidate_rides):
    """
    Ranks candidate rides for a passenger request using multi-attribute AI scoring.
    """
    p_pickup = (passenger_req.get('pickupLat', 0), passenger_req.get('pickupLng', 0))
    p_drop = (passenger_req.get('dropLat', 0), passenger_req.get('dropLng', 0))
    requested_time = passenger_req.get('departureTimeMinutes', 0) # minutes from midnight
    passenger_pref_women_only = passenger_req.get('womenOnly', False)
    requested_seats = passenger_req.get('seats', 1)

    scored_rides = []

    for ride in candidate_rides:
        # Check hard filters
        if ride.get('availableSeats', 0) < requested_seats:
            continue
        if passenger_pref_women_only and not ride.get('isWomenOnly', False):
            continue

        d_pickup = (ride.get('originLat', 0), ride.get('originLng', 0))
        d_drop = (ride.get('destLat', 0), ride.get('destLng', 0))

        # 1. Distance & Proximity Score (0 - 30 pts)
        pickup_dist_km = calculate_haversine_distance(p_pickup[0], p_pickup[1], d_pickup[0], d_pickup[1])
        drop_dist_km = calculate_haversine_distance(p_drop[0], p_drop[1], d_drop[0], d_drop[1])
        pickup_score = max(0, 15 - (pickup_dist_km * 2.5))
        drop_score = max(0, 15 - (drop_dist_km * 2.5))
        proximity_score = pickup_score + drop_score

        # 2. Route Overlap (0 - 25 pts)
        overlap_pct = compute_route_overlap(p_pickup, p_drop, d_pickup, d_drop)
        overlap_score = (overlap_pct / 100.0) * 25.0

        # 3. Time Compatibility (0 - 20 pts)
        ride_time = ride.get('departureTimeMinutes', 0)
        time_diff = abs(requested_time - ride_time)
        time_score = max(0, 20 - (time_diff * 0.5))

        # 4. Driver Trust & Safety (0 - 15 pts)
        trust_score = ride.get('driverTrustScore', 75)
        trust_subscore = (trust_score / 100.0) * 15.0

        # 5. Community & Rating Match (0 - 10 pts)
        driver_rating = ride.get('driverRating', 4.5)
        community_match = 3 if ride.get('communityType') == passenger_req.get('communityType') else 0
        rating_subscore = ((driver_rating / 5.0) * 7.0) + community_match

        total_match_score = round(proximity_score + overlap_score + time_score + trust_subscore + rating_subscore, 1)
        total_match_score = min(100.0, max(0.0, total_match_score))

        match_badge = "Best Match" if total_match_score >= 85 else "Great Match" if total_match_score >= 70 else "Good Match"

        scored_ride = dict(ride)
        scored_ride['matchScore'] = total_match_score
        scored_ride['matchBadge'] = match_badge
        scored_ride['pickupDistanceKm'] = round(pickup_dist_km, 2)
        scored_ride['dropDistanceKm'] = round(drop_dist_km, 2)
        scored_ride['routeOverlapPct'] = overlap_pct
        scored_rides.append(scored_ride)

    # Sort descending by matchScore
    scored_rides.sort(key=lambda x: x['matchScore'], reverse=True)
    return scored_rides
