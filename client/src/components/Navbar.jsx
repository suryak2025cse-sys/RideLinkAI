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
    <nav className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 lg:px-8 py-3.5 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo - Rapido Pill Style */}
        <Link to={isAdmin ? '/admin' : (user?.role === 'Driver' ? '/driver' : '/passenger')} className="flex items-center gap-3 group">
          <div className="bg-amber-400 text-slate-950 font-black px-5 py-2 rounded-full text-xl tracking-tight shadow-sm flex items-center gap-2 border border-amber-300 group-hover:scale-105 transition-transform">
            <Car className="w-5 h-5 text-slate-950" />
            <span>ridelink</span>
          </div>
          <span className="text-xs font-black bg-slate-950 text-white px-2.5 py-1 rounded-full uppercase tracking-wider hidden sm:inline">
            AI Rides
          </span>
        </Link>

        {/* Navigation Links - Rapido Underline Style */}
        {isAuthenticated ? (
          <div className="hidden md:flex items-center gap-8 text-base font-bold text-slate-700">
            {!isAdmin && (
              <>
                <Link
                  to="/passenger"
                  className={`py-1 transition-all ${
                    isActive('/passenger') ? 'text-slate-950 font-black border-b-2 border-slate-950' : 'hover:text-slate-950'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/driver"
                  className={`py-1 transition-all ${
                    isActive('/driver') ? 'text-slate-950 font-black border-b-2 border-slate-950' : 'hover:text-slate-950'
                  }`}
                >
                  Driver Portal
                </Link>
                <Link
                  to="/women-safety"
                  className={`py-1 transition-all ${
                    isActive('/women-safety') ? 'text-pink-600 font-black border-b-2 border-pink-600' : 'hover:text-pink-600'
                  }`}
                >
                  Safety
                </Link>
                <Link
                  to="/carbon-impact"
                  className={`py-1 transition-all ${
                    isActive('/carbon-impact') ? 'text-slate-950 font-black border-b-2 border-slate-950' : 'hover:text-slate-950'
                  }`}
                >
                  Eco Impact
                </Link>
                <Link
                  to="/community-modes"
                  className={`py-1 transition-all ${
                    isActive('/community-modes') ? 'text-slate-950 font-black border-b-2 border-slate-950' : 'hover:text-slate-950'
                  }`}
                >
                  Communities
                </Link>
              </>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className={`py-1 transition-all ${
                  isActive('/admin') ? 'text-slate-950 font-black border-b-2 border-slate-950' : 'hover:text-slate-950'
                }`}
              >
                Admin Analytics
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
                className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold px-4 py-2 rounded-full text-xs flex items-center gap-1.5 uppercase tracking-wider animate-pulse shadow-sm"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>SOS</span>
              </button>

              {/* Chat Drawer Toggle */}
              <button
                onClick={() => dispatch(toggleChatDrawer())}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-900 transition-colors border border-slate-200"
                title="Open Chat"
              >
                <MessageSquare className="w-5 h-5" />
              </button>

              {/* Wallet Pill */}
              <div className="hidden sm:flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-full text-sm font-black text-slate-950">
                <Wallet className="w-4 h-4 text-amber-600" />
                <span>₹{user?.walletBalance ? user.walletBalance.toFixed(0) : '0'}</span>
              </div>

              {/* User Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 bg-slate-950 hover:bg-slate-900 text-white px-4 py-2 rounded-full font-bold text-sm shadow-sm transition-colors"
                >
                  <img
                    src={user?.profilePicture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt="User"
                    className="w-6 h-6 rounded-full object-cover border border-amber-400"
                  />
                  <span className="hidden sm:inline">{user?.name || 'Account'}</span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-sm font-extrabold text-slate-900">{user?.name || 'Commuter'}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email || 'user@univ.edu'}</p>
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <Link to="/profile" onClick={() => setIsUserMenuOpen(false)} className="block px-4 py-2 text-sm text-slate-700 hover:bg-amber-50 font-bold">
                        Profile & Verifications
                      </Link>
                      <button
                        onClick={() => {
                          dispatch(logout());
                          setIsUserMenuOpen(false);
                          navigate('/login');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 font-black flex items-center gap-2 uppercase tracking-wider text-xs"
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
