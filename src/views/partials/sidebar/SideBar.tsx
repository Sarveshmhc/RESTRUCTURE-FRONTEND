import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../components/contexts/AuthContext";
import type { User } from "../../components/contexts/AuthContext";
import { useThemeStore } from "../../components/contexts/ThemeStore";
import { hrSidebarItems, employeeSidebarItems, type SidebarItem } from "./sidebarcontent";
import mhCover from "../../../assets/MH Cognizant LOGO_White.png"; // for dark theme
import mhLogo from "../../../assets/MH Cognition LOGO.png";        // for light theme
import styles from "./sidebar.module.css";
import { Button ,} from "../../components";


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

  const SidebarProfileFooter: React.FC<{ user: User | null }> = ({ user }) => {
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
        <Button
          className={styles.profileBtn}
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="true"
          aria-expanded={open}
          variant="secondary"
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
        </Button>
        {open && (
          <div className={styles.profileDropdown}>
            <Button
              className={styles.dropdownItem}
              onClick={() => {
                setOpen(false);
                navigate(user?.role === "hr" ? "/hr/profile" : "/employee/profile");
              }}
              variant="secondary"
            >
              <UserIcon className={styles.dropdownIcon} />
              Profile
            </Button>
            <Button
              className={styles.logoutDropdownItem}
              onClick={() => {
                setOpen(false);
                logout();
                navigate("/login");
              }}
              variant="danger"
            >
              <LogOut className={styles.dropdownIcon} />
              Logout
            </Button>
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
        {isMobile ? (
          <Button
            className={styles.mobileCloseButton}
            onClick={onToggle}
            title="Close Menu"
            variant="secondary"
          >
            <X className={styles.closeIcon} />
          </Button>
        ) : (
          <Button
            className={styles.toggleButton}
            onClick={onToggle}
            variant="secondary"
          >
            <ChevronLeft className={`${styles.toggleIcon} ${isCollapsed ? styles.rotated : ''}`} />
          </Button>
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