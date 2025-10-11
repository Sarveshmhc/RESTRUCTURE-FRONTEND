import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import styles from "./accordion.module.css";

type AccordionContextValue = {
  multiple: boolean;
  openIds: Set<string>;
  toggle: (id: string) => void;
  registerHeader: (id: string, ref: HTMLButtonElement | null) => void;
  focusHeaderByOffset: (currentId: string, offset: number) => void;
};

const AccordionContext = createContext<AccordionContextValue | null>(null);

export type AccordionProps = {
  children: React.ReactNode;
  multiple?: boolean; // allow multiple panels open
  defaultOpen?: string[]; // list of ids to open initially
  className?: string;
};

export const Accordion: React.FC<AccordionProps> = ({ children, multiple = false, defaultOpen = [], className = "" }) => {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(defaultOpen));
  const headerRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const toggle = useCallback(
    (id: string) => {
      setOpenIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else {
          if (!multiple) next.clear();
          next.add(id);
        }
        return next;
      });
    },
    [multiple]
  );

  const registerHeader = useCallback((id: string, ref: HTMLButtonElement | null) => {
    headerRefs.current[id] = ref;
  }, []);

  const focusHeaderByOffset = useCallback((currentId: string, offset: number) => {
    const keys = Object.keys(headerRefs.current);
    const idx = keys.indexOf(currentId);
    if (idx === -1) return;
    const next = (idx + offset + keys.length) % keys.length;
    const ref = headerRefs.current[keys[next]];
    ref?.focus();
  }, []);

  useEffect(() => {
    // keep defaultOpen sanitized (if needed)
    setOpenIds(new Set(defaultOpen));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ctx: AccordionContextValue = {
    multiple,
    openIds,
    toggle,
    registerHeader,
    focusHeaderByOffset,
  };

  return (
    <AccordionContext.Provider value={ctx}>
      <div className={`${styles.accordion} ${className}`}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

/* -------------------------------------------------------------------------- */
/* AccordionItem - used as children of Accordion                               */
/* -------------------------------------------------------------------------- */
export type AccordionItemProps = {
  id: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  defaultOpen?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
};

export const AccordionItem: React.FC<AccordionItemProps> = ({
  id,
  title,
  subtitle,
  children,
  disabled = false,
  className = "",
}) => {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error("AccordionItem must be used inside Accordion");

  const { openIds, toggle, registerHeader, focusHeaderByOffset } = ctx;
  const isOpen = openIds.has(id);
  const headerRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // register header ref for keyboard navigation
  useEffect(() => registerHeader(id, headerRef.current), [id, registerHeader]);

  // animate height when open/close
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    if (isOpen) {
      const height = el.scrollHeight;
      el.style.maxHeight = height + "px";
      el.style.opacity = "1";
    } else {
      el.style.maxHeight = "0px";
      el.style.opacity = "0";
    }
  }, [isOpen]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle(id);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      focusHeaderByOffset(id, 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      focusHeaderByOffset(id, -1);
    } else if (e.key === "Home") {
      e.preventDefault();
      focusHeaderByOffset(id, -9999); // wrap to first
    } else if (e.key === "End") {
      e.preventDefault();
      focusHeaderByOffset(id, 9999); // wrap to last
    }
  };

  return (
    <div className={`${styles.item} ${className} ${disabled ? styles.disabled : ""}`}>
      <button
        ref={headerRef}
        className={`${styles.header} ${isOpen ? styles.open : ""}`}
        onClick={() => !disabled && toggle(id)}
        onKeyDown={onKeyDown}
        aria-expanded={isOpen}
        aria-controls={`accordion-panel-${id}`}
        id={`accordion-header-${id}`}
        disabled={disabled}
      >
        <div className={styles.headerLeft}>
          <div className={styles.title}>{title}</div>
          {subtitle ? <div className={styles.subtitle}>{subtitle}</div> : null}
        </div>

        <span className={`${styles.chev} ${isOpen ? styles.chevOpen : ""}`} aria-hidden>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>

      <div
        ref={panelRef}
        id={`accordion-panel-${id}`}
        role="region"
        aria-labelledby={`accordion-header-${id}`}
        className={styles.panel}
      >
        <div className={styles.panelInner}>{children}</div>
      </div>
    </div>
  );
};

export default Accordion;