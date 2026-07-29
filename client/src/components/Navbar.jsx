import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Shield, Car, Award, Wallet, AlertTriangle, MessageSquare, Leaf, LayoutDashboard, LogOut, ChevronDown, Zap } from 'lucide-react';
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
    <nav className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-2xl border-b border-cyan-500/20 px-4 lg:px-8 py-3.5 shadow-2xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to={isAdmin ? '/admin' : (user?.role === 'Driver' ? '/driver' : '/passenger')} className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-600 to-purple-600 flex items-center justify-center shadow-neon-cyan group-hover:scale-105 transition-transform border border-cyan-300/50">
            <Car className="w-6 h-6 text-black" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-black text-2xl tracking-tight text-white">RideLink</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 font-black text-2xl">AI</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-cyan-400 font-black tracking-widest uppercase">
              <Zap className="w-3 h-3 text-cyan-400 fill-cyan-400 animate-bounce" />
              <span>NEON MOBILITY ENGINE</span>
            </div>
          </div>
        </Link>

        {/* Navigation Links */}
        {isAuthenticated ? (
          <div className="hidden md:flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-cyan-500/20 text-sm font-black text-slate-300 backdrop-blur-xl">
            {!isAdmin && (
              <>
                <Link
                  to="/passenger"
                  className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                    isActive('/passenger') ? 'bg-gradient-to-r from-cyan-400 to-blue-600 text-black shadow-neon-cyan font-black' : 'hover:text-cyan-300 hover:bg-white/5'
                  }`}
                >
                  <Car className="w-4 h-4" /> Rides
                </Link>
                <Link
                  to="/driver"
                  className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                    isActive('/driver') ? 'bg-gradient-to-r from-cyan-400 to-blue-600 text-black shadow-neon-cyan font-black' : 'hover:text-cyan-300 hover:bg-white/5'
                  }`}
                >
                  <Award className="w-4 h-4" /> Driver Portal
                </Link>
                <Link
                  to="/women-safety"
                  className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                    isActive('/women-safety') ? 'bg-pink-600/30 text-pink-300 border border-pink-500/40 font-black' : 'hover:text-pink-400 hover:bg-white/5'
                  }`}
                >
                  <Shield className="w-4 h-4 text-pink-400" /> Women Safety
                </Link>
                <Link
                  to="/carbon-impact"
                  className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                    isActive('/carbon-impact') ? 'bg-gradient-to-r from-cyan-400 to-blue-600 text-black shadow-neon-cyan font-black' : 'hover:text-cyan-300 hover:bg-white/5'
                  }`}
                >
                  <Leaf className="w-4 h-4" /> Eco Impact
                </Link>
                <Link
                  to="/community-modes"
                  className={`px-4 py-2 rounded-xl transition-all ${
                    isActive('/community-modes') ? 'bg-gradient-to-r from-cyan-400 to-blue-600 text-black shadow-neon-cyan font-black' : 'hover:text-cyan-300 hover:bg-white/5'
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
                  isActive('/admin') ? 'bg-gradient-to-r from-cyan-400 to-blue-600 text-black shadow-neon-cyan font-black' : 'hover:text-cyan-300 hover:bg-white/5'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" /> Admin Analytics Portal
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
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 transition-colors relative border border-cyan-500/30 shadow-md"
                title="Open Chat"
              >
                <MessageSquare className="w-5 h-5" />
              </button>

              {/* Wallet Pill */}
              <div className="hidden sm:flex items-center gap-2 bg-slate-900 border border-cyan-500/30 px-3.5 py-2 rounded-xl text-sm font-black text-cyan-400 shadow-neon-cyan">
                <Wallet className="w-4 h-4 text-cyan-400" />
                <span>₹{user?.walletBalance ? user.walletBalance.toFixed(0) : '0'}</span>
              </div>

              {/* User Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 p-1.5 pr-3 rounded-2xl border border-cyan-500/30 transition-colors"
                >
                  <img
                    src={user?.profilePicture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt="User"
                    className="w-8 h-8 rounded-xl object-cover border border-cyan-400"
                  />
                  <span className="text-sm font-black text-white hidden sm:inline">{user?.name || 'Account'}</span>
                  <ChevronDown className="w-4 h-4 text-cyan-400" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-slate-950 border border-cyan-500/30 rounded-2xl shadow-cyber-glass py-2 z-50 backdrop-blur-2xl">
                    <div className="px-4 py-2 border-b border-white/10">
                      <p className="text-sm font-extrabold text-white">{user?.name || 'Commuter'}</p>
                      <p className="text-xs text-slate-400 truncate">{user?.email || 'user@univ.edu'}</p>
                    </div>

                    <div className="border-t border-white/10 pt-1">
                      <Link to="/profile" onClick={() => setIsUserMenuOpen(false)} className="block px-4 py-2 text-sm text-cyan-300 hover:bg-cyan-500/10 font-bold">
                        Profile & Verifications
                      </Link>
                      <button
                        onClick={() => {
                          dispatch(logout());
                          setIsUserMenuOpen(false);
                          navigate('/login');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 font-black flex items-center gap-2 uppercase tracking-wider text-xs"
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
