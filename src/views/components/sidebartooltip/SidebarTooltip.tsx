import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import styles from "./sidebartooltip.module.css";

type Placement = "bottom" | "top" | "left" | "right";

interface SidebarTooltipProps {
  text: string;
  children: React.ReactNode;
  placement?: Placement;
  delay?: number; // ms
  className?: string;
}

const sidebarSelectors = [
  "nav",
  ".sidebar",
  ".sidebarWrapper",
  ".sidebarNav",
  ".appSidebar",
  "aside",
  "[data-sidebar]",
];

const SidebarTooltip: React.FC<SidebarTooltipProps> = ({
  text,
  children,
  placement = "bottom",
  delay = 500,
  className,
}) => {
  const wrapRef = useRef<HTMLSpanElement | null>(null);
  const tipRef = useRef<HTMLSpanElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const [portalEl] = useState<HTMLElement | null>(() => {
    if (typeof document === "undefined") return null;
    const el = document.createElement("div");
    el.className = styles.portal || "";
    // don't set position here — keep portal a plain body child so tooltip uses fixed positioning
    return el;
  });

  useEffect(() => {
    if (!portalEl) return;
    document.body.appendChild(portalEl);
    return () => {
      if (portalEl.parentNode) portalEl.parentNode.removeChild(portalEl);
    };
  }, [portalEl]);

  const clearPending = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const isInSidebar = (el: Element | null) => {
    if (!el) return false;
    return sidebarSelectors.some((sel) => !!el.closest(sel));
  };

  const computePlacement = (trigger: Element | null): Placement => {
    if (!trigger) return placement;
    if (isInSidebar(trigger)) return "right";
    if (!!trigger.closest("header, .headerBar, .appHeader")) return "bottom";
    return placement;
  };

  const applyPlacementClassToDom = (tip: HTMLElement | null, p: Placement) => {
    if (!tip) return;
    const clsList = [styles.top, styles.bottom, styles.left, styles.right].filter(Boolean) as string[];
    clsList.forEach((c) => tip.classList.remove(c));
    const placementClass = (styles as any)[p];
    if (placementClass) tip.classList.add(placementClass);
    tip.setAttribute("data-placement", p);
    tip.setAttribute("data-origin", p === "right" ? "sidebar" : (p === "bottom" ? "header" : "default"));
  };

  const updatePosition = () => {
    const trigger = wrapRef.current;
    const tip = tipRef.current;
    if (!trigger || !tip) return;

    const rect = trigger.getBoundingClientRect();
    const gap = 8;
    const effective = computePlacement(trigger);

    applyPlacementClassToDom(tip, effective);

    // ensure fixed positioning (outside any parent stacking context)
    tip.style.position = "fixed";
    tip.style.zIndex = "100000"; // authoritative high z-index to be above sidebar/header

    if (effective === "bottom") {
      const left = rect.left + rect.width / 2;
      const top = rect.bottom + gap;
      tip.style.left = `${Math.round(left)}px`;
      tip.style.top = `${Math.round(top)}px`;
      tip.style.transform = "translateX(-50%)";
    } else if (effective === "top") {
      const left = rect.left + rect.width / 2;
      const top = rect.top - gap;
      tip.style.left = `${Math.round(left)}px`;
      tip.style.top = `${Math.round(top)}px`;
      tip.style.transform = "translateX(-50%) translateY(-100%)";
    } else if (effective === "right") {
      const arrow = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--tt-arrow-size") || "10", 10) || 10;
      // add a small extra offset to ensure the tooltip box sits fully outside the sidebar
      const extra = 6;
      const left = rect.right + gap + Math.ceil(arrow / 2) + extra;
      const top = rect.top + rect.height / 2;
      tip.style.left = `${Math.round(left)}px`;
      tip.style.top = `${Math.round(top)}px`;
      tip.style.transform = "translateY(-50%) translateX(0)";
    } else {
      const arrow = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--tt-arrow-size") || "10", 10) || 10;
      const extra = 6;
      const left = rect.left - gap - Math.ceil(arrow / 2) - extra;
      const top = rect.top + rect.height / 2;
      tip.style.left = `${Math.round(left)}px`;
      tip.style.top = `${Math.round(top)}px`;
      tip.style.transform = "translateY(-50%) translateX(-100%)";
    }
  };

  const showNow = () => {
    clearPending();
    rafRef.current = requestAnimationFrame(() => {
      updatePosition();
      setIsVisible(true);
      rafRef.current = null;
    });
  };

  const hideNow = () => {
    clearPending();
    setIsVisible(false);
  };

  const nodeIsInsideTriggerOrTip = (node: EventTarget | null) => {
    const trigger = wrapRef.current;
    const tip = tipRef.current;
    if (!node || typeof node === "string") return false;
    const n = node as Node;
    if (trigger && trigger.contains(n)) return true;
    if (tip && tip.contains(n)) return true;
    return false;
  };

  const handleEnter = (ev?: PointerEvent | any) => {
    if (ev && nodeIsInsideTriggerOrTip(ev.relatedTarget)) return;
    updatePosition();
    clearPending();
    timerRef.current = window.setTimeout(() => {
      showNow();
    }, delay);
  };

  const handleLeave = (ev?: PointerEvent | any) => {
    if (ev && nodeIsInsideTriggerOrTip(ev.relatedTarget)) return;
    hideNow();
  };

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    el.addEventListener("pointerenter", handleEnter);
    el.addEventListener("pointerleave", handleLeave);
    el.addEventListener("focus", handleEnter);
    el.addEventListener("blur", handleLeave);

    const onDocPointerMove = (e: PointerEvent) => {
      if (!isVisible) return;
      if (!nodeIsInsideTriggerOrTip(e.target)) hideNow();
    };
    const onDocPointerDown = (e: PointerEvent) => {
      if (!isVisible) return;
      if (!nodeIsInsideTriggerOrTip(e.target)) hideNow();
    };

    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    document.addEventListener("pointermove", onDocPointerMove);
    document.addEventListener("pointerdown", onDocPointerDown);

    return () => {
      el.removeEventListener("pointerenter", handleEnter);
      el.removeEventListener("pointerleave", handleLeave);
      el.removeEventListener("focus", handleEnter);
      el.removeEventListener("blur", handleLeave);
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
      document.removeEventListener("pointermove", onDocPointerMove);
      document.removeEventListener("pointerdown", onDocPointerDown);
      clearPending();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placement, delay, isVisible, portalEl]);

  const tipNode = (
    <span
      ref={tipRef}
      className={`${styles.tip} ${isVisible ? styles.visible : ""}`}
      role="tooltip"
      aria-hidden={!isVisible}
      style={{ position: "fixed", left: 0, top: 0, zIndex: 100000 }}
    >
      <span className={styles.arrow} aria-hidden />
      <span className={styles.content}>{text}</span>
    </span>
  );

  return (
    <span ref={wrapRef} className={`${styles.wrap} ${className || ""}`} aria-label={text} data-placement={placement}>
      {children}
      {portalEl ? ReactDOM.createPortal(tipNode, portalEl) : tipNode}
    </span>
  );
};

export default SidebarTooltip;
