import React, { useState } from 'react';
import styles from './expandablecard.module.css';

export interface ExpandableCardProps {
  title: string;
  children: React.ReactNode;
}

const ExpandableCard: React.FC<ExpandableCardProps> = ({ title, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.card}>
      <div className={styles.header} onClick={() => setOpen(o => !o)}>
        {title}
      </div>
      {open && <div className={styles.content}>{children}</div>}
    </div>
  );
};

export default ExpandableCard;