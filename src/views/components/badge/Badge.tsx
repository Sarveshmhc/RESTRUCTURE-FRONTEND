import React from 'react';
import styles from './badge.module.css';

export interface BadgeProps {
  label: string;
  color?: 'primary' | 'success' | 'danger' | 'warning';
}

const Badge: React.FC<BadgeProps> = ({ label, color = 'primary' }) => (
  <span className={`${styles.badge} ${styles[color]}`}>{label}</span>
);

export default Badge;