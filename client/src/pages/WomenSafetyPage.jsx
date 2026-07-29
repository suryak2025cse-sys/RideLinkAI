import React from 'react';
import { Shield, Sparkles, CheckCircle2, PhoneCall, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function WomenSafetyPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="app-card p-8 rounded-3xl border border-pink-200 bg-gradient-to-r from-pink-50 via-white to-purple-50 space-y-4">
        <div className="inline-flex items-center gap-2 bg-pink-100 border border-pink-200 text-pink-800 px-4 py-1.5 rounded-full text-sm font-bold">
          <Shield className="w-4 h-4 text-pink-600" /> Exclusive Women Safety Portal
        </div>
        <h2 className="text-3xl font-black text-slate-900">Women-Only Community Rides</h2>
        <p className="text-base text-slate-600 max-w-2xl leading-relaxed">
          Ride with verified female drivers and passengers. Featuring priority AI matching, verified female badges, 24/7 continuous Guardian telemetry monitoring, and instant emergency escalation.
        </p>

        <button
          onClick={() => navigate('/passenger?womenOnly=true')}
          className="bg-pink-600 hover:bg-pink-700 text-white font-bold text-base px-6 py-3.5 rounded-2xl shadow-md shadow-pink-600/20 flex items-center gap-2 active:scale-95 transition-all"
        >
          <span>Explore Available Women-Only Rides</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Safety Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="app-card p-8 rounded-3xl space-y-4 border border-pink-100">
          <div className="w-14 h-14 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-600">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Verified Female Drivers</h3>
          <p className="text-base text-slate-600 leading-relaxed">
            Strict Aadhaar & Driver License background verification for all drivers operating on Women Safety Mode.
          </p>
        </div>

        <div className="app-card p-8 rounded-3xl space-y-4 border border-pink-100">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
            <Sparkles className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Priority AI Matching</h3>
          <p className="text-base text-slate-600 leading-relaxed">
            Our AI matching engine prioritizes high Trust Scores (&gt;90) and same-campus female commuter circles.
          </p>
        </div>

        <div className="app-card p-8 rounded-3xl space-y-4 border border-pink-100">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
            <PhoneCall className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Emergency SOS Escalation</h3>
          <p className="text-base text-slate-600 leading-relaxed">
            Single-tap emergency SOS button automatically pings designated contacts, platform safety leads, and live location coordinates.
          </p>
        </div>
      </div>

    </div>
  );
}
