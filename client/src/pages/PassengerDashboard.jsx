import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Search, Sparkles, Filter, ShieldCheck, MapPin, Navigation, Car } from 'lucide-react';
import MatchCard from '../components/MatchCard';
import TrustScoreWidget from '../components/TrustScoreWidget';
import EmptyState from '../components/EmptyState';
import { CardSkeleton } from '../components/SkeletonLoader';
import ToastNotification from '../components/ToastNotification';
import API from '../services/api';

export default function PassengerDashboard() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [pickup, setPickup] = useState(searchParams.get('pickup') || '');
  const [drop, setDrop] = useState(searchParams.get('drop') || '');
  const [womenOnly, setWomenOnly] = useState(false);
  const [communityType, setCommunityType] = useState('Campus Mode');
  
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const fetchRides = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/rides/match?pickupLat=12.9716&pickupLng=77.5946&dropLat=12.9800&dropLng=77.6000&womenOnly=${womenOnly}&communityType=${encodeURIComponent(communityType)}`);
      if (res.data && res.data.recommendations) {
        setRides(res.data.recommendations);
      } else {
        setRides([]);
      }
    } catch (err) {
      setRides([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();
  }, [womenOnly, communityType]);

  const handleBookRide = async (ride) => {
    try {
      await API.post('/rides/book', {
        rideId: ride._id,
        seatsRequested: 1,
        paymentMethod: 'Wallet'
      });
      setToast({ message: 'Ride booked successfully!', type: 'success' });
      setTimeout(() => navigate(`/tracking?rideId=${ride._id}`), 1000);
    } catch (err) {
      navigate(`/tracking?rideId=${ride._id}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <ToastNotification message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
      
      {/* Top Banner & Search */}
      <div className="app-card p-6 lg:p-8 rounded-3xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900">Passenger Portal</h2>
            <p className="text-base text-slate-500">AI Ride Matching & Community Commuter Circle</p>
          </div>
          <button
            onClick={() => navigate('/tracking')}
            className="btn-secondary text-sm py-2.5 px-4 font-bold border-blue-200 text-blue-700 bg-blue-50"
          >
            <Navigation className="w-4 h-4 text-blue-600 animate-spin" />
            <span>Active Ride Live Tracking</span>
          </button>
        </div>

        {/* Filters & Mode Toggles */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100 text-base font-semibold">
          <span className="text-slate-500 flex items-center gap-1.5 font-bold">
            <Filter className="w-4 h-4 text-blue-600" /> Mode Filter:
          </span>

          <button
            onClick={() => setWomenOnly(!womenOnly)}
            className={`px-4 py-2 rounded-2xl border transition-all ${
              womenOnly
                ? 'bg-pink-600 text-white border-pink-600 font-bold shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            Women-Only Rides
          </button>

          {['Campus Mode', 'Corporate Mode', 'Residential Community', 'Open Community'].map((mode) => (
            <button
              key={mode}
              onClick={() => setCommunityType(mode)}
              className={`px-4 py-2 rounded-2xl border transition-all ${
                communityType === mode
                  ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Rides List + Trust Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Rides List Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span>AI Ranked Recommendations ({rides.length})</span>
            </h3>
          </div>

          {loading ? (
            <div className="space-y-4">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : rides.length === 0 ? (
            <EmptyState
              title="No Rides Available"
              description={`There are currently no active rides matching ${communityType}. You can offer a new ride or change your filter.`}
              icon={Car}
              actionLabel="Offer a Ride as Driver"
              onAction={() => navigate('/driver')}
            />
          ) : (
            <div className="space-y-4">
              {rides.map((ride) => (
                <MatchCard key={ride._id} ride={ride} onBook={handleBookRide} />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Column: Trust Score Widget */}
        <div className="space-y-6">
          <TrustScoreWidget trustScore={user?.trustScore || 94} trustBadge={user?.trustBadge || 'Highly Trusted'} />
        </div>

      </div>

    </div>
  );
}
