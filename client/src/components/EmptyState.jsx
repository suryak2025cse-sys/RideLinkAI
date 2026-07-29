import React from 'react';
import { Inbox, Car, BellOff, ShieldAlert, CreditCard } from 'lucide-react';

export default function EmptyState({ 
  title = "No Data Found", 
  description = "There are currently no items to display.", 
  icon = Inbox, 
  actionLabel, 
  onAction 
}) {
  const IconComponent = icon;

  return (
    <div className="app-card p-12 text-center flex flex-col items-center justify-center space-y-4 max-w-md mx-auto my-8">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
        <IconComponent className="w-8 h-8" />
      </div>
      
      <div className="space-y-1">
        <h3 className="text-xl font-bold text-slate-800">{title}</h3>
        <p className="text-base text-slate-500 max-w-xs mx-auto leading-relaxed">{description}</p>
      </div>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="btn-primary mt-2"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
