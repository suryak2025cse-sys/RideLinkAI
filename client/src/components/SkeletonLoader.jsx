import React from 'react';

export function CardSkeleton() {
  return (
    <div className="app-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-6 w-32 skeleton rounded-xl"></div>
        <div className="h-6 w-16 skeleton rounded-xl"></div>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full skeleton shrink-0"></div>
        <div className="space-y-2 flex-1">
          <div className="h-4 w-40 skeleton rounded"></div>
          <div className="h-3 w-24 skeleton rounded"></div>
        </div>
      </div>
      <div className="h-20 w-full skeleton rounded-2xl"></div>
      <div className="flex justify-between items-center pt-2">
        <div className="h-4 w-28 skeleton rounded"></div>
        <div className="h-10 w-28 skeleton rounded-2xl"></div>
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="border-b border-slate-100 animate-pulse">
      <td className="py-4 px-4"><div className="h-4 w-32 skeleton rounded"></div></td>
      <td className="py-4 px-4"><div className="h-4 w-20 skeleton rounded"></div></td>
      <td className="py-4 px-4"><div className="h-4 w-16 skeleton rounded"></div></td>
      <td className="py-4 px-4"><div className="h-4 w-24 skeleton rounded"></div></td>
      <td className="py-4 px-4 text-right"><div className="h-8 w-20 skeleton rounded-xl ml-auto"></div></td>
    </tr>
  );
}
