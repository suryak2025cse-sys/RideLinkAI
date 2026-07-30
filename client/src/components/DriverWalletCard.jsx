import React, { useState } from 'react';
import { Wallet, ArrowDownRight, ArrowUpRight, Plus, Gift, CreditCard } from 'lucide-react';
import ToastNotification from './ToastNotification';

export default function DriverWalletCard({ balance = 450.0 }) {
  const [currentBalance, setCurrentBalance] = useState(balance);
  const [toast, setToast] = useState(null);

  const transactions = [
    { id: 1, type: 'Ride Income', amount: 180, date: 'Today, 09:45 AM', isCredit: true },
    { id: 2, type: 'Referral Bonus', amount: 100, date: 'Yesterday, 06:20 PM', isCredit: true },
    { id: 3, type: 'Bank Withdrawal', amount: 200, date: '28 Jul, 02:15 PM', isCredit: false },
  ];

  const handleWithdraw = () => {
    if (currentBalance < 100) {
      setToast({ message: 'Minimum withdrawal amount is ₹100.', type: 'error' });
      return;
    }
    setCurrentBalance(prev => prev - 100);
    setToast({ message: '✅ ₹100 withdrawal initiated to linked UPI/Bank Account!', type: 'success' });
  };

  return (
    <div className="app-card p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
      <ToastNotification message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      {/* Wallet Balance Banner */}
      <div className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 p-6 rounded-2xl border border-amber-300 text-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <span className="text-xs font-black uppercase tracking-wider block text-slate-800">AVAILABLE WALLET BALANCE</span>
          <span className="text-3xl font-black">₹{currentBalance.toFixed(0)}</span>
        </div>

        <button
          onClick={handleWithdraw}
          className="bg-slate-950 hover:bg-slate-900 text-white font-black px-6 py-3 rounded-2xl text-xs uppercase tracking-wider shadow-sm transition-transform active:scale-95"
        >
          Withdraw to Bank / UPI
        </button>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
          <span className="text-slate-500 font-bold uppercase block text-[10px]">COMMUNITY BONUSES</span>
          <span className="text-emerald-700 font-black text-base flex items-center gap-1">
            <Gift className="w-4 h-4 text-emerald-600" /> ₹150 Earned
          </span>
        </div>
        <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200">
          <span className="text-slate-500 font-bold uppercase block text-[10px]">REFERRAL EARNINGS</span>
          <span className="text-blue-700 font-black text-base flex items-center gap-1">
            <CreditCard className="w-4 h-4 text-blue-600" /> ₹100 Earned
          </span>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="space-y-2">
        <h5 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">Recent Transactions</h5>
        <div className="space-y-2 text-xs">
          {transactions.map(t => (
            <div key={t.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold ${
                  t.isCredit ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                }`}>
                  {t.isCredit ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                </div>
                <div>
                  <p className="font-extrabold text-slate-900">{t.type}</p>
                  <p className="text-[10px] text-slate-500 font-semibold">{t.date}</p>
                </div>
              </div>

              <span className={`font-black text-sm ${t.isCredit ? 'text-emerald-700' : 'text-rose-600'}`}>
                {t.isCredit ? '+' : '-'}₹{t.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
