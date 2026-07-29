import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigation, Phone, MessageSquare, AlertTriangle, ShieldCheck, Clock, CheckCircle } from 'lucide-react';
import MapContainer from '../components/MapContainer';
import { toggleSOSModal, toggleSafetyCheckPopup, addSafetyLog } from '../redux/safetySlice';
import { toggleChatDrawer } from '../redux/chatSlice';
import { socket } from '../services/socket';
import EmptyState from '../components/EmptyState';

export default function RideTrackingPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { safetyEventsLog } = useSelector((state) => state.safety);

  const [driverPos, setDriverPos] = useState({ lat: 12.9730, lng: 77.5960 });
  const [etaMinutes, setEtaMinutes] = useState(6);

  useEffect(() => {
    socket.emit('join_ride_room', { rideId: 'ride_active_demo_101', userId: user?._id, role: user?.role });

    socket.on('driver_location_changed', (loc) => {
      setDriverPos({ lat: loc.lat, lng: loc.lng });
    });

    socket.on('guardian_safety_alert', (alert) => {
      dispatch(toggleSafetyCheckPopup(true));
      dispatch(addSafetyLog({
        id: `alert_${Date.now()}`,
        time: new Date().toLocaleTimeString(),
        text: `⚠️ Guardian Alert: ${alert.reason}`,
        status: 'warning'
      }));
    });

    const interval = setInterval(() => {
      setDriverPos(prev => ({
        lat: prev.lat + 0.0003,
        lng: prev.lng + 0.0004
      }));
      setEtaMinutes(prev => Math.max(1, prev - 1));
    }, 4000);

    return () => {
      clearInterval(interval);
      socket.off('driver_location_changed');
      socket.off('guardian_safety_alert');
    };
  }, [dispatch, user]);

  const handleSimulateDeviation = () => {
    socket.emit('guardian_deviation_trigger', {
      rideId: 'ride_active_demo_101',
      driverId: '660a1234567890abcdef1234',
      reason: 'Vehicle diverged 450m from AI planned route',
      deviationKm: 0.45
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      
      {/* Top Banner */}
      <div className="app-card p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 bg-blue-50 px-3.5 py-1 rounded-full mb-1">
            <Navigation className="w-4 h-4 animate-spin" /> LIVE TRACKING ACTIVE
          </div>
          <h2 className="text-3xl font-black text-slate-900">Active Ride Tracking</h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-50 border border-slate-200 px-5 py-3 rounded-2xl text-base font-semibold">
            <span className="text-slate-400 block text-xs font-bold uppercase">ESTIMATED ARRIVAL</span>
            <span className="text-blue-600 text-xl font-bold">~{etaMinutes} Minutes</span>
          </div>

          <button
            onClick={() => dispatch(toggleSOSModal(true))}
            className="btn-danger py-3 px-5 text-base font-bold shadow-md shadow-rose-600/20"
          >
            <AlertTriangle className="w-5 h-5" />
            <span>SOS</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interactive Map Column */}
        <div className="lg:col-span-2 space-y-4">
          <MapContainer driverPos={driverPos} height="480px" />

          {/* Test Guardian Simulation Trigger */}
          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200 text-sm font-semibold">
            <span className="text-slate-600 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" /> AI Guardian Continuous Telemetry Monitor
            </span>
            <button
              onClick={handleSimulateDeviation}
              className="btn-secondary text-sm py-2 px-3 text-amber-700 bg-amber-50 border-amber-200"
            >
              Simulate Safety Check
            </button>
          </div>
        </div>

        {/* Sidebar Column: Driver Card & Guardian Log */}
        <div className="space-y-6">
          
          {/* Driver Card */}
          <div className="app-card p-6 rounded-3xl space-y-5">
            <div className="flex items-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150"
                alt="Driver"
                className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-500"
              />
              <div className="flex-1">
                <h4 className="font-bold text-slate-900 text-lg">Ananya Verma</h4>
                <p className="text-sm text-slate-500 font-medium">Tata Nexon EV • KA-01-EQ-9021</p>
                <div className="flex items-center gap-3 text-sm font-bold mt-1">
                  <span className="text-amber-600">4.95 ★</span>
                  <span className="text-emerald-600">Trust 96/100</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <a
                href="tel:+919876543211"
                className="btn-secondary text-sm py-3"
              >
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>Call Driver</span>
              </a>
              <button
                onClick={() => dispatch(toggleChatDrawer(true))}
                className="btn-primary text-sm py-3"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Live Chat</span>
              </button>
            </div>
          </div>

          {/* Ride Guardian Log */}
          <div className="app-card p-6 rounded-3xl space-y-4">
            <h4 className="font-bold text-sm text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" /> Ride Guardian Safety Log
            </h4>

            {safetyEventsLog.length === 0 ? (
              <EmptyState
                title="No Telemetry Events"
                description="GPS continuous position streaming active. No route anomalies detected."
                icon={ShieldCheck}
              />
            ) : (
              <div className="space-y-2 max-h-52 overflow-y-auto text-sm">
                {safetyEventsLog.map((log) => (
                  <div key={log.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-start gap-2">
                    <span className="text-xs font-mono text-slate-400 shrink-0">{log.time}</span>
                    <p className={`text-slate-700 font-medium ${log.status === 'emergency' ? 'text-rose-600 font-bold' : log.status === 'warning' ? 'text-amber-600' : ''}`}>
                      {log.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
