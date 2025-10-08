import React from "react";
import styles from "./themetoggle.module.css";
import { useThemeStore } from "../../contexts/ThemeStore";

const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <button
      type="button"
      className={`${styles.iconToggle} ${isDark ? styles.dark : styles.light}`}
      onClick={toggleTheme}
      aria-pressed={isDark}
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      <span className={styles.icons} aria-hidden>
        <svg
          className={styles.sun}
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          focusable="false"
          role="img"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="5" fill="#FDBA12" />
          <g stroke="#F59E0B" strokeWidth="1.6" strokeLinecap="round">
            <line x1="12" y1="1.5" x2="12" y2="4" />
            <line x1="12" y1="20" x2="12" y2="22.5" />
            <line x1="4.8" y1="4.8" x2="6.5" y2="6.5" />
            <line x1="17.5" y1="17.5" x2="19.2" y2="19.2" />
            <line x1="1.5" y1="12" x2="4" y2="12" />
            <line x1="20" y1="12" x2="22.5" y2="12" />
            <line x1="4.8" y1="19.2" x2="6.5" y2="17.5" />
            <line x1="17.5" y1="6.5" x2="19.2" y2="4.8" />
          </g>
        </svg>

        <svg
          className={styles.moon}
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          focusable="false"
          role="img"
          aria-hidden="true"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 1 0 9.79 9.79z" fill="#1E3A8A" />
        </svg>
      </span>
    </button>
  );
};

export default ThemeToggle;