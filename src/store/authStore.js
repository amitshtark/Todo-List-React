import { create } from 'zustand';
import { auth, googleProvider } from '../lib/firebase.js';
import { seedDemoData } from '../utils/seedDemo.js';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';

const useAuthStore = create((set, get) => ({
  user: null,
  loading: true,
  error: null,

  // Demo mode — works without Firebase config
  demoMode: false,

  init() {
    try {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        set({ user: firebaseUser, loading: false });
      });
      return unsubscribe;
    } catch {
      // If Firebase not configured, check for demo session
      const demoUser = localStorage.getItem('demo_user');
      const parsed = demoUser ? JSON.parse(demoUser) : null;
      set({ user: parsed, loading: false, demoMode: true });
      if (parsed?.uid) seedDemoData(parsed.uid).catch(() => {});
      return () => {};
    }
  },

  async loginWithGoogle() {
    if (get().demoMode) return get().loginDemo('Google User', 'google@demo.com');
    set({ error: null });
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  async loginWithEmail(email, password) {
    if (get().demoMode) return get().loginDemo(email.split('@')[0], email);
    set({ error: null });
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  async register(email, password, displayName) {
    if (get().demoMode) return get().loginDemo(displayName, email);
    set({ error: null });
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName });
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  async logout() {
    if (get().demoMode) {
      localStorage.removeItem('demo_user');
      set({ user: null });
      return;
    }
    await signOut(auth);
  },

  // Works without Firebase — persists to localStorage
  loginDemo(name = 'Demo User', email = 'demo@taskflow.app') {
    // Use a stable uid so seed data is only created once
    const uid = 'demo-uid-taskflow';
    const user = { uid, displayName: name, email, photoURL: null, isDemo: true };
    localStorage.setItem('demo_user', JSON.stringify(user));
    set({ user, loading: false, demoMode: true });
    // Seed demo projects/tasks if first time
    seedDemoData(uid).catch(() => {});
    return user;
  },

  clearError() {
    set({ error: null });
  },
}));

export default useAuthStore;
