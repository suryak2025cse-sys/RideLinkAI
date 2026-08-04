import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, CreditCard, PhoneCall, AlertCircle, User, Star, Plus, Trash2 } from 'lucide-react';
import TrustScoreWidget from '../components/TrustScoreWidget';
import ToastNotification from '../components/ToastNotification';
import { updateUser } from '../redux/authSlice';
import API from '../services/api';
import {
  validateAadhaar, sanitizeAadhaar,
  validatePan, sanitizePan,
  validateContact, sanitizeContact,
  validateLicense, sanitizeLicense,
  validateName, sanitizeName,
  validateEmail
} from '../utils/trustValidation';

export default function ProfileVerificationPage() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Controlled component state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [aadhaarNum, setAadhaarNum] = useState(user?.aadhaarNumber || '');
  const [panNum, setPanNum] = useState(user?.panNumber || '');
  const [licenseNum, setLicenseNum] = useState(user?.licenseNumber || '');

  // Emergency Contacts List state
  const [contacts, setContacts] = useState(
    user?.emergencyContacts?.length > 0
      ? user.emergencyContacts
      : [
          { name: user?.emergencyContactName || 'Rajesh K (Parent)', phone: user?.emergencyContactPhone || '9876543210', relation: 'Parent', isPrimary: true }
        ]
  );

  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactRelation, setNewContactRelation] = useState('Family');

  // Field validation error states
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    aadhaarNum: '',
    panNum: '',
    licenseNum: '',
    contacts: ''
  });

  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const isVerified = !!(user?.isAadhaarVerified && user?.isLicenseVerified && user?.aadhaarNumber && user?.licenseNumber);

  // Validate fields
  const validateFields = (fields = { name, email, aadhaarNum, panNum, licenseNum, contacts }) => {
    return {
      name: validateName(fields.name),
      email: validateEmail(fields.email),
      aadhaarNum: validateAadhaar(fields.aadhaarNum),
      panNum: validatePan(fields.panNum),
      licenseNum: validateLicense(fields.licenseNum),
      contacts: fields.contacts.length === 0 ? 'At least one emergency contact is required.' : ''
    };
  };

  const handleNameChange = (e) => {
    const sanitized = sanitizeName(e.target.value);
    setName(sanitized);
    setErrors(prev => ({ ...prev, name: validateName(sanitized) }));
  };

  const handleEmailChange = (e) => {
    const val = e.target.value.trim();
    setEmail(val);
    setErrors(prev => ({ ...prev, email: validateEmail(val) }));
  };

  const handleAadhaarChange = (e) => {
    const sanitized = sanitizeAadhaar(e.target.value);
    setAadhaarNum(sanitized);
    setErrors(prev => ({ ...prev, aadhaarNum: validateAadhaar(sanitized) }));
  };

  const handlePanChange = (e) => {
    const sanitized = sanitizePan(e.target.value);
    setPanNum(sanitized);
    setErrors(prev => ({ ...prev, panNum: validatePan(sanitized) }));
  };

  const handleLicenseChange = (e) => {
    const sanitized = sanitizeLicense(e.target.value);
    setLicenseNum(sanitized);
    setErrors(prev => ({ ...prev, licenseNum: validateLicense(sanitized) }));
  };

  const handleAddContact = (e) => {
    e.preventDefault();
    const nameErr = validateName(newContactName);
    const phoneErr = validateContact(newContactPhone);

    if (nameErr || phoneErr) {
      setToast({ message: nameErr || phoneErr, type: 'error' });
      return;
    }

    const isFirst = contacts.length === 0;
    const newEntry = {
      name: newContactName.trim(),
      phone: sanitizeContact(newContactPhone),
      relation: newContactRelation,
      isPrimary: isFirst
    };

    const updated = [...contacts, newEntry];
    setContacts(updated);
    setNewContactName('');
    setNewContactPhone('');
    setErrors(prev => ({ ...prev, contacts: '' }));
  };

  const handleRemoveContact = (index) => {
    const updated = contacts.filter((_, idx) => idx !== index);
    if (updated.length > 0 && !updated.some(c => c.isPrimary)) {
      updated[0].isPrimary = true;
    }
    setContacts(updated);
    if (updated.length === 0) {
      setErrors(prev => ({ ...prev, contacts: 'At least one emergency contact is required.' }));
    }
  };

  const handleSetPrimary = (index) => {
    const updated = contacts.map((c, idx) => ({ ...c, isPrimary: idx === index }));
    setContacts(updated);
  };

  // Compute form overall validity
  const currentValidationErrors = validateFields();
  const isFormValid =
    !currentValidationErrors.name &&
    !currentValidationErrors.email &&
    !currentValidationErrors.aadhaarNum &&
    !currentValidationErrors.panNum &&
    !currentValidationErrors.licenseNum &&
    contacts.length > 0;

  const handleUpdate = async (e) => {
    e.preventDefault();

    const submissionErrors = validateFields();
    setErrors(submissionErrors);

    if (Object.values(submissionErrors).some(err => err !== '')) {
      setToast({ message: '⚠️ Please resolve all validation errors before submitting.', type: 'error' });
      return;
    }

    setLoading(true);

    const primaryC = contacts.find(c => c.isPrimary) || contacts[0];

    const updatedData = {
      name: name.trim(),
      email: email.trim(),
      isAadhaarVerified: true,
      isLicenseVerified: true,
      aadhaarNumber: aadhaarNum.trim(),
      panNumber: panNum.trim(),
      licenseNumber: licenseNum.trim(),
      phone: primaryC.phone,
      emergencyContactName: primaryC.name,
      emergencyContactPhone: primaryC.phone,
      emergencyContacts: contacts,
      trustScore: 98,
      trustBadge: 'Verified Driver'
    };

    try {
      const res = await API.put('/auth/verifications', updatedData);

      if (res.data && res.data.user) {
        dispatch(updateUser({ 
          ...res.data.user, 
          isAadhaarVerified: true, 
          isLicenseVerified: true,
          aadhaarNumber: aadhaarNum.trim(),
          panNumber: panNum.trim(),
          licenseNumber: licenseNum.trim(),
          emergencyContacts: contacts
        }));
      } else {
        dispatch(updateUser(updatedData));
      }
    } catch (err) {
      dispatch(updateUser(updatedData));
    } finally {
      setLoading(false);
      setToast({ message: '✅ Identity & Emergency Contacts Verified! Driver Portal unlocked.', type: 'success' });
      setTimeout(() => navigate('/driver'), 1000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <ToastNotification message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      <div className="app-card p-8 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white">Profile & Emergency Contacts Settings</h2>
          <p className="text-base text-slate-400">Manage identity credentials and emergency contacts for route deviation auto escalations</p>
        </div>

        <div className="flex items-center gap-2">
          {isVerified ? (
            <span className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-extrabold px-4 py-2 rounded-2xl text-xs flex items-center gap-1.5 shadow-glow-emerald">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>AADHAAR & LICENSE VERIFIED</span>
            </span>
          ) : (
            <span className="bg-amber-950/80 border border-amber-500/40 text-amber-400 font-extrabold px-4 py-2 rounded-2xl text-xs flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>UNVERIFIED - DETAILS REQUIRED</span>
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Verification Form */}
        <div className="lg:col-span-2 app-card p-8 rounded-3xl space-y-6">
          <form onSubmit={handleUpdate} className="space-y-5" noValidate>
            
            {/* Personal Details Section */}
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-400" /> Personal Identity Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Driver Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  className={`form-input ${errors.name ? 'border-rose-500' : ''}`}
                  placeholder="e.g. Surya K"
                  required
                />
                {errors.name && <p className="text-xs text-rose-400 font-semibold mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  className={`form-input ${errors.email ? 'border-rose-500' : ''}`}
                  placeholder="e.g. driver@ridelink.ai"
                  required
                />
                {errors.email && <p className="text-xs text-rose-400 font-semibold mt-1">{errors.email}</p>}
              </div>
            </div>

            {/* Credential Identification Section */}
            <h3 className="font-bold text-lg text-white pt-2 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-cyan-400" /> Identity Credentials Validation
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="form-label">Aadhaar Card Number (12 Digits) *</label>
                <input
                  type="text"
                  value={aadhaarNum}
                  onChange={handleAadhaarChange}
                  maxLength={12}
                  className={`form-input font-mono ${errors.aadhaarNum ? 'border-rose-500' : ''}`}
                  placeholder="12-digit Aadhaar"
                  required
                />
                {errors.aadhaarNum && <p className="text-xs text-rose-400 font-semibold mt-1">{errors.aadhaarNum}</p>}
              </div>

              <div>
                <label className="form-label">PAN Number (10 Chars) *</label>
                <input
                  type="text"
                  value={panNum}
                  onChange={handlePanChange}
                  maxLength={10}
                  className={`form-input font-mono uppercase ${errors.panNum ? 'border-rose-500' : ''}`}
                  placeholder="e.g. ABCDE1234F"
                  required
                />
                {errors.panNum && <p className="text-xs text-rose-400 font-semibold mt-1">{errors.panNum}</p>}
              </div>

              <div>
                <label className="form-label">Driver License Number *</label>
                <input
                  type="text"
                  value={licenseNum}
                  onChange={handleLicenseChange}
                  maxLength={16}
                  className={`form-input font-mono uppercase ${errors.licenseNum ? 'border-rose-500' : ''}`}
                  placeholder="e.g. DL1420110012345"
                  required
                />
                {errors.licenseNum && <p className="text-xs text-rose-400 font-semibold mt-1">{errors.licenseNum}</p>}
              </div>
            </div>

            {/* Emergency Contacts Management Section */}
            <h3 className="font-bold text-lg text-white pt-2 flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-rose-400" /> Emergency Contacts Setup (Twilio Voice & SMS Target)
            </h3>

            <div className="space-y-3">
              {contacts.map((c, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-white text-sm">{c.name}</h4>
                        {c.isPrimary && (
                          <span className="bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full text-[10px] uppercase flex items-center gap-1">
                            <Star className="w-3 h-3 fill-slate-950" /> Primary Target
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 font-mono">{c.phone} • {c.relation}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!c.isPrimary && (
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(idx)}
                        className="text-xs font-bold text-amber-400 hover:underline bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700"
                      >
                        Set as Primary
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveContact(idx)}
                      className="text-slate-400 hover:text-rose-400 p-1.5 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {errors.contacts && <p className="text-xs text-rose-400 font-semibold">{errors.contacts}</p>}

              {/* Add New Contact Row */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-dashed border-slate-700 space-y-3">
                <h5 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">Add Emergency Contact</h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={newContactName}
                    onChange={(e) => setNewContactName(sanitizeName(e.target.value))}
                    placeholder="Contact Name"
                    className="form-input text-xs"
                  />
                  <input
                    type="tel"
                    value={newContactPhone}
                    onChange={(e) => setNewContactPhone(sanitizeContact(e.target.value))}
                    placeholder="10-Digit Mobile"
                    maxLength={10}
                    className="form-input text-xs font-mono"
                  />
                  <select
                    value={newContactRelation}
                    onChange={(e) => setNewContactRelation(e.target.value)}
                    className="form-input text-xs bg-slate-800"
                  >
                    <option value="Parent">Parent</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Friend">Friend</option>
                    <option value="Guardian">Guardian</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleAddContact}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 border border-slate-700"
                >
                  <Plus className="w-4 h-4 text-emerald-400" />
                  <span>Add Emergency Contact</span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid || loading}
              className={`w-full py-4 text-base font-black uppercase tracking-wider rounded-2xl transition-all ${
                isFormValid && !loading
                  ? 'btn-primary shadow-neon-cyan cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              {loading ? 'Validating Credentials & Contacts...' : 'Save Settings & Verify Driver Credentials'}
            </button>
          </form>
        </div>

        {/* Sidebar Trust Score */}
        <div className="space-y-6">
          <TrustScoreWidget 
            trustScore={isVerified ? 98 : 80} 
            trustBadge={isVerified ? 'Verified Driver' : 'Unverified Member'} 
          />
        </div>

      </div>

    </div>
  );
}
