import React, { useState } from "react";
import { Bell } from "../../components/icons";
import { SearchBar, ThemeToggle } from "@components";
import Tooltip from "../../components/tooltip/ToolTip";
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
  function flattenMenu(items) {
    let out = [];
    for (const it of items) {
      if (it.label && it.path) out.push({ label: it.label, path: it.path, icon: it.icon });
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
    <header
      className={`${styles.headerBar} ${isCollapsed ? styles.collapsed : ""} ${isMobile ? styles.mobile : ""} ${isDark ? styles.dark : styles.light}`}
      data-theme={isDark ? "dark" : "light"}
    >
      {/* Left section - empty */}
      <div className={styles.headerLeft}>
        {/* Mobile hamburger - visible only on mobile */}
        {isMobile && (
          <button
            className={styles.mobileHamburger}
            aria-label="Open menu"
            onClick={onToggle}
          >
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
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
        {/* Notification button with Tooltip */}
        <Tooltip text="Notifications" delay={500} placement="bottom">
          <button
            className={styles.actionButton}
            aria-label="Notifications"
            type="button"
          >
            <Bell className={styles.actionIcon} />
            <span className={styles.notificationBadge}></span>
          </button>
        </Tooltip>

        {/* Theme toggle with Tooltip */}
        <Tooltip text={isDark ? "Switch to Light" : "Switch to Dark"} delay={500} placement="bottom">
          <ThemeToggle />
        </Tooltip>
      </div>
    </header>
  );
};

export default HeaderBar;