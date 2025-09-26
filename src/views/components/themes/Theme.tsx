import React from 'react';
import styles from './theme.module.css';

export interface ThemeProps {
  dark?: boolean;
  children: React.ReactNode;
}

const Theme: React.FC<ThemeProps> = ({ dark = false, children }) => (
  <div className={dark ? styles.dark : styles.light}>{children}</div>
);

export default Theme;