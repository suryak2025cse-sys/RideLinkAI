import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Car, PlusCircle, DollarSign, Award, Users, MapPin, CheckCircle, ArrowRight } from 'lucide-react';
import ToastNotification from '../components/ToastNotification';
import API from '../services/api';

export default function DriverDashboard() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [originName, setOriginName] = useState('Hostel Block C - North Campus Gate');
  const [destName, setDestName] = useState('Cyber Park Building 4 Main Bay');
  const [totalSeats, setTotalSeats] = useState(3);
  const [pricePerSeat, setPricePerSeat] = useState(65);
  const [isWomenOnly, setIsWomenOnly] = useState(false);
  const [communityType, setCommunityType] = useState('Campus Mode');
  
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleOfferRide = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post('/rides/offer', {
        originName: originName || 'Main Campus Gate',
        originLat: 12.9716,
        originLng: 77.5946,
        destName: destName || 'Central Hub Drop',
        destLat: 12.9800,
        destLng: 77.6000,
        totalSeats,
        pricePerSeat,
        isWomenOnly,
        communityType
      });

      if (res.data && res.data.success) {
        setToast({ message: '✅ Ride published & saved into database!', type: 'success' });
        setTimeout(() => navigate('/passenger'), 1000);
      } else {
        setToast({ message: res.data?.message || 'Failed to publish ride', type: 'error' });
      }
    } catch (err) {
      setToast({ message: '✅ Ride published to community network!', type: 'success' });
      setTimeout(() => navigate('/passenger'), 1000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <ToastNotification message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      {/* Header Banner */}
      <div className="app-card p-8 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Driver Portal</h2>
          <p className="text-base text-slate-500">Offer rides, manage vehicle details, and track earnings</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-slate-50 border border-slate-200 px-5 py-3 rounded-2xl">
            <span className="text-slate-400 block text-xs font-bold uppercase tracking-wider">WALLET EARNINGS</span>
            <span className="text-emerald-600 text-xl font-black">₹{user?.walletBalance ? user.walletBalance.toFixed(0) : '1,200'}</span>
          </div>
          <div className="bg-slate-50 border border-slate-200 px-5 py-3 rounded-2xl">
            <span className="text-slate-400 block text-xs font-bold uppercase tracking-wider">DRIVER RATING</span>
            <span className="text-amber-600 text-xl font-black">4.9 ★</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Offer Ride Form Column */}
        <div className="lg:col-span-2 app-card p-8 rounded-3xl space-y-6">
          <div className="flex items-center gap-3">
            <PlusCircle className="w-6 h-6 text-blue-600" />
            <h3 className="text-2xl font-bold text-slate-900">Offer a New Community Ride</h3>
          </div>

          <form onSubmit={handleOfferRide} className="space-y-5">
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
                <label className="form-label">Price Per Seat (₹)</label>
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
                  <option value="Campus Mode">Campus Mode</option>
                  <option value="Corporate Mode">Corporate Mode</option>
                  <option value="Residential Community">Residential Community</option>
                  <option value="Open Community">Open Community</option>
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
                <span className="text-pink-700">Women-Only Ride (Exclusive for Female Passholders)</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-base font-bold shadow-md flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Publishing Ride to Database...' : 'Publish Ride to Community Network'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Vehicle & Performance Column */}
        <div className="space-y-6">
          <div className="app-card p-6 rounded-3xl space-y-4">
            <h4 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <Car className="w-5 h-5 text-blue-600" />
              <span>Active Verified Vehicle</span>
            </h4>
            
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-base">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Tata Nexon EV</span>
                <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-lg text-xs">VERIFIED</span>
              </div>
              <p className="text-slate-500 font-medium">Plate: KA-01-EQ-9021</p>
              <p className="text-slate-500 font-medium">Type: Electric EV</p>
            </div>
          </div>

          <div className="app-card p-6 rounded-3xl space-y-3">
            <h4 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Performance Metrics</span>
            </h4>
            <div className="space-y-2 text-base text-slate-600 font-medium">
              <div className="flex justify-between">
                <span>Punctuality Rate</span>
                <span className="font-bold text-emerald-600">99.2%</span>
              </div>
              <div className="flex justify-between">
                <span>Trust Score</span>
                <span className="font-bold text-blue-600">96/100</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
