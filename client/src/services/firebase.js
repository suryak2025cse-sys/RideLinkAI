import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyArKReLHdQzxnbeimpiEf0MqDKUvQGK4mk",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ridelinkai-c0199.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ridelinkai-c0199",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ridelinkai-c0199.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "598706395693",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:598706395693:web:12f2a3d566fe086f4cf6a4",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-K32C87S652"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Force Google to show the account picker window every time
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export const signInWithGoogleFirebase = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    return {
      success: true,
      user: {
        name: user.displayName,
        email: user.email,
        picture: user.photoURL,
        uid: user.uid
      }
    };
  } catch (error) {
    console.error('[Firebase Google Auth Error]:', error.message);
    return { success: false, error: error.message };
  }
};
