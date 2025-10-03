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

  return (
    <div className={styles.layoutWrapper}>
      {/* Mobile overlay */}
      {isMobile && mobileMenuOpen && (
        <div
          className={styles.mobileOverlay}
          onClick={closeMobileMenu}
        />
      )}

      <div className={styles.contentRow}>
        <div className={`${styles.sidebarWrapper} ${sidebarCollapsed && !isMobile ? styles.collapsed : ''} ${isMobile ? styles.mobile : ''} ${mobileMenuOpen ? styles.mobileOpen : ''}`}>
          <SideBar
            isCollapsed={isMobile ? false : sidebarCollapsed}
            onToggle={toggleMobileMenu}
            isMobile={isMobile}
          />
        </div>
        <div className={`${styles.mainArea} ${sidebarCollapsed && !isMobile ? styles.collapsed : ''}`}>
          <HeaderBar
            isCollapsed={sidebarCollapsed}
            onToggle={toggleMobileMenu}
            isMobile={isMobile}
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