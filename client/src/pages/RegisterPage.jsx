import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { User, Mail, Lock, Phone, Building, UserCheck, Car } from 'lucide-react';
import { setCredentials } from '../redux/authSlice';
import API from '../services/api';
import ToastNotification from '../components/ToastNotification';
import { signInWithGoogleFirebase } from '../services/firebase';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('Passenger');
  const [organizationName, setOrganizationName] = useState('');
  const [gender, setGender] = useState('Male');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setToast(null);

    const firebaseResult = await signInWithGoogleFirebase();

    if (!firebaseResult.success || !firebaseResult.user) {
      setToast({ 
        message: `⚠️ Google Sign-In Failed: ${firebaseResult.error || 'Please select your Google Account.'}`, 
        type: 'error' 
      });
      setLoading(false);
      return;
    }

    const selectedGoogleUser = firebaseResult.user;

    const userPayload = {
      name: selectedGoogleUser.name || selectedGoogleUser.email.split('@')[0],
      email: selectedGoogleUser.email,
      picture: selectedGoogleUser.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      googleId: selectedGoogleUser.uid,
      role
    };

    try {
      const res = await API.post('/auth/google', userPayload);
      if (res.data && res.data.success) {
        dispatch(setCredentials({ 
          user: res.data.user, 
          token: res.data.token 
        }));
        setToast({ message: `✅ Signed in as ${userPayload.name} (${userPayload.email})`, type: 'success' });
        setTimeout(() => navigate(role === 'Driver' ? '/driver' : '/passenger'), 600);
        return;
      }
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Google Registration failed.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setToast({ message: 'Please fill in your full name, email, and password.', type: 'error' });
      return;
    }

    setLoading(true);
    setToast(null);

    const payload = { name, email, password, phone, role, gender, organizationName };

    try {
      const res = await API.post('/auth/register', payload);
      if (res.data && res.data.success) {
        dispatch(setCredentials({ user: res.data.user, token: res.data.token }));
        setToast({ message: 'Account created! Opening portal...', type: 'success' });
        setTimeout(() => navigate(role === 'Driver' ? '/driver' : '/passenger'), 800);
        return;
      }
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Registration failed. User may already exist.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <ToastNotification message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      <div className="max-w-md w-full app-card p-8 rounded-4xl space-y-5 border border-slate-200 bg-white shadow-xl">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="bg-amber-400 text-slate-950 font-black px-6 py-2 rounded-full text-2xl tracking-tight shadow-sm inline-flex items-center gap-2 border border-amber-300 mx-auto">
            <Car className="w-6 h-6 text-slate-950" />
            <span>ridelink</span>
          </div>

          <div>
            <h1 className="font-extrabold text-3xl tracking-tight text-slate-900">Create Account</h1>
            <p className="text-sm font-semibold text-slate-500 mt-0.5">Access community ride-sharing</p>
          </div>
        </div>

        {/* Role Selector */}
        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-sm font-black">
          {['Passenger', 'Driver'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`py-2 rounded-xl transition-all uppercase tracking-wider ${
                role === r ? 'bg-slate-950 text-white font-black shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {r} Account
            </button>
          ))}
        </div>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full bg-white hover:bg-slate-50 text-slate-700 font-bold py-3 px-4 rounded-2xl border border-slate-300 shadow-sm flex items-center justify-center gap-3 transition-all hover:border-slate-400"
        >
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.28v3.15C3.25 21.3 7.31 24 12 24z"/>
            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.28C.46 8.21 0 10.05 0 12s.46 3.79 1.28 5.42l4-3.15z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.28 6.58l4 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
          </svg>
          <span className="text-sm">Sign up with Google</span>
        </button>

        <div className="flex items-center my-2 text-xs text-slate-400 font-bold uppercase tracking-wider">
          <div className="flex-1 border-t border-slate-200"></div>
          <span className="px-3">or form</span>
          <div className="flex-1 border-t border-slate-200"></div>
        </div>

        <form onSubmit={handleRegister} className="space-y-3">
          <div>
            <label className="form-label">Full Name *</label>
            <div className="relative">
              <User className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="form-input pl-12 py-2.5"
                required
              />
            </div>
          </div>

          <div>
            <label className="form-label">Email Address *</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="form-input pl-12 py-2.5"
                required
              />
            </div>
          </div>

          <div>
            <label className="form-label">Phone Number</label>
            <div className="relative">
              <Phone className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 9025953166"
                className="form-input pl-12 py-2.5"
              />
            </div>
          </div>

          <div>
            <label className="form-label">University / Organization</label>
            <div className="relative">
              <Building className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                placeholder="e.g. Sri Eshwar College of Engineering"
                className="form-input pl-12 py-2.5"
              />
            </div>
          </div>

          <div>
            <label className="form-label">Password *</label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input pl-12 py-2.5"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 text-base font-black shadow-rapido-yellow flex items-center justify-center gap-2 mt-1"
          >
            <UserCheck className="w-5 h-5 text-slate-950" />
            <span>{loading ? 'Registering...' : 'Create Account & Open App'}</span>
          </button>
        </form>

        <div className="text-center text-sm font-bold text-slate-600 pt-2 border-t border-slate-100">
          Already have an account?{' '}
          <Link to="/login" className="text-slate-950 font-extrabold underline hover:text-amber-600">
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
}
