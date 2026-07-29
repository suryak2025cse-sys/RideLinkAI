import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Shield, Car, Award, Wallet, AlertTriangle, MessageSquare, Leaf, LayoutDashboard, LogOut, ChevronDown } from 'lucide-react';
import { toggleSOSModal } from '../redux/safetySlice';
import { toggleChatDrawer } from '../redux/chatSlice';
import { logout } from '../redux/authSlice';

export default function Navbar() {
  const { user, token } = useSelector((state) => state.auth);
  const isAuthenticated = !!(user || token);
  const isAdmin = user?.role === 'Admin' || user?.role === 'CampusAdmin' || user?.email === 'CodeShift@gmail.com';

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 py-3.5 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to={isAdmin ? '/admin' : (user?.role === 'Driver' ? '/driver' : '/passenger')} className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
            <Car className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-2xl tracking-tight text-slate-900">RideLink</span>
              <span className="text-blue-600 font-black text-2xl">AI</span>
            </div>
            <p className="text-[11px] text-slate-500 font-semibold tracking-wide uppercase">Community Mobility</p>
          </div>
        </Link>

        {/* Navigation Links - Hides Admin for regular users */}
        {isAuthenticated ? (
          <div className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60 text-base font-semibold text-slate-600">
            {!isAdmin && (
              <>
                <Link
                  to="/passenger"
                  className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                    isActive('/passenger') ? 'bg-white text-blue-600 shadow-sm font-bold' : 'hover:text-slate-900'
                  }`}
                >
                  <Car className="w-4 h-4 text-blue-600" /> Rides
                </Link>
                <Link
                  to="/driver"
                  className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                    isActive('/driver') ? 'bg-white text-blue-600 shadow-sm font-bold' : 'hover:text-slate-900'
                  }`}
                >
                  <Award className="w-4 h-4 text-emerald-600" /> Driver Portal
                </Link>
                <Link
                  to="/women-safety"
                  className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                    isActive('/women-safety') ? 'bg-pink-50 text-pink-600 shadow-sm font-bold' : 'hover:text-pink-600'
                  }`}
                >
                  <Shield className="w-4 h-4 text-pink-500" /> Women Safety
                </Link>
                <Link
                  to="/carbon-impact"
                  className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                    isActive('/carbon-impact') ? 'bg-white text-blue-600 shadow-sm font-bold' : 'hover:text-slate-900'
                  }`}
                >
                  <Leaf className="w-4 h-4 text-emerald-600" /> Eco Impact
                </Link>
                <Link
                  to="/community-modes"
                  className={`px-4 py-2 rounded-xl transition-all ${
                    isActive('/community-modes') ? 'bg-white text-blue-600 shadow-sm font-bold' : 'hover:text-slate-900'
                  }`}
                >
                  Communities
                </Link>
              </>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                  isActive('/admin') ? 'bg-white text-blue-600 shadow-sm font-bold' : 'hover:text-slate-900'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-blue-600" /> Admin Analytics Portal
              </Link>
            )}
          </div>
        ) : null}

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          
          {isAuthenticated ? (
            <>
              {/* Emergency SOS Button */}
              <button
                onClick={() => dispatch(toggleSOSModal(true))}
                className="btn-danger py-2.5 px-4 text-sm rounded-xl font-bold flex items-center gap-1.5 animate-pulse"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>SOS</span>
              </button>

              {/* Chat Drawer Toggle */}
              <button
                onClick={() => dispatch(toggleChatDrawer())}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors relative border border-slate-200"
                title="Open Chat"
              >
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </button>

              {/* Wallet Pill */}
              <div className="hidden sm:flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl text-sm font-bold text-emerald-700">
                <Wallet className="w-4 h-4 text-emerald-600" />
                <span>₹{user?.walletBalance ? user.walletBalance.toFixed(0) : '0'}</span>
              </div>

              {/* User Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 p-1.5 pr-3 rounded-2xl border border-slate-200 transition-colors"
                >
                  <img
                    src={user?.profilePicture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt="User"
                    className="w-8 h-8 rounded-xl object-cover border border-blue-500/40"
                  />
                  <span className="text-sm font-semibold text-slate-800 hidden sm:inline">{user?.name || 'Account'}</span>
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-sm font-bold text-slate-900">{user?.name || 'Commuter'}</p>
                      <p className="text-xs text-slate-500">{user?.email || 'user@univ.edu'}</p>
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <Link to="/profile" onClick={() => setIsUserMenuOpen(false)} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium">
                        Profile & Verifications
                      </Link>
                      <button
                        onClick={() => {
                          dispatch(logout());
                          setIsUserMenuOpen(false);
                          navigate('/login');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 font-semibold flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" /> Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : null}

        </div>

      </div>
    </nav>
  );
}
