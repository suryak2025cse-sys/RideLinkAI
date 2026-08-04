import React, { useState, useEffect } from 'react';
import { ShieldCheck, Phone, AlertTriangle, Navigation, Clock, CheckCircle2, XCircle, ShieldAlert, History } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MapContainer from '../components/MapContainer';
import ToastNotification from '../components/ToastNotification';
import VoiceCommandHandler from '../components/VoiceCommandHandler';
import CheckInModal from '../components/CheckInModal';
import API from '../services/api';
import { socket } from '../services/socket';

export default function RideTrackingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rideId = searchParams.get('rideId') || '6a70d396ab2af401769466fa';

  const [toast, setToast] = useState(null);

  // Safety & Deviation States
  const [checkInStatus, setCheckInStatus] = useState('none');
  const [isOffRoute, setIsOffRoute] = useState(false);
  const [distanceMeters, setDistanceMeters] = useState(0);
  const [safetyLogs, setSafetyLogs] = useState([]);

  // Fetch Safety History & Status
  const fetchSafetyHistory = async () => {
    try {
      const res = await API.get(`/rides/${rideId}/safety-history`);
      if (res.data) {
        setCheckInStatus(res.data.checkInStatus || 'none');
        setSafetyLogs(res.data.safetyLogs || []);
      }
    } catch (err) {
      console.log('[Safety History Notice]: Using local tracking state');
    }
  };

  // Live Location Ping Interval (Every 10 Seconds)
  useEffect(() => {
    fetchSafetyHistory();

    const pingInterval = setInterval(async () => {
      try {
        // Send location ping
        const res = await API.post(`/rides/${rideId}/location`, {
          lat: 12.9716 + (Math.random() * 0.002 - 0.001),
          lng: 77.5946 + (Math.random() * 0.002 - 0.001),
          address: 'Outer Bypass Gate'
        });

        if (res.data) {
          setDistanceMeters(res.data.distanceMeters || 0);
          setIsOffRoute(res.data.isOffRoute || false);
          if (res.data.checkInStatus) {
            setCheckInStatus(res.data.checkInStatus);
          }
        }
      } catch (err) {
        console.log('[Ping Warning]:', err.message);
      }
    }, 10000);

    // Socket.IO Listeners for instant check-in prompts & emergency alerts
    if (socket) {
      socket.on('checkin_prompt', (data) => {
        if (data.rideId === rideId) {
          setCheckInStatus('pending');
          setDistanceMeters(data.distanceMeters || 650);
          setToast({ message: '⚠️ Safety Prompt: Please confirm your safety status.', type: 'error' });
        }
      });

      socket.on('checkin_resolved', (data) => {
        if (data.rideId === rideId) {
          setCheckInStatus(data.status);
          setIsOffRoute(false);
          fetchSafetyHistory();
        }
      });

      socket.on('emergency_escalated', (data) => {
        if (data.rideId === rideId) {
          setCheckInStatus('unresponsive');
          setToast({ message: '🚨 Emergency Escalated: Emergency contacts notified.', type: 'error' });
          fetchSafetyHistory();
        }
      });
    }

    return () => {
      clearInterval(pingInterval);
      if (socket) {
        socket.off('checkin_prompt');
        socket.off('checkin_resolved');
        socket.off('emergency_escalated');
      }
    };
  }, [rideId]);

  const handleSimulateDeviation = async () => {
    setIsOffRoute(true);
    setDistanceMeters(680);
    setCheckInStatus('pending');
    setToast({ message: '⚠️ Simulated Route Deviation Triggered (680m off route)', type: 'error' });
  };

  const handleCancelBooking = () => {
    setToast({ message: '✅ Ride booking cancelled successfully.', type: 'success' });
    setTimeout(() => navigate('/passenger'), 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <ToastNotification message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      {/* Check-In Modal when checkInStatus === 'pending' */}
      {checkInStatus === 'pending' && (
        <CheckInModal
          rideId={rideId}
          distanceMeters={distanceMeters || 650}
          timeoutSeconds={90}
          onResolved={(newStatus) => {
            setCheckInStatus(newStatus);
            fetchSafetyHistory();
          }}
        />
      )}

      {/* Header Banner */}
      <div className="app-card p-6 rounded-3xl bg-white border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-black text-slate-900">Live Ride Tracking & Navigation</h2>
            <VoiceCommandHandler />
          </div>
          <p className="text-base text-slate-500 font-semibold mt-1">
            Real-time GPS telemetry, route deviation detection, and automated emergency escalation
          </p>
        </div>

        {/* Live On-Route / Off-Route Status Indicator Badge */}
        <div className="flex items-center gap-3">
          {checkInStatus === 'none' && !isOffRoute && (
            <span className="bg-emerald-100 border border-emerald-300 text-emerald-950 font-black px-4 py-2 rounded-full text-xs flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              ON-ROUTE (NORMAL)
            </span>
          )}

          {isOffRoute && checkInStatus === 'none' && (
            <span className="bg-amber-100 border border-amber-300 text-amber-950 font-black px-4 py-2 rounded-full text-xs flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              OFF-ROUTE ({distanceMeters}m)
            </span>
          )}

          {checkInStatus === 'pending' && (
            <span className="bg-rose-100 border border-rose-300 text-rose-950 font-black px-4 py-2 rounded-full text-xs flex items-center gap-1.5 animate-pulse">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              CHECK-IN REQUIRED
            </span>
          )}

          {checkInStatus === 'confirmed' && (
            <span className="bg-emerald-100 border border-emerald-300 text-emerald-950 font-black px-4 py-2 rounded-full text-xs flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              CHECK-IN CONFIRMED (SAFE)
            </span>
          )}

          {checkInStatus === 'unresponsive' && (
            <span className="bg-rose-600 text-white font-black px-4 py-2 rounded-full text-xs flex items-center gap-1.5 animate-bounce">
              <ShieldAlert className="w-4 h-4 text-white" />
              EMERGENCY ESCALATED
            </span>
          )}

          <button
            onClick={handleCancelBooking}
            className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-black px-5 py-2.5 rounded-2xl border border-rose-200 text-xs flex items-center gap-2"
          >
            <XCircle className="w-4 h-4" /> Cancel Booking
          </button>
        </div>
      </div>

      {/* Map & Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-8 space-y-4">
          <div className="app-card p-4 rounded-3xl bg-white border border-slate-200 space-y-3">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-black text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
                📍 Live GPS OpenStreetMap Polyline Radar
              </span>
              <button
                onClick={handleSimulateDeviation}
                className="text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1 rounded-full border border-rose-200"
              >
                Test Route Deviation (680m)
              </button>
            </div>
            <MapContainer height="480px" />
          </div>

          {/* Past Deviation & Safety Audit Log Table */}
          <div className="app-card p-6 rounded-3xl bg-white border border-slate-200 space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <History className="w-5 h-5 text-emerald-600" />
              <span>Ride Safety Audit Log & Incident History</span>
            </h3>

            {safetyLogs.length === 0 ? (
              <p className="text-xs text-slate-500 font-semibold italic">No safety incidents or route deviations logged for this trip.</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {safetyLogs.map((log) => (
                  <div key={log._id || Math.random()} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs font-bold">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
                      <span className="text-slate-800">{log.details}</span>
                    </div>
                    <span className="bg-slate-200 text-slate-800 px-2.5 py-0.5 rounded-full text-[10px] uppercase">
                      {log.eventType}
                    </span>
                  </div>
                ))}
              </div>
            )}
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
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-500"
                />
                <div>
                  <h4 className="font-extrabold text-slate-900 text-base">Surya K (Verified Driver)</h4>
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
                <span>Deviation Threshold</span>
                <span className="font-extrabold text-slate-900">500 meters</span>
              </div>
              <div className="flex justify-between">
                <span>Auto Call Escalation</span>
                <span className="font-extrabold text-emerald-700">Active (90s Timeout)</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
