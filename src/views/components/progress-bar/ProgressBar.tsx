import React from "react";
import styles from "./progressbar.module.css";

export interface ProgressBarProps {
  value: number; // 0-100
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value }) => (
  <div className={styles.progressbar}>
    <div
      className={styles.bar}
      data-progress={value}
    />
  </div>
);

export default ProgressBar;