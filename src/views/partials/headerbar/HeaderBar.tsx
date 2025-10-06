import React, { useState } from "react";
import { Bell } from "../../components/icons";
import { SearchBar, ThemeToggle } from "@components";
import styles from "./headerbar.module.css";

interface HeaderBarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobile: boolean;
}

const HeaderBar: React.FC<HeaderBarProps> = ({ isCollapsed, onToggle, isMobile }) => {
  const [search, setSearch] = useState("");

  return (
    <header className={`${styles.headerBar} ${isCollapsed ? styles.collapsed : ""} ${isMobile ? styles.mobile : ""}`}>
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
            placeholder="Search anything..."
          />
        </div>
      </div>

      {/* Right section - Bell and ThemeToggle */}
      <div className={styles.headerRight}>
        <button
          className={styles.actionButton}
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell className={styles.actionIcon} />
          <span className={styles.notificationBadge}></span>
        </button>

        <ThemeToggle />
      </div>
    </header>
  );
};

export default HeaderBar;