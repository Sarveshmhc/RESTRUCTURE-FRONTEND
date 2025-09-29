import React, { useEffect, useRef } from 'react';
import styles from './auto-scroll.module.css';

export interface AutoScrollProps {
  children: React.ReactNode;
}

const AutoScroll: React.FC<AutoScrollProps> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [children]);
  return (
    <div className={styles.autoScroll} ref={ref}>
      {children}
    </div>
  );
};

export default AutoScroll;