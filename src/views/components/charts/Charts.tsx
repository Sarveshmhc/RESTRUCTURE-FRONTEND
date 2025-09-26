import React from 'react';
import styles from './charts.module.css';

export interface ChartsProps {
  title: string;
  children?: React.ReactNode;
}

const Charts: React.FC<ChartsProps> = ({ title, children }) => (
  <div className={styles.chart}>
    <div className={styles.title}>{title}</div>
    <div>{children}</div>
  </div>
);

export default Charts;