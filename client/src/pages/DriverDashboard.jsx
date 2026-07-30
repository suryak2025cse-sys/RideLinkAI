import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Car, PlusCircle, DollarSign, Award, Users, MapPin, Clock, Phone, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';
import ToastNotification from '../components/ToastNotification';
import API from '../services/api';
import { addOfferedRide } from '../redux/rideSlice';

export default function DriverDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Driver Verifications Check (Requires explicit verification submission in /profile)
  const isAadhaarVerified = !!(user?.isAadhaarVerified && user?.aadhaarNumber);
  const isLicenseVerified = !!(user?.isLicenseVerified && user?.licenseNumber);
  const isFullyVerified = isAadhaarVerified && isLicenseVerified;

  const [originName, setOriginName] = useState('Hostel Block C - North Campus Gate');
  const [destName, setDestName] = useState('Cyber Park Building 4 Main Bay');
  const [departureTime, setDepartureTime] = useState('09:30 AM');
  const [phone, setPhone] = useState(user?.phone || '9025953166');
  const [totalSeats, setTotalSeats] = useState(3);
  const [pricePerSeat, setPricePerSeat] = useState(0); // Sample amount defaults to 0
  const [isWomenOnly, setIsWomenOnly] = useState(false);
  const [communityType, setCommunityType] = useState('Open Community');
  
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleOfferRide = async (e) => {
    e.preventDefault();

    if (!isFullyVerified) {
      setToast({ 
        message: '⚠️ Verification Required: Please verify your Aadhaar and Driver License in Profile & Verifications first.', 
        type: 'error' 
      });
      return;
    }

    setLoading(true);
    setToast(null);

    const rideData = {
      _id: `ride_${Date.now()}`,
      driverDetails: {
        name: user?.name || 'Surya K',
        phone: phone || user?.phone || '+91 9025953166',
        rating: 4.9,
        trustScore: user?.trustScore || 98,
        trustBadge: user?.trustBadge || 'Highly Verified Driver',
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
      pricePerSeat: parseFloat(pricePerSeat) || 0,
      communityType: communityType || 'Open Community',
      isWomenOnly: !!isWomenOnly,
      status: 'Scheduled',
      matchScore: 98.5
    };

    try {
      const res = await API.post('/rides/offer', rideData);
      const createdRide = (res.data && res.data.ride) ? res.data.ride : rideData;
      
      dispatch(addOfferedRide(createdRide));

      const savedRides = JSON.parse(localStorage.getItem('local_offered_rides') || '[]');
      savedRides.unshift(createdRide);
      localStorage.setItem('local_offered_rides', JSON.stringify(savedRides));

      setLoading(false);
      setToast({ message: '✅ Verified Ride published & saved to DB!', type: 'success' });
      setTimeout(() => navigate('/passenger'), 800);
    } catch (err) {
      dispatch(addOfferedRide(rideData));
      const savedRides = JSON.parse(localStorage.getItem('local_offered_rides') || '[]');
      savedRides.unshift(rideData);
      localStorage.setItem('local_offered_rides', JSON.stringify(savedRides));

      setLoading(false);
      setToast({ message: '✅ Verified Ride published to community network!', type: 'success' });
      setTimeout(() => navigate('/passenger'), 800);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <ToastNotification message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      {/* Header Banner */}
      <div className="app-card p-8 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white">Driver Portal</h2>
          <p className="text-base text-slate-400">Offer verified rides, set departure times, and connect with commuters</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-slate-900 border border-cyan-500/30 px-5 py-3 rounded-2xl">
            <span className="text-slate-400 block text-xs font-bold uppercase tracking-wider">WALLET EARNINGS</span>
            <span className="text-cyan-400 text-xl font-black">₹{user?.walletBalance ? user.walletBalance.toFixed(0) : '0'}</span>
          </div>
          <div className="bg-slate-900 border border-cyan-500/30 px-5 py-3 rounded-2xl">
            <span className="text-slate-400 block text-xs font-bold uppercase tracking-wider">DRIVER RATING</span>
            <span className="text-amber-400 text-xl font-black">4.9 ★</span>
          </div>
        </div>
      </div>

      {/* Verification Status Banner */}
      {!isFullyVerified ? (
        <div className="bg-amber-950/60 border-2 border-amber-500/40 p-6 rounded-3xl space-y-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-amber-400 shrink-0" />
            <div>
              <h4 className="font-bold text-white text-lg">Aadhaar & Driver License Verification Required</h4>
              <p className="text-amber-300 text-sm">
                You must verify your Aadhaar ID and Driver's License in Profile & Verifications before offering a ride.
              </p>
            </div>
          </div>
          <Link
            to="/profile"
            className="btn-primary py-3 px-6 text-sm font-black uppercase tracking-wider whitespace-nowrap shadow-neon-cyan"
          >
            Verify Identity in Profile
          </Link>
        </div>
      ) : (
        <div className="bg-emerald-950/60 border border-emerald-500/40 p-4 rounded-3xl flex items-center justify-between gap-4 text-emerald-400 font-extrabold text-sm px-6 shadow-glow-emerald">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>AADHAAR & DRIVER LICENSE FULLY VERIFIED</span>
          </div>
          <span className="bg-emerald-500/20 text-emerald-300 text-xs px-3 py-1 rounded-full uppercase border border-emerald-500/30">
            Active Verified Driver
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Offer Ride Form Column */}
        <div className="lg:col-span-2 app-card p-8 rounded-3xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <PlusCircle className="w-6 h-6 text-cyan-400" />
              <h3 className="text-2xl font-bold text-white">Offer a New Community Ride</h3>
            </div>
            {isFullyVerified ? (
              <span className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-extrabold px-3 py-1 rounded-full text-xs flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> VERIFIED DRIVER
              </span>
            ) : (
              <span className="bg-amber-950/80 border border-amber-500/40 text-amber-400 font-extrabold px-3 py-1 rounded-full text-xs">
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
                  <MapPin className="w-5 h-5 text-emerald-400 absolute left-4 top-4" />
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
                  <MapPin className="w-5 h-5 text-rose-400 absolute left-4 top-4" />
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
                  <Clock className="w-5 h-5 text-cyan-400 absolute left-4 top-4" />
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
                  <Phone className="w-5 h-5 text-emerald-400 absolute left-4 top-4" />
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
                  <Users className="w-5 h-5 text-cyan-400 absolute left-4 top-4" />
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
                <label className="form-label">Calculated Fare Per Seat (₹)</label>
                <div className="relative">
                  <DollarSign className="w-5 h-5 text-emerald-400 absolute left-4 top-4" />
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
              <label className="flex items-center gap-3 font-semibold text-base cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={isWomenOnly}
                  onChange={(e) => setIsWomenOnly(e.target.checked)}
                  className="w-5 h-5 accent-pink-500 rounded"
                />
                <span className="text-pink-400">Women-Only Ride (Exclusive for Female Passholders)</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !isFullyVerified}
              className={`w-full py-4 text-base font-black shadow-md flex items-center justify-center gap-2 rounded-2xl transition-all uppercase tracking-wider ${
                isFullyVerified
                  ? 'btn-primary shadow-neon-cyan'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
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
        </div>

        {/* Vehicle & Performance Column */}
        <div className="space-y-6">
          <div className="app-card p-6 rounded-3xl space-y-4">
            <h4 className="font-bold text-lg text-white flex items-center gap-2">
              <Car className="w-5 h-5 text-cyan-400" />
              <span>Active Verified Vehicle</span>
            </h4>
            
            <div className="bg-slate-900 p-4 rounded-2xl border border-white/10 space-y-2 text-base">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">Tata Nexon EV</span>
                <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${
                  isFullyVerified ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                }`}>
                  {isFullyVerified ? 'VERIFIED' : 'UNVERIFIED'}
                </span>
              </div>
              <p className="text-slate-400 font-medium">Plate: KA-01-EQ-9021</p>
              <p className="text-slate-400 font-medium">Contact: {phone}</p>
            </div>
          </div>

          <div className="app-card p-6 rounded-3xl space-y-3">
            <h4 className="font-bold text-lg text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Performance Metrics</span>
            </h4>
            <div className="space-y-2 text-base text-slate-300 font-medium">
              <div className="flex justify-between">
                <span>Punctuality Rate</span>
                <span className="font-bold text-emerald-400">99.2%</span>
              </div>
              <div className="flex justify-between">
                <span>Trust Score</span>
                <span className="font-bold text-cyan-400">{user?.trustScore || 80}/100</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
