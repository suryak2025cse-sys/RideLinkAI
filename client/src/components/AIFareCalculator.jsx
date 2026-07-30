import React, { useState } from 'react';
import { Calculator, Sparkles, TrendingUp, CloudRain, ShieldCheck, HelpCircle } from 'lucide-react';

export default function AIFareCalculator({ 
  distanceKm = 8.5, 
  baseFare = 30, 
  onFareSelect 
}) {
  const [trafficMultiplier, setTrafficMultiplier] = useState(1.2);
  const [weatherMultiplier, setWeatherMultiplier] = useState(1.0);
  const [demandMultiplier, setDemandMultiplier] = useState(1.15);

  const fuelCost = Math.round(distanceKm * 2.8);
  const calculatedFare = Math.round((baseFare + (distanceKm * 10)) * trafficMultiplier * weatherMultiplier * demandMultiplier);
  const confidencePct = 96;

  return (
    <div className="app-card p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-amber-500" />
          <h4 className="font-extrabold text-slate-900 text-lg">Dynamic AI Fare Recommender</h4>
        </div>
        <span className="bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> {confidencePct}% Confidence
        </span>
      </div>

      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">RECOMMENDED FARE</span>
          <span className="text-3xl font-black text-slate-900">₹{calculatedFare}</span>
        </div>
        <span className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-xl">
          ~ ₹{Math.round(calculatedFare / distanceKm)} / km
        </span>
      </div>

      {/* Dynamic Breakdown */}
      <div className="space-y-2 text-xs font-semibold text-slate-600">
        <div className="flex justify-between border-b border-slate-100 pb-1.5">
          <span>Base Minimum Fare</span>
          <span className="font-bold text-slate-900">₹{baseFare}</span>
        </div>
        <div className="flex justify-between border-b border-slate-100 pb-1.5">
          <span>Distance Traveled ({distanceKm} km)</span>
          <span className="font-bold text-slate-900">₹{Math.round(distanceKm * 10)}</span>
        </div>
        <div className="flex justify-between border-b border-slate-100 pb-1.5">
          <span>Fuel Cost Estimate</span>
          <span className="font-bold text-rose-600">₹{fuelCost}</span>
        </div>
        <div className="flex justify-between border-b border-slate-100 pb-1.5">
          <span>Traffic & Demand Multiplier</span>
          <span className="font-bold text-amber-600">{(demandMultiplier * trafficMultiplier).toFixed(2)}x Surge</span>
        </div>
      </div>

      {onFareSelect && (
        <button
          onClick={() => onFareSelect(calculatedFare)}
          className="btn-primary w-full py-3 text-xs font-black shadow-rapido-yellow text-slate-950"
        >
          Apply Recommended Fare (₹{calculatedFare})
        </button>
      )}
    </div>
  );
}
