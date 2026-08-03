import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Mail, Lock, LogIn, Car, AlertCircle } from 'lucide-react';
import { setCredentials } from '../redux/authSlice';
import API from '../services/api';
import ToastNotification from '../components/ToastNotification';
import { signInWithGoogleFirebase } from '../services/firebase';

export default function LoginPage() {
  const [role, setRole] = useState('Passenger');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [domainError, setDomainError] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    setEmail('');
    setPassword('');
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setToast(null);
    setDomainError(false);

    const firebaseResult = await signInWithGoogleFirebase();

    if (firebaseResult.isUnauthorizedDomain) {
      setDomainError(true);
      setToast({ 
        message: '⚠️ Firebase Domain Notice: Please add localhost and your domain in Firebase Console -> Authentication -> Settings -> Authorized Domains.', 
        type: 'error' 
      });
      setLoading(false);
      return;
    }

    if (!firebaseResult.success || !firebaseResult.user) {
      setToast({ 
        message: `⚠️ Google Sign-In: ${firebaseResult.error || 'Please select your Google Account in the popup window.'}`, 
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
      setToast({ message: err.response?.data?.message || 'Google Authentication failed.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setToast({ message: 'Please enter your email address and password.', type: 'error' });
      return;
    }

    setLoading(true);
    setToast(null);

    try {
      const res = await API.post('/auth/login', { email, password });
      if (res.data && res.data.success) {
        dispatch(setCredentials({ 
          user: { ...res.data.user, role }, 
          token: res.data.token 
        }));
        setToast({ message: 'Login successful! Opening application...', type: 'success' });
        setTimeout(() => navigate(role === 'Driver' ? '/driver' : '/passenger'), 600);
        return;
      }
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Invalid email or password. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <ToastNotification message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      <div className="max-w-md w-full app-card p-8 rounded-4xl space-y-6 border border-slate-200 bg-white shadow-xl">
        
        {/* Brand Logo Header */}
        <div className="text-center space-y-3">
          <div className="bg-emerald-500 text-white font-black px-6 py-2.5 rounded-full text-2xl tracking-tight shadow-sm inline-flex items-center gap-2 border border-emerald-400 mx-auto">
            <Car className="w-6 h-6 text-white" />
            <span>ridelink</span>
          </div>

          <div>
            <h1 className="font-extrabold text-3xl tracking-tight text-slate-900">Sign In to RideLink AI</h1>
            <p className="text-sm font-semibold text-slate-500 mt-1">Quick & affordable community rides</p>
          </div>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-black">
          {['Passenger', 'Driver'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => handleRoleChange(r)}
              className={`py-3 rounded-xl transition-all uppercase tracking-wider ${
                role === r 
                  ? 'bg-slate-950 text-white shadow-sm font-black' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Firebase Domain Unauthorized Guide Banner */}
        {domainError && (
          <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl text-xs font-semibold text-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-900">
              <AlertCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Firebase Domain Setup Instructions (30 Secs)</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-600">
              1. Open <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer" className="underline font-bold text-slate-900">Firebase Console</a> &rrarr; <b>ridelinkai-c0199</b><br/>
              2. Go to <b>Authentication</b> &rarr; <b>Settings</b> &rarr; <b>Authorized domains</b><br/>
              3. Click <b>Add domain</b> and add: <code className="bg-slate-200 px-1 py-0.5 rounded font-bold">{window.location.hostname}</code>
            </p>
          </div>
        )}

        {/* Google Firebase OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full bg-white hover:bg-slate-50 text-slate-700 font-bold py-3.5 px-4 rounded-2xl border border-slate-300 shadow-sm flex items-center justify-center gap-3 transition-all hover:border-slate-400"
        >
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.28v3.15C3.25 21.3 7.31 24 12 24z"/>
            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.28C.46 8.21 0 10.05 0 12s.46 3.79 1.28 5.42l4-3.15z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.28 6.58l4 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
          </svg>
          <span className="text-sm">Sign in with Google</span>
        </button>

        <div className="flex items-center my-3 text-xs text-slate-400 font-bold uppercase tracking-wider">
          <div className="flex-1 border-t border-slate-200"></div>
          <span className="px-3">or email</span>
          <div className="flex-1 border-t border-slate-200"></div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="form-label">Email Address</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-4" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="form-input pl-12"
                required
              />
            </div>
          </div>

          <div>
            <label className="form-label">Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-4" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="form-input pl-12"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-4 text-lg font-black shadow-rapido-yellow flex items-center justify-center gap-2 mt-2 text-white"
          >
            <LogIn className="w-5 h-5 text-white" />
            <span>{loading ? 'Authenticating...' : `Sign In as ${role}`}</span>
          </button>
        </form>

        <div className="text-center text-sm font-bold text-slate-600 pt-2 border-t border-slate-100">
          Don't have an account?{' '}
          <Link to="/register" className="text-emerald-600 font-extrabold underline hover:text-emerald-700">
            Create Account
          </Link>
        </div>

      </div>
    </div>
  );
}
