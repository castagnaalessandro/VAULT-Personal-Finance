import { create } from 'zustand';
import { Transaction, Goal, UserProfile } from '../types';
import { loadUserData, saveUserData, clearSession, getDisplayName } from '../lib/auth';

export type View = 'dashboard' | 'transactions' | 'goals' | 'stats';

interface UserState extends UserProfile {
  uid: string | null;
}

interface FinanceState {
  user: UserState;
  transactions: Transaction[];
  goals: Goal[];
  currentView: View;
  isInitialSyncDone: boolean;
  isSyncing: boolean;

  // Chiamata dopo il login per caricare i dati dell'utente
  loadUser: (userId: string) => void;

  setCurrentView: (view: View) => void;
  setProfile: (profile: Partial<UserProfile>) => void;
  setUserUid: (uid: string | null) => void;
  addTransaction: (tx: Omit<Transaction, 'id' | 'date'>) => void;
  removeTransaction: (id: string) => void;
  updateGoal: (id: string, current: number) => void;
  addGoal: (goal: Omit<Goal, 'id' | 'current'>) => void;
  removeGoal: (id: string) => void;
  resetData: () => void;
  logout: () => void;
  syncData: (uid: string) => () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function persist(userId: string, state: Pick<FinanceState, 'transactions' | 'goals' | 'user'>) {
  saveUserData(userId, {
    transactions: state.transactions,
    goals: state.goals,
    profile: {
      name: state.user.name,
      theme: state.user.theme,
      onboarded: state.user.onboarded,
    },
  });
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useStore = create<FinanceState>()((set, get) => ({
  user: { uid: null, name: '', theme: 'dark', onboarded: false },
  transactions: [],
  goals: [],
  currentView: 'dashboard',
  isInitialSyncDone: true,
  isSyncing: false,

  loadUser: (userId: string) => {
    const saved = loadUserData(userId);
    const displayName = getDisplayName(userId);
    if (saved) {
      set({
        user: {
          uid: userId,
          name: saved.profile?.name ?? displayName,
          theme: saved.profile?.theme ?? 'dark',
          onboarded: true,
        },
        transactions: saved.transactions ?? [],
        goals: saved.goals ?? [],
      });
    } else {
      // Primo accesso: dati vuoti
      set({
        user: { uid: userId, name: displayName, theme: 'dark', onboarded: true },
        transactions: [],
        goals: [],
      });
    }
  },

  setCurrentView: (view) => set({ currentView: view }),

  setUserUid: (uid) => set((s) => ({ user: { ...s.user, uid } })),

  setProfile: (profile) => {
    set((s) => {
      const updated = { ...s.user, ...profile };
      if (s.user.uid) persist(s.user.uid, { ...s, user: updated });
      return { user: updated };
    });
  },

  syncData: (_uid) => () => {},

  addTransaction: (tx) => {
    set((s) => {
      const newTx: Transaction = {
        ...tx,
        id: `tx_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        date: new Date().toISOString(),
      };
      const transactions = [newTx, ...s.transactions];
      if (s.user.uid) persist(s.user.uid, { ...s, transactions });
      return { transactions };
    });
  },

  removeTransaction: (id) => {
    set((s) => {
      const transactions = s.transactions.filter((t) => t.id !== id);
      if (s.user.uid) persist(s.user.uid, { ...s, transactions });
      return { transactions };
    });
  },

  updateGoal: (id, current) => {
    set((s) => {
      const goals = s.goals.map((g) => (g.id === id ? { ...g, current } : g));
      if (s.user.uid) persist(s.user.uid, { ...s, goals });
      return { goals };
    });
  },

  addGoal: (goal) => {
    set((s) => {
      const newGoal: Goal = {
        ...goal,
        id: `goal_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        current: 0,
      };
      const goals = [...s.goals, newGoal];
      if (s.user.uid) persist(s.user.uid, { ...s, goals });
      return { goals };
    });
  },

  removeGoal: (id) => {
    set((s) => {
      const goals = s.goals.filter((g) => g.id !== id);
      if (s.user.uid) persist(s.user.uid, { ...s, goals });
      return { goals };
    });
  },

  resetData: () => {
    set((s) => {
      if (s.user.uid) persist(s.user.uid, { ...s, transactions: [], goals: [] });
      return { transactions: [], goals: [] };
    });
  },

  logout: () => {
    clearSession();
    set({
      user: { uid: null, name: '', theme: 'dark', onboarded: false },
      transactions: [],
      goals: [],
      currentView: 'dashboard',
    });
  },
}));
