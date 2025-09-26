import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useThemeStore } from "../../contexts/ThemeStore";
import styles from "./sidebar.module.css";

import {
  User,
  Calendar,
  FileText,
  DollarSign,
  Users,
  BookOpen,
  Inbox as InboxIcon,
  HelpCircle,
  Settings as SettingsIcon,
  Bell,
  ChevronDown,
  ChevronRight,
  Plus,
  Clock,
  BarChart3,
  Briefcase,
  Sun,
  Moon,
  LogOut,
  //ChevronLeft,
  PanelLeft,
} from "lucide-react";

interface SideBarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

type SidebarItem = {
  label: string;
  icon: React.ElementType;
  path: string;
  hasDropdown?: boolean;
  subItems?: SidebarItem[];
};

const hrSidebarItems: SidebarItem[] = [
  { label: "Home", icon: User, path: "/hr/home" },
  {
    label: "Employee Management",
    icon: Users,
    path: "/hr/employees",
    hasDropdown: true,
    subItems: [
      { label: "All Employees", icon: Users, path: "/hr/employees/all" },
      { label: "Employee Directory", icon: User, path: "/hr/employees/directory" },
      { label: "Employee Profiles", icon: User, path: "/hr/employees/profiles" },
      { label: "Organizational Chart", icon: User, path: "/hr/employees/org-chart" },
    ],
  },
  {
    label: "Recruitment",
    icon: Briefcase,
    path: "/hr/recruitment",
    hasDropdown: true,
    subItems: [
      { label: "Job Openings", icon: Briefcase, path: "/hr/recruitment/jobs" },
      { label: "Applications", icon: FileText, path: "/hr/recruitment/applications" },
    ],
  },
  {
    label: "Attendance",
    icon: Calendar,
    path: "/hr/attendance",
    hasDropdown: true,
    subItems: [
      { label: "View Attendance", icon: Calendar, path: "/hr/attendance/view" },
      { label: "Attendance Reports", icon: FileText, path: "/hr/attendance/reports" },
    ],
  },
  {
    label: "Payroll",
    icon: DollarSign,
    path: "/hr/payroll",
    hasDropdown: true,
    subItems: [
      { label: "Salary Structure", icon: Briefcase, path: "/hr/payroll/salary-structure" },
      { label: "Run Payroll", icon: DollarSign, path: "/hr/payroll/run" },
      { label: "Payslips", icon: FileText, path: "/hr/payroll/payslips" },
    ],
  },
  { label: "Inbox", icon: InboxIcon, path: "/hr/inbox" },
  {
    label: "Help Desk",
    icon: HelpCircle,
    path: "/hr/help-desk",
    hasDropdown: true,
    subItems: [
      { label: "Employee Queries", icon: HelpCircle, path: "/hr/help-desk/queries" },
      { label: "Knowledge Base", icon: BookOpen, path: "/hr/help-desk/kb" },
      { label: "FAQ", icon: HelpCircle, path: "/hr/help-desk/faq" },
    ],
  },
  { label: "Settings", icon: SettingsIcon, path: "/hr/settings" },
  { label: "Announcements", icon: Bell, path: "/hr/announcements" },
];

const employeeSidebarItems: SidebarItem[] = [
  { label: "Home", icon: User, path: "/employee/home" },
  { label: "My Profile", icon: Users, path: "/employee/profile" },
  {
    label: "My Attendance",
    icon: Calendar,
    path: "/employee/attendance",
    hasDropdown: true,
    subItems: [
      { label: "View Attendance", icon: Calendar, path: "/employee/attendance/view" },
      { label: "Attendance Reports", icon: FileText, path: "/employee/attendance/reports" },
    ],
  },
  {
    label: "Leave",
    icon: FileText,
    path: "/employee/leave",
    hasDropdown: true,
    subItems: [
      { label: "Apply for Leave", icon: Plus, path: "/employee/leave/application" },
      { label: "Leave History", icon: Clock, path: "/employee/leave/history" },
      { label: "Leave Balance", icon: BarChart3, path: "/employee/leave/balance" },
    ],
  },
  { label: "Payroll", icon: DollarSign, path: "/employee/payroll" },
  { label: "Policies", icon: BookOpen, path: "/employee/policies" },
  { label: "Inbox", icon: InboxIcon, path: "/employee/inbox" },
  { label: "Help Desk", icon: HelpCircle, path: "/employee/help-desk" },
  { label: "Settings", icon: SettingsIcon, path: "/employee/settings" },
  { label: "Announcements", icon: Bell, path: "/employee/announcements" },
];

const SideBar: React.FC<SideBarProps> = ({ isCollapsed, onToggle }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useThemeStore();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  

  const sidebarItems =
    user?.role === "hr" ? hrSidebarItems : employeeSidebarItems;

  // Helper to check if a sidebar item or its subitems is active
   const isItemActive = (item: SidebarItem) => {
    if (location.pathname === item.path) return true;
    if (item.subItems) {
      return item.subItems.some((sub) => location.pathname === sub.path);
    }
    return false;
  };

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ""}`}>
    <div className={styles.sidebarHeader}>
  <span className={styles.sidebarTitle}>
    {user?.role === "hr" ? "HR Portal" : "Employee Portal"}
  </span>
  <button
  className={styles.collapseBtn}
  onClick={onToggle}
  title="Toggle Sidebar"
  aria-label="Toggle Sidebar"
  type="button"
>
  <PanelLeft size={32} />
</button>
</div>
      <nav className={styles.sidebarNav}>
        {sidebarItems.map((item) => {
          const active = isItemActive(item);
          const hasDropdown = item.hasDropdown && item.subItems;
          return (
            <div key={item.label} className={styles.sidebarItem}>
              <Link
                to={item.path}
                className={`${styles.sidebarLink} ${active ? styles.active : ""}`}
                onClick={() =>
                  hasDropdown &&
                  setOpenDropdown(openDropdown === item.label ? null : item.label)
                }
              >
                <item.icon className={styles.sidebarIcon} />
                <span>{item.label}</span>
                {hasDropdown &&
                  (openDropdown === item.label ? (
                    <ChevronDown className={styles.chevronIcon} />
                  ) : (
                    <ChevronRight className={styles.chevronIcon} />
                  ))}
              </Link>
              {hasDropdown && openDropdown === item.label && (
                <div className={styles.dropdownMenu}>
                  {item.subItems!.map((sub) => (
                    <Link
                      key={sub.label}
                      to={sub.path}
                      className={`${styles.sidebarLink} ${
                        location.pathname === sub.path ? styles.active : ""
                      }`}
                    >
                      <sub.icon className={styles.sidebarIcon} />
                      <span>{sub.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
      <div className={styles.sidebarFooter}>
        <button
          className={styles.themeBtn}
          onClick={toggleTheme}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? (
            <Sun className={styles.footerIcon} />
          ) : (
            <Moon className={styles.footerIcon} />
          )}
          <span className={styles.footerBtnText}>
            {isDark ? "Light Mode" : "Dark Mode"}
          </span>
        </button>
        <button
          className={styles.logoutBtn}
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          <LogOut className={styles.footerIcon} />
          <span className={styles.footerBtnText}>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default SideBar;