import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../sidebar";
import HeaderBar from "../headerbar/HeaderBar";
import { useMobileView } from "../../../hooks/use-mobile";
import styles from "./baselayout.module.css";

const BaseLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    isMobile,
    mobileMenuOpen,
    sidebarCollapsed,
    toggleMobileMenu,
    closeMobileMenu
  } = useMobileView();

  // Treat up to and including 1024px as "mobile-like" for the sidebar behavior
  const effectiveIsMobile = isMobile || window.innerWidth <= 1024;

  React.useEffect(() => {
    // centralize body scroll lock for mobile overlay here
    if (isMobile) {
      if (mobileMenuOpen) document.body.classList.add('mobile-open');
      else document.body.classList.remove('mobile-open');
    } else {
      document.body.classList.remove('mobile-open');
    }
    return () => document.body.classList.remove('mobile-open');
  }, [effectiveIsMobile, mobileMenuOpen]);

  return (
    <div className={styles.layoutWrapper}>
      {/* Mobile overlay */}
      {effectiveIsMobile && mobileMenuOpen && (
        <div
          className={styles.mobileOverlay}
          onClick={closeMobileMenu}
        />
      )}

      <div className={styles.contentRow}>
        <div className={`${styles.sidebarWrapper} ${sidebarCollapsed && !effectiveIsMobile ? styles.collapsed : ''} ${effectiveIsMobile ? styles.mobile : ''} ${mobileMenuOpen ? styles.mobileOpen : ''}`}>
          <SideBar
            isCollapsed={effectiveIsMobile ? !mobileMenuOpen : sidebarCollapsed}
            onToggle={toggleMobileMenu}
            isMobile={effectiveIsMobile}
          />
        </div>
        <div className={`${styles.mainArea} ${sidebarCollapsed && !effectiveIsMobile ? styles.collapsed : ''}`}>
          <HeaderBar
            isCollapsed={sidebarCollapsed}
            onToggle={toggleMobileMenu}
            isMobile={effectiveIsMobile}
          />
          <div className={styles.contentArea}>
            {children}
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaseLayout;