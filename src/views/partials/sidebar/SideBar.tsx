import React, { useState, useRef, useEffect } from "react";
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
  LogOut,
  ChevronLeft,
  ChevronUp,
  User as UserIcon,
  Settings as SettingsIcon
} from "lucide-react";

interface SideBarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const SideBar: React.FC<SideBarProps> = ({ isCollapsed, onToggle }) => {
  const { user, logout } = useAuth();
  const { isDark, } = useThemeStore();
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

  const SidebarProfileFooter: React.FC<{ user: any }> = ({ user }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
      function handleClick(e: MouseEvent) {
        if (ref.current && !ref.current.contains(e.target as Node)) {
          setOpen(false);
        }
      }
      if (open) document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }, [open]);

    const initials =
      user?.firstName && user?.lastName
        ? user.firstName[0].toUpperCase() + user.lastName[0].toUpperCase()
        : user?.role === "hr"
        ? "HR"
        : "U";

    return (
      <div className={styles.footerRoot} ref={ref}>
        <button
          className={styles.profileBtn}
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="true"
          aria-expanded={open}
        >
          <div className={styles.avatar}>
            <span>{initials}</span>
          </div>
          <div className={styles.profileInfo}>
            <div className={styles.profileName}>{user?.firstName || user?.role?.toUpperCase() || "User"}</div>
            <div className={styles.profileRole}>Profile</div>
          </div>
          {open ? (
            <ChevronUp className={styles.chevron} />
          ) : (
            <ChevronDown className={styles.chevron} />
          )}
        </button>
        {open && (
          <div className={styles.profileDropdown}>
            <button
              className={styles.dropdownItem}
              onClick={() => {
                setOpen(false);
                navigate(user?.role === "hr" ? "/hr/profile" : "/employee/profile");
              }}
            >
              <UserIcon className={styles.dropdownIcon} />
              Profile
            </button>
            <button
              className={styles.logoutDropdownItem}
              onClick={() => {
                setOpen(false);
                logout();
                navigate("/login");
              }}
            >
              <LogOut className={styles.dropdownIcon} />
              Logout
            </button>
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
        <SidebarProfileFooter user={user} />
      </div>
    </aside>
  );
};

export default SideBar;