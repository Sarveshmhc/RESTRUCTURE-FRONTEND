import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "../cards/Cards";
import styles from "./expandablecard.module.css";

export type ExpandableCardProps = {
  id?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  startOpen?: boolean;
  controlledOpen?: boolean | null; // use to control externally (null = uncontrolled)
  onToggle?: (open: boolean) => void;
  actions?: React.ReactNode; // right-side action buttons
  hover?: boolean; // pass to Card hover effect
  className?: string;
  children?: React.ReactNode;
};

export type CardProps = {
  hover?: boolean;
  className?: string;
  children?: React.ReactNode;
  shadow?: string; // Add this line to accept the 'shadow' prop
};

const chevronVariants = {
  closed: { rotate: 0 },
  open: { rotate: 180 },
};

const ExpandableCard: React.FC<ExpandableCardProps> = ({
  id,
  title,
  subtitle,
  startOpen = false,
  controlledOpen = null,
  onToggle,
  actions,
  hover = true,
  className = "",
  children,
}) => {
  const isControlled = controlledOpen !== null;
  const [open, setOpen] = useState<boolean>(startOpen);
  const headerRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [contentHeight, setContentHeight] = useState<number | "auto">(0);

  useEffect(() => {
    if (isControlled) setOpen(Boolean(controlledOpen));
  }, [controlledOpen, isControlled]);

  // measure content height for smooth maxHeight animation
  useEffect(() => {
    const el = panelRef.current?.querySelector(`.${styles.panelInner}`) as HTMLElement | null;
    if (!el) {
      setContentHeight(0);
      return;
    }

    const measure = () => {
      const h = el.scrollHeight;
      setContentHeight(h);
    };

    measure();
    // observe for dynamic content
    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    return () => ro.disconnect();
  }, [children, open]);

  const toggle = useCallback(() => {
    if (isControlled) {
      onToggle?.(!Boolean(controlledOpen));
    } else {
      setOpen((s) => {
        const next = !s;
        onToggle?.(next);
        return next;
      });
    }
  }, [isControlled, controlledOpen, onToggle]);

  // keyboard handling: Enter/Space toggle; Escape closes panel
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    } else if (e.key === "Escape") {
      if (!isControlled) setOpen(false);
      else onToggle?.(false);
      headerRef.current?.focus();
    }
  };

  // close on global Escape when open
  useEffect(() => {
    const onEsc = (ev: KeyboardEvent) => {
      if (ev.key === "Escape" && open) {
        if (!isControlled) setOpen(false);
        else onToggle?.(false);
        headerRef.current?.focus();
      }
    };
    if (open) document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open, isControlled, onToggle]);

  return (
    <Card
      shadow={hover ? "soft" : "none"}
      className={`${styles.wrapper} ${className}`}
    >
      <div className={styles.headerRow}>
        <button
          ref={headerRef}
          id={id}
          className={`${styles.header} ${open ? styles.open : ""}`}
          onClick={toggle}
          onKeyDown={onKeyDown}
          aria-expanded={!!open}
          aria-controls={id ? `panel-${id}` : undefined}
          type="button"
        >
          <div className={styles.titleWrap}>
            <div className={styles.title}>{title}</div>
            {subtitle ? <div className={styles.subtitle}>{subtitle}</div> : null}
          </div>

          <div className={styles.headerRight}>
            {actions ? <div className={styles.actions}>{actions}</div> : null}
            <motion.span
              className={styles.chev}
              initial="closed"
              animate={open ? "open" : "closed"}
              variants={chevronVariants}
              transition={{ duration: 0.18 }}
              aria-hidden
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" role="img" aria-hidden>
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.span>
          </div>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="panel"
            id={id ? `panel-${id}` : undefined}
            role="region"
            aria-labelledby={id ? id : undefined}
            className={styles.panelWrap}
            initial={{ opacity: 0, maxHeight: 0 }}
            animate={{ opacity: 1, maxHeight: contentHeight === "auto" ? "9999px" : `${contentHeight}px` }}
            exit={{ opacity: 0, maxHeight: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 0.9, 0.3, 1] }}
            ref={panelRef}
          >
            <div className={styles.panelInner}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default ExpandableCard;