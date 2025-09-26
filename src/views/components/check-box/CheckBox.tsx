import React from "react";
import styles from "./checkbox.module.css";

export interface CheckBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  checked?: boolean;
}

const CheckBox: React.FC<CheckBoxProps> = ({ label, checked, ...props }) => (
  <div className={styles.wrapper}>
    <label htmlFor="cbx" className={styles.cbx}>
      <div className={styles.checkmark}>
        <input
          type="checkbox"
          id="cbx"
          className={styles.input}
          checked={checked}
          {...props}
        />
        <div className={styles.flip}>
          <div className={styles.front} />
          <div className={styles.back}>
            <svg viewBox="0 0 16 14" height={14} width={16}>
              <path d="M2 8.5L6 12.5L14 1.5" />
            </svg>
          </div>
        </div>
      </div>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  </div>
);

export default CheckBox;