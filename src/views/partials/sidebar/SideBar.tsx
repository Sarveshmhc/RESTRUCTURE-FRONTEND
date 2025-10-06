import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import type { User } from "../../contexts/AuthContext";
import { useThemeStore } from "../../contexts/ThemeStore";
import { hrSidebarItems, employeeSidebarItems, type SidebarItem } from "./sidebarcontent";
import mhCover from "../../../assets/MH Cognizant LOGO_White.png"; // for dark theme
import mhLogo from "../../../assets/MH Cognition LOGO.png";        // for light theme
import styles from "./sidebar.module.css";
import { Button ,} from "../../components";
import SidebarTooltip from "../../components/sidebartooltip/SidebarTooltip";


import {
  ChevronDown, ChevronRight, LogOut, ChevronLeft, ChevronUp, User as UserIcon, X
} from "../../components/icons";

interface SideBarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobile?: boolean;
}

const SideBar: React.FC<SideBarProps> = ({ isCollapsed, onToggle, isMobile = false }) => {
  const { user, logout } = useAuth();
  const { isDark, } = useThemeStore();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();

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

    const linkEl = (
      <Link
        to={item.path}
        className={`${styles.sidebarLink} ${isItemActive ? styles.active : ''}`}
        onClick={(e) => {
          if (hasSubItems) {
            e.preventDefault();
            toggleDropdown(item.label);
          }
        }}
        title={isCollapsed ? item.label : undefined}
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
    );

    return (
      <div key={item.label} className={styles.sidebarItem}>
        {(isCollapsed && !isMobile) ? (
          <SidebarTooltip text={item.label}>{linkEl}</SidebarTooltip>
        ) : (
          linkEl
        )}

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
                  <span>{subItem.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const SidebarProfileFooter = ({ user }: { user: User | null }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { logout } = useAuth();

    useEffect(() => {
      function onDocClick(e: MouseEvent) {
        if (!ref.current) return;
        if (!ref.current.contains(e.target as Node)) setOpen(false);
      }
      function onKey(e: KeyboardEvent) {
        if (e.key === "Escape") setOpen(false);
      }
      if (open) {
        document.addEventListener("mousedown", onDocClick);
        document.addEventListener("keydown", onKey);
      }
      return () => {
        document.removeEventListener("mousedown", onDocClick);
        document.removeEventListener("keydown", onKey);
      };
    }, [open]);

    const initials =
      user?.firstName && user?.lastName
        ? user.firstName[0].toUpperCase() + user.lastName[0].toUpperCase()
        : user?.role === "hr"
          ? "HR"
          : "U";

    const gotoProfile = () => {
      setOpen(false);
      navigate(user?.role === "hr" ? "/hr/profile" : "/employee/profile");
    };

    const doLogout = async () => {
      setOpen(false);
      await logout();
      navigate("/login");
    };

    const buttonEl = (
      <button
        type="button"
        className={styles.profileBtn}
        onClick={() => setOpen(v => !v)}
        aria-haspopup="menu"
        aria-expanded={open ? true : false}
        aria-controls="sidebar-profile-menu"
        aria-label="Profile"
      >
        <div className={styles.avatar}><span>{initials}</span></div>
        {!isCollapsed && (
          <>
            <div className={styles.profileInfo}>
              <div className={styles.profileName}>{user?.firstName || "User"}</div>
              <div className={styles.profileRole}>Profile</div>
            </div>
            {open ? <ChevronUp className={styles.chevron} /> : <ChevronDown className={styles.chevron} />}
          </>
        )}
      </button>
    );

    return (
      <div className={styles.profileContainer} ref={ref}>
        {(isCollapsed && !isMobile)
          ? <SidebarTooltip text={`${user?.firstName || "User"} • Profile`}>{buttonEl}</SidebarTooltip>
          : buttonEl}

        {open && (
          <div
            id="sidebar-profile-menu"
            role="menu"
            className={`${styles.profileDropdown} ${isCollapsed ? styles.profileDropdownRight : styles.profileDropdownUp}`}
          >
            <button type="button" className={styles.dropdownItem} onClick={gotoProfile} role="menuitem">
              <UserIcon className={styles.dropdownIcon} />
              <span>Profile</span>
            </button>
            <div className={styles.dropdownDivider} />
            <button type="button" className={styles.logoutDropdownItem} onClick={doLogout} role="menuitem">
              <LogOut className={styles.dropdownIcon} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : styles.expanded} ${isMobile ? styles.mobile : ''}`}>
      <div className={styles.sidebarHeader}>
        <div className={styles.logoContainer}>
          <img
            src={isDark ? mhCover : mhLogo}
            alt="MH Cognition Logo"
            className={styles.logo}
          />
        </div>
        {!isMobile ? (
          (isCollapsed ? (
            <SidebarTooltip text="Expand sidebar">
              <button
                className={styles.toggleButton}
                onClick={onToggle}
                title="Expand sidebar"
              >
                <ChevronLeft className={`${styles.toggleIcon} ${isCollapsed ? styles.rotated : ''}`} />
              </button>
            </SidebarTooltip>
          ) : (
            <button
              className={styles.toggleButton}
              onClick={onToggle}
              title="Collapse sidebar"
            >
              <ChevronLeft className={`${styles.toggleIcon} ${isCollapsed ? styles.rotated : ''}`} />
            </button>
          ))
        ) : (
          <button
            className={styles.mobileCloseButton}
            onClick={onToggle}
            title="Close Menu"
          >
            <X className={styles.closeIcon} />
          </button>
        )}
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