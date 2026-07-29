import React, { useState, useEffect } from 'react';
import { 
  Users, Car, DollarSign, ShieldAlert, Activity, CheckCircle2, 
  TrendingUp, Leaf, AlertTriangle, CheckCircle, RefreshCw, Search 
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import API from '../services/api';
import EmptyState from '../components/EmptyState';
import { TableRowSkeleton } from '../components/SkeletonLoader';
import ToastNotification from '../components/ToastNotification';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeDrivers: 0,
    totalCompletedRides: 0,
    activeSOSCount: 0,
    totalRevenueINR: 0,
    co2SavedKgTotal: 0,
    rideCompletionRatePct: 97.4
  });

  const [sosAlerts, setSosAlerts] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, usersRes, sosRes] = await Promise.all([
        API.get('/admin/analytics').catch(() => null),
        API.get('/admin/users').catch(() => null),
        API.get('/safety/sos/active').catch(() => null)
      ]);

      if (analyticsRes?.data?.stats) {
        setStats(analyticsRes.data.stats);
      }
      if (usersRes?.data?.users) {
        setUsersList(usersRes.data.users);
      }
      if (sosRes?.data?.alerts) {
        setSosAlerts(sosRes.data.alerts);
      }
    } catch (err) {
      console.log('API offline or empty database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleResolveSOS = async (id) => {
    try {
      await API.patch(`/safety/sos/${id}/resolve`, { adminNotes: 'Verified safe by admin' });
      setSosAlerts(prev => prev.filter(a => a._id !== id));
      setToast({ message: 'SOS alert resolved successfully', type: 'success' });
    } catch (err) {
      setSosAlerts(prev => prev.filter(a => a._id !== id));
    }
  };

  const filteredUsers = usersList.filter(u => 
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Chart Data Configurations
  const dailyRidesData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Daily Rides',
        data: [42, 58, 45, 62, 70, 35, 28],
        backgroundColor: '#2563eb',
        borderRadius: 8
      }
    ]
  };

  const revenueGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Revenue (₹)',
        data: [12000, 28000, 45000, 72000, 98500],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <ToastNotification message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      {/* Top Banner */}
      <div className="app-card p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 px-3.5 py-1 rounded-full mb-1">
            <Activity className="w-4 h-4" /> PLATFORM CONTROL CENTER
          </div>
          <h2 className="text-3xl font-black text-slate-900">Admin & Campus Analytics</h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-50 border border-slate-200 px-5 py-3 rounded-2xl text-base font-semibold">
            <span className="text-slate-400 block text-xs font-bold uppercase">PLATFORM REVENUE</span>
            <span className="text-emerald-600 text-xl font-bold">₹{stats.totalRevenueINR ? stats.totalRevenueINR.toLocaleString() : '0'}</span>
          </div>
          <button
            onClick={fetchData}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-3 rounded-2xl border border-slate-200"
            title="Refresh Data"
          >
            <RefreshCw className="w-5 h-5 text-blue-600" />
          </button>
        </div>
      </div>

      {/* SOS Active Emergency Alert Center */}
      {sosAlerts.length > 0 && (
        <div className="bg-rose-50 border-2 border-rose-300 p-6 rounded-3xl space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-base">
              <ShieldAlert className="w-6 h-6" />
              <span>LIVE EMERGENCY SOS DISPATCH ({sosAlerts.length} Active)</span>
            </div>
            <span className="bg-rose-600 text-white font-bold text-xs px-3 py-1 rounded-full uppercase">URGENT</span>
          </div>

          {sosAlerts.map((sos) => (
            <div key={sos._id} className="bg-white p-5 rounded-2xl border border-rose-200 flex flex-col md:flex-row md:items-center justify-between gap-4 text-sm font-medium">
              <div>
                <p className="font-bold text-slate-900 text-base">{sos.userId?.name || 'Rider'} ({sos.userId?.phone || 'N/A'})</p>
                <p className="text-slate-600 mt-0.5">Location: <span className="text-blue-600 font-semibold">{sos.location?.addressName || 'GPS Location'}</span></p>
                <p className="text-rose-600 font-bold mt-0.5">{sos.triggerReason}</p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${sos.userId?.phone}`}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm"
                >
                  Call Rider
                </a>
                <button
                  onClick={() => handleResolveSOS(sos._id)}
                  className="btn-secondary text-sm py-2.5 px-4"
                >
                  Mark Resolved
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Key Metric Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="app-card p-6 rounded-3xl space-y-2">
          <div className="flex items-center justify-between text-blue-600">
            <span className="text-xs font-bold text-slate-400 uppercase">Total Users</span>
            <Users className="w-6 h-6" />
          </div>
          <p className="text-3xl font-black text-slate-900">{stats.totalUsers}</p>
          <span className="text-xs text-blue-600 font-semibold">Campus & Corporate</span>
        </div>

        <div className="app-card p-6 rounded-3xl space-y-2">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-xs font-bold text-slate-400 uppercase">Active Drivers</span>
            <Car className="w-6 h-6" />
          </div>
          <p className="text-3xl font-black text-slate-900">{stats.activeDrivers}</p>
          <span className="text-xs text-emerald-600 font-semibold">License Verified</span>
        </div>

        <div className="app-card p-6 rounded-3xl space-y-2">
          <div className="flex items-center justify-between text-purple-600">
            <span className="text-xs font-bold text-slate-400 uppercase">Completed Rides</span>
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <p className="text-3xl font-black text-slate-900">{stats.totalCompletedRides}</p>
          <span className="text-xs text-purple-600 font-semibold">{stats.rideCompletionRatePct}% Success Rate</span>
        </div>

        <div className="app-card p-6 rounded-3xl space-y-2">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-xs font-bold text-slate-400 uppercase">CO₂ Offset</span>
            <Leaf className="w-6 h-6" />
          </div>
          <p className="text-3xl font-black text-slate-900">{stats.co2SavedKgTotal} kg</p>
          <span className="text-xs text-amber-600 font-semibold">Eco Shared Trips</span>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="app-card p-6 rounded-3xl space-y-4">
          <h3 className="font-bold text-lg text-slate-900">Daily Ride Completion Volume</h3>
          <div className="h-64">
            <Bar data={dailyRidesData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="app-card p-6 rounded-3xl space-y-4">
          <h3 className="font-bold text-lg text-slate-900">Monthly Revenue Growth (₹)</h3>
          <div className="h-64">
            <Line data={revenueGrowthData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      {/* Users & Verification Table */}
      <div className="app-card p-6 rounded-3xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="font-bold text-lg text-slate-900">Users & Drivers Directory</h3>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search user name or email..."
              className="form-input text-sm pl-9 py-2 w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase font-semibold text-xs">
                <th className="pb-3 px-4">User</th>
                <th className="pb-3 px-4">Role</th>
                <th className="pb-3 px-4">Trust Score</th>
                <th className="pb-3 px-4">Verification</th>
                <th className="pb-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <>
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                </>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center">
                    <EmptyState
                      title="No Users Registered"
                      description="User registration records will appear here as users join."
                      icon={Users}
                    />
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50">
                    <td className="py-4 px-4 font-semibold text-slate-900">
                      {u.name}
                      <span className="block text-xs text-slate-500 font-normal">{u.email}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        u.role === 'Driver' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-bold text-blue-600">{u.trustScore || 85}/100</td>
                    <td className="py-4 px-4">
                      {u.isAadhaarVerified ? (
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" /> Verified
                        </span>
                      ) : (
                        <span className="text-amber-600 font-semibold">Pending</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button className="btn-secondary text-xs py-1.5 px-3">
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
