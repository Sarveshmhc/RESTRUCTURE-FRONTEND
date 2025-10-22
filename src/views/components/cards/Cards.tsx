import React from 'react';
import styles from './cards.module.css';

export interface CardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  // optional shadow prop used by some callers (e.g. ExpandableCard)
  shadow?: 'soft' | 'none' | string;
}

const Card: React.FC<CardProps> = ({ children, onClick, className = '', shadow }) => {
  // map a small set of shadow names to CSS utility classes or preserve for future use
  const shadowClass = shadow === 'none' ? '' : shadow === 'soft' ? styles.softShadow : '';
  return (
    <div className={`${styles.card} ${shadowClass} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;