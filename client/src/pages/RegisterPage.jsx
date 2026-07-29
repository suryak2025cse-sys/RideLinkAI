import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { User, Mail, Lock, Phone, Building, UserCheck } from 'lucide-react';
import { setCredentials } from '../redux/authSlice';
import API from '../services/api';
import ToastNotification from '../components/ToastNotification';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('Passenger');
  const [organizationName, setOrganizationName] = useState('');
  const [gender, setGender] = useState('Female');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post('/auth/register', { name, email, password, phone, role, gender, organizationName });
      dispatch(setCredentials({ user: res.data.user, token: res.data.token }));
      navigate(role === 'Driver' ? '/driver' : '/passenger');
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Registration failed. Please check inputs.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto pt-8 px-4">
      <ToastNotification message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      <div className="app-card p-8 rounded-3xl space-y-6 shadow-card">
        
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black text-slate-900">Create Account</h2>
          <p className="text-base text-slate-500">Join RideLink AI community mobility ecosystem</p>
        </div>

        {/* Role Selector */}
        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-sm font-semibold">
          {['Passenger', 'Driver'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`py-2 rounded-xl transition-all ${
                role === r ? 'bg-white text-blue-600 font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="form-label">Full Name</label>
            <div className="relative">
              <User className="w-5 h-5 text-slate-400 absolute left-4 top-4" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Priya Sharma"
                className="form-input pl-12"
                required
              />
            </div>
          </div>

          <div>
            <label className="form-label">Email Address</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-4" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="priya@univ.edu"
                className="form-input pl-12"
                required
              />
            </div>
          </div>

          <div>
            <label className="form-label">Phone Number</label>
            <div className="relative">
              <Phone className="w-5 h-5 text-slate-400 absolute left-4 top-4" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="form-input pl-12"
              />
            </div>
          </div>

          <div>
            <label className="form-label">University / Organization</label>
            <div className="relative">
              <Building className="w-5 h-5 text-slate-400 absolute left-4 top-4" />
              <input
                type="text"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                placeholder="Greenwood Tech University"
                className="form-input pl-12"
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
                placeholder="••••••••"
                className="form-input pl-12"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 text-base font-bold shadow-md"
          >
            <UserCheck className="w-5 h-5" />
            <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
          </button>
        </form>

        <div className="text-center text-base text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-bold hover:underline">
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
}
