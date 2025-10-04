import React, { useEffect, useRef, useState } from 'react';
import styles from './tooltip.module.css';

export type TooltipPlacement = 'top' | 'right' | 'bottom' | 'left';

export interface ToolTipProps {
  text: string;
  children: React.ReactNode;
  placement?: TooltipPlacement;
  delay?: number;           // show delay in ms (default 100)
  disabled?: boolean;
  className?: string;
}

const Tooltip: React.FC<ToolTipProps> = ({
  text,
  children,
  placement = 'top',
  delay = 100,
  disabled = false,
  className,
}) => {
  const [show, setShow] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  const onEnter = () => {
    if (disabled) return;
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setShow(true), delay);
  };

  const onLeave = () => {
    clearTimeout(timer.current);
    setShow(false);
  };

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <span
      className={`${styles.wrapper} ${className || ''}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      data-has-tooltip
    >
      {children}
      {!disabled && (
        <span
          className={`${styles.tooltip} ${show ? styles.show : ''}`}
          role="tooltip"
          data-placement={placement}
        >
          {text}
          <span className={styles.arrow} aria-hidden />
        </span>
      )}
    </span>
  );
};

export default Tooltip;