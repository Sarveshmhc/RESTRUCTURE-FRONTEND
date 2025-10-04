import React from 'react';
import styles from './dropdown.module.css';

export interface DropDownProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
}

const Dropdown: React.FC<DropDownProps> = ({ options, ...props }) => (
  <select className={styles.dropdown} {...props}>
    {options.map(opt => (
      <option key={opt.value} value={opt.value}>{opt.label}</option>
    ))}
  </select>
);

export default Dropdown;