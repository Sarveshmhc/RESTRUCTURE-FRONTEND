import React from 'react';
// import icons from 'lucide-react'
import {
  User, Calendar, FileText, DollarSign, Users, BookOpen, Inbox as InboxIcon, HelpCircle, Bell,
  Briefcase, Shield, ClipboardList, BarChart3, UserPlus, Search, Upload, Edit,
  CreditCard, Calculator, Building2, Headphones, MessageSquare, Settings, Palette, Plus, Clock,
} from '../../components/icons';

export interface SidebarItem {
    label: string;
    path: string;
    icon: React.ElementType;
    roles: ('hr' | 'employee')[];
    hasDropdown?: boolean;
    subItems?: SidebarItem[];
}

// HR specific sidebar items with proper grouping
export const hrSidebarItems: SidebarItem[] = [
    {
        label: 'Home',
        path: '/hr/home',
        roles: ['hr'],
        icon: User
    },
    {
        label: 'Employee Management',
        path: '/hr/employee-management',
        roles: ['hr'],
        icon: Users,
        hasDropdown: true,
        subItems: [
            { label: "Employee Profiles", icon: Users, path: "/employee-profile", roles: ['hr'] },
            { label: "Employee Directory", icon: Users, path: "/employee/directory", roles: ['hr'] },
            { label: "Profile Management", icon: User, path: "/employee/profile-management", roles: ['hr'] },
            { label: "Document Management", icon: FileText, path: "/employee/documents", roles: ['hr'] },
            { label: "Access Control", icon: Shield, path: "/employee/access-control", roles: ['hr'] },
            { label: "Audit Logs", icon: ClipboardList, path: "/employee/audit-logs", roles: ['hr'] },
            { label: "Employee Reports", icon: BarChart3, path: "/employee/reports", roles: ['hr'] },
        ]
    },
    {
        label: 'Recruitment',
        path: '/hr/recruitment',
        roles: ['hr'],
        icon: Briefcase,
        hasDropdown: true,
        subItems: [
            { label: "Job Requisition Management", icon: FileText, path: "/recruitment/job-requisition", roles: ['hr'] },
            { label: "Job Posting & Advertisement", icon: Plus, path: "/recruitment/job-posting", roles: ['hr'] },
            { label: "Application Tracking System", icon: Search, path: "/recruitment/ats", roles: ['hr'] },
            { label: "Interview Management", icon: Calendar, path: "/recruitment/interviews", roles: ['hr'] },
            { label: "Candidate Registration", icon: UserPlus, path: "/recruitment/candidates", roles: ['hr'] },
            { label: "Hiring Analytics Dashboard", icon: BarChart3, path: "/recruitment/analytics", roles: ['hr'] },
            { label: "Recruitment Budget Tracker", icon: DollarSign, path: "/recruitment/budget", roles: ['hr'] },
        ]
    },
    {
        label: 'Attendance',
        path: '/hr/attendance',
        roles: ['hr'],
        icon: Calendar,
        hasDropdown: true,
        subItems: [
            { label: "Daily Attendance View", icon: Calendar, path: "/attendance/daily", roles: ['hr'] },
            { label: "Monthly Attendance Calendar", icon: Calendar, path: "/attendance/monthly", roles: ['hr'] },
            { label: "Attendance Summary Report", icon: BarChart3, path: "/attendance/summary", roles: ['hr'] },
            { label: "Manual Attendance Update", icon: Edit, path: "/attendance/manual-update", roles: ['hr'] },
            { label: "Import Attendance", icon: Upload, path: "/attendance/import", roles: ['hr'] },
            { label: "Holiday Calendar", icon: Calendar, path: "/attendance/holidays", roles: ['hr'] },
            { label: "Attendance Metrics Dashboard", icon: BarChart3, path: "/attendance/metrics", roles: ['hr'] },
        ]
    },
    {
        label: 'Payroll',
        path: '/hr/payroll',
        roles: ['hr'],
        icon: DollarSign,
        hasDropdown: true,
        subItems: [
            { label: "Employee Salary Structure Setup", icon: DollarSign, path: "/payroll/salary-structure", roles: ['hr'] },
            { label: "Attendance & Time Integration", icon: Clock, path: "/payroll/attendance-integration", roles: ['hr'] },
            { label: "Payroll Run (Monthly/Quarterly)", icon: Calendar, path: "/payroll/run", roles: ['hr'] },
            { label: "Payslip Generation & Distribution", icon: FileText, path: "/payroll/payslips", roles: ['hr'] },
            { label: "Income Tax Management (TDS)", icon: Calculator, path: "/payroll/tax-management", roles: ['hr'] },
            { label: "Bank & Payment Processing", icon: CreditCard, path: "/payroll/bank-processing", roles: ['hr'] },
            { label: "Statutory Compliance", icon: Shield, path: "/payroll/compliance", roles: ['hr'] },
            { label: "Payroll Reports & Analytics", icon: BarChart3, path: "/payroll/reports", roles: ['hr'] },
            { label: "Audit & Access Control", icon: Shield, path: "/payroll/audit", roles: ['hr'] },
            { label: "Self-Service Portal", icon: User, path: "/payroll/self-service", roles: ['hr'] },
        ]
    },
    {
        label: 'Organization',
        path: '/hr/organization',
        roles: ['hr'],
        icon: Building2
    },
    {
        label: 'Help Desk',
        path: '/hr/help-desk',
        roles: ['hr'],
        icon: Headphones,
        hasDropdown: true,
        subItems: [
            { label: "Create Support Ticket", icon: Plus, path: "/hr/help-desk/create-ticket", roles: ['hr'] },
            { label: "Ticket Tracking", icon: Search, path: "/hr/help-desk/tracking", roles: ['hr'] },
            { label: "Knowledge Base", icon: BookOpen, path: "/hr/help-desk/knowledge-base", roles: ['hr'] },
            { label: "Frequently Asked Questions", icon: HelpCircle, path: "/hr/help-desk/faq", roles: ['hr'] },
            { label: "Feedback & Engagement", icon: MessageSquare, path: "/hr/help-desk/feedback", roles: ['hr'] },
        ]
    },
    {
        label: 'Announcements',
        path: '/hr/announcements',
        roles: ['hr'],
        icon: Bell
    },
    {
        label: 'Inbox',
        path: '/hr/inbox',
        roles: ['hr'],
        icon: InboxIcon
    },
    {
        label: 'Settings',
        path: '/hr/settings',
        roles: ['hr'],
        icon: Settings,
        hasDropdown: true,
        subItems: [
            { label: "General Settings", icon: Settings, path: "/hr/settings/general", roles: ['hr'] },
            { label: "Theme & Appearance", icon: Palette, path: "/hr/settings/theme", roles: ['hr'] },
            { label: "Notifications", icon: Bell, path: "/hr/settings/notifications", roles: ['hr'] },
            { label: "Security & Privacy", icon: Shield, path: "/hr/settings/security", roles: ['hr'] },
        ]
    }
];

// Employee specific sidebar items
export const employeeSidebarItems: SidebarItem[] = [
    {
        label: 'Home',
        path: '/employee/home',
        roles: ['employee'],
        icon: User
    },
    {
        label: 'Profile',
        path: '/employee/profile',
        roles: ['employee'],
        icon: Users
    },
    {
        label: 'My Attendance',
        path: '/employee/attendance',
        roles: ['employee'],
        icon: Calendar,
        hasDropdown: true,
        subItems: [
            { label: "View Attendance", icon: Calendar, path: "/employee/attendance/view", roles: ['employee'] },
            { label: "Attendance Reports", icon: FileText, path: "/employee/attendance/reports", roles: ['employee'] },
        ]
    },
    {
        label: 'Leave',
        path: '/employee/leave',
        roles: ['employee'],
        icon: FileText,
        hasDropdown: true,
        subItems: [
            { label: "Apply for Leave", icon: Plus, path: "/employee/leave/application", roles: ['employee'] },
            { label: "Leave History", icon: Clock, path: "/employee/leave/history", roles: ['employee'] },
            { label: "Leave Balance", icon: BarChart3, path: "/employee/leave/balance", roles: ['employee'] },
        ]
    },
    {
        label: 'Payroll',
        path: '/employee/payroll',
        roles: ['employee'],
        icon: DollarSign
    },
    {
        label: 'Policies',
        path: '/employee/policies',
        roles: ['employee'],
        icon: BookOpen
    },
    {
        label: 'Help Desk',
        path: '/employee/help-desk',
        roles: ['employee'],
        icon: HelpCircle,
        hasDropdown: true,
        subItems: [
            { label: "Create Support Ticket", icon: Plus, path: "/employee/help-desk/create-ticket", roles: ['employee'] },
            { label: "Ticket Tracking", icon: MessageSquare, path: "/employee/help-desk/tracking", roles: ['employee'] },
            { label: "Knowledge Base", icon: BookOpen, path: "/employee/help-desk/knowledge-base", roles: ['employee'] },
            { label: "Frequently Asked Questions", icon: HelpCircle, path: "/employee/help-desk/faq", roles: ['employee'] },
        ]
    },
    {
        label: 'Settings',
        path: '/employee/settings',
        roles: ['employee'],
        icon: Settings,
        hasDropdown: true,
        subItems: [
            { label: "General Settings", icon: Settings, path: "/employee/settings/general", roles: ['employee'] },
            { label: "Theme & Appearance", icon: Palette, path: "/employee/settings/theme", roles: ['employee'] },
            { label: "Notifications", icon: Bell, path: "/employee/settings/notifications", roles: ['employee'] },
            { label: "Security & Privacy", icon: Shield, path: "/employee/settings/security", roles: ['employee'] },
        ]
    },
    {
        label: 'Announcements',
        path: '/employee/announcements',
        roles: ['employee'],
        icon: Bell
    }
];

/*  for checking porpose */