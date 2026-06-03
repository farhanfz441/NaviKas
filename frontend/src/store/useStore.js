import { create } from 'zustand'

// ── helpers ──────────────────────────────────────────────────
const loadUser = () => {
  try {
    const raw = localStorage.getItem('fintrack_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const saveUser = (user) => {
  try {
    if (user) localStorage.setItem('fintrack_user', JSON.stringify(user));
    else       localStorage.removeItem('fintrack_user');
  } catch { /* quota error — ignore */ }
};

// ── store ─────────────────────────────────────────────────────
export const useStore = create(set => ({
  token:        localStorage.getItem('fintrack_token') || null,
  user:         loadUser(),          // ← restored from localStorage on boot
  transactions: [],
  prediction:   null,
  isDark:       true,

  setToken: token => {
    localStorage.setItem('fintrack_token', token);
    set({ token });
  },

  // Call this right after a successful login / register
  setUser: user => {
    saveUser(user);
    set({ user });
  },

  logout: () => {
    localStorage.removeItem('fintrack_token');
    localStorage.removeItem('fintrack_user');
    set({ token: null, user: null, transactions: [] });
  },

  setTransactions: transactions => set({ transactions }),
  setPrediction:   prediction   => set({ prediction }),
  addTransaction:  txn => set(s => ({ transactions: [txn, ...s.transactions] })),
  setIsDark:       isDark => set({ isDark }),
}));