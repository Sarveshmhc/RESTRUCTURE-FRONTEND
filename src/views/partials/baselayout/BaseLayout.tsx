import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../sidebar/SideBar";
import HeaderBar from "../headerbar/HeaderBar";
import styles from "./baselayout.module.css";

const BaseLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className={styles.layoutWrapper}>
      <div className={styles.sidebarWrapper}>
        <SideBar
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((c) => !c)}
        />
      </div>
      <div className={`${styles.mainArea} ${sidebarCollapsed ? styles.collapsed : ''}`}>
        <HeaderBar isCollapsed={sidebarCollapsed} />
        <div className={styles.contentArea}>
          {children}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default BaseLayout;