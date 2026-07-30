import React from 'react';
import { TrendingUp, Award, DollarSign, CheckCircle2, Fuel, Compass, Clock, Star } from 'lucide-react';
import DriverLevelProgress from '../components/DriverLevelProgress';
import AchievementBadges from '../components/AchievementBadges';
import DriverWalletCard from '../components/DriverWalletCard';

export default function DriverAnalyticsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Banner */}
      <div className="app-card p-8 rounded-3xl bg-white border border-slate-200 space-y-3">
        <div className="inline-flex items-center gap-2 bg-amber-100 text-slate-950 border border-amber-300 px-3.5 py-1 rounded-full text-xs font-black">
          <TrendingUp className="w-4 h-4 text-amber-600" /> DRIVER PERFORMANCE & EARNINGS ANALYTICS
        </div>
        <h2 className="text-3xl font-black text-slate-900">Smart Driver Dashboard</h2>
        <p className="text-base text-slate-600 font-semibold max-w-2xl">
          Track daily earnings, fuel expenditure, acceptance rates, driver levels, and community badges.
        </p>
      </div>

      {/* Main Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="app-card p-6 rounded-3xl bg-white border border-slate-200 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">TODAY'S EARNINGS</span>
          <p className="text-3xl font-black text-slate-900">₹680</p>
          <span className="text-xs text-emerald-600 font-bold">Net Profit: ₹540</span>
        </div>

        <div className="app-card p-6 rounded-3xl bg-white border border-slate-200 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">WEEKLY EARNINGS</span>
          <p className="text-3xl font-black text-slate-900">₹4,250</p>
          <span className="text-xs text-blue-600 font-bold">24 Rides Completed</span>
        </div>

        <div className="app-card p-6 rounded-3xl bg-white border border-slate-200 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">ACCEPTANCE RATE</span>
          <p className="text-3xl font-black text-slate-900">96.8%</p>
          <span className="text-xs text-emerald-600 font-bold">Top 5% Drivers</span>
        </div>

        <div className="app-card p-6 rounded-3xl bg-white border border-slate-200 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">CANCELLATION RATE</span>
          <p className="text-3xl font-black text-slate-900">0.8%</p>
          <span className="text-xs text-emerald-600 font-bold">Zero Cancellation Badge</span>
        </div>
      </div>

      {/* Driver Level & Wallet Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 space-y-6">
          <DriverLevelProgress completedRides={48} driverRating={4.9} acceptanceRatePct={96.8} />
          <AchievementBadges completedRides={48} rating={4.9} />
        </div>

        <div className="lg:col-span-6">
          <DriverWalletCard balance={450.0} />
        </div>
      </div>
    </div>
  );
}
