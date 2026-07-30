import React from 'react';
import { useDispatch } from 'react-redux';
import { ShieldCheck, Star, Users, Clock, ArrowRight, Sparkles, CheckCircle2, MessageSquare, Phone } from 'lucide-react';
import { toggleChatDrawer, setActiveRecipient } from '../redux/chatSlice';

export default function MatchCard({ ride, match, onBook, onBookRide, booking }) {
  const dispatch = useDispatch();
  const activeRide = ride || match || {};
  const driver = activeRide.driverDetails || {};
  const score = activeRide.matchScore || 94.5;
  const badge = activeRide.matchBadge || 'Best Match';
  const handleBook = onBook || onBookRide || (() => {});

  const handleOpenChat = () => {
    dispatch(setActiveRecipient({
      name: driver.name || 'Surya K (Driver)',
      phone: driver.phone || '+91 9025953166',
      rideId: activeRide._id
    }));
    dispatch(toggleChatDrawer(true));
  };

  return (
    <div className="app-card app-card-hover p-6 rounded-3xl flex flex-col justify-between gap-5 relative overflow-hidden bg-white border border-slate-200 shadow-sm">
      {/* Top AI Match Badge & Price */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="bg-amber-100 border border-amber-300 text-slate-950 font-black text-xs px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            {badge} ({score}%)
          </span>
          {activeRide.isWomenOnly && (
            <span className="bg-pink-50 border border-pink-200 text-pink-700 font-extrabold text-xs px-3 py-1 rounded-full">
              Women-Only
            </span>
          )}
        </div>

        <div className="text-right">
          <span className="text-2xl font-black text-slate-900">₹{activeRide.pricePerSeat ?? 0}</span>
          <span className="text-xs text-slate-500 block font-bold">/ seat</span>
        </div>
      </div>

      {/* Driver Info & Phone Contact */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={driver.profilePicture || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150'}
            alt={driver.name || 'Driver'}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-200 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-extrabold text-slate-900 text-base">{driver.name || 'Surya K'}</h4>
              <CheckCircle2 className="w-4 h-4 text-amber-500 fill-amber-400" />
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600 mt-0.5 font-semibold">
              <span className="flex items-center gap-1 text-amber-600 font-black">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> {driver.rating || 4.9}
              </span>
              <span className="flex items-center gap-1 text-emerald-700 font-bold">
                <ShieldCheck className="w-4 h-4" /> Trust {driver.trustScore || 96}/100
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-bold mt-1">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>{driver.phone || '+91 9025953166'}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleOpenChat}
          className="bg-slate-100 hover:bg-slate-200 text-slate-900 font-extrabold px-3.5 py-2.5 rounded-2xl text-xs flex items-center gap-1.5 border border-slate-200 shadow-sm"
          title="Open Driver Chat"
        >
          <MessageSquare className="w-4 h-4 text-amber-600" />
          <span>Chat Driver</span>
        </button>
      </div>

      {/* Route & Timing Details */}
      <div className="space-y-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-sm">
        <div className="flex items-start gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
          <div>
            <p className="text-slate-400 text-[11px] font-black uppercase tracking-wider">PICKUP</p>
            <p className="font-extrabold text-slate-900 text-base">{activeRide.originName || 'Main Campus Pickup'}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></div>
          <div>
            <p className="text-slate-400 text-[11px] font-black uppercase tracking-wider">DESTINATION DROP</p>
            <p className="font-extrabold text-slate-900 text-base">{activeRide.destName || 'Central Hub Drop'}</p>
          </div>
        </div>
      </div>

      {/* Footer Details & Action Button */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <div className="flex items-center gap-4 text-sm text-slate-700 font-bold">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-600" /> {activeRide.departureTime || '09:30 AM'}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-emerald-600" /> {activeRide.availableSeats ?? 3} seats left
          </span>
        </div>

        <button
          onClick={() => {
            handleBook(activeRide);
            handleOpenChat();
          }}
          disabled={booking}
          className="btn-primary py-2.5 px-5 text-sm shadow-rapido-yellow text-slate-950 font-black rounded-2xl"
        >
          <span>{booking ? 'Booking...' : 'Book Ride & Chat'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
