import React from "react";
import styles from "./switch.module.css";

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  theme?: "light" | "dark";
}

const Switch: React.FC<SwitchProps> = ({ theme = "light", ...props }) => (
  <div className={`${styles.toggleSwitch} ${styles[theme]}`}>
    <input className={styles.toggleInput} id="toggle" type="checkbox" {...props} />
    <label className={styles.toggleLabel} htmlFor="toggle" />
  </div>
);

export default Switch;