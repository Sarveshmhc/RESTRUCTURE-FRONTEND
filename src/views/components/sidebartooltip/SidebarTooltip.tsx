import React, { useRef, useEffect, useState } from "react";
import styles from "./sidebartooltip.module.css";

export interface SidebarTooltipProps {
  text: string;
  children: React.ReactNode;
  className?: string;
  placement?: 'right' | 'top' | 'left' | 'bottom';
}

const SidebarTooltip: React.FC<SidebarTooltipProps> = ({ 
  text, 
  children, 
  className,
  placement = 'right' 
}) => {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const tipRef = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const delayRef = useRef<number>();

  const updatePosition = () => {
    if (wrapRef.current && tipRef.current) {
      const rect = wrapRef.current.getBoundingClientRect();
      const tip = tipRef.current;
      const viewport = window.innerWidth;
      
      if (placement === 'right') {
        // Calculate position ensuring it stays within viewport
        let leftPos = rect.right + 12;
        const topPos = rect.top + (rect.height / 2);
        
        // If tooltip would go off-screen, position it differently
        if (leftPos + 200 > viewport) {
          leftPos = rect.left - 12; // Position to the left instead
          tip.classList.add(styles.leftPlacement);
        } else {
          tip.classList.remove(styles.leftPlacement);
        }
        
        tip.style.left = `${leftPos}px`;
        tip.style.top = `${topPos}px`;
        tip.style.transform = 'translateY(-50%)';
      } else if (placement === 'top') {
        const leftPos = rect.left + (rect.width / 2);
        const topPos = rect.top - 12;
        
        tip.style.left = `${leftPos}px`;
        tip.style.top = `${topPos}px`;
        tip.style.transform = 'translate(-50%, -100%)';
      }
    }
  };

  const handleMouseEnter = () => {
    updatePosition();
    // Add 1s delay before showing
    delayRef.current = window.setTimeout(() => setIsVisible(true), 1000);
  };

  const handleMouseLeave = () => {
    clearTimeout(delayRef.current);
    setIsVisible(false);
  };

  useEffect(() => {
    const element = wrapRef.current;
    if (element) {
      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);
      element.addEventListener('focus', handleMouseEnter);
      element.addEventListener('blur', handleMouseLeave);

      return () => {
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
        element.removeEventListener('focus', handleMouseEnter);
        element.removeEventListener('blur', handleMouseLeave);
      };
    }
  }, [placement]);

  useEffect(() => () => clearTimeout(delayRef.current), []);

  return (
    <span 
      ref={wrapRef}
      className={`${styles.wrap} ${className || ""}`} 
      aria-label={text} 
      data-placement={placement}
    >
      {children}
      <span 
        ref={tipRef}
        className={`${styles.tip} ${styles[placement]} ${isVisible ? styles.visible : ''}`} 
        role="tooltip"
      >
        <span className={styles.text}>{text}</span>
        <span className={`${styles.arrow} ${styles[`arrow${placement.charAt(0).toUpperCase() + placement.slice(1)}`]}`} />
      </span>
    </span>
  );
};

export default SidebarTooltip;