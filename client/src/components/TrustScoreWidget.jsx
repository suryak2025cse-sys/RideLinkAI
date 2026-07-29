import React from 'react';
import { ShieldCheck, Award, CheckCircle, AlertTriangle } from 'lucide-react';

export default function TrustScoreWidget({ trustScore = 94, trustBadge = "Highly Trusted", breakdown }) {
  const details = breakdown || {
    verifications: 25,
    ratings: 15,
    completionHistory: 14,
    cancellationPenalty: 0,
    safetyPenalty: 0
  };

  return (
    <div className="app-card p-6 rounded-2xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-base text-slate-900">AI Trust Score</h4>
            <p className="text-sm text-emerald-600 font-semibold">{trustBadge}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-3xl font-black text-slate-900">{trustScore}</span>
          <span className="text-sm text-slate-500 font-medium"> / 100</span>
        </div>
      </div>

      {/* Trust Score Progress Bar */}
      <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200">
        <div
          className="h-full bg-blue-600 rounded-full transition-all duration-500"
          style={{ width: `${trustScore}%` }}
        ></div>
      </div>

      {/* Breakdown Factors */}
      <div className="grid grid-cols-2 gap-2 text-xs pt-1">
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 flex items-center justify-between">
          <span className="text-slate-500 font-medium">ID Verifications</span>
          <span className="text-emerald-600 font-bold">+{details.verifications} pts</span>
        </div>
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 flex items-center justify-between">
          <span className="text-slate-500 font-medium">User Ratings</span>
          <span className="text-emerald-600 font-bold">+{details.ratings} pts</span>
        </div>
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 flex items-center justify-between">
          <span className="text-slate-500 font-medium">Ride History</span>
          <span className="text-emerald-600 font-bold">+{details.completionHistory} pts</span>
        </div>
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 flex items-center justify-between">
          <span className="text-slate-500 font-medium">Cancellation Penalty</span>
          <span className="text-slate-700 font-bold">-{details.cancellationPenalty} pts</span>
        </div>
      </div>
    </div>
  );
}
