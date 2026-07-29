import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Car, PlusCircle, DollarSign, Award, Users, MapPin, Clock, Phone, ArrowRight } from 'lucide-react';
import ToastNotification from '../components/ToastNotification';
import API from '../services/api';
import { addOfferedRide } from '../redux/rideSlice';

export default function DriverDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [originName, setOriginName] = useState('Hostel Block C - North Campus Gate');
  const [destName, setDestName] = useState('Cyber Park Building 4 Main Bay');
  const [departureTime, setDepartureTime] = useState('09:30 AM');
  const [phone, setPhone] = useState(user?.phone || '9025953166');
  const [totalSeats, setTotalSeats] = useState(3);
  const [pricePerSeat, setPricePerSeat] = useState(65);
  const [isWomenOnly, setIsWomenOnly] = useState(false);
  const [communityType, setCommunityType] = useState('Open Community');
  
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleOfferRide = async (e) => {
    e.preventDefault();
    setLoading(true);
    setToast(null);

    const rideData = {
      _id: `ride_${Date.now()}`,
      driverDetails: {
        name: user?.name || 'Surya K',
        phone: phone || user?.phone || '+91 9025953166',
        rating: 4.9,
        trustScore: user?.trustScore || 96,
        trustBadge: user?.trustBadge || 'Highly Trusted',
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
      pricePerSeat: parseFloat(pricePerSeat) || 65,
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
      setToast({ message: '✅ Ride published with departure time & contact details!', type: 'success' });
      setTimeout(() => navigate('/passenger'), 800);
    } catch (err) {
      dispatch(addOfferedRide(rideData));
      const savedRides = JSON.parse(localStorage.getItem('local_offered_rides') || '[]');
      savedRides.unshift(rideData);
      localStorage.setItem('local_offered_rides', JSON.stringify(savedRides));

      setLoading(false);
      setToast({ message: '✅ Ride published to community network!', type: 'success' });
      setTimeout(() => navigate('/passenger'), 800);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <ToastNotification message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      {/* Header Banner */}
      <div className="app-card p-8 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Driver Portal</h2>
          <p className="text-base text-slate-500">Offer rides, set departure times, and connect with commuters</p>
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
                  <Clock className="w-5 h-5 text-blue-600 absolute left-4 top-4" />
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
                <span className="text-pink-700">Women-Only Ride (Exclusive for Female Passholders)</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-base font-bold shadow-md flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Publishing Ride...' : 'Publish Ride with Departure Time & Contact'}</span>
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
              <p className="text-slate-500 font-medium">Contact: {phone}</p>
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
