import React from "react";
import styles from "./themetoggle.module.css";
import { useThemeStore } from "../contexts/ThemeStore";

const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <span
      className={styles.iconToggle}
      onClick={toggleTheme}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      role="button"
      tabIndex={0}
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      onKeyDown={e => (e.key === "Enter" || e.key === " ") && toggleTheme()}
    >
      {isDark ? (
        // Moon icon
        <svg className={styles.icon} width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 1 0 9.79 9.79z" fill="#2563eb" />
        </svg>
      ) : (
        // Sun icon
        <svg className={styles.icon} width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="5" fill="#facc15" />
          <g stroke="#facc15" strokeWidth="2">
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </g>
        </svg>
      )}
    </span>
  );
};

export default ThemeToggle;