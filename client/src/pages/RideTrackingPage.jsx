import React, { useState, useEffect } from 'react';
import { ShieldCheck, Phone, AlertTriangle, Navigation, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MapContainer from '../components/MapContainer';
import ToastNotification from '../components/ToastNotification';
import VoiceCommandHandler from '../components/VoiceCommandHandler';

export default function RideTrackingPage() {
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  // Route Deviation State (Feature 5)
  const [isDeviated, setIsDeviated] = useState(false);
  const [deviationMeters, setDeviationMeters] = useState(0);

  // Simulate route progress & periodic deviation check
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDeviated(true);
      setDeviationMeters(650);
      setToast({ message: '⚠️ Route Deviation Detected: Driver strayed 650m from recommended path.', type: 'error' });
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  const handleCancelBooking = () => {
    setToast({ message: '✅ Ride booking cancelled successfully.', type: 'success' });
    setTimeout(() => navigate('/passenger'), 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <ToastNotification message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      {/* Header Banner */}
      <div className="app-card p-6 rounded-3xl bg-white border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-black text-slate-900">Live Ride Tracking & Navigation</h2>
            <VoiceCommandHandler />
          </div>
          <p className="text-base text-slate-500 font-semibold mt-1">Real-time GPS telemetry, safety monitoring, and route deviation alert system</p>
        </div>

        <button
          onClick={handleCancelBooking}
          className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-black px-5 py-3 rounded-2xl border border-rose-200 text-xs flex items-center gap-2"
        >
          <XCircle className="w-4 h-4" /> Cancel Booking
        </button>
      </div>

      {/* Route Deviation Warning (Feature 5) */}
      {isDeviated && (
        <div className="bg-rose-50 border-2 border-rose-300 p-5 rounded-3xl space-y-2 flex flex-col md:flex-row md:items-center justify-between gap-4 text-rose-900 shadow-sm animate-pulse">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-rose-600 shrink-0" />
            <div>
              <h4 className="font-extrabold text-lg">Route Deviation Warning Detected</h4>
              <p className="text-sm text-rose-700 font-semibold">
                Current vehicle GPS is {deviationMeters} meters away from the planned route. Safety log recorded.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/women-safety')}
            className="btn-danger py-2.5 px-5 text-xs font-black uppercase tracking-wider whitespace-nowrap"
          >
            Trigger Safety SOS
          </button>
        </div>
      )}

      {/* Map & Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-8 space-y-4">
          <div className="app-card p-4 rounded-3xl bg-white border border-slate-200">
            <MapContainer height="480px" />
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="app-card p-6 rounded-3xl bg-white border border-slate-200 space-y-4">
            <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Assigned Driver Details</span>
            </h3>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
                  alt="Driver"
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-400"
                />
                <div>
                  <h4 className="font-extrabold text-slate-900 text-base">Surya K</h4>
                  <p className="text-xs text-slate-500 font-bold">Tata Nexon EV • KA-01-EQ-9021</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between text-xs font-bold text-slate-600">
                <span>Driver Contact</span>
                <span className="text-slate-900 font-black">+91 9025953166</span>
              </div>
            </div>

            <div className="space-y-2 text-xs font-semibold text-slate-600">
              <div className="flex justify-between">
                <span>Estimated Arrival (ETA)</span>
                <span className="font-extrabold text-slate-900">4 mins</span>
              </div>
              <div className="flex justify-between">
                <span>Safety Telemetry</span>
                <span className="font-extrabold text-emerald-700">Audio SOS Active</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
