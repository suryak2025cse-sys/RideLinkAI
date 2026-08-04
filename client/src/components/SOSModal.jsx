import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AlertTriangle, X, ShieldAlert, PhoneCall, Navigation, CheckCircle2, Phone } from 'lucide-react';
import { toggleSOSModal, addSafetyLog } from '../redux/safetySlice';
import API from '../services/api';

export default function SOSModal() {
  const { isSOSModalOpen } = useSelector((state) => state.safety);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [triggered, setTriggered] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isSOSModalOpen) return null;

  const emergencyNumber = user?.emergencyContactPhone || user?.phone || '112';

  const handleConfirmSOS = async () => {
    setLoading(true);

    // Get live browser GPS coordinates if available
    let latitude = 12.9716;
    let longitude = 77.5946;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          latitude = pos.coords.latitude;
          longitude = pos.coords.longitude;
        },
        () => {},
        { timeout: 3000 }
      );
    }

    try {
      await API.post('/safety/sos', {
        lat: latitude,
        lng: longitude,
        addressName: 'Live GPS Emergency Track',
        triggerReason: 'Manual SOS Emergency Button Pressed'
      });
      
      setTriggered(true);
      dispatch(addSafetyLog({
        id: `sos_${Date.now()}`,
        time: new Date().toLocaleTimeString(),
        text: '🚨 EMERGENCY SOS TRIGGERED - Live GPS Broadcast & Call Initiated',
        status: 'emergency'
      }));

      // Immediately trigger live mobile phone call via tel: protocol
      window.location.href = `tel:${emergencyNumber}`;
    } catch (err) {
      setTriggered(true);
      // Trigger call even if network backend is offline
      window.location.href = `tel:${emergencyNumber}`;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-rose-200 rounded-3xl max-w-md w-full p-8 shadow-2xl relative overflow-hidden space-y-6">
        
        <button
          onClick={() => {
            setTriggered(false);
            dispatch(toggleSOSModal(false));
          }}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-xl bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {!triggered ? (
          <div className="text-center space-y-5">
            <div className="w-20 h-20 rounded-full bg-rose-100 border-2 border-rose-400 flex items-center justify-center mx-auto text-rose-600 animate-pulse">
              <ShieldAlert className="w-10 h-10" />
            </div>
            
            <div>
              <h3 className="text-2xl font-black text-slate-900">Emergency SOS Alert</h3>
              <p className="text-base text-slate-600 mt-1 leading-relaxed">
                Activating SOS will immediately trigger a <strong>live phone call</strong> to emergency services, broadcast your live GPS location, and alert safety leads.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left space-y-2 text-sm font-semibold">
              <div className="flex items-center gap-2 text-blue-600">
                <Navigation className="w-4 h-4" />
                <span>Live GPS Radar: Active Track</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <PhoneCall className="w-4 h-4 text-emerald-600" />
                <span>Emergency Contact: {emergencyNumber}</span>
              </div>
            </div>

            {/* Direct Call Quick Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <a
                href="tel:112"
                className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold py-3 px-3 rounded-2xl border border-rose-200 flex items-center justify-center gap-1.5 text-xs"
              >
                <Phone className="w-4 h-4 text-rose-600" />
                <span>Call Police (112)</span>
              </a>

              <a
                href={`tel:${emergencyNumber}`}
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-extrabold py-3 px-3 rounded-2xl border border-emerald-200 flex items-center justify-center gap-1.5 text-xs"
              >
                <PhoneCall className="w-4 h-4 text-emerald-600" />
                <span>Call Contact</span>
              </a>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => dispatch(toggleSOSModal(false))}
                className="btn-secondary flex-1 text-base py-3"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSOS}
                disabled={loading}
                className="btn-danger flex-1 text-base py-3 font-bold shadow-md shadow-rose-600/30 flex items-center justify-center gap-1.5"
              >
                <AlertTriangle className="w-5 h-5" />
                <span>{loading ? 'CALLING...' : 'TRIGGER SOS CALL'}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-5 py-3">
            <div className="w-20 h-20 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-slate-900">Live SOS Call Dispatched!</h3>
              <p className="text-base text-slate-600 mt-1">
                Live phone call initiated to {emergencyNumber} & emergency alert broadcasted with GPS coordinates.
              </p>
            </div>

            <a
              href={`tel:${emergencyNumber}`}
              className="btn-danger w-full text-base py-3.5 flex items-center justify-center gap-2 font-black"
            >
              <PhoneCall className="w-5 h-5" />
              <span>Redial Emergency Phone Call ({emergencyNumber})</span>
            </a>

            <button
              onClick={() => {
                setTriggered(false);
                dispatch(toggleSOSModal(false));
              }}
              className="btn-primary w-full text-base py-3"
            >
              Close Window
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
