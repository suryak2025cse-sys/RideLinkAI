import React from 'react';
import { Shield, Lock, AlertTriangle, Users, Heart, ArrowRight } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { toggleSOSModal } from '../redux/safetySlice';

export default function WomenSafetyPage() {
  const dispatch = useDispatch();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="app-card p-8 rounded-3xl border border-pink-200 bg-gradient-to-r from-pink-50 via-white to-amber-50 space-y-4">
        <div className="inline-flex items-center gap-2 bg-pink-100 border border-pink-200 text-pink-800 px-4 py-1.5 rounded-full text-sm font-extrabold">
          <Shield className="w-4 h-4 text-pink-600" /> Women Safety Guard System
        </div>
        <h2 className="text-3xl font-black text-slate-900">Women-Only Community Rides</h2>
        <p className="text-base text-slate-600 max-w-2xl leading-relaxed font-semibold">
          RideLink AI provides female commuters with verified female drivers, real-time Audio SOS monitoring, emergency contact alerts, and gender-restricted matching.
        </p>
        <button
          onClick={() => dispatch(toggleSOSModal(true))}
          className="btn-danger py-3 px-6 text-sm font-black uppercase tracking-wider flex items-center gap-2"
        >
          <AlertTriangle className="w-4 h-4" /> Trigger Emergency SOS
        </button>
      </div>

      {/* Safety Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="app-card p-6 rounded-3xl space-y-3 bg-white">
          <div className="w-12 h-12 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center font-black">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-xl text-slate-900">Female-Only Matching</h3>
          <p className="text-sm font-semibold text-slate-500">
            Passholders can restrict ride searches exclusively to verified female drivers and female co-passengers.
          </p>
        </div>

        <div className="app-card p-6 rounded-3xl space-y-3 bg-white">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-black">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-xl text-slate-900">1-Tap Emergency SOS</h3>
          <p className="text-sm font-semibold text-slate-500">
            Instantly alerts police desk, campus security hotline, and emergency contact numbers with live GPS location.
          </p>
        </div>

        <div className="app-card p-6 rounded-3xl space-y-3 bg-white">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-xl text-slate-900">College & Corporate Verification</h3>
          <p className="text-sm font-semibold text-slate-500">
            Every user is verified via institutional email, Aadhaar ID, and official organization credentials.
          </p>
        </div>
      </div>

    </div>
  );
}
