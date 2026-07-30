import React from 'react';
import { Award, ShieldCheck, Star, Moon, Zap, CheckCircle2 } from 'lucide-react';

export default function AchievementBadges({ completedRides = 48, rating = 4.9 }) {
  const badges = [
    {
      id: 1,
      title: '100 Trips Club',
      desc: 'Completed 100+ community rides',
      icon: Award,
      unlocked: completedRides >= 100,
      color: 'bg-amber-100 text-amber-800 border-amber-300'
    },
    {
      id: 2,
      title: 'Safe Driver Guard',
      desc: 'Maintained 95%+ safety score',
      icon: ShieldCheck,
      unlocked: true,
      color: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    },
    {
      id: 3,
      title: 'Top Rated Driver',
      desc: 'Achieved 4.8+ passenger rating',
      icon: Star,
      unlocked: rating >= 4.8,
      color: 'bg-amber-100 text-amber-800 border-amber-300'
    },
    {
      id: 4,
      title: 'Zero Cancellation',
      desc: '0 cancellations in last 30 days',
      icon: Zap,
      unlocked: true,
      color: 'bg-blue-100 text-blue-800 border-blue-300'
    },
    {
      id: 5,
      title: 'Night Shift Commuter',
      desc: 'Provided verified late-night rides',
      icon: Moon,
      unlocked: true,
      color: 'bg-purple-100 text-purple-800 border-purple-300'
    }
  ];

  return (
    <div className="app-card p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          <h4 className="font-extrabold text-slate-900 text-lg">Achievement Badges</h4>
        </div>
        <span className="text-xs font-bold text-slate-500">
          {badges.filter(b => b.unlocked).length}/{badges.length} Unlocked
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {badges.map((b) => {
          const Icon = b.icon;
          return (
            <div 
              key={b.id}
              className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
                b.unlocked ? b.color : 'bg-slate-50 border-slate-200 opacity-50 grayscale'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <h5 className="font-extrabold text-xs text-slate-900">{b.title}</h5>
                  {b.unlocked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                </div>
                <p className="text-[10px] font-semibold text-slate-600 line-clamp-1">{b.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
