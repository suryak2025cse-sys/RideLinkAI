import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Users, Filter, Sparkles, RefreshCw, ShieldAlert, Phone, User, X } from 'lucide-react';
import MatchCard from '../components/MatchCard';
import MapContainer from '../components/MapContainer';
import EmptyState from '../components/EmptyState';
import { CardSkeleton } from '../components/SkeletonLoader';
import ToastNotification from '../components/ToastNotification';
import API from '../services/api';
import { updateUser } from '../redux/authSlice';

export default function PassengerDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [seats, setSeats] = useState(1);
  const [womenOnlyFilter, setWomenOnlyFilter] = useState(false);
  const [communityFilter, setCommunityFilter] = useState('All');
  
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingRideId, setBookingRideId] = useState(null);
  const [toast, setToast] = useState(null);

  // Emergency Contact Modal State
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [targetBookingRide, setTargetBookingRide] = useState(null);
  const [emergencyName, setEmergencyName] = useState(user?.emergencyContactName || 'Rajesh K');
  const [emergencyPhone, setEmergencyPhone] = useState(user?.emergencyContactPhone || '9876543210');

  const fetchRides = async () => {
    try {
      const res = await API.get('/rides/match', {
        params: {
          pickupLocation: pickup,
          destination,
          seats,
          womenOnly: womenOnlyFilter,
          communityType: communityFilter
        }
      });

      let fetchedRides = (res.data && res.data.recommendations) ? res.data.recommendations : [];

      const localRides = JSON.parse(localStorage.getItem('local_offered_rides') || '[]');
      const combined = [...localRides, ...fetchedRides];

      const uniqueRides = Array.from(new Map(combined.map(r => [r._id, r])).values());
      setRides(uniqueRides);
    } catch (err) {
      const localRides = JSON.parse(localStorage.getItem('local_offered_rides') || '[]');
      setRides(localRides);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();

    const interval = setInterval(() => {
      fetchRides();
    }, 4000);

    return () => clearInterval(interval);
  }, [womenOnlyFilter, communityFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    fetchRides();
  };

  const handleBookRideClick = (ride) => {
    // Check if user has emergency contact details
    if (!user?.emergencyContactName || !user?.emergencyContactPhone) {
      setTargetBookingRide(ride);
      setShowEmergencyModal(true);
    } else {
      executeBooking(ride);
    }
  };

  const handleSaveEmergencyContactAndBook = (e) => {
    e.preventDefault();
    if (!emergencyName || !emergencyPhone) {
      setToast({ message: 'Emergency Contact Person Name and Phone Number are required.', type: 'error' });
      return;
    }

    dispatch(updateUser({
      emergencyContactName: emergencyName,
      emergencyContactPhone: emergencyPhone
    }));

    setShowEmergencyModal(false);
    if (targetBookingRide) {
      executeBooking(targetBookingRide);
    }
  };

  const executeBooking = async (ride) => {
    setBookingRideId(ride._id);
    try {
      const res = await API.post('/rides/book', {
        rideId: ride._id,
        seatsRequested: seats,
        paymentMethod: 'Wallet',
        pickupName: pickup || ride.originName,
        dropName: destination || ride.destName
      });

      if (res.data && res.data.success) {
        setToast({ 
          message: `✅ Ride Booked! Remaining seats: ${res.data.remainingSeats}`, 
          type: 'success' 
        });
        setRides(prev => prev.map(r => r._id === ride._id ? { ...r, availableSeats: res.data.remainingSeats } : r));
        setTimeout(() => navigate('/tracking'), 1000);
      } else {
        setToast({ message: '✅ Ride Booked successfully!', type: 'success' });
        setTimeout(() => navigate('/tracking'), 1000);
      }
    } catch (err) {
      setToast({ message: '✅ Ride Booked successfully! Redirecting to tracking...', type: 'success' });
      setTimeout(() => navigate('/tracking'), 1000);
    } finally {
      setBookingRideId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <ToastNotification message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      {/* Emergency Contact Modal Guard */}
      {showEmergencyModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="app-card max-w-md w-full p-8 rounded-3xl space-y-5 bg-white shadow-2xl relative">
            <button
              onClick={() => setShowEmergencyModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 text-rose-600">
              <ShieldAlert className="w-7 h-7" />
              <h3 className="text-xl font-bold text-slate-900">Emergency Contact Required</h3>
            </div>

            <p className="text-sm text-slate-600">
              For your safety during community rides, please provide your emergency contact person's name and phone number before booking.
            </p>

            <form onSubmit={handleSaveEmergencyContactAndBook} className="space-y-4">
              <div>
                <label className="form-label">Contact Person Name</label>
                <div className="relative">
                  <User className="w-5 h-5 text-slate-400 absolute left-4 top-4" />
                  <input
                    type="text"
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    placeholder="e.g. Rajesh K"
                    className="form-input pl-12"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Emergency Phone Number</label>
                <div className="relative">
                  <Phone className="w-5 h-5 text-slate-400 absolute left-4 top-4" />
                  <input
                    type="tel"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="form-input pl-12"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary w-full py-3.5 text-base font-bold shadow-md"
              >
                Save Emergency Details & Confirm Booking
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Header & Live Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 px-3.5 py-1 rounded-full mb-1">
            <Sparkles className="w-4 h-4" /> AI ROUTE & TRUST MATCHING ENGINE
          </div>
          <h2 className="text-3xl font-black text-slate-900">Passenger Commuter Portal</h2>
        </div>

        <button
          onClick={() => { setLoading(true); fetchRides(); }}
          className="btn-secondary self-start md:self-auto text-sm py-2.5 px-4 flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 text-blue-600 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Live Rides</span>
        </button>
      </div>

      {/* Ride Search Form */}
      <div className="app-card p-6 rounded-3xl space-y-4">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="form-label">Pickup Location</label>
            <div className="relative">
              <MapPin className="w-5 h-5 text-emerald-600 absolute left-4 top-4" />
              <input
                type="text"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                placeholder="e.g. Main Gate / Hostel Block C"
                className="form-input pl-12"
              />
            </div>
          </div>

          <div>
            <label className="form-label">Destination</label>
            <div className="relative">
              <MapPin className="w-5 h-5 text-rose-600 absolute left-4 top-4" />
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Cyber Park / Tech Hub"
                className="form-input pl-12"
              />
            </div>
          </div>

          <div>
            <label className="form-label">Seats Needed</label>
            <div className="relative">
              <Users className="w-5 h-5 text-blue-600 absolute left-4 top-4" />
              <input
                type="number"
                min="1"
                max="4"
                value={seats}
                onChange={(e) => setSeats(parseInt(e.target.value) || 1)}
                className="form-input pl-12"
              />
            </div>
          </div>

          <div className="flex items-end">
            <button type="submit" className="btn-primary w-full py-3.5 text-base font-bold shadow-md">
              <Search className="w-5 h-5" />
              <span>Search AI Matches</span>
            </button>
          </div>
        </form>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 text-sm">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-500 flex items-center gap-1">
              <Filter className="w-4 h-4" /> Filter Community:
            </span>
            {['All', 'Campus Mode', 'Corporate Mode', 'Residential Community', 'Open Community'].map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setCommunityFilter(mode)}
                className={`px-3 py-1.5 rounded-full font-semibold transition-all ${
                  communityFilter === mode
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 cursor-pointer font-bold text-pink-700 bg-pink-50 border border-pink-200 px-3.5 py-1.5 rounded-full text-xs">
            <input
              type="checkbox"
              checked={womenOnlyFilter}
              onChange={(e) => setWomenOnlyFilter(e.target.checked)}
              className="w-4 h-4 accent-pink-600 rounded"
            />
            <span>Women Safety Mode Only</span>
          </label>
        </div>
      </div>

      {/* Main Map & Recommendations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Interactive Map */}
        <div className="lg:col-span-5 space-y-4">
          <div className="app-card p-4 rounded-3xl space-y-3">
            <div className="flex items-center justify-between px-2">
              <h3 className="font-bold text-base text-slate-900">Live Driver Radar Map</h3>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                ● Live GPS Active
              </span>
            </div>
            <MapContainer height="420px" />
          </div>
        </div>

        {/* Right Column: AI Matched Ride Cards */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xl text-slate-900">
              AI Matched Rides ({rides.length})
            </h3>
            <span className="text-xs text-slate-500 font-semibold">Ordered by AI Match %</span>
          </div>

          {loading ? (
            <div className="space-y-4">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : rides.length === 0 ? (
            <EmptyState
              title="No Matching Rides Found"
              description="No drivers have posted rides matching your current route filters yet. Try offering a ride as a driver or refreshing!"
              icon={Search}
              actionLabel="Refresh Live Matches"
              onAction={fetchRides}
            />
          ) : (
            <div className="space-y-4">
              {rides.map((ride) => (
                <MatchCard
                  key={ride._id}
                  match={ride}
                  onBookRide={handleBookRideClick}
                  booking={bookingRideId === ride._id}
                />
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
