import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ShieldCheck, AlertCircle, CheckCircle, PhoneCall } from 'lucide-react';
import { toggleSafetyCheckPopup, toggleSOSModal, addSafetyLog } from '../redux/safetySlice';

export default function SafetyCheckModal() {
  const { isSafetyCheckPopupOpen } = useSelector((state) => state.safety);
  const dispatch = useDispatch();

  if (!isSafetyCheckPopupOpen) return null;

  const handleConfirmSafe = () => {
    dispatch(toggleSafetyCheckPopup(false));
    dispatch(addSafetyLog({
      id: `safe_${Date.now()}`,
      time: new Date().toLocaleTimeString(),
      text: 'Rider confirmed safe after route check prompt.',
      status: 'normal'
    }));
  };

  const handleTriggerSOSFromCheck = () => {
    dispatch(toggleSafetyCheckPopup(false));
    dispatch(toggleSOSModal(true));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-amber-200 rounded-3xl max-w-md w-full p-8 shadow-2xl space-y-5 text-center">
        <div className="w-16 h-16 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center mx-auto text-amber-600 animate-bounce">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div>
          <h4 className="text-2xl font-bold text-slate-900">Ride Guardian Safety Check</h4>
          <p className="text-base text-slate-600 mt-1 leading-relaxed">
            Our AI detected a 5-minute stationary stop or minor route divergence. Are you safe?
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <button
            onClick={handleConfirmSafe}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-2xl text-base flex items-center justify-center gap-2 shadow-sm"
          >
            <CheckCircle className="w-5 h-5" />
            <span>I'm Safe - Continue Ride</span>
          </button>
          
          <button
            onClick={handleTriggerSOSFromCheck}
            className="btn-danger w-full text-base py-3"
          >
            <PhoneCall className="w-5 h-5" />
            <span>No, I Need Assistance / SOS</span>
          </button>
        </div>
      </div>
    </div>
  );
}
