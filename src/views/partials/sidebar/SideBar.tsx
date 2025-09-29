import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useThemeStore } from "../../contexts/ThemeStore";
import { hrSidebarItems, employeeSidebarItems, type SidebarItem } from "./sidebarcontent";
import mhCover from "../../../assets/MH Cognizant LOGO_White.png"; // for dark theme
import mhLogo from "../../../assets/MH Cognition LOGO.png";        // for light theme
import styles from "./sidebar.module.css";

import {
  ChevronDown,
  ChevronRight,
  Sun,
  Moon,
  LogOut,
  ChevronLeft,
} from "lucide-react";

interface SideBarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const SideBar: React.FC<SideBarProps> = ({ isCollapsed, onToggle }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useThemeStore();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Get sidebar items based on user role
  const sidebarItems = user?.role === "hr" ? hrSidebarItems : employeeSidebarItems;

  const toggleDropdown = (label: string) => {
    setOpenDropdown(prev => prev === label ? null : label);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const renderSidebarItem = (item: SidebarItem) => {
    const Icon = item.icon;
    const isItemActive = isActive(item.path);
    const hasSubItems = item.hasDropdown && item.subItems && item.subItems.length > 0;
    const isDropdownOpen = openDropdown === item.label;

    return (
      <div key={item.label} className={styles.sidebarItem}>
        <Link
          to={item.path}
          className={`${styles.sidebarLink} ${isItemActive ? styles.active : ''}`}
          onClick={(e) => {
            if (hasSubItems) {
              e.preventDefault();
              toggleDropdown(item.label);
            }
          }}
        >
          <Icon className={styles.sidebarIcon} />
          {!isCollapsed && (
            <>
              <span className={styles.sidebarLabel}>{item.label}</span>
              {hasSubItems && (
                <>
                  {isDropdownOpen ? (
                    <ChevronDown className={styles.chevron} />
                  ) : (
                    <ChevronRight className={styles.chevron} />
                  )}
                </>
              )}
            </>
          )}
        </Link>

        {hasSubItems && isDropdownOpen && !isCollapsed && (
          <div className={styles.submenu}>
            {item.subItems?.map((subItem) => {
              const SubIcon = subItem.icon;
              const isSubItemActive = isActive(subItem.path);
              return (
                <Link
                  key={subItem.path}
                  to={subItem.path}
                  className={`${styles.submenuLink} ${isSubItemActive ? styles.active : ''}`}
                >
                  <SubIcon className={styles.submenuIcon} />
                  <span className={styles.submenuLabel}>{subItem.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : styles.expanded}`}>
      <div className={styles.sidebarHeader}>
        <div className={styles.logoContainer}>
          <img
            src={isDark ? mhCover : mhLogo}
            alt="MH Cognition Logo"
            className={styles.logo}
          />
        </div>
        <button
          className={styles.toggleButton}
          onClick={onToggle}
        >
          <ChevronLeft className={`${styles.toggleIcon} ${isCollapsed ? styles.rotated : ''}`} />
        </button>
      </div>

      <nav className={styles.sidebarNav}>
        {sidebarItems.map(renderSidebarItem)}
      </nav>

      <div className={styles.sidebarFooter}>
        <button
          className={styles.themeToggle}
          onClick={toggleTheme}
        >
          {isDark ? <Sun className={styles.footerIcon} /> : <Moon className={styles.footerIcon} />}
          {!isCollapsed && (
            <span className={styles.footerBtnText}>
              {isDark ? "Light Mode" : "Dark Mode"}
            </span>
          )}
        </button>
        <button
          className={styles.logoutBtn}
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          <LogOut className={styles.footerIcon} />
          {!isCollapsed && <span className={styles.footerBtnText}>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default SideBar;