import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Shield, Car, Award, Wallet, AlertTriangle, MessageSquare, Leaf, LayoutDashboard, LogOut, ChevronDown, Sparkles } from 'lucide-react';
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
    <nav className="sticky top-0 z-40 bg-slate-950/70 backdrop-blur-xl border-b border-white/10 px-4 lg:px-8 py-3.5 shadow-2xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to={isAdmin ? '/admin' : (user?.role === 'Driver' ? '/driver' : '/passenger')} className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 flex items-center justify-center shadow-glow-indigo group-hover:scale-105 transition-transform border border-white/20">
            <Car className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-2xl tracking-tight text-white">RideLink</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 font-black text-2xl">AI</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-bold tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>AI Mobility Active</span>
            </div>
          </div>
        </Link>

        {/* Navigation Links */}
        {isAuthenticated ? (
          <div className="hidden md:flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-2xl border border-white/10 text-sm font-bold text-slate-300 backdrop-blur-md">
            {!isAdmin && (
              <>
                <Link
                  to="/passenger"
                  className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                    isActive('/passenger') ? 'bg-indigo-600 text-white shadow-glow-indigo font-black' : 'hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Car className="w-4 h-4 text-indigo-400" /> Rides
                </Link>
                <Link
                  to="/driver"
                  className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                    isActive('/driver') ? 'bg-indigo-600 text-white shadow-glow-indigo font-black' : 'hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Award className="w-4 h-4 text-emerald-400" /> Driver Portal
                </Link>
                <Link
                  to="/women-safety"
                  className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                    isActive('/women-safety') ? 'bg-pink-600/30 text-pink-300 border border-pink-500/30 font-black' : 'hover:text-pink-400 hover:bg-white/5'
                  }`}
                >
                  <Shield className="w-4 h-4 text-pink-400" /> Women Safety
                </Link>
                <Link
                  to="/carbon-impact"
                  className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                    isActive('/carbon-impact') ? 'bg-indigo-600 text-white shadow-glow-indigo font-black' : 'hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Leaf className="w-4 h-4 text-emerald-400" /> Eco Impact
                </Link>
                <Link
                  to="/community-modes"
                  className={`px-4 py-2 rounded-xl transition-all ${
                    isActive('/community-modes') ? 'bg-indigo-600 text-white shadow-glow-indigo font-black' : 'hover:text-white hover:bg-white/5'
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
                  isActive('/admin') ? 'bg-indigo-600 text-white shadow-glow-indigo font-black' : 'hover:text-white hover:bg-white/5'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-indigo-400" /> Admin Analytics Portal
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
                className="btn-danger py-2.5 px-4 text-xs rounded-xl font-black flex items-center gap-1.5 uppercase tracking-wider animate-pulse"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>SOS</span>
              </button>

              {/* Chat Drawer Toggle */}
              <button
                onClick={() => dispatch(toggleChatDrawer())}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-indigo-400 transition-colors relative border border-white/10 shadow-md"
                title="Open Chat"
              >
                <MessageSquare className="w-5 h-5" />
              </button>

              {/* Wallet Pill */}
              <div className="hidden sm:flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/30 px-3.5 py-2 rounded-xl text-sm font-black text-emerald-400 shadow-glow-emerald">
                <Wallet className="w-4 h-4 text-emerald-400" />
                <span>₹{user?.walletBalance ? user.walletBalance.toFixed(0) : '0'}</span>
              </div>

              {/* User Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 p-1.5 pr-3 rounded-2xl border border-white/10 transition-colors"
                >
                  <img
                    src={user?.profilePicture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt="User"
                    className="w-8 h-8 rounded-xl object-cover border border-indigo-500/50"
                  />
                  <span className="text-sm font-bold text-slate-200 hidden sm:inline">{user?.name || 'Account'}</span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-slate-900 border border-white/15 rounded-2xl shadow-glass py-2 z-50 backdrop-blur-2xl">
                    <div className="px-4 py-2 border-b border-white/10">
                      <p className="text-sm font-extrabold text-white">{user?.name || 'Commuter'}</p>
                      <p className="text-xs text-slate-400 truncate">{user?.email || 'user@univ.edu'}</p>
                    </div>

                    <div className="border-t border-white/10 pt-1">
                      <Link to="/profile" onClick={() => setIsUserMenuOpen(false)} className="block px-4 py-2 text-sm text-slate-300 hover:bg-white/10 font-semibold">
                        Profile & Verifications
                      </Link>
                      <button
                        onClick={() => {
                          dispatch(logout());
                          setIsUserMenuOpen(false);
                          navigate('/login');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 font-extrabold flex items-center gap-2"
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
