import React, { useState } from 'react';
import { Flame, TrendingUp, Compass, Clock, CloudRain, Sun, Search, MapPin } from 'lucide-react';
import MapContainer from '../components/MapContainer';

export default function DemandHeatmapPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('Now (03:30 PM)');

  const demandZones = [
    {
      id: 1,
      name: 'North Campus Gate - Student Quad',
      status: 'High Demand 🔥',
      surge: '+45% Surge',
      fareMultiplier: '1.4x',
      activeRequests: 28,
      avgWaitMin: 3,
      color: 'bg-rose-100 text-rose-800 border-rose-300'
    },
    {
      id: 2,
      name: 'Tech Park Building 4 Main Bay',
      status: 'High Demand 🔥',
      surge: '+35% Surge',
      fareMultiplier: '1.3x',
      activeRequests: 22,
      avgWaitMin: 4,
      color: 'bg-rose-100 text-rose-800 border-rose-300'
    },
    {
      id: 3,
      name: 'Central Metro Station Interchange',
      status: 'Medium Demand 🟡',
      surge: 'Normal Rate',
      fareMultiplier: '1.1x',
      activeRequests: 14,
      avgWaitMin: 6,
      color: 'bg-amber-100 text-amber-900 border-amber-300'
    },
    {
      id: 4,
      name: 'Greenwood Residential Enclave',
      status: 'Low Demand 🟢',
      surge: 'Standard Rate',
      fareMultiplier: '1.0x',
      activeRequests: 5,
      avgWaitMin: 10,
      color: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Banner */}
      <div className="app-card p-8 rounded-3xl bg-white border border-slate-200 space-y-3">
        <div className="inline-flex items-center gap-2 bg-amber-100 text-slate-950 border border-amber-300 px-3.5 py-1 rounded-full text-xs font-black">
          <Flame className="w-4 h-4 text-amber-600" /> AI RIDE DEMAND HEATMAP
        </div>
        <h2 className="text-3xl font-black text-slate-900">Demand Prediction & Surge Hotspots</h2>
        <p className="text-base text-slate-600 font-semibold max-w-2xl">
          Real-time AI predictions based on historical commute logs, shift changes, class schedules, and weather forecasts.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Heatmap Visual Radar */}
        <div className="lg:col-span-6 space-y-4">
          <div className="app-card p-4 rounded-3xl bg-white space-y-3">
            <div className="flex items-center justify-between px-2 text-sm font-bold">
              <span>Live Demand Radar Map</span>
              <span className="text-emerald-700 font-black bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-full text-xs">
                ● Live AI Feeds Active
              </span>
            </div>
            <MapContainer height="450px" />
          </div>
        </div>

        {/* Demand Zones List */}
        <div className="lg:col-span-6 space-y-4">
          <h3 className="font-extrabold text-xl text-slate-900">High Surge Demand Hotspots</h3>
          
          <div className="space-y-3">
            {demandZones.map((zone) => (
              <div 
                key={zone.id}
                className="app-card p-5 rounded-3xl bg-white border border-slate-200 space-y-3 hover:border-amber-400 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-amber-500" />
                    <h4 className="font-black text-slate-900 text-base">{zone.name}</h4>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-black border ${zone.color}`}>
                    {zone.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-2xl text-xs font-semibold text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">ACTIVE REQUESTS</span>
                    <span className="font-black text-slate-900 text-sm">{zone.activeRequests} Riders</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">SURGE RATE</span>
                    <span className="font-black text-amber-600 text-sm">{zone.surge}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">AVG WAIT</span>
                    <span className="font-black text-emerald-700 text-sm">{zone.avgWaitMin} min</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
