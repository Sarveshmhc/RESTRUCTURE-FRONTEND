import React from "react";
import styles from "./notification.module.css";
import { useThemeStore } from "../../contexts/ThemeStore";
import Tooltip from "../../components/tooltip/ToolTip";

const NotificationButton: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
  const { isDark } = useThemeStore();

  return (
    <Tooltip text="Notifications" delay={500} placement="bottom">
      <button
        type="button"
        onClick={onClick}
        className={`${styles.notifyBtn} ${isDark ? styles.dark : styles.light}`}
        aria-label="Notifications"
      >
        <svg className={styles.icon} width="20" height="20" viewBox="0 0 24 24" aria-hidden>
          {/* ...icon path... */}
        </svg>
        <span className={styles.counter} aria-hidden>3</span>
      </button>
    </Tooltip>
  );
};

export default NotificationButton;