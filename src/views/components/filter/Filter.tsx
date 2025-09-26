import React from 'react';
import styles from './filter.module.css';

export interface FilterProps {
  children: React.ReactNode;
}

const Filter: React.FC<FilterProps> = ({ children }) => (
  <div className={styles.filter}>{children}</div>
);

export default Filter;