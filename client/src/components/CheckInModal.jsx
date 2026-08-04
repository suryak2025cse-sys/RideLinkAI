import React, { useState, useEffect } from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle2, Clock, PhoneCall } from 'lucide-react';
import API from '../services/api';

export default function CheckInModal({ rideId, distanceMeters = 650, timeoutSeconds = 90, onResolved }) {
  const [timeLeft, setTimeLeft] = useState(timeoutSeconds);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleRespond = async (responseType) => {
    setSubmitting(true);
    try {
      const res = await API.post(`/rides/${rideId}/checkin`, { response: responseType });
      if (onResolved) {
        onResolved(res.data?.checkInStatus || (responseType === 'ok' ? 'confirmed' : 'unresponsive'));
      }
    } catch (err) {
      if (onResolved) {
        onResolved(responseType === 'ok' ? 'confirmed' : 'unresponsive');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in-95">
      <div className="bg-white border-4 border-rose-500 rounded-4xl max-w-lg w-full p-8 shadow-2xl space-y-6 text-center relative overflow-hidden">
        
        {/* Glowing Alert Pulsing Ring */}
        <div className="w-24 h-24 rounded-full bg-rose-100 border-4 border-rose-500 flex items-center justify-center mx-auto text-rose-600 animate-bounce shadow-lg">
          <ShieldAlert className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <span className="bg-rose-100 text-rose-800 font-black px-4 py-1.5 rounded-full text-xs tracking-wider uppercase border border-rose-300">
            ⚠️ ROUTE DEVIATION DETECTED ({distanceMeters}m OFF-ROUTE)
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight pt-2">
            Are You OK?
          </h2>
          <p className="text-base font-semibold text-slate-600">
            We noticed your ride went off the planned route. Please verify your safety.
          </p>
        </div>

        {/* Countdown Timer Display */}
        <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between px-6 border border-slate-800">
          <div className="flex items-center gap-2 text-rose-400 font-extrabold text-sm">
            <Clock className="w-5 h-5 animate-pulse" />
            <span>Auto Emergency Escalation In:</span>
          </div>
          <span className="font-mono text-3xl font-black text-amber-400">
            {timeLeft > 0 ? `${timeLeft}s` : '0s'}
          </span>
        </div>

        {/* Large Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            onClick={() => handleRespond('ok')}
            disabled={submitting}
            className="w-full py-5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xl shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 transition-transform active:scale-98"
          >
            <CheckCircle2 className="w-7 h-7" />
            <span>I'M OK — ON ROUTE</span>
          </button>

          <button
            onClick={() => handleRespond('help')}
            disabled={submitting}
            className="w-full py-5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xl shadow-lg shadow-rose-600/40 flex items-center justify-center gap-2 transition-transform active:scale-98"
          >
            <AlertTriangle className="w-7 h-7" />
            <span>I NEED HELP — TRIGGER EMERGENCY</span>
          </button>
        </div>

        <p className="text-xs text-slate-400 font-bold">
          If unresponsive when countdown reaches 0s, an automated voice call and SMS with live GPS will be sent to your primary emergency contact.
        </p>

      </div>
    </div>
  );
}
