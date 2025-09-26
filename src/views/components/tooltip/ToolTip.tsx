import React, { useState } from 'react';
import styles from './tooltip.module.css';

export interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  const [show, setShow] = useState(false);
  return (
    <span
      className={styles.wrapper}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && <span className={styles.tooltip}>{text}</span>}
    </span>
  );
};

export default Tooltip;