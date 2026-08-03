import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Car, PlusCircle, DollarSign, Award, Users, MapPin, Clock, Phone, ArrowRight, ShieldAlert, CheckCircle2, Trash2, XCircle } from 'lucide-react';
import ToastNotification from '../components/ToastNotification';
import API from '../services/api';
import { addOfferedRide, removeOfferedRide } from '../redux/rideSlice';
import AIRideAcceptanceCard from '../components/AIRideAcceptanceCard';
import AIFareCalculator from '../components/AIFareCalculator';
import VoiceCommandHandler from '../components/VoiceCommandHandler';

export default function DriverDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Strict verification check: Requires explicit submission of Aadhaar and License numbers
  const isAadhaarVerified = !!(user?.isAadhaarVerified && user?.aadhaarNumber);
  const isLicenseVerified = !!(user?.isLicenseVerified && user?.licenseNumber);
  const isFullyVerified = isAadhaarVerified && isLicenseVerified;

  const [originName, setOriginName] = useState('Hostel Block C - North Campus Gate');
  const [destName, setDestName] = useState('Cyber Park Building 4 Main Bay');
  const [departureTime, setDepartureTime] = useState('09:30 AM');
  const [phone, setPhone] = useState(user?.phone || '9025953166');
  const [totalSeats, setTotalSeats] = useState(3);
  const [pricePerSeat, setPricePerSeat] = useState(60);
  const [isWomenOnly, setIsWomenOnly] = useState(false);
  const [communityType, setCommunityType] = useState('Open Community');
  
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Local state for offered rides list
  const [offeredRides, setOfferedRides] = useState(() => {
    try {
      const local = JSON.parse(localStorage.getItem('local_offered_rides')) || [];
      return Array.isArray(local) ? local : [];
    } catch (e) {
      return [];
    }
  });

  const handleDeleteRide = async (rideId) => {
    try {
      await API.delete(`/rides/${rideId}`).catch(() => null);
    } catch (e) {}

    const updated = offeredRides.filter(r => r._id !== rideId);
    setOfferedRides(updated);
    localStorage.setItem('local_offered_rides', JSON.stringify(updated));
    dispatch(removeOfferedRide(rideId));
    setToast({ message: '✅ Ride cancelled and removed from active listings.', type: 'success' });
  };

  const handleOfferRide = async (e) => {
    e.preventDefault();

    if (!isFullyVerified) {
      setToast({ 
        message: '⚠️ Verification Required: Please enter your Aadhaar Card Number and Driver License in Profile & Verifications first.', 
        type: 'error' 
      });
      return;
    }

    setLoading(true);
    setToast(null);

    const ridePayload = {
      driverDetails: {
        name: user?.name || 'Surya K',
        phone: phone || user?.phone || '+91 9025953166',
        rating: 4.9,
        trustScore: user?.trustScore || 98,
        trustBadge: user?.trustBadge || 'Verified Driver',
        vehicleModel: 'Tata Nexon EV (KA-01-EQ-9021)',
        plateNumber: 'KA-01-EQ-9021'
      },
      originName: originName || 'Hostel Block C - North Campus Gate',
      originLat: 12.9716,
      originLng: 77.5946,
      destName: destName || 'Cyber Park Building 4 Main Bay',
      destLat: 12.9800,
      destLng: 77.6000,
      departureTime: departureTime || '09:30 AM',
      totalSeats: parseInt(totalSeats) || 3,
      availableSeats: parseInt(totalSeats) || 3,
      pricePerSeat: parseFloat(pricePerSeat) || 60.0,
      communityType: communityType || 'Open Community',
      organizationName: user?.organizationName || 'Sri Eshwar College of Engineering',
      isWomenOnly: !!isWomenOnly,
      status: 'Scheduled'
    };

    try {
      const res = await API.post('/rides/offer', ridePayload);
      const createdRide = (res.data && res.data.ride) ? res.data.ride : ridePayload;
      
      dispatch(addOfferedRide(createdRide));

      const updated = [createdRide, ...offeredRides];
      setOfferedRides(updated);
      localStorage.setItem('local_offered_rides', JSON.stringify(updated));

      setLoading(false);
      setToast({ message: '✅ Verified Ride published & saved to MongoDB Atlas!', type: 'success' });
      setTimeout(() => navigate('/passenger'), 800);
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to offer ride. Please check network connection.', type: 'error' });
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <ToastNotification message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      {/* Header Banner */}
      <div className="app-card p-8 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-black text-slate-900">Driver Portal</h2>
            <VoiceCommandHandler />
          </div>
          <p className="text-base text-slate-500 font-semibold mt-1">Offer verified rides, set departure times, and manage active listings</p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/driver-analytics" className="btn-secondary py-2.5 px-4 text-xs font-black">
            Performance Analytics
          </Link>
          <Link to="/demand-heatmap" className="btn-primary py-2.5 px-4 text-xs font-black shadow-rapido-yellow text-slate-950">
            Demand Heatmap 🔥
          </Link>
        </div>
      </div>

      {/* Verification Warning Banner */}
      {!isFullyVerified ? (
        <div className="bg-amber-50 border-2 border-amber-300 p-6 rounded-3xl space-y-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-amber-600 shrink-0" />
            <div>
              <h4 className="font-bold text-slate-900 text-lg">Aadhaar & Driver License Verification Required</h4>
              <p className="text-slate-600 text-sm font-semibold">
                Please enter your Aadhaar Card Number and Driver License Number in Profile & Verifications to unlock offering rides.
              </p>
            </div>
          </div>
          <Link
            to="/profile"
            className="btn-primary py-3 px-6 text-sm font-black uppercase tracking-wider whitespace-nowrap shadow-rapido-yellow text-slate-950"
          >
            Verify Identity in Profile
          </Link>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-3xl flex items-center justify-between gap-4 text-emerald-800 font-extrabold text-sm px-6">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>AADHAAR & DRIVER LICENSE FULLY VERIFIED</span>
          </div>
          <span className="bg-emerald-200 text-emerald-900 text-xs px-3 py-1 rounded-full uppercase font-black">
            Active Verified Driver
          </span>
        </div>
      )}

      {/* AI Acceptance Score & Recommendation */}
      <AIRideAcceptanceCard 
        rideScore={94}
        estimatedProfit={180}
        extraDistanceKm={1.3}
        fuelCostInr={22}
        pickupTimeMin={4}
        recommendation="✅ Highly Recommended"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Offer Ride Form Column */}
        <div className="lg:col-span-2 app-card p-8 rounded-3xl space-y-6 bg-white border border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <PlusCircle className="w-6 h-6 text-amber-500" />
              <h3 className="text-2xl font-black text-slate-900">Offer a New Community Ride</h3>
            </div>
            {isFullyVerified ? (
              <span className="bg-emerald-100 border border-emerald-200 text-emerald-800 font-extrabold px-3 py-1 rounded-full text-xs flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> VERIFIED DRIVER
              </span>
            ) : (
              <span className="bg-amber-100 border border-amber-300 text-amber-900 font-extrabold px-3 py-1 rounded-full text-xs">
                VERIFICATION REQUIRED
              </span>
            )}
          </div>

          <form onSubmit={handleOfferRide} className="space-y-5">
            {/* Route Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Pickup Spot / Origin</label>
                <div className="relative">
                  <MapPin className="w-5 h-5 text-emerald-600 absolute left-4 top-4" />
                  <input
                    type="text"
                    value={originName}
                    onChange={(e) => setOriginName(e.target.value)}
                    placeholder="e.g. Hostel Block C - North Campus Gate"
                    className="form-input pl-12"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Destination Drop</label>
                <div className="relative">
                  <MapPin className="w-5 h-5 text-rose-600 absolute left-4 top-4" />
                  <input
                    type="text"
                    value={destName}
                    onChange={(e) => setDestName(e.target.value)}
                    placeholder="e.g. Cyber Park Building 4 Main Bay"
                    className="form-input pl-12"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Timing & Contact Details Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Departure Time</label>
                <div className="relative">
                  <Clock className="w-5 h-5 text-amber-500 absolute left-4 top-4" />
                  <input
                    type="text"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    placeholder="e.g. 09:30 AM"
                    className="form-input pl-12"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Driver Contact Phone Number</label>
                <div className="relative">
                  <Phone className="w-5 h-5 text-emerald-600 absolute left-4 top-4" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9025953166"
                    className="form-input pl-12"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Seats, Price & Community */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="form-label">Available Seats</label>
                <div className="relative">
                  <Users className="w-5 h-5 text-blue-600 absolute left-4 top-4" />
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={totalSeats}
                    onChange={(e) => setTotalSeats(e.target.value)}
                    className="form-input pl-12"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Fare Per Seat (₹)</label>
                <div className="relative">
                  <DollarSign className="w-5 h-5 text-emerald-600 absolute left-4 top-4" />
                  <input
                    type="number"
                    value={pricePerSeat}
                    onChange={(e) => setPricePerSeat(e.target.value)}
                    className="form-input pl-12"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Community Mode</label>
                <select
                  value={communityType}
                  onChange={(e) => setCommunityType(e.target.value)}
                  className="form-input"
                >
                  <option value="Open Community">Open Community</option>
                  <option value="Campus Mode">Campus Mode</option>
                  <option value="Corporate Mode">Corporate Mode</option>
                  <option value="Residential Community">Residential Community</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-3 font-semibold text-base cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={isWomenOnly}
                  onChange={(e) => setIsWomenOnly(e.target.checked)}
                  className="w-5 h-5 accent-pink-600 rounded"
                />
                <span className="text-pink-700 font-bold">Women-Only Ride (Exclusive for Female Passholders)</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !isFullyVerified}
              className={`w-full py-4 text-base font-black shadow-md flex items-center justify-center gap-2 rounded-2xl transition-all uppercase tracking-wider ${
                isFullyVerified
                  ? 'btn-primary shadow-rapido-yellow text-slate-950'
                  : 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
              }`}
            >
              <span>
                {!isFullyVerified 
                  ? 'Complete Verifications in Profile to Offer Ride' 
                  : (loading ? 'Publishing Ride...' : 'Publish Verified Ride with Departure Time & Contact')}
              </span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* Offered Rides List with Cancel / Delete Option */}
          {offeredRides.length > 0 && (
            <div className="pt-6 border-t border-slate-100 space-y-4">
              <h4 className="font-extrabold text-slate-900 text-lg">Active Offered Rides ({offeredRides.length})</h4>
              <div className="space-y-3">
                {offeredRides.map((ride) => (
                  <div key={ride._id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4 text-sm font-semibold">
                    <div>
                      <p className="font-extrabold text-slate-900">{ride.originName} ➔ {ride.destName}</p>
                      <p className="text-xs text-slate-500 font-bold mt-0.5">
                        Departure: {ride.departureTime} • {ride.availableSeats} seats left • ₹{ride.pricePerSeat}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteRide(ride._id)}
                      className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-black px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Cancel / Delete Ride</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Fare & Vehicle Column */}
        <div className="space-y-6">
          <AIFareCalculator distanceKm={8.5} onFareSelect={(recommended) => setPricePerSeat(recommended)} />

          <div className="app-card p-6 rounded-3xl space-y-4 bg-white border border-slate-200">
            <h4 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <Car className="w-5 h-5 text-amber-500" />
              <span>Active Verified Vehicle</span>
            </h4>
            
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-base">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Tata Nexon EV</span>
                <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${
                  isFullyVerified ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}>
                  {isFullyVerified ? 'VERIFIED' : 'UNVERIFIED'}
                </span>
              </div>
              <p className="text-slate-500 font-medium">Plate: KA-01-EQ-9021</p>
              <p className="text-slate-500 font-medium">Contact: {phone}</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
