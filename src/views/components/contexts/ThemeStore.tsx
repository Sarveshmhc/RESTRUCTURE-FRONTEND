import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

const updateCSSVariables = (isDark: boolean) => {
  const root = document.documentElement;

  if (isDark) {
    // Dark theme variables
    root.style.setProperty('--bg', '#0f172a');
    root.style.setProperty('--bg-secondary', '#1e293b');
    root.style.setProperty('--bg-tertiary', '#334155');
    root.style.setProperty('--text', '#f1f5f9');
    root.style.setProperty('--text-secondary', '#cbd5e0');
    root.style.setProperty('--text-muted', '#94a3b8');

    // Sidebar dark theme
    root.style.setProperty('--sidebar-bg', '#1e293b');
    root.style.setProperty('--sidebar-text', '#f1f5f9');
    root.style.setProperty('--sidebar-hover', '#334155');
    root.style.setProperty('--sidebar-active', '#3b82f6');
    root.style.setProperty('--sidebar-active-text', '#ffffff');
    root.style.setProperty('--sidebar-border', '#334155');
    root.style.setProperty('--sidebar-header-bg', '#1e293b');

    // Header dark theme
    root.style.setProperty('--header-bg', '#1e293b');
    root.style.setProperty('--header-text', '#f1f5f9');
    root.style.setProperty('--header-border', '#334155');

    // Search dark theme
    root.style.setProperty('--search-bg', '#334155');
    root.style.setProperty('--search-border', '#475569');
    root.style.setProperty('--search-text', '#f1f5f9');
    root.style.setProperty('--search-placeholder', '#94a3b8');

    // Border colors dark
    root.style.setProperty('--border-color', '#334155');
    root.style.setProperty('--border-light', '#475569');
    root.style.setProperty('--border-dark', '#1e293b');

    // Utility colors dark
    root.style.setProperty('--shadow', 'rgba(0, 0, 0, 0.3)');
    root.style.setProperty('--shadow-lg', 'rgba(0, 0, 0, 0.4)');
    root.style.setProperty('--overlay', 'rgba(0, 0, 0, 0.7)');
  } else {
    // Light theme variables
    root.style.setProperty('--bg', '#ffffff');
    root.style.setProperty('--bg-secondary', '#f8fafc');
    root.style.setProperty('--bg-tertiary', '#f1f5f9');
    root.style.setProperty('--text', '#1e293b');
    root.style.setProperty('--text-secondary', '#475569');
    root.style.setProperty('--text-muted', '#64748b');

    // Sidebar light theme
    root.style.setProperty('--sidebar-bg', '#ffffff');
    root.style.setProperty('--sidebar-text', '#1e293b');
    root.style.setProperty('--sidebar-hover', '#f1f5f9');
    root.style.setProperty('--sidebar-active', '#3b82f6');
    root.style.setProperty('--sidebar-active-text', '#ffffff');
    root.style.setProperty('--sidebar-border', '#e2e8f0');
    root.style.setProperty('--sidebar-header-bg', '#ffffff');

    // Header light theme
    root.style.setProperty('--header-bg', '#ffffff');
    root.style.setProperty('--header-text', '#1e293b');
    root.style.setProperty('--header-border', '#e2e8f0');

    // Search light theme
    root.style.setProperty('--search-bg', '#f8fafc');
    root.style.setProperty('--search-border', '#e2e8f0');
    root.style.setProperty('--search-text', '#1e293b');
    root.style.setProperty('--search-placeholder', '#94a3b8');

    // Border colors light
    root.style.setProperty('--border-color', '#e2e8f0');
    root.style.setProperty('--border-light', '#f1f5f9');
    root.style.setProperty('--border-dark', '#cbd5e0');

    // Utility colors light
    root.style.setProperty('--shadow', 'rgba(0, 0, 0, 0.1)');
    root.style.setProperty('--shadow-lg', 'rgba(0, 0, 0, 0.15)');
    root.style.setProperty('--overlay', 'rgba(0, 0, 0, 0.5)');
  }
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      isDark: false,

      toggleTheme: () => {
        const newTheme = !get().isDark;
        set({ isDark: newTheme });

        // Prevent transitions during theme switch for instant change
        document.body.classList.add('theme-switching');

        // Update CSS variables instantly
        updateCSSVariables(newTheme);

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

        // Update CSS variables instantly
        updateCSSVariables(isDark);

        // Update document class
        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
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
          updateCSSVariables(true);
        } else {
          document.documentElement.classList.remove('dark');
          updateCSSVariables(false);
        }
      },
    }
  )
);