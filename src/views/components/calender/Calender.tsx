import React from 'react';
import styles from './calender.module.css';

export interface CalenderProps {
  children?: React.ReactNode;
}

const Calender: React.FC<CalenderProps> = ({ children }) => (
  <div className={styles.calender}>{children}</div>
);

export default Calender;