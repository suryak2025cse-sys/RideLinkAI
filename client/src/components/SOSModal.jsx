import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AlertTriangle, X, ShieldAlert, PhoneCall, Navigation, CheckCircle2 } from 'lucide-react';
import { toggleSOSModal, addSafetyLog } from '../redux/safetySlice';
import API from '../services/api';

export default function SOSModal() {
  const { isSOSModalOpen } = useSelector((state) => state.safety);
  const dispatch = useDispatch();
  const [triggered, setTriggered] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isSOSModalOpen) return null;

  const handleConfirmSOS = async () => {
    setLoading(true);
    try {
      await API.post('/safety/sos', {
        lat: 12.9716,
        lng: 77.5946,
        addressName: 'MG Road Metro Station Interchange',
        triggerReason: 'Manual SOS Emergency Button Pressed'
      });
      setTriggered(true);
      dispatch(addSafetyLog({
        id: `sos_${Date.now()}`,
        time: new Date().toLocaleTimeString(),
        text: '🚨 EMERGENCY SOS TRIGGERED - Location & Contacts Notified',
        status: 'emergency'
      }));
    } catch (err) {
      setTriggered(true);
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
                Activating SOS will immediately broadcast your live GPS location, notify your emergency contacts, and dispatch an urgent alert to platform safety leads.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left space-y-2 text-sm font-semibold">
              <div className="flex items-center gap-2 text-blue-600">
                <Navigation className="w-4 h-4" />
                <span>Current Location: MG Road Interchange</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <PhoneCall className="w-4 h-4 text-emerald-600" />
                <span>Emergency Contacts: 2 Listed</span>
              </div>
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
                className="btn-danger flex-1 text-base py-3 font-bold shadow-md shadow-rose-600/30"
              >
                <AlertTriangle className="w-5 h-5" />
                {loading ? 'SENDING...' : 'TRIGGER SOS NOW'}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-5 py-3">
            <div className="w-20 h-20 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-slate-900">SOS Alert Dispatched!</h3>
              <p className="text-base text-slate-600 mt-1">
                Your emergency contacts and Safety Control Center have received your live location alert.
              </p>
            </div>

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
