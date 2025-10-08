import React, { useMemo, useRef, useState } from 'react';
import styles from './accordion.module.css';

export type AccordionItem = {
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
};

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean; // if false, behaves like radio (only one open)
  defaultExpanded?: string[]; // array of ids
  onChange?: (expandedIds: string[]) => void;
  className?: string;
}

const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  defaultExpanded = [],
  onChange,
  className
}) => {
  const [expanded, setExpanded] = useState<string[]>(
    () => defaultExpanded.filter(id => items.some(it => it.id === id))
  );

  const headingsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const toggle = (id: string) => {
    const already = expanded.includes(id);
    let next: string[];
    if (allowMultiple) {
      next = already ? expanded.filter(x => x !== id) : [...expanded, id];
    } else {
      next = already ? [] : [id];
    }
    setExpanded(next);
    onChange?.(next);
  };

  const focusHeading = (idx: number) => {
    const node = headingsRef.current[idx];
    if (node) node.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent, idx: number, id: string) => {
    const key = e.key;
    if (key === 'ArrowDown') {
      e.preventDefault();
      focusHeading((idx + 1) % items.length);
    } else if (key === 'ArrowUp') {
      e.preventDefault();
      focusHeading((idx - 1 + items.length) % items.length);
    } else if (key === 'Home') {
      e.preventDefault();
      focusHeading(0);
    } else if (key === 'End') {
      e.preventDefault();
      focusHeading(items.length - 1);
    } else if (key === 'Enter' || key === ' ') {
      e.preventDefault();
      if (!items[idx].disabled) toggle(id);
    }
  };

  const getIsExpanded = (id: string) => expanded.includes(id);

  // memoize id -> panel id mapping for aria
  const idMap = useMemo(
    () =>
      items.reduce((acc: Record<string, { buttonId: string; panelId: string }>, it) => {
        acc[it.id] = { buttonId: `accordion-btn-${it.id}`, panelId: `accordion-panel-${it.id}` };
        return acc;
      }, {}),
    [items]
  );

  return (
    <div className={[styles.container, className ?? ''].join(' ')} role="presentation">
      {items.map((it, idx) => {
        const isExpanded = getIsExpanded(it.id);
        const ids = idMap[it.id];
        return (
          <div key={it.id} className={styles.item}>
            <h3 className={styles.heading}>
              <button
                id={ids.buttonId}
                ref={el => { headingsRef.current[idx] = el; }}
                aria-controls={ids.panelId}
                aria-expanded={isExpanded}
                aria-disabled={it.disabled || undefined}
                className={[
                  styles.trigger,
                  it.disabled ? styles.disabled : '',
                  isExpanded ? styles.expanded : ''
                ].join(' ')}
                onClick={() => !it.disabled && toggle(it.id)}
                onKeyDown={e => handleKeyDown(e, idx, it.id)}
              >
                <span className={styles.title}>{it.title}</span>
                <svg
                  className={styles.icon}
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  aria-hidden
                  focusable="false"
                >
                  <path
                    d="M6 9l6 6 6-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </h3>

            <div
              id={ids.panelId}
              role="region"
              aria-labelledby={ids.buttonId}
              className={[styles.panel, isExpanded ? styles.panelOpen : ''].join(' ')}
              style={{ maxHeight: isExpanded ? undefined : 0 }}
            >
              <div className={styles.panelInner}>{it.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;