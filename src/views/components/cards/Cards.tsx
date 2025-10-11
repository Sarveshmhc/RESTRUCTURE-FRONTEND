import React from 'react';
import styles from './cards.module.css';

export interface CardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, onClick, className }) => (
  <div className={`${styles.card} ${className}`} onClick={onClick}>
    {children}
  </div>
);


export default Card;