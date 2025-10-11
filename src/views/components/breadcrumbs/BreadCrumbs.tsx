import React, { useEffect, useRef, useState } from "react";
import styles from "./breadcrumbs.module.css";

export type Crumb = {
  label: string;
  href?: string;
  onClick?: (e?: React.MouseEvent) => void;
  icon?: React.ReactNode;
  ariaLabel?: string;
};

type BreadcrumbsProps = {
  items: Crumb[];
  separator?: React.ReactNode;
  maxVisible?: number; // when exceeded, collapse middle items into an overflow menu
  className?: string;
};

const DEFAULT_SEPARATOR = (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden>
    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, separator = DEFAULT_SEPARATOR, maxVisible = 5, className = "" }) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  if (!items || items.length === 0) return null;

  // If items fit, show all. If too long, show first, ellipsis menu, then last (maxVisible - 2) tail
  const shouldCollapse = items.length > maxVisible;
  const head = shouldCollapse ? items.slice(0, 1) : items.slice(0);
  const tail = shouldCollapse ? items.slice(items.length - (maxVisible - 1)) : [];
  const hidden = shouldCollapse ? items.slice(1, items.length - (maxVisible - 1)) : [];

  const renderCrumb = (c: Crumb, i: number, isLast?: boolean) => {
    const commonProps = {
      className: `${styles.crumb} ${isLast ? styles.current : ""}`,
      "aria-current": isLast ? "page" : undefined,
    } as any;

    if (c.href && !c.onClick) {
      return (
        <a key={i} href={c.href} {...commonProps} aria-label={c.ariaLabel ?? c.label}>
          {c.icon ? <span className={styles.icon}>{c.icon}</span> : null}
          <span className={styles.label}>{c.label}</span>
        </a>
      );
    }

    return (
      <button
        key={i}
        type="button"
        onClick={(e) => c.onClick?.(e)}
        {...commonProps}
        aria-label={c.ariaLabel ?? c.label}
      >
        {c.icon ? <span className={styles.icon}>{c.icon}</span> : null}
        <span className={styles.label}>{c.label}</span>
      </button>
    );
  };

  return (
    <div ref={wrapRef} className={`${styles.root} ${className}`}>
      <nav className={styles.wrap} aria-label="Breadcrumb">
        {head.map((c, i) => (
          <React.Fragment key={`h-${i}`}>
            {renderCrumb(c, i, items.length === 1)}
            <span className={styles.sep}>{separator}</span>
          </React.Fragment>
        ))}

        {shouldCollapse && (
          <>
            <div className={styles.overflow}>
              <button
                type="button"
                className={styles.overflowBtn}
                onClick={() => setOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={open ? "true" : "false"}
                aria-label={`Show ${hidden.length} more items`}
              >
                •••
              </button>

              {open && (
                <div className={styles.overflowMenu} role="menu">
                  {hidden.map((c, i) => (
                    <button
                      key={`hidden-${i}`}
                      role="menuitem"
                      className={styles.overflowItem}
                      onClick={(e) => {
                        setOpen(false);
                        c.onClick?.(e);
                        if (c.href && !c.onClick) window.location.href = c.href;
                      }}
                    >
                      {c.icon ? <span className={styles.icon}>{c.icon}</span> : null}
                      <span className={styles.label}>{c.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <span className={styles.sep}>{separator}</span>
          </>
        )}

        {tail.map((c, i) => {
          const isLast = i === tail.length - 1;
          return (
            <React.Fragment key={`t-${i}`}>
              {renderCrumb(c, i + (shouldCollapse ? items.length - tail.length : i), isLast)}
              {!isLast && <span className={styles.sep}>{separator}</span>}
            </React.Fragment>
          );
        })}
      </nav>
    </div>
  );
};

export default Breadcrumbs;