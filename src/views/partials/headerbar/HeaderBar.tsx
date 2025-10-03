import React from "react";
import styles from "./headerbar.module.css";
import { Search, Bell, Menu } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import ThemeToggle from "../../components/themetoggle/ThemeToggle";

interface HeaderBarProps {
  onSearch?: (query: string) => void;
  onNotificationsClick?: () => void;
  isCollapsed?: boolean;
  onToggle?: () => void;
  isMobile?: boolean;
}

const HeaderBar: React.FC<HeaderBarProps> = ({
  onSearch,
  onNotificationsClick,
  isCollapsed = false,
  onToggle,
  isMobile = false,
}) => {
  const [search, setSearch] = React.useState("");
  const { user } = useAuth();

  // Get initials for avatar
  const initials =
    user?.email
      ? user.email
        .split("@")[0]
        .split(/[.\-_]/)
        .map((s) => s[0]?.toUpperCase())
        .join("")
        .slice(0, 2)
      : "U";

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  return (
    <header className={`${styles.headerbar} ${isCollapsed ? styles.collapsed : ''} ${isMobile ? styles.mobile : ''}`}>
      {/* Mobile menu button */}
      {isMobile && (
        <button
          type="button"
          className={styles.mobileMenuBtn}
          onClick={onToggle}
          title="Toggle Menu"
        >
          <Menu className={styles.menuIcon} />
        </button>
      )}

      {/* Search section */}
      <div className={styles.searchContainer}>
        <Search className={styles.searchIcon} />
        <input
          type="text"
          className={styles.searchInput}
          placeholder={isMobile ? "Search..." : "Search for actions, pages, requests, reports, people..."}
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      {/* Right section with actions */}
      <div className={styles.rightSection}>
        <ThemeToggle />
        <button
          type="button"
          className={styles.iconBtn}
          title="Notifications"
          onClick={onNotificationsClick}
        >
          <Bell className={styles.actionIcon} />
        </button>
        <div className={styles.avatar}>
          <span>{initials}</span>
        </div>
      </div>
    </header>
  );
};

export default HeaderBar;