import React from "react";
import styles from "./toggle.module.css";

export interface ToggleProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Toggle: React.FC<ToggleProps> = ({ label, ...props }) => (
  <label className={styles.toggle}>
    <input type="checkbox" {...props} />
    <span className={styles.slider}></span>
    {label && <span className={styles.label}>{label}</span>}
  </label>
);

export default Toggle;