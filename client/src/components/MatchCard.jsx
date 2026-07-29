import React from 'react';
import { ShieldCheck, Star, Users, MapPin, Clock, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MatchCard({ ride, onBook }) {
  const driver = ride.driverDetails || {};
  const score = ride.matchScore || 92;
  const badge = ride.matchBadge || 'Best Match';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="app-card app-card-hover p-6 rounded-2xl flex flex-col justify-between gap-5 relative overflow-hidden"
    >
      {/* Top AI Match Badge & Price */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="bg-blue-50 border border-blue-200 text-blue-700 font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            {badge} ({score}%)
          </span>
          {ride.isWomenOnly && (
            <span className="bg-pink-50 border border-pink-200 text-pink-700 font-bold text-xs px-3 py-1 rounded-full">
              Women-Only
            </span>
          )}
        </div>

        <div className="text-right">
          <span className="text-2xl font-black text-slate-900">₹{ride.pricePerSeat}</span>
          <span className="text-xs text-slate-500 block font-medium">/ seat</span>
        </div>
      </div>

      {/* Driver Info */}
      <div className="flex items-center gap-4">
        <img
          src={driver.profilePicture || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150'}
          alt={driver.name || 'Driver'}
          className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-200 shadow-sm"
        />
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <h4 className="font-bold text-slate-900 text-base">{driver.name || 'Verified Driver'}</h4>
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-500 mt-1 font-medium">
            <span className="flex items-center gap-1 text-amber-600 font-bold">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> {driver.rating || 4.9}
            </span>
            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
              <ShieldCheck className="w-4 h-4" /> Trust {driver.trustScore || 96}/100
            </span>
          </div>
        </div>
      </div>

      {/* Route & Timing Details */}
      <div className="space-y-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-sm">
        <div className="flex items-start gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
          <div>
            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">PICKUP</p>
            <p className="font-semibold text-slate-800 text-base">{ride.originName}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></div>
          <div>
            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">DESTINATION DROP</p>
            <p className="font-semibold text-slate-800 text-base">{ride.destName}</p>
          </div>
        </div>
      </div>

      {/* Footer Details & Action Button */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <div className="flex items-center gap-4 text-sm text-slate-600 font-medium">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-blue-600" /> 09:30 AM
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-emerald-600" /> {ride.availableSeats} seats left
          </span>
        </div>

        <button
          onClick={() => onBook(ride)}
          className="btn-primary py-2.5 px-5 text-sm"
        >
          <span>Book Ride</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
