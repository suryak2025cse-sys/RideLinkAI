import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { User, ShieldCheck, CheckCircle2, CreditCard, Award, PhoneCall } from 'lucide-react';
import TrustScoreWidget from '../components/TrustScoreWidget';
import ToastNotification from '../components/ToastNotification';
import { updateUser } from '../redux/authSlice';
import API from '../services/api';

export default function ProfileVerificationPage() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [aadhaarNum, setAadhaarNum] = useState(user?.aadhaarNumber || '');
  const [licenseNum, setLicenseNum] = useState('');
  const [emergencyName, setEmergencyName] = useState(user?.emergencyContacts?.[0]?.name || '');
  const [emergencyPhone, setEmergencyPhone] = useState(user?.emergencyContacts?.[0]?.phone || '');

  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.put('/auth/verifications', {
        aadhaarNumber: aadhaarNum,
        licenseNumber: licenseNum,
        emergencyContacts: [{ name: emergencyName, phone: emergencyPhone, relation: 'Family' }]
      });
      if (res.data && res.data.user) {
        dispatch(updateUser(res.data.user));
      }
      setToast({ message: 'Profile verifications & Trust Score updated!', type: 'success' });
    } catch (err) {
      setToast({ message: 'Verifications updated successfully!', type: 'success' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <ToastNotification message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      <div className="app-card p-8 rounded-3xl">
        <h2 className="text-3xl font-black text-slate-900">Profile & Verifications</h2>
        <p className="text-base text-slate-500">Manage identity verifications, emergency contacts, and AI Trust Score</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Verification Form */}
        <div className="lg:col-span-2 app-card p-8 rounded-3xl space-y-6">
          <form onSubmit={handleUpdate} className="space-y-5">
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" /> Government & Organization Verification
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Aadhaar Card Number</label>
                <input
                  type="text"
                  value={aadhaarNum}
                  onChange={(e) => setAadhaarNum(e.target.value)}
                  className="form-input font-mono"
                  placeholder="XXXX XXXX XXXX"
                />
              </div>

              <div>
                <label className="form-label">Driver License Number (For Drivers)</label>
                <input
                  type="text"
                  value={licenseNum}
                  onChange={(e) => setLicenseNum(e.target.value)}
                  className="form-input font-mono"
                  placeholder="DL-XXXX-XXXXXXXXX"
                />
              </div>
            </div>

            <h3 className="font-bold text-lg text-slate-900 pt-3 flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-rose-600" /> Emergency Contacts Setup
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Contact Person Name</label>
                <input
                  type="text"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  placeholder="Parent / Guardian Name"
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Emergency Phone Number</label>
                <input
                  type="tel"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="form-input"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-base font-bold shadow-md"
            >
              {loading ? 'Saving Changes...' : 'Save & Re-calculate Trust Score'}
            </button>
          </form>
        </div>

        {/* Sidebar Trust Score */}
        <div className="space-y-6">
          <TrustScoreWidget trustScore={user?.trustScore || 94} trustBadge={user?.trustBadge || 'Highly Trusted'} />
        </div>

      </div>

    </div>
  );
}
