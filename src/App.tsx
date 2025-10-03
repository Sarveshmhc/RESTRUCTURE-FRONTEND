import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './views/contexts/AuthContext';
import { LoadingProvider } from './views/contexts/LoadingContext';
import { ToastProvider } from './views/contexts/ToastContext';
import { useThemeStore } from './views/contexts/ThemeStore';
import AppRoutes from './routes/AppRoutes';

const App: React.FC = () => {
  const { setTheme } = useThemeStore();

  useEffect(() => {
    // Initialize theme on app load
    const savedTheme = localStorage.getItem('theme-storage');
    if (savedTheme) {
      try {
        const themeData = JSON.parse(savedTheme);
        if (themeData?.state?.isDark !== undefined) {
          setTheme(themeData.state.isDark);
        }
      } catch (error) {
        console.warn('Error parsing saved theme:', error);
        // Fallback to system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark);
      }
    } else {
      // Check system preference if no saved theme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark);
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't manually set a theme
      const hasManualTheme = localStorage.getItem('theme-storage');
      if (!hasManualTheme) {
        setTheme(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [setTheme]);

  return (
    <AuthProvider>
      <LoadingProvider>
        <ToastProvider>
          <Router>
            <div className="app layout-transition-only">
              <AppRoutes />
            </div>
          </Router>
        </ToastProvider>
      </LoadingProvider>
    </AuthProvider>
  );
};

export default App;