import React from 'react';
import { Leaf, Fuel, Trees, Share2 } from 'lucide-react';

export default function CarbonDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="app-card p-8 rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-blue-50 space-y-3">
        <div className="inline-flex items-center gap-2 bg-emerald-100 border border-emerald-200 text-emerald-800 px-4 py-1.5 rounded-full text-sm font-bold">
          <Leaf className="w-4 h-4 text-emerald-600" /> Environmental Sustainability Impact
        </div>
        <h2 className="text-3xl font-black text-slate-900">Carbon Impact Dashboard</h2>
        <p className="text-base text-slate-600 max-w-2xl leading-relaxed">
          RideLink AI commuters collectively reduce fuel consumption, greenhouse gas emissions, and urban traffic congestion by pooling last-mile campus and corporate rides.
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="app-card p-6 rounded-3xl space-y-2">
          <div className="flex items-center justify-between text-blue-600">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Fuel Saved</span>
            <Fuel className="w-6 h-6" />
          </div>
          <p className="text-3xl font-black text-slate-900">1,840 L</p>
          <p className="text-sm text-emerald-600 font-semibold">+18% this month</p>
        </div>

        <div className="app-card p-6 rounded-3xl space-y-2">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">CO₂ Offset</span>
            <Leaf className="w-6 h-6" />
          </div>
          <p className="text-3xl font-black text-slate-900">4,620 kg</p>
          <p className="text-sm text-emerald-600 font-semibold">Equal to 220 trees</p>
        </div>

        <div className="app-card p-6 rounded-3xl space-y-2">
          <div className="flex items-center justify-between text-purple-600">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Shared Trips</span>
            <Share2 className="w-6 h-6" />
          </div>
          <p className="text-3xl font-black text-slate-900">3,890</p>
          <p className="text-sm text-blue-600 font-semibold">Campus & Corporate</p>
        </div>

        <div className="app-card p-6 rounded-3xl space-y-2">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Trees Equivalent</span>
            <Trees className="w-6 h-6" />
          </div>
          <p className="text-3xl font-black text-slate-900">220 🌲</p>
          <p className="text-sm text-amber-600 font-semibold">Platform Milestone</p>
        </div>
      </div>

    </div>
  );
}
