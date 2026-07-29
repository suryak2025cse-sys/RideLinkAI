import React, { useState, useEffect } from 'react';
import { Leaf, Fuel, Trees, Share2, RefreshCw } from 'lucide-react';
import API from '../services/api';

export default function CarbonDashboardPage() {
  const [co2Saved, setCo2Saved] = useState(0);
  const [fuelSaved, setFuelSaved] = useState(0);
  const [sharedTrips, setSharedTrips] = useState(0);
  const [treesEquivalent, setTreesEquivalent] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchEcoImpact = async () => {
    try {
      const res = await API.get('/admin/analytics');
      if (res.data && res.data.stats) {
        const ridesCount = res.data.stats.totalCompletedRides || 0;
        setSharedTrips(ridesCount);
        setCo2Saved((ridesCount * 2.8).toFixed(1));
        setFuelSaved((ridesCount * 1.2).toFixed(1));
        setTreesEquivalent(Math.round(ridesCount * 0.15));
      }
    } catch (err) {
      console.log('[Eco Impact]: Calculating metrics from completed trips');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEcoImpact();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="app-card p-8 rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-blue-50 space-y-3">
        <div className="inline-flex items-center gap-2 bg-emerald-100 border border-emerald-200 text-emerald-800 px-4 py-1.5 rounded-full text-sm font-bold">
          <Leaf className="w-4 h-4 text-emerald-600" /> Environmental Sustainability Impact
        </div>
        <h2 className="text-3xl font-black text-slate-900">Carbon Impact Dashboard</h2>
        <p className="text-base text-slate-600 max-w-2xl leading-relaxed">
          RideLink AI commuters reduce fuel consumption, greenhouse gas emissions, and urban traffic congestion by pooling last-mile campus and corporate rides.
        </p>
      </div>

      {/* Metric Cards Grid - Defaults to 0 and calculates based on travel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="app-card p-6 rounded-3xl space-y-2">
          <div className="flex items-center justify-between text-blue-600">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Fuel Saved</span>
            <Fuel className="w-6 h-6" />
          </div>
          <p className="text-3xl font-black text-slate-900">{fuelSaved} L</p>
          <p className="text-sm text-emerald-600 font-semibold">Calculated from pooled trips</p>
        </div>

        <div className="app-card p-6 rounded-3xl space-y-2">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">CO₂ Offset</span>
            <Leaf className="w-6 h-6" />
          </div>
          <p className="text-3xl font-black text-slate-900">{co2Saved} kg</p>
          <p className="text-sm text-emerald-600 font-semibold">Net CO₂ Reduction</p>
        </div>

        <div className="app-card p-6 rounded-3xl space-y-2">
          <div className="flex items-center justify-between text-purple-600">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Shared Trips</span>
            <Share2 className="w-6 h-6" />
          </div>
          <p className="text-3xl font-black text-slate-900">{sharedTrips}</p>
          <p className="text-sm text-blue-600 font-semibold">Completed Commutes</p>
        </div>

        <div className="app-card p-6 rounded-3xl space-y-2">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Trees Equivalent</span>
            <Trees className="w-6 h-6" />
          </div>
          <p className="text-3xl font-black text-slate-900">{treesEquivalent} 🌲</p>
          <p className="text-sm text-amber-600 font-semibold">Eco Impact Milestone</p>
        </div>
      </div>

    </div>
  );
}
