import React, { useEffect } from "react";
import styles from "./themetoggle.module.css";
import { useThemeStore } from "../../contexts/ThemeStore";

const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useThemeStore();

  useEffect(() => {
    if (typeof document !== "undefined") {
      if (isDark) document.documentElement.dataset.theme = "dark";
      else document.documentElement.removeAttribute("data-theme");
    }
  }, [isDark]);

  const cssVars: React.CSSProperties = {
    ["--sun-color" as any]: isDark ? "#f6c84c" : "#f59e0b",
    ["--toggle-icon-color" as any]: isDark ? "#ffffff" : "var(--header-text, #111827)",
  };

  return (
    <button
      type="button"
      className={`${styles.iconToggle} ${isDark ? styles.dark : styles.light}`}
      onClick={toggleTheme}
      aria-pressed={!!isDark}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      style={cssVars}
    >
      <span className={styles.icons} aria-hidden>
        {/* Sun */}
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          className={`${styles.icon} ${styles.sun}`}
          focusable="false"
          aria-hidden
        >
          <circle cx="12" cy="12" r="4" fill="currentColor" />
          <g
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          >
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="M4.93 4.93l1.41 1.41" />
            <path d="M17.66 17.66l1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="M4.93 19.07l1.41-1.41" />
            <path d="M17.66 6.34l1.41-1.41" />
          </g>
        </svg>

        {/* Moon */}
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          className={`${styles.icon} ${styles.moon}`}
          focusable="false"
          aria-hidden
        >
          <path
            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
            fill="currentColor"
          />
        </svg>
      </span>
    </button>
  );
};

export default ThemeToggle;