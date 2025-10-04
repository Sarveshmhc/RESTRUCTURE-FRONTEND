import React from "react";
import styles from "./sidebartooltip.module.css";

export interface SidebarTooltipProps {
  text: string;
  children: React.ReactNode;
  className?: string;
}

const SidebarTooltip: React.FC<SidebarTooltipProps> = ({ text, children, className }) => {
  return (
    <span className={`${styles.wrap} ${className || ""}`} aria-label={text}>
      {children}
      <span className={styles.tip} role="tooltip">
        {text}
        <span className={styles.arrow} />
      </span>
    </span>
  );
};

export default SidebarTooltip;