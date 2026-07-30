import React from 'react';
import { Sparkles, TrendingUp, Compass, Fuel, Clock, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function AIRideAcceptanceCard({ 
  rideScore = 94, 
  estimatedProfit = 180, 
  extraDistanceKm = 1.3, 
  fuelCostInr = 22, 
  pickupTimeMin = 4,
  recommendation = "✅ Highly Recommended",
  onAccept,
  onReject
}) {
  return (
    <div className="app-card p-6 rounded-3xl bg-white border border-amber-300 shadow-lg space-y-5">
      {/* Header Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="bg-amber-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" /> AI ACCEPTANCE SCORE
          </span>
          <span className="bg-emerald-100 text-emerald-800 font-extrabold text-xs px-3 py-1 rounded-full border border-emerald-200">
            {recommendation}
          </span>
        </div>

        <div className="text-right">
          <span className="text-3xl font-black text-slate-900">{rideScore}</span>
          <span className="text-xs text-slate-500 font-bold block">/100 Score</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
        <div>
          <span className="text-slate-400 font-bold uppercase tracking-wider block">NET PROFIT</span>
          <span className="text-emerald-700 font-black text-lg flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-emerald-600" /> ₹{estimatedProfit}
          </span>
        </div>

        <div>
          <span className="text-slate-400 font-bold uppercase tracking-wider block">EXTRA DISTANCE</span>
          <span className="text-slate-900 font-extrabold text-lg flex items-center gap-1">
            <Compass className="w-4 h-4 text-blue-600" /> +{extraDistanceKm} km
          </span>
        </div>

        <div>
          <span className="text-slate-400 font-bold uppercase tracking-wider block">FUEL COST</span>
          <span className="text-rose-600 font-extrabold text-lg flex items-center gap-1">
            <Fuel className="w-4 h-4 text-rose-500" /> ₹{fuelCostInr}
          </span>
        </div>

        <div>
          <span className="text-slate-400 font-bold uppercase tracking-wider block">PICKUP TIME</span>
          <span className="text-amber-700 font-extrabold text-lg flex items-center gap-1">
            <Clock className="w-4 h-4 text-amber-600" /> {pickupTimeMin} min
          </span>
        </div>
      </div>

      {/* Action Controls */}
      {(onAccept || onReject) && (
        <div className="flex items-center gap-3 pt-1">
          {onReject && (
            <button
              onClick={onReject}
              type="button"
              className="btn-secondary flex-1 py-3 text-xs font-bold"
            >
              Decline Request
            </button>
          )}
          {onAccept && (
            <button
              onClick={onAccept}
              type="button"
              className="btn-primary flex-1 py-3 text-xs font-black shadow-rapido-yellow text-slate-950"
            >
              Accept Ride (₹{estimatedProfit} Profit)
            </button>
          )}
        </div>
      )}
    </div>
  );
}
