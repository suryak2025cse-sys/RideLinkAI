import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Shield, Car, Users, Leaf, ArrowRight, MapPin, Clock, Search, CheckCircle, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');

  const handleSearchRides = (e) => {
    e.preventDefault();
    navigate(`/passenger?pickup=${encodeURIComponent(pickup)}&drop=${encodeURIComponent(drop)}`);
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative pt-12 lg:pt-20 px-4 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded-full text-sm font-semibold text-blue-700">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>AI-Powered Last-Mile Community Ride Sharing</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Smart Mobility for <br />
            <span className="text-blue-600">Campuses & Communities</span>
          </h1>

          <p className="text-slate-600 text-lg leading-relaxed max-w-2xl mx-auto">
            Connect with verified peers traveling your route. Experience AI ride matching, route optimization, real-time safety monitoring, and trust scoring.
          </p>

          {/* Quick AI Search Form */}
          <form onSubmit={handleSearchRides} className="app-card p-6 rounded-3xl space-y-4 text-left shadow-card border border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Pickup Location</label>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-emerald-600 shrink-0" />
                  <input
                    type="text"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    className="w-full bg-transparent text-base font-medium text-slate-800 focus:outline-none placeholder:text-slate-400"
                    placeholder="Enter campus gate or pickup spot..."
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Destination Drop</label>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-rose-600 shrink-0" />
                  <input
                    type="text"
                    value={drop}
                    onChange={(e) => setDrop(e.target.value)}
                    className="w-full bg-transparent text-base font-medium text-slate-800 focus:outline-none placeholder:text-slate-400"
                    placeholder="Enter tech park or metro drop..."
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full py-4 text-base font-bold shadow-md">
              <Search className="w-5 h-5" />
              <span>Find AI Recommended Rides</span>
            </button>
          </form>
        </motion.div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="app-card app-card-hover p-8 rounded-3xl space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Sparkles className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">AI Multi-Factor Matching</h3>
          <p className="text-base text-slate-600 leading-relaxed">
            Ranks candidate rides based on location distance, route overlap %, time compatibility, driver trust score, and personal preferences.
          </p>
        </div>

        <div className="app-card app-card-hover p-8 rounded-3xl space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <Shield className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Ride Guardian & Trust Score</h3>
          <p className="text-base text-slate-600 leading-relaxed">
            Continuous telemetry monitoring for route deviations, abnormal long stops, verified Aadhaar/College IDs, and instant emergency SOS.
          </p>
        </div>

        <div className="app-card app-card-hover p-8 rounded-3xl space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-600">
            <Users className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Women Safety & Community Modes</h3>
          <p className="text-base text-slate-600 leading-relaxed">
            Dedicated Women-Only rides with verified female drivers, campus domain verification (@univ.edu), and corporate commuter circles.
          </p>
        </div>
      </section>

      {/* Carbon Impact Banner */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="app-card p-8 rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-blue-50 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-emerald-700 font-bold text-sm">
              <Leaf className="w-4 h-4" /> Eco Impact Tracker
            </div>
            <h3 className="text-2xl font-black text-slate-900">4,620 kg CO₂ Saved Together</h3>
            <p className="text-base text-slate-600 max-w-xl">
              By pooling rides across university campuses and corporate parks, RideLink AI commuters have saved over 220 trees worth of carbon emissions this month.
            </p>
          </div>
          <Link to="/carbon-impact" className="btn-primary bg-emerald-600 hover:bg-emerald-700 text-white border-none text-base py-3 px-6 rounded-2xl shadow-sm whitespace-nowrap">
            <span>View Carbon Dashboard</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

    </div>
  );
}
