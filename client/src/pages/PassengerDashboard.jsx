import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Users, Filter, Sparkles, RefreshCw, ShieldAlert, Phone, User, X, ArrowRight, Car, Building, CheckCircle2 } from 'lucide-react';
import MatchCard from '../components/MatchCard';
import MapContainer from '../components/MapContainer';
import EmptyState from '../components/EmptyState';
import { CardSkeleton } from '../components/SkeletonLoader';
import ToastNotification from '../components/ToastNotification';
import VoiceCommandHandler from '../components/VoiceCommandHandler';
import API from '../services/api';
import { updateUser } from '../redux/authSlice';
import { socket } from '../services/socket';

export default function PassengerDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [seats, setSeats] = useState(1);
  const [womenOnlyFilter, setWomenOnlyFilter] = useState(false);
  const [communityFilter, setCommunityFilter] = useState('All');
  const [selectedOrganization, setSelectedOrganization] = useState('Sri Eshwar College of Engineering');
  
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingRideId, setBookingRideId] = useState(null);
  const [toast, setToast] = useState(null);

  // Emergency Contact Modal State
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [targetBookingRide, setTargetBookingRide] = useState(null);
  const [emergencyName, setEmergencyName] = useState(user?.emergencyContactName || '');
  const [emergencyPhone, setEmergencyPhone] = useState(user?.emergencyContactPhone || '');

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

      // Filter by Organization if Campus Mode or Corporate Mode is active
      const filteredByOrg = fetchedRides.filter(r => {
        if (communityFilter === 'Campus Mode' || communityFilter === 'Corporate Mode') {
          return r.organizationName ? r.organizationName.toLowerCase().includes(selectedOrganization.toLowerCase()) : true;
        }
        return true;
      });

      setRides(filteredByOrg);
    } catch (err) {
      console.log('[Fetch Rides Warning]:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();

    // Live real-time socket listeners for instant multi-user synchronization
    if (socket) {
      socket.on('ride_created', (newRide) => {
        setRides(prev => [newRide, ...prev.filter(r => r._id !== newRide._id)]);
        setToast({ message: '⚡ New live community ride offered nearby!', type: 'info' });
      });

      socket.on('ride_updated', (updatedRide) => {
        setRides(prev => prev.map(r => r._id === updatedRide._id ? { ...r, ...updatedRide } : r));
      });

      socket.on('ride_deleted', (deletedRideId) => {
        setRides(prev => prev.filter(r => r._id !== deletedRideId));
      });
    }

    const interval = setInterval(() => {
      fetchRides();
    }, 4000);

    return () => {
      if (socket) {
        socket.off('ride_created');
        socket.off('ride_updated');
        socket.off('ride_deleted');
      }
      clearInterval(interval);
    };
  }, [womenOnlyFilter, communityFilter, selectedOrganization]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    fetchRides();
  };

  const handleBookRideClick = (ride) => {
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
      setToast({ message: err.response?.data?.message || 'Failed to book ride. Please check network connection.', type: 'error' });
    } finally {
      setBookingRideId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      <ToastNotification message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      {/* Emergency Contact Modal Guard */}
      {showEmergencyModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="app-card max-w-md w-full p-8 rounded-3xl space-y-5 bg-white shadow-2xl relative border border-slate-200">
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

            <p className="text-sm text-slate-600 font-semibold">
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
                className="btn-primary w-full py-4 text-lg font-black shadow-rapido-yellow text-white"
              >
                Save Emergency Details & Confirm Booking
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Hero Booking Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
        
        {/* Left Hero Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="bg-emerald-100 text-emerald-950 font-black px-3.5 py-1 rounded-full text-xs border border-emerald-300">
                ⚡ SMART AI COMMUNITY MOBILITY
              </span>
              <VoiceCommandHandler />
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight pt-1">
              Smart AI-Powered Community Mobility Platform
            </h1>
            <p className="text-lg font-semibold text-slate-600">
              Quick, verified & affordable last-mile rides for colleges, companies & daily commuters
            </p>
          </div>

          <div className="app-card p-6 rounded-3xl space-y-4 bg-white border border-slate-200 shadow-lg">
            <form onSubmit={handleSearchSubmit} className="space-y-4">
              <div>
                <div className="relative">
                  <div className="w-3 h-3 rounded-full bg-slate-950 absolute left-4 top-5"></div>
                  <input
                    type="text"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    placeholder="Enter Pickup Location"
                    className="form-input pl-11 py-4 text-lg font-semibold text-slate-900 border-slate-300"
                  />
                </div>
              </div>

              <div>
                <div className="relative">
                  <div className="w-3 h-3 rounded-full border-2 border-slate-950 absolute left-4 top-5"></div>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Enter Drop Location"
                    className="form-input pl-11 py-4 text-lg font-semibold text-slate-900 border-slate-300"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="btn-primary w-full py-4 text-xl font-black shadow-rapido-yellow text-white rounded-2xl flex items-center justify-center gap-2"
              >
                <span>Book Ride</span>
                <ArrowRight className="w-6 h-6" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Hero Illustration Card */}
        <div className="lg:col-span-5 hidden lg:block">
          <div className="bg-gradient-to-tr from-emerald-100 via-emerald-50 to-teal-50 p-8 rounded-4xl border border-emerald-200 shadow-sm relative overflow-hidden text-center space-y-4">
            <div className="w-20 h-20 bg-emerald-500 text-white rounded-3xl flex items-center justify-center mx-auto shadow-md">
              <Car className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">AI Ride-Pooling Active</h3>
            <p className="text-sm font-semibold text-slate-600 max-w-xs mx-auto">
              Verified drivers travelling on your exact route with instant match scores and safety tracking.
            </p>
          </div>
        </div>

      </div>

      {/* Organization & Filter Controls Bar */}
      <div className="app-card p-5 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-sm font-bold bg-white border border-slate-200">
        
        {/* Organization Filter Selector */}
        <div className="flex items-center gap-3">
          <Building className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-extrabold text-slate-900 whitespace-nowrap">Organization Filter:</span>
          <select
            value={selectedOrganization}
            onChange={(e) => setSelectedOrganization(e.target.value)}
            className="form-input py-2 text-xs font-bold text-slate-900 bg-slate-50 border-slate-300"
          >
            <option value="Sri Eshwar College of Engineering">Sri Eshwar College of Engineering</option>
            <option value="Infosys Tech Park">Infosys Tech Park</option>
            <option value="Cyber City IT Hub">Cyber City IT Hub</option>
            <option value="Greenwood Residential Colony">Greenwood Residential Colony</option>
          </select>
        </div>

        {/* Community Mode Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {['All', 'Campus Mode', 'Corporate Mode', 'Residential Community', 'Open Community'].map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setCommunityFilter(mode)}
              className={`px-3.5 py-1.5 rounded-full transition-all text-xs uppercase tracking-wider ${
                communityFilter === mode
                  ? 'bg-slate-950 text-white font-black shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 cursor-pointer font-extrabold text-pink-700 bg-pink-50 border border-pink-200 px-3.5 py-1.5 rounded-full text-xs">
          <input
            type="checkbox"
            checked={womenOnlyFilter}
            onChange={(e) => setWomenOnlyFilter(e.target.checked)}
            className="w-4 h-4 accent-pink-600 rounded"
          />
          <span>Women Safety Mode</span>
        </label>
      </div>

      {/* Main Map & Recommendations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: OpenStreetMap Live Radar Map */}
        <div className="lg:col-span-5 space-y-4">
          <div className="app-card p-4 rounded-3xl space-y-3 bg-white border border-slate-200">
            <div className="flex items-center justify-between px-2">
              <h3 className="font-extrabold text-base text-slate-900">Live Driver OpenStreetMap Radar</h3>
              <span className="text-xs font-black text-emerald-700 bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-full">
                ● Live GPS Active
              </span>
            </div>
            <MapContainer height="420px" />
          </div>
        </div>

        {/* Right Column: AI Matched Ride Cards */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-2xl text-slate-900">
              Available Rides ({rides.length})
            </h3>
            <button
              onClick={() => { setLoading(true); fetchRides(); }}
              className="text-xs font-bold text-slate-600 hover:text-slate-950 flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-full"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-500' : ''}`} />
              <span>Refresh Rides</span>
            </button>
          </div>

          {loading ? (
            <div className="space-y-4">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : rides.length === 0 ? (
            <EmptyState
              title="No Active Rides Listed Right Now"
              description="No active rides matching your search criteria. Offer a ride in Driver Portal or refresh live matches!"
              icon={Search}
              actionLabel="Refresh Live Matches"
              onAction={fetchRides}
            />
          ) : (
            <div className="space-y-4">
              {rides.map((ride) => (
                <MatchCard
                  key={ride._id || Math.random()}
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
