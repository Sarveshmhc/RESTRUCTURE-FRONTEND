import React from 'react';
import styles from './loader.module.css';

type Size = 'xs' | 'sm' | 'md' | 'lg';
type Variant = 'spinner' | 'skeleton' | 'bar';

interface LoaderProps {
  variant?: Variant;
  size?: Size;
  label?: string; // optional accessible label shown visually if provided
  ariaLabel?: string; // overrides aria-label for screen readers
  fullscreen?: boolean;
  className?: string;
  count?: number; // for skeleton: number of lines/blocks
}

/**
 * Reusable loader for global components.
 * - variant="spinner": circular spinner
 * - variant="skeleton": shimmer blocks (count controls lines)
 * - variant="bar": thin progress bar animation
 *
 * Accessible: role="status", aria-live, and customizable ariaLabel.
 */
const Loader: React.FC<LoaderProps> = ({
  variant = 'spinner',
  size = 'md',
  label,
  ariaLabel,
  fullscreen = false,
  className,
  count = 3
}) => {
  const srLabel = ariaLabel ?? label ?? 'Loading';

  if (variant === 'skeleton') {
    const items = Array.from({ length: Math.max(1, count) });
    return (
      <div
        className={[
          styles.skeletonWrap,
          styles[size],
          fullscreen ? styles.fullscreen : '',
          className ?? ''
        ].join(' ')}
        role="status"
        aria-live="polite"
        aria-label={srLabel}
      >
        {items.map((_, i) => (
          <div key={i} className={styles.skeletonLine} />
        ))}
      </div>
    );
  }

  if (variant === 'bar') {
    return (
      <div
        className={[styles.barWrap, fullscreen ? styles.fullscreen : '', className ?? ''].join(' ')}
        role="status"
        aria-live="polite"
        aria-label={srLabel}
      >
        <div className={styles.bar} />
      </div>
    );
  }

  // default: spinner
  return (
    <div
      className={[styles.spinnerWrap, styles[size], fullscreen ? styles.fullscreen : '', className ?? ''].join(' ')}
      role="status"
      aria-live="polite"
      aria-label={srLabel}
    >
      <svg className={styles.spinner} viewBox="0 0 50 50" aria-hidden>
        <circle className={styles.path} cx="25" cy="25" r="20" fill="none" strokeWidth="4" />
      </svg>
      {label ? <div className={styles.label}>{label}</div> : null}
    </div>
  );
};

export default Loader;