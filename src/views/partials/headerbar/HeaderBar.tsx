import React, { useState } from "react";
import { Bell } from "../../components/icons";
import { SearchBar, ThemeToggle, SidebarTooltip } from "@components";
// replace generic Tooltip import with SidebarTooltip

import styles from "./headerbar.module.css";
import { useThemeStore } from "../../contexts/ThemeStore";
import { useNavigate } from "react-router-dom";
import { hrSidebarItems, employeeSidebarItems } from "../sidebar/sidebarcontent"; // <-- use correct exports
import { useAuth } from "../../contexts/AuthContext"; // if you want to filter by user role

interface HeaderBarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobile: boolean;
}

const HeaderBar: React.FC<HeaderBarProps> = ({ isCollapsed, onToggle, isMobile }) => {
  const [search, setSearch] = useState("");
  const { isDark } = useThemeStore();
  const navigate = useNavigate();
  const { user } = useAuth(); // get user role

  // Flatten menu items for search
  type MenuItem = {
    label: string;
    path: string;
    icon?: React.ReactNode;
    subItems?: MenuItem[];
  };

  function flattenMenu(items: MenuItem[] | any[]): { label: string; path: string; icon?: React.ComponentType<any> }[] {
    let out: { label: string; path: string; icon?: React.ComponentType<any> }[] = [];
    for (const it of items) {
      let iconComp: React.ComponentType<any> | undefined = undefined;
      if (it.icon && (typeof it.icon === "function" || (typeof it.icon === "object" && it.icon.$$typeof))) {
        iconComp = it.icon;
      }
      if (it.label && it.path) out.push({ label: it.label, path: it.path, icon: iconComp });
      if (it.subItems) out = out.concat(flattenMenu(it.subItems));
    }
    return out;
  }

  // Use sidebar items based on user role
  const sidebarItems = user?.role === "hr" ? hrSidebarItems : employeeSidebarItems;
  const flatMenuItems = flattenMenu(sidebarItems);

  // Handler for navigation from SearchBar
  const handleNavigate = (path: string) => {
    navigate(path);
    setSearch(""); // clear search after navigation
  };

  return (
    <header className={styles.headerBar}>
      <div className={styles.headerLeft}>
        {/* Mobile hamburger - visible only on mobile */}
        {isMobile && (
          <button
            type="button"
            aria-label="Toggle sidebar"
            title="Toggle sidebar"
            onClick={onToggle}
            className={`${styles.mobileHamburger} ${!isCollapsed ? styles.open : ""}`}
          >
            <span className={`${styles.hamburgerBar} ${styles.bar1}`} />
            <span className={`${styles.hamburgerBar} ${styles.bar2}`} />
            <span className={`${styles.hamburgerBar} ${styles.bar3}`} />
          </button>
        )}
      </div>

      {/* Center section - SearchBar */}
      <div className={styles.headerCenter}>
        <div className={styles.searchWrapper}>
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search for actions, pages, requests, reports, people..."
            menuItems={flatMenuItems} // <-- pass flattened menuItems for search
            onNavigate={handleNavigate} // <-- handle navigation
          />
        </div>
      </div>

      {/* Right section - Bell and ThemeToggle */}
      <div className={styles.headerRight}>
        {/* Notifications - use SidebarTooltip */}
        <SidebarTooltip text="Notifications" delay={400} placement="bottom">
          <button className={styles.actionButton} aria-label="Notifications">
            <Bell />
            <span className={styles.notificationBadge}></span>
          </button>
        </SidebarTooltip>

        {/* Theme toggle - use SidebarTooltip */}
        <SidebarTooltip text={isDark ? "Switch to Light" : "Switch to Dark"} delay={500} placement="bottom">
          <ThemeToggle />
        </SidebarTooltip>
      </div>
    </header>
  );
};

export default HeaderBar;