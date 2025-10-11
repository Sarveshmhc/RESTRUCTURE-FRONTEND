import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      isDark: false,

      toggleTheme: () => {
        const newTheme = !get().isDark;
        set({ isDark: newTheme });

        // Prevent transitions during theme switch for instant change
        document.body.classList.add('theme-switching');

        // Update document class for additional styling
        if (newTheme) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }

        // Remove transition prevention after instant update
        setTimeout(() => {
          document.body.classList.remove('theme-switching');
        }, 10);
      },

      setTheme: (isDark: boolean) => {
        set({ isDark });

        // Prevent transitions during theme switch
        document.body.classList.add('theme-switching');

        // Update document class
        if (typeof document !== 'undefined') {
          if (isDark) {
            document.documentElement.dataset.theme = 'dark';
          } else {
            document.documentElement.removeAttribute('data-theme');
          }
          document.documentElement.classList.remove('dark'); // remove legacy
        }

        // Remove transition prevention
        setTimeout(() => {
          document.body.classList.remove('theme-switching');
        }, 10);
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        // Apply theme on app load
        if (state?.isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
    }
  )
);