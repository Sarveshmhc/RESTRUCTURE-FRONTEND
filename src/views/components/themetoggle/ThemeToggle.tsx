import React from "react";
import styles from "./toggleSwitch.module.css";
import { Sun, Moon } from "lucide-react";
import { useThemeStore } from "../../context/themeStore";

const ToggleSwitch: React.FC = () => {
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <button
      className={`${styles.toggle} ${isDark ? styles.dark : styles.light}`}
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      type="button"
    >
      <span className={styles.icon}>
        {isDark ? <Moon size={20} /> : <Sun size={20} />}
      </span>
      <span className={styles.label}>
        {isDark ? "Dark" : "Light"}
      </span>
      <span
        className={`${styles.slider} ${isDark ? styles.sliderDark : styles.sliderLight}`}
      />
    </button>
  );
};

export default ToggleSwitch;