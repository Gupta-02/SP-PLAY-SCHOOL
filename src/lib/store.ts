import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, ActivityLog, FilterState } from '@/types';
import { ACTIVITY_LOGS, ALL_USERS } from '@/data/seedData';

const DEFAULT_FILTERS: FilterState = {
  studentId: '',
  teacherId: '',
  standardId: '',
  divisionId: '',
  category: '',
  keyword: '',
  dateFrom: '',
  dateTo: '',
  month: '',
  year: '',
};

interface AppState {
  currentUser: User | null;
  activities: ActivityLog[];
  filters: FilterState;
  sidebarOpen: boolean;

  login: (userId: string) => void;
  logout: () => void;

  addActivity: (activity: ActivityLog) => void;
  updateActivity: (id: string, updates: Partial<ActivityLog>) => void;
  deleteActivity: (id: string) => void;

  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;

  setSidebarOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentUser: null,
      activities: ACTIVITY_LOGS,
      filters: DEFAULT_FILTERS,
      sidebarOpen: false,

      login: (userId) => {
        const user = ALL_USERS.find((u) => u.id === userId) ?? null;
        set({ currentUser: user });
      },

      logout: () => set({ currentUser: null }),

      addActivity: (activity) =>
        set((state) => ({ activities: [activity, ...state.activities] })),

      updateActivity: (id, updates) =>
        set((state) => ({
          activities: state.activities.map((a) =>
            a.id === id ? { ...a, ...updates, edited: true } : a
          ),
        })),

      deleteActivity: (id) =>
        set((state) => ({
          activities: state.activities.filter((a) => a.id !== id),
        })),

      setFilters: (filters) =>
        set((state) => ({ filters: { ...state.filters, ...filters } })),

      resetFilters: () => set({ filters: DEFAULT_FILTERS }),

      setSidebarOpen: (open) => set({ sidebarOpen: open }),
    }),
    { name: 'sp-play-school-store', partialize: (s) => ({ currentUser: s.currentUser }) }
  )
);
