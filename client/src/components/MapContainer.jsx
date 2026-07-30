import React from 'react';
import { Navigation, MapPin } from 'lucide-react';

export default function MapContainer({ 
  driverPos = { lat: 12.9730, lng: 77.5960 }, 
  pickupPos = { lat: 12.9716, lng: 77.5946 }, 
  dropPos = { lat: 12.9800, lng: 77.6000 },
  height = "420px" 
}) {
  return (
    <div style={{ height }} className="w-full rounded-2xl overflow-hidden shadow-sm border border-slate-200 relative bg-slate-900 group">
      
      {/* Interactive Map Visual Mock with Live Radar Animation */}
      <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
      
      {/* Route Path Visual */}
      <svg className="absolute inset-0 w-full h-full stroke-amber-400 stroke-[3] stroke-dasharray-[8,8] opacity-80">
        <line x1="20%" y1="70%" x2="50%" y2="40%" />
        <line x1="50%" y1="40%" x2="80%" y2="30%" />
      </svg>

      {/* Pickup Pin */}
      <div className="absolute left-[20%] top-[70%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-lg">
          <div className="w-3 h-3 bg-white rounded-full"></div>
        </div>
        <span className="bg-slate-950 text-emerald-400 font-bold text-[10px] px-2 py-0.5 rounded-full mt-1 border border-emerald-500/40">
          Pickup
        </span>
      </div>

      {/* Driver Car Marker */}
      <div className="absolute left-[50%] top-[40%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-bounce">
        <div className="w-10 h-10 rounded-full bg-amber-400 border-2 border-slate-950 flex items-center justify-center shadow-xl">
          <Navigation className="w-5 h-5 text-slate-950 transform rotate-45" />
        </div>
        <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full mt-1 shadow-sm">
          Driver Live GPS
        </span>
      </div>

      {/* Destination Drop Pin */}
      <div className="absolute left-[80%] top-[30%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-rose-500 border-2 border-white flex items-center justify-center shadow-lg">
          <MapPin className="w-4 h-4 text-white" />
        </div>
        <span className="bg-slate-950 text-rose-400 font-bold text-[10px] px-2 py-0.5 rounded-full mt-1 border border-rose-500/40">
          Destination
        </span>
      </div>

      {/* Floating Status Bar */}
      <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-200 shadow-md text-xs font-bold text-slate-900 flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
        <span className="text-slate-900">Live AI Route Matching Active</span>
      </div>

    </div>
  );
}
