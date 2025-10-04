import React, { useState } from "react";
import styles from "./headerbar.module.css";
import { Search, Menu, Bell, BellDot } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import ThemeToggle from "../../components/themetoggle/ThemeToggle";

interface HeaderBarProps {
  onSearch?: (query: string) => void;
  isCollapsed?: boolean;
  onToggle?: () => void;
  isMobile?: boolean;
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

const HeaderBar: React.FC<HeaderBarProps> = ({
  onSearch,
  isCollapsed = false,
  onToggle,
  isMobile = false,
  onMenuClick,
  showMenuButton,
}) => {
  const [search, setSearch] = React.useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  // Mock notifications data
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New leave request from John Doe", time: "5 min ago", unread: true },
    { id: 2, message: "Meeting reminder: Team standup at 2 PM", time: "1 hour ago", unread: true },
    { id: 3, message: "Payroll has been processed successfully", time: "2 hours ago", unread: false },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };
  useAuth(); // keep hook to preserve auth side-effects if any

  // (avatar initials removed - not used in this header)

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
      {showMenuButton && (
        <button
          className="lg:hidden mr-4 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={onMenuClick}
          aria-label="Open sidebar"
        >
          <span className="material-icons">menu</span>
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
        {/* Notification button */}
        <div className={styles.notificationContainer}>
          <button className={styles.iconBtn} aria-label="Notifications" onClick={() => setShowNotifications(s => !s)}>
            {unreadCount > 0 ? <BellDot className={styles.actionIcon} /> : <Bell className={styles.actionIcon} />}
            {unreadCount > 0 && <span className={styles.notificationBadge}>{unreadCount}</span>}
          </button>

          {/* Simple dropdown (rendered when showNotifications=true) */}
          {showNotifications && (
            <div className={styles.notificationDropdown}>
              <div className={styles.notificationHeader}>
                <h3>Notifications</h3>
                <span className={styles.notificationCount}>{unreadCount} new</span>
              </div>
              <div className={styles.notificationList}>
                {notifications.map(n => (
                  <div key={n.id} className={`${styles.notificationItem} ${n.unread ? styles.unread : ''}`} onClick={() => markAsRead(n.id)}>
                    <div className={styles.notificationContent}>
                      <p className={styles.notificationMessage}>{n.message}</p>
                      <span className={styles.notificationTime}>{n.time}</span>
                    </div>
                    {n.unread && <div className={styles.unreadDot} />}
                  </div>
                ))}
              </div>
              <div className={styles.notificationFooter}>
                <button className={styles.viewAllBtn}>View All Notifications</button>
              </div>
            </div>
          )}
        </div>

        {/* Theme toggle next to notifications */}
        <div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default HeaderBar;