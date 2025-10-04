import React from "react";
import { useMobileView } from "../../../hooks/use-mobile";
import SideBar from "./SideBar";
import styles from "./sidebarwrapper.module.css";

interface SidebarWrapperProps {
  children?: React.ReactNode;
}

const SidebarWrapper: React.FC<SidebarWrapperProps> = ({ children }) => {
  const {
    isMobile,
    isTablet,
    deviceType,
    mobileMenuOpen,
    sidebarCollapsed,
    toggleMobileMenu,
    closeMobileMenu
  } = useMobileView();

  const getWrapperClasses = () => {
    let classes = `${styles.sidebarWrapper}`;
    
    if (isMobile) {
      classes += ` ${styles.mobileWrapper}`;
      if (mobileMenuOpen) {
        classes += ` ${styles.mobileOpen}`;
      }
    } else if (isTablet) {
      classes += ` ${styles.tabletWrapper}`;
    } else {
      classes += ` ${styles.desktopWrapper}`;
      if (sidebarCollapsed) {
        classes += ` ${styles.collapsed}`;
      }
    }
    
    return classes;
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isMobile && mobileMenuOpen && (
        <div
          className={styles.mobileOverlay}
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}
      
      <div className={getWrapperClasses()}>
        <SideBar
          isCollapsed={isMobile ? false : (isTablet || sidebarCollapsed)}
          onToggle={toggleMobileMenu}
          isMobile={isMobile}
        />
        {children}
      </div>
    </>
  );
};

export default SidebarWrapper;