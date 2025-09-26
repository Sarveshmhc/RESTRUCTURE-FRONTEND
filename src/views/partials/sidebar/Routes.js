//import { ENABLED_FEATURES } from '../../../utils/constants';

const Routes = () => {
  return {
    hr: [
      {
        path: "/hr/dashboard",
        label: "Dashboard",
        icon: "bi bi-grid-1x2",
      },
      {
        path: "/hr/employees",
        label: "Employee Management",
        icon: "bi bi-people",
        dropdown: [
          {
            path: "/hr/employees/all",
            label: "All Employees",
            icon: "bi bi-people",
          },
          {
            path: "/hr/employees/directory",
            label: "Employee Directory",
            icon: "bi bi-person-lines-fill",
          },
          {
            path: "/hr/employees/profiles",
            label: "Employee Profiles",
            icon: "bi bi-person-badge",
          },
          {
            path: "/hr/employees/org-chart",
            label: "Organizational Chart",
            icon: "bi bi-diagram-3",
          },
        ],
      },
      {
        path: "/hr/recruitment",
        label: "Recruitment",
        icon: "bi bi-person-plus",
        dropdown: [
          {
            path: "/hr/recruitment/pipeline",
            label: "Candidate Pipeline",
            icon: "bi bi-funnel",
          },
          {
            path: "/hr/recruitment/interviews",
            label: "Interview Scheduling",
            icon: "bi bi-calendar-event",
          },
          {
            path: "/hr/recruitment/offers",
            label: "Offer Management",
            icon: "bi bi-envelope-check",
          },
        ],
      },
      {
        path: "/hr/onboarding",
        label: "Onboarding",
        icon: "bi bi-person-check",
        dropdown: [
          {
            path: "/hr/onboarding/new-hires",
            label: "New Hires",
            icon: "bi bi-person-plus-fill",
          },
          {
            path: "/hr/onboarding/documentation",
            label: "Documentation",
            icon: "bi bi-file-earmark-text",
          },
          {
            path: "/hr/onboarding/verification",
            label: "Background Verification",
            icon: "bi bi-shield-check",
          },
        ],
      },
      {
        path: "/hr/attendance",
        label: "Attendance",
        icon: "bi bi-clock",
        dropdown: [
          {
            path: "/hr/attendance/daily",
            label: "Daily Attendance",
            icon: "bi bi-calendar-day",
          },
          {
            path: "/hr/attendance/monthly",
            label: "Monthly Calendar",
            icon: "bi bi-calendar-month",
          },
          {
            path: "/hr/attendance/reports",
            label: "Attendance Reports",
            icon: "bi bi-graph-up",
          },
        ],
      },
      {
        path: "/hr/leave",
        label: "Leave Management",
        icon: "bi bi-x-circle",
        dropdown: [
          {
            path: "/hr/leave/applications",
            label: "Leave Applications",
            icon: "bi bi-file-earmark-minus",
          },
          {
            path: "/hr/leave/approval",
            label: "Leave Approval",
            icon: "bi bi-check-circle",
          },
          {
            path: "/hr/leave/reports",
            label: "Leave Reports",
            icon: "bi bi-clipboard-data",
          },
        ],
      },
      {
        path: "/hr/payroll",
        label: "Payroll",
        icon: "bi bi-currency-dollar",
        dropdown: [
          {
            path: "/hr/payroll/salary",
            label: "Salary Management",
            icon: "bi bi-cash-stack",
          },
          {
            path: "/hr/payroll/payslips",
            label: "Payslips",
            icon: "bi bi-receipt",
          },
          {
            path: "/hr/payroll/tax",
            label: "Tax Management",
            icon: "bi bi-calculator",
          },
        ],
      },
      {
        path: "/hr/performance",
        label: "Performance",
        icon: "bi bi-graph-up",
        dropdown: [
          {
            path: "/hr/performance/reviews",
            label: "Performance Reviews",
            icon: "bi bi-star",
          },
          {
            path: "/hr/performance/goals",
            label: "Goal Setting",
            icon: "bi bi-target",
          },
        ],
      },
      {
        path: "/hr/organization",
        label: "Organization",
        icon: "bi bi-building",
      },
      {
        path: "/hr/policies",
        label: "Policies & Documents",
        icon: "bi bi-file-earmark-text",
        dropdown: [
          {
            path: "/hr/policies/documents",
            label: "Company Policies",
            icon: "bi bi-file-earmark-ruled",
          },
          {
            path: "/hr/policies/handbook",
            label: "Employee Handbook",
            icon: "bi bi-book",
          },
        ],
      },
      {
        path: "/hr/help-desk",
        label: "HR Help Desk",
        icon: "bi bi-question-circle",
        dropdown: [
          {
            path: "/hr/help-desk/queries",
            label: "Employee Queries",
            icon: "bi bi-chat-dots",
          },
          {
            path: "/hr/help-desk/kb",
            label: "Knowledge Base",
            icon: "bi bi-journal-bookmark",
          },
          {
            path: "/hr/help-desk/faq",
            label: "FAQ",
            icon: "bi bi-question-diamond",
          },
        ],
      },
      {
        path: "/hr/settings",
        label: "Settings",
        icon: "bi bi-gear",
      },
    ],
    employee: [
      {
        path: "/employee/dashboard",
        label: "Dashboard",
        icon: "bi bi-grid-1x2",
      },
      {
        path: "/employee/profile",
        label: "My Profile",
        icon: "bi bi-person",
      },
      {
        path: "/employee/attendance",
        label: "My Attendance",
        icon: "bi bi-clock",
        dropdown: [
          {
            path: "/employee/attendance/view",
            label: "View Attendance",
            icon: "bi bi-calendar-check",
          },
          {
            path: "/employee/attendance/punch",
            label: "Punch In/Out",
            icon: "bi bi-clock-fill",
          },
        ],
      },
      {
        path: "/employee/leave",
        label: "Leave",
        icon: "bi bi-x-circle",
        dropdown: [
          {
            path: "/employee/leave/apply",
            label: "Apply Leave",
            icon: "bi bi-plus-circle",
          },
          {
            path: "/employee/leave/history",
            label: "Leave History",
            icon: "bi bi-clock-history",
          },
          {
            path: "/employee/leave/balance",
            label: "Leave Balance",
            icon: "bi bi-pie-chart",
          },
        ],
      },
      {
        path: "/employee/payroll",
        label: "Payroll",
        icon: "bi bi-currency-dollar",
        dropdown: [
          {
            path: "/employee/payroll/payslips",
            label: "My Payslips",
            icon: "bi bi-receipt",
          },
          {
            path: "/employee/payroll/tax",
            label: "Tax Documents",
            icon: "bi bi-file-earmark-spreadsheet",
          },
        ],
      },
      {
        path: "/employee/benefits",
        label: "Benefits",
        icon: "bi bi-gift",
      },
      {
        path: "/employee/help-desk",
        label: "Help Desk",
        icon: "bi bi-question-circle",
      },
      {
        path: "/employee/settings",
        label: "Settings",
        icon: "bi bi-gear",
      },
    ],
  };
};

export default Routes;