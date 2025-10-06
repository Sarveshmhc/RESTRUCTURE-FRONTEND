import React, { useEffect, useRef, useState } from 'react';
import styles from './tooltip.module.css';

export type TooltipPlacement = 'top' | 'right' | 'bottom' | 'left';

export interface ToolTipProps {
  text: string;
  children: React.ReactNode;
  placement?: TooltipPlacement;
  delay?: number;
  disabled?: boolean;
  className?: string;
  title?: string;
  subtitle?: string;
  variant?: 'simple' | 'enhanced';
  icon?: React.ReactNode;
}

const Tooltip: React.FC<ToolTipProps> = ({
  text,
  children,
  placement = 'top',
  delay = 100,
  disabled = false,
  className,
  title,
  subtitle,
  variant = 'simple',
  icon,
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

  // Default info icon for enhanced tooltips
  const defaultIcon = (
    <svg viewBox="0 0 20 20" fill="currentColor" className={styles.defaultIcon}>
      <path clipRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" fillRule="evenodd" />
    </svg>
  );

  const renderTooltipContent = () => {
    if (variant === 'enhanced') {
      return (
        <div className={`${styles.enhancedTooltip} ${styles[placement]} ${show ? styles.show : ''}`}>
          <div className={styles.enhancedContent}>
            {(title || icon) && (
              <div className={styles.enhancedHeader}>
                <div className={styles.iconContainer}>
                  {icon || defaultIcon}
                </div>
                {title && <h3 className={styles.enhancedTitle}>{title}</h3>}
              </div>
            )}
            <div className={styles.enhancedBody}>
              <p className={styles.enhancedText}>{text}</p>
              {subtitle && (
                <div className={styles.enhancedSubtitle}>
                  <svg viewBox="0 0 20 20" fill="currentColor" className={styles.checkIcon}>
                    <path clipRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fillRule="evenodd" />
                  </svg>
                  <span>{subtitle}</span>
                </div>
              )}
            </div>
            <div className={styles.enhancedGradientOverlay} />
            <div className={styles.enhancedArrow} />
          </div>
        </div>
      );
    }

    // Simple tooltip (existing functionality)
    return (
      <span className={`${styles.tooltip} ${styles[placement]} ${show ? styles.show : ''}`} role="tooltip">
        {text}
        <span className={styles.arrow} aria-hidden />
      </span>
    );
  };

  return (
    <span
      className={`${styles.wrapper} ${variant === 'enhanced' ? styles.enhancedWrapper : ''} ${className || ''}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      data-has-tooltip
    >
      {children}
      {!disabled && renderTooltipContent()}
    </span>
  );
};

export default Tooltip;