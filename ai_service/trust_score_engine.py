def compute_trust_score(user_data):
    """
    Computes dynamic trust score (0 - 100) based on verifications,
    ratings, completion history, safety records, and behavior.
    """
    base_score = 50.0 # Starting baseline score

    # 1. Identity & Document Verification (Up to +25 pts)
    is_aadhaar_verified = user_data.get('isAadhaarVerified', False)
    is_license_verified = user_data.get('isLicenseVerified', False)
    is_college_corporate_verified = user_data.get('isCollegeCorporateVerified', False)

    verification_pts = 0
    if is_aadhaar_verified: verification_pts += 10
    if is_license_verified: verification_pts += 10
    if is_college_corporate_verified: verification_pts += 5

    # 2. Ratings (Up to +15 pts)
    avg_rating = user_data.get('avgRating', 4.0)
    rating_pts = ((avg_rating - 3.0) / 2.0) * 15.0 # 3.0 -> 0, 5.0 -> 15
    rating_pts = max(0, min(15, rating_pts))

    # 3. Ride Completion Rate (Up to +15 pts)
    completed_rides = user_data.get('completedRides', 0)
    total_rides = user_data.get('totalRides', 0)
    if total_rides > 0:
        completion_rate = completed_rides / total_rides
        completion_pts = completion_rate * 15.0
    else:
        completion_pts = 10.0 # Neutral for new users

    # 4. Cancellation Rate Penalties (Up to -15 pts)
    cancellations = user_data.get('cancellations', 0)
    cancellation_penalty = min(15.0, cancellations * 3.0)

    # 5. Safety Incidents & Complaints (Up to -30 pts)
    safety_incidents = user_data.get('safetyIncidents', 0)
    incident_penalty = min(30.0, safety_incidents * 15.0)

    # Final calculation
    trust_score = base_score + verification_pts + rating_pts + completion_pts - cancellation_penalty - incident_penalty
    trust_score = round(max(10.0, min(100.0, trust_score)), 1)

    # Badge classification
    if trust_score >= 90:
        badge = "Highly Trusted"
        badge_color = "emerald"
    elif trust_score >= 75:
        badge = "Verified Community Member"
        badge_color = "cyan"
    elif trust_score >= 60:
        badge = "Standard Rider"
        badge_color = "yellow"
    else:
        badge = "Under Safety Review"
        badge_color = "red"

    return {
        "trustScore": trust_score,
        "trustBadge": badge,
        "badgeColor": badge_color,
        "breakdown": {
            "verifications": round(verification_pts, 1),
            "ratings": round(rating_pts, 1),
            "completionHistory": round(completion_pts, 1),
            "cancellationPenalty": round(cancellation_penalty, 1),
            "safetyPenalty": round(incident_penalty, 1)
        }
    }
