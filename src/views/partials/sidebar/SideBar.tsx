import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import type { User } from "../../contexts/AuthContext";
import { useThemeStore } from "../../contexts/ThemeStore";
import { hrSidebarItems, employeeSidebarItems, type SidebarItem } from "./sidebarcontent";
import mhCover from "../../../assets/MH Cognizant LOGO_White.png";
import mhLogo from "../../../assets/MH Cognition LOGO.png";
import styles from "./sidebar.module.css";
import { SidebarTooltip } from "@components";
import { ChevronRight, LogOut, ChevronLeft, ChevronUp, User as UserIcon, X} from "../../components/icons";

interface SideBarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobile?: boolean;
}

const SideBar: React.FC<SideBarProps> = ({ isCollapsed, onToggle, isMobile = false }) => {
  const { user, logout } = useAuth();
  const { isDark } = useThemeStore();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [closingDropdown, setClosingDropdown] = useState<string | null>(null);
  const [showSample, setShowSample] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Get sidebar items based on user role
  const sidebarItems = user?.role === "hr" ? hrSidebarItems : employeeSidebarItems;

  const toggleDropdown = (label: string) => {
    if (openDropdown === label) {
      // Close the dropdown with animation
      setClosingDropdown(label);
      setTimeout(() => {
        setOpenDropdown(null);
        setClosingDropdown(null);
      }, 400); // Match the CSS transition duration
    } else {
      setOpenDropdown(label);
      setClosingDropdown(null);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const renderSidebarItem = (item: SidebarItem) => {
    const Icon = item.icon;
    const isItemActive = isActive(item.path);
    const hasSubItems = item.hasDropdown && item.subItems && item.subItems.length > 0;
    const isDropdownOpen = openDropdown === item.label;
    const isDropdownClosing = closingDropdown === item.label;

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
        style={{ textDecoration: "none" }}
        aria-label={item.label}
        aria-expanded={isDropdownOpen}
      >
        <Icon className={styles.sidebarIcon} />
        {!isCollapsed && (
          <>
            <span className={styles.sidebarLabel}>
              {item.label}
            </span>
            {hasSubItems && (
              <ChevronRight
                className={`${styles.chevron} ${isDropdownOpen ? styles.rotated : ''}`}
              />
            )}
          </>
        )}
      </Link>
    );

    return (
      <div key={item.label} className={styles.sidebarItem}>
        {/* Use SidebarTooltip when collapsed and not mobile */}
        {(isCollapsed && !isMobile) ? (
          <SidebarTooltip text={item.label}>
            {linkEl}
          </SidebarTooltip>
        ) : (
          linkEl
        )}

        {/* Render submenu items with smooth animations */}
        {hasSubItems && !isCollapsed && (
          <div
            className={`${styles.submenu} ${isDropdownOpen ? styles.open : ''
              } ${isDropdownClosing ? styles.closing : ''}`}
          >
            {item.subItems?.map((subItem, index) => {
              const SubIcon = subItem.icon;
              const isSubItemActive = isActive(subItem.path);
              return (
                <Link
                  key={subItem.path}
                  to={subItem.path}
                  className={`${styles.submenuLink} ${isSubItemActive ? styles.active : ""}`}
                  style={{
                    textDecoration: "none",
                    // set CSS variable used by CSS to stagger items
                    ['--i' as any]: index
                  }}
                  aria-label={subItem.label}
                >
                  <span className={styles.submenuIcon}><SubIcon /></span>
                  <span className={styles.submenuLabel}>{subItem.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // Profile Footer Component with enhanced animations
  const SidebarProfileFooter = ({ user }: { user: User | null }) => {
    const [open, setOpen] = useState(false);
    const [closing, setClosing] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      function onDocClick(e: MouseEvent) {
        if (!ref.current) return;
        if (!ref.current.contains(e.target as Node)) {
          handleClose();
        }
      }
      function onKey(e: KeyboardEvent) {
        if (e.key === "Escape") {
          handleClose();
        }
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

    const handleClose = () => {
      setClosing(true);
      setTimeout(() => {
        setOpen(false);
        setClosing(false);
      }, 300); // Match animation duration
    };

    const handleOpen = () => {
      setOpen(true);
      setClosing(false);
    };

    // Position dropdown for both collapsed and expanded states
    useEffect(() => {
      if (open && dropdownRef.current && ref.current) {
        const profileRect = ref.current.getBoundingClientRect();
        const dropdown = dropdownRef.current;

        if (isCollapsed) {
          // Position to the right of collapsed sidebar
          dropdown.style.left = `${64 + 12}px`;
          dropdown.style.bottom = `${window.innerHeight - profileRect.bottom + 10}px`;
          dropdown.style.top = 'auto';
          dropdown.style.right = 'auto';
          dropdown.style.width = '160px';
        } else {
          // Position above the profile button for expanded sidebar
          dropdown.style.left = `${profileRect.left}px`;
          dropdown.style.right = 'auto';
          dropdown.style.bottom = `${window.innerHeight - profileRect.top + 8}px`;
          dropdown.style.top = 'auto';
          dropdown.style.width = `${Math.max(profileRect.width, 160)}px`;
        }
      }
    }, [open, isCollapsed]);

    const initials =
      user?.firstName && user?.lastName
        ? user.firstName[0].toUpperCase() + user.lastName[0].toUpperCase()
        : user?.role === "hr"
          ? "HR"
          : "U";

    const gotoProfile = () => {
      handleClose();
      navigate(user?.role === "hr" ? "/hr/profile" : "/employee/profile");
    };

    const doLogout = async () => {
      handleClose();
      await logout();
      navigate("/login");
    };

    const buttonEl = (
      <button
        type="button"
        className={`${styles.profileBtn} ${open ? styles.profileBtnOpen : ''}`}
        onClick={() => open ? handleClose() : handleOpen()}
        aria-haspopup="menu"
        aria-expanded={open}
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
            <ChevronUp className={`${styles.chevron} ${open ? styles.rotated : ''}`} />
          </>
        )}
      </button>
    );

    return (
      <div className={styles.profileContainer} ref={ref}>
        {/* Use SidebarTooltip for profile when collapsed */}
        {(isCollapsed && !isMobile) ? (
          <SidebarTooltip text={`${user?.firstName || "User"} • Profile`}>
            {buttonEl}
          </SidebarTooltip>
        ) : (
          buttonEl
        )}

        {/* Render dropdown with smooth animations */}
        {open && (
          <div
            ref={dropdownRef}
            id="sidebar-profile-menu"
            role="menu"
            className={`${styles.profileDropdown} ${isCollapsed ? styles.profileDropdownRight : styles.profileDropdownUp
              } ${closing ? styles.closing : styles.opening}`}
          >
            <button
              type="button"
              className={`${styles.dropdownItem} ${styles.profileDropdownItem}`}
              onClick={gotoProfile}
              role="menuitem"
            >
              <UserIcon className={styles.dropdownIcon} />
              <span>Profile</span>
            </button>
            <div className={styles.dropdownDivider} />
            <button
              type="button"
              className={`${styles.logoutDropdownItem} ${styles.logoutDropdownItemSecond}`}
              onClick={doLogout}
              role="menuitem"
            >
              <LogOut className={styles.dropdownIcon} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <aside
      className={
        `${styles.sidebar} ` +
        (isMobile ? `${styles.mobile}` : (isCollapsed ? styles.collapsed : styles.expanded))
      }
      data-mobile={isMobile ? 'true' : 'false'}
    >
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

        {/* Replace any Link / <a> for Sample with this button */}
        <div
          role="button"
          className={`${styles.navItem} ${showSample ? "active" : ""}`}
          onClick={() => setShowSample(s => !s)}
          data-tooltip="Sample — UI preview"
        >
          <span className={styles.navIcon} aria-hidden>
            {/* svg icon */}
          </span>
          <span className={styles.navLabel}></span>
        </div>
      </nav>

      <div className={styles.sidebarFooter}>
        <SidebarProfileFooter user={user} />
      </div>
    </aside>
  );
};

export default SideBar;