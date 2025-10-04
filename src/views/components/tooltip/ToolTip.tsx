import React, { useState } from 'react';
import styles from './tooltip.module.css';

export interface ToolTipProps {
  text: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<ToolTipProps> = ({ text, children }) => {
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