import React, { useState, useEffect } from 'react';
import { Bot, Sparkles, AlertTriangle, TrendingUp, Compass, X, ChevronRight } from 'lucide-react';

export default function AISmartCoPilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([
    {
      id: 1,
      type: 'demand',
      title: 'High Demand Area Ahead',
      message: 'North Campus Gate is experiencing 45% higher ride demand right now.',
      action: 'View Demand Heatmap',
      tag: '🔥 High Profit',
      color: 'amber'
    },
    {
      id: 2,
      type: 'route',
      title: 'Optimal Traffic Route Detected',
      message: 'Outer Ring Road has 12 min delay. AI co-pilot recommends Inner Bypass route.',
      action: 'Reroute GPS',
      tag: '⏱️ Save 12 Min',
      color: 'emerald'
    },
    {
      id: 3,
      type: 'weather',
      title: 'Weather Warning & Surge Fare',
      message: 'Light rain expected in 15 mins. Surge pricing (+20%) active.',
      action: 'Apply Surge Fare',
      tag: '🌧️ +20% Surge',
      color: 'blue'
    }
  ]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-slate-950 text-amber-400 border-2 border-amber-400 p-3.5 rounded-full shadow-2xl flex items-center gap-2.5 hover:scale-105 transition-all group font-black text-sm"
        >
          <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black">
            <Bot className="w-5 h-5" />
          </div>
          <span className="hidden sm:inline pr-2 text-slate-100">AI Co-Pilot</span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
        </button>
      ) : (
        <div className="app-card w-80 sm:w-96 p-5 rounded-3xl bg-white border border-slate-200 shadow-2xl space-y-4 text-slate-900 animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-sm">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-extrabold text-slate-900 text-base">AI Smart Co-Pilot</h4>
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </div>
                <p className="text-[11px] font-bold text-slate-500">Real-time Mobility Analytics Engine</p>
              </div>
            </div>

            <button 
              onClick={() => setIsOpen(false)} 
              className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Suggestions List */}
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {suggestions.map((item) => (
              <div 
                key={item.id} 
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 hover:border-amber-400 transition-all text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                    {item.type === 'demand' && <TrendingUp className="w-4 h-4 text-amber-600" />}
                    {item.type === 'route' && <Compass className="w-4 h-4 text-emerald-600" />}
                    {item.type === 'weather' && <AlertTriangle className="w-4 h-4 text-blue-600" />}
                    {item.title}
                  </span>
                  <span className="bg-amber-100 text-slate-950 font-black px-2 py-0.5 rounded-full text-[10px]">
                    {item.tag}
                  </span>
                </div>
                <p className="text-slate-600 font-semibold leading-relaxed">{item.message}</p>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-slate-950 font-black flex items-center gap-1 hover:underline pt-1 text-xs"
                >
                  <span>{item.action}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Footer Status */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-bold">
            <span className="flex items-center gap-1.5 text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Traffic & Weather Active
            </span>
            <span className="text-slate-400">v2.4 AI Engine</span>
          </div>
        </div>
      )}
    </div>
  );
}
