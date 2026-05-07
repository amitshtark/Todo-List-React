import { create } from 'zustand';

const useUIStore = create((set, get) => ({
  theme: localStorage.getItem('theme') || 'dark',
  sidebarCollapsed: false,
  notifications: [],
  modals: {
    createProject: false,
    createTask: false,
    taskDetail: false,
    deleteConfirm: false,
    settings: false,
    editProfile: false,
  },
  deleteTarget: null,

  toggleTheme() {
    const next = get().theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    set({ theme: next });
  },

  setTheme(theme) {
    localStorage.setItem('theme', theme);
    set({ theme });
  },

  toggleSidebar() {
    set(state => ({ sidebarCollapsed: !state.sidebarCollapsed }));
  },

  setSidebarCollapsed(v) {
    set({ sidebarCollapsed: v });
  },

  openModal(name) {
    set(state => ({ modals: { ...state.modals, [name]: true } }));
  },

  closeModal(name) {
    set(state => ({ modals: { ...state.modals, [name]: false } }));
  },

  closeAllModals() {
    const modals = {};
    for (const key of Object.keys(get().modals)) modals[key] = false;
    set({ modals });
  },

  setDeleteTarget(target) {
    set({ deleteTarget: target });
  },

  addNotification(notification) {
    const id = Math.random().toString(36).substr(2, 9);
    const notif = { id, timestamp: new Date().toISOString(), ...notification };
    set(state => ({ notifications: [notif, ...state.notifications].slice(0, 50) }));

    if (notification.autoDismiss !== false) {
      setTimeout(() => {
        get().removeNotification(id);
      }, notification.duration || 4000);
    }
    return id;
  },

  removeNotification(id) {
    set(state => ({ notifications: state.notifications.filter(n => n.id !== id) }));
  },

  clearNotifications() {
    set({ notifications: [] });
  },

  // Shorthand helpers
  toast: {
    success: (msg) => useUIStore.getState().addNotification({ type: 'success', message: msg }),
    error: (msg) => useUIStore.getState().addNotification({ type: 'error', message: msg, duration: 6000 }),
    info: (msg) => useUIStore.getState().addNotification({ type: 'info', message: msg }),
    warning: (msg) => useUIStore.getState().addNotification({ type: 'warning', message: msg }),
  },
}));

export default useUIStore;
