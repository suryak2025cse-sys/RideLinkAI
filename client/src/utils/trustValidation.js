/**
 * RideLinkAI Driver Trust Validation Helper Module
 * Modular validation and sanitization functions for identity verification.
 */

// 1. Aadhaar Number Validation (Exactly 12 numeric digits)
export const validateAadhaar = (val) => {
  if (!val || val.trim() === '') {
    return 'Aadhaar number is required.';
  }
  const cleaned = val.replace(/\D/g, '');
  if (cleaned.length !== 12) {
    return 'Aadhaar number must contain exactly 12 digits.';
  }
  return '';
};

export const sanitizeAadhaar = (val) => {
  return val.replace(/\D/g, '').slice(0, 12);
};

// 2. PAN Number Validation (5 Alphabets + 4 Numbers + 1 Alphabet, Uppercase, 10 chars)
export const validatePan = (val) => {
  if (!val || val.trim() === '') {
    return 'PAN number is required.';
  }
  const upper = val.toUpperCase().trim();
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  if (!panRegex.test(upper)) {
    return 'Enter a valid PAN number.';
  }
  return '';
};

export const sanitizePan = (val) => {
  return val.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
};

// 3. Contact Number Validation (10 digits starting with 6, 7, 8, or 9)
export const validateContact = (val) => {
  if (!val || val.trim() === '') {
    return 'Contact number is required.';
  }
  const cleaned = val.replace(/\D/g, '');
  const mobileRegex = /^[6-9]\d{9}$/;
  if (!mobileRegex.test(cleaned)) {
    return 'Enter a valid 10-digit mobile number.';
  }
  return '';
};

export const sanitizeContact = (val) => {
  return val.replace(/\D/g, '').slice(0, 10);
};

// 4. Driving License Number Validation (Uppercase, Indian DL format)
export const validateLicense = (val) => {
  if (!val || val.trim() === '') {
    return 'Driving license number is required.';
  }
  const upper = val.toUpperCase().trim();
  // Standard Indian DL regex: State code (2 letters) + optional space/hyphen + numbers/letters (13 to 16 length)
  const dlRegex = /^[A-Z]{2}[- ]?[0-9]{2}[- ]?[0-9]{4}[- ]?[0-9]{7}$|^[A-Z]{2}[0-9]{13,14}$|^[A-Z]{2}[- ]?[0-9]{11,14}$/;
  if (!dlRegex.test(upper) || upper.length < 13 || upper.length > 16) {
    return 'Enter a valid Indian Driving License number.';
  }
  return '';
};

export const sanitizeLicense = (val) => {
  return val.toUpperCase().replace(/[^A-Z0-9 -]/g, '').slice(0, 16);
};

// 5. Name Validation (Only alphabets and spaces)
export const validateName = (val) => {
  if (!val || !val.trim()) {
    return 'Name is required.';
  }
  const nameRegex = /^[a-zA-Z\s]+$/;
  if (!nameRegex.test(val.trim())) {
    return 'Name must contain only alphabets and spaces.';
  }
  return '';
};

export const sanitizeName = (val) => {
  return val.replace(/[^a-zA-Z\s]/g, '');
};

// 6. Email Validation (Standard email format)
export const validateEmail = (val) => {
  if (!val || !val.trim()) {
    return 'Email address is required.';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(val.trim())) {
    return 'Enter a valid email address.';
  }
  return '';
};
