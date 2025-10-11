import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ToastProvider } from './views/contexts/ToastContext.tsx'
import { AuthProvider } from './views/contexts/AuthContext.tsx'

// Ensure this runs before React renders
if (typeof document !== "undefined") {
  // remove legacy class
  document.documentElement.classList.remove("dark");
  document.body.classList.remove("theme-switching");

  // try to read persisted theme from common keys (adapt key if you use a different name)
  const candidates = Object.keys(localStorage).filter(k => /theme|zustand|persist/i.test(k));
  let themeFromStorage: string | null = null;
  for (const k of candidates) {
    try {
      const raw = localStorage.getItem(k);
      if (!raw) continue;
      // try parse JSON then fallback to raw string
      const parsed = JSON.parse(raw);
      // zustand persist common shape: { state: { theme: 'dark' } }
      if (parsed && parsed.state && (parsed.state.theme === "dark" || parsed.state.theme === "light")) {
        themeFromStorage = parsed.state.theme;
        break;
      }
      if (parsed === "dark" || parsed === "light") {
        themeFromStorage = parsed;
        break;
      }
    } catch {
      const raw = localStorage.getItem(k);
      if (raw === "dark" || raw === "light") {
        themeFromStorage = raw;
        break;
      }
    }
  }

  if (themeFromStorage === "dark" || themeFromStorage === "light") {
    document.documentElement.dataset.theme = themeFromStorage;
  } else {
    // default to light — remove attribute to use light tokens
    document.documentElement.removeAttribute("data-theme");
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ToastProvider>
  </StrictMode>,
)

