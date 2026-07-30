import React from 'react';
import { Building, GraduationCap, Home, Users, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CommunityModesPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      <div className="app-card p-8 rounded-3xl bg-white space-y-3">
        <h2 className="text-3xl font-black text-slate-900">Community Mobility Modes</h2>
        <p className="text-base text-slate-600 font-semibold max-w-2xl">
          Connect with trusted commuters within your college campus, corporate tech park, or residential neighborhood.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Campus Mode */}
        <div className="app-card p-8 rounded-3xl space-y-4 bg-white hover:border-amber-400 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-black">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">Campus Mode</h3>
          <p className="text-sm font-semibold text-slate-500">
            Exclusive pool for university students & faculty. Ride between hostels, library, and campus gates.
          </p>
          <button
            onClick={() => navigate('/passenger')}
            className="btn-primary w-full py-3 text-sm font-black shadow-rapido-yellow"
          >
            <span>Explore Campus Rides</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Corporate Mode */}
        <div className="app-card p-8 rounded-3xl space-y-4 bg-white hover:border-amber-400 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-black">
            <Building className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">Corporate Mode</h3>
          <p className="text-sm font-semibold text-slate-500">
            Verified tech park commuters. Match rides with colleagues traveling on similar office shifts.
          </p>
          <button
            onClick={() => navigate('/passenger')}
            className="btn-primary w-full py-3 text-sm font-black shadow-rapido-yellow"
          >
            <span>Explore Corporate Rides</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Residential Mode */}
        <div className="app-card p-8 rounded-3xl space-y-4 bg-white hover:border-amber-400 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
            <Home className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">Residential Mode</h3>
          <p className="text-sm font-semibold text-slate-500">
            Gated community neighbor pools. Carpool to metro stations, markets, and IT hubs.
          </p>
          <button
            onClick={() => navigate('/passenger')}
            className="btn-primary w-full py-3 text-sm font-black shadow-rapido-yellow"
          >
            <span>Explore Gated Community</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}
