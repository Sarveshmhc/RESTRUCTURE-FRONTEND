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
  Shield,
  LogOut,
  ClipboardList,
  UserPlus,
  Search,
  Upload,
  Edit,
  CreditCard,
  Calculator,
  Building2,
  Headphones,
  MessageSquare,
  Settings,
  Palette,
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
    path: "/hr/employees-management",
    hasDropdown: true,
    subItems: [
      { label: "Employee Profiles", icon: Users, path: "/employee-profile" },
      { label: "Employee Directory", icon: Users, path: "/employee/directory" },
      { label: "Profile Management", icon: User, path: "/employee/profile-management" },
      { label: "Document Management", icon: FileText, path: "/employee/documents" },
      { label: "Access Control", icon: Shield, path: "/employee/access-control" },
      { label: "Audit Logs", icon: ClipboardList, path: "/employee/audit-logs" },
      { label: "Employee Reports", icon: BarChart3, path: "/employee/reports" },
    ],
  },
  {
    label: "Recruitment",
    icon: Briefcase,
    path: "/hr/recruitment",
    hasDropdown: true,
   subItems: [
      { label: "Job Requisition Management", icon: FileText, path: "/recruitment/job-requisition" },
      { label: "Job Posting & Advertisement", icon: Plus, path: "/recruitment/job-posting" },
      { label: "Application Tracking System", icon: Search, path: "/recruitment/ats" },
      { label: "Interview Management", icon: Calendar, path: "/recruitment/interviews" },
      { label: "Candidate Registration", icon: UserPlus, path: "/recruitment/candidates" },
      { label: "Hiring Analytics Dashboard", icon: BarChart3, path: "/recruitment/analytics" },
      { label: "Recruitment Budget Tracker", icon: DollarSign, path: "/recruitment/budget" },
    ],
  },
  {
    label: "Attendance",
    icon: Calendar,
    path: "/hr/attendance",
    hasDropdown: true,
    subItems: [
      { label: "Daily Attendance View", icon: Calendar, path: "/attendance/daily" },
      { label: "Monthly Attendance Calendar", icon: Calendar, path: "/attendance/monthly" },
      { label: "Attendance Summary Report", icon: BarChart3, path: "/attendance/summary" },
      { label: "Manual Attendance Update", icon: Edit, path: "/attendance/manual-update" },
      { label: "Import Attendance", icon: Upload, path: "/attendance/import" },
      { label: "Holiday Calendar", icon: Calendar, path: "/attendance/holidays" },
      { label: "Attendance Metrics Dashboard", icon: BarChart3, path: "/attendance/metrics" },
    ],
  },
  {
    label: "Payroll",
    icon: DollarSign,
    path: "/hr/payroll",
    hasDropdown: true,
    subItems: [
      { label: "Employee Salary Structure Setup", icon: DollarSign, path: "/payroll/salary-structure" },
      { label: "Attendance & Time Integration", icon: Clock, path: "/payroll/attendance-integration" },
      { label: "Payroll Run (Monthly/Quarterly)", icon: Calendar, path: "/payroll/run" },
      { label: "Payslip Generation & Distribution", icon: FileText, path: "/payroll/payslips" },
      { label: "Income Tax Management (TDS)", icon: Calculator, path: "/payroll/tax-management" },
      { label: "Bank & Payment Processing", icon: CreditCard, path: "/payroll/bank-processing" },
      { label: "Statutory Compliance", icon: Shield, path: "/payroll/compliance" },
      { label: "Payroll Reports & Analytics", icon: BarChart3, path: "/payroll/reports" },
      { label: "Audit & Access Control", icon: Shield, path: "/payroll/audit" },
      { label: "Self-Service Portal", icon: User, path: "/payroll/self-service" },
    ],
  },
  {
    label: "Organization",
    icon: Building2,
    path: "hr/organizations",
  },{
    label: "Help Desk",
    icon: Headphones,
    path: "/help-desk",
    hasDropdown: true,
    subItems: [
      { label: "Create Support Ticket", icon: Plus, path: "/help-desk/create-ticket" },
      { label: "Ticket Tracking", icon: Search, path: "/help-desk/tracking" },
      { label: "Knowledge Base", icon: BookOpen, path: "/help-desk/knowledge-base" },
      { label: "Frequently Asked Questions", icon: HelpCircle, path: "/help-desk/faq" },
      { label: "Feedback & Engagement", icon: MessageSquare, path: "/help-desk/feedback" },
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
  {
    label: "Settings",
    icon: Settings,
    path: "/settings",
    hasDropdown: true,
    subItems: [
      { label: "General Settings", icon: Settings, path: "/settings/general" },
      { label: "Theme & Appearance", icon: Palette, path: "/settings/theme" },
      { label: "Notifications", icon: Bell, path: "/settings/notifications" },
      { label: "Security & Privacy", icon: Shield, path: "/settings/security" },
    ],
  },
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