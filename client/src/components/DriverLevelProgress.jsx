import React from 'react';
import { Award, Shield, Star, Trophy, Sparkles } from 'lucide-react';

export default function DriverLevelProgress({ 
  completedRides = 48, 
  driverRating = 4.9,
  acceptanceRatePct = 96
}) {
  // Levels: Bronze (<20), Silver (20-50), Gold (50-100), Diamond (100-250), Elite (250+)
  let currentLevel = 'Bronze';
  let nextLevel = 'Silver';
  let minRides = 0;
  let maxRides = 20;
  let badgeColor = 'bg-amber-100 text-amber-800 border-amber-300';

  if (completedRides >= 250) {
    currentLevel = 'Elite';
    nextLevel = 'Legend';
    minRides = 250;
    maxRides = 500;
    badgeColor = 'bg-purple-100 text-purple-900 border-purple-300';
  } else if (completedRides >= 100) {
    currentLevel = 'Diamond';
    nextLevel = 'Elite';
    minRides = 100;
    maxRides = 250;
    badgeColor = 'bg-cyan-100 text-cyan-900 border-cyan-300';
  } else if (completedRides >= 50) {
    currentLevel = 'Gold';
    nextLevel = 'Diamond';
    minRides = 50;
    maxRides = 100;
    badgeColor = 'bg-amber-300 text-slate-950 border-amber-400';
  } else if (completedRides >= 20) {
    currentLevel = 'Silver';
    nextLevel = 'Gold';
    minRides = 20;
    maxRides = 50;
    badgeColor = 'bg-slate-200 text-slate-900 border-slate-300';
  }

  const progressPct = Math.min(100, Math.max(0, ((completedRides - minRides) / (maxRides - minRides)) * 100));

  return (
    <div className="app-card p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-sm">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-slate-900 text-lg">Driver Level Tier</h4>
              <span className={`px-3 py-0.5 rounded-full text-xs font-black border ${badgeColor}`}>
                {currentLevel} Tier
              </span>
            </div>
            <p className="text-xs text-slate-500 font-bold mt-0.5">
              {completedRides} Rides Completed • {driverRating} ★ Rating
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-bold text-slate-600">
          <span>{currentLevel} Level</span>
          <span>{maxRides - completedRides} rides to {nextLevel}</span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200 p-0.5">
          <div 
            className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500" 
            style={{ width: `${progressPct}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
