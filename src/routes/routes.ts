import React, { lazy } from 'react';

// Existing components
const HRHomepage = lazy(() => import('../views/hr/homepage/HRHomepage'));
const SamplePanel = lazy(() => import('../views/partials/sidebar/SamplePanel'));

// Placeholder component for routes that don't exist yet
const PlaceholderComponent = lazy(() => import('../views/components/placeholder/PlaceholderComponent'));

export interface RouteConfig {
  path: string;
  component: React.ComponentType<Record<string, unknown>>;
  title: string;
  roles: ('hr' | 'employee')[];
  children?: RouteConfig[];
}

export const routeConfig: RouteConfig[] = [
  // HR Routes
  {
    path: '/hr/home',
    component: HRHomepage,
    title: 'Home',
    roles: ['hr'],
  },
  {
    path: '/hr/employee-management',
    component: PlaceholderComponent,
    title: 'Employee Management',
    roles: ['hr'],
  },
  {
    path: '/hr/onboarding',
    component: PlaceholderComponent,
    title: 'Onboarding',
    roles: ['hr'],
  },
  {
    path: '/hr/recruitment',
    component: PlaceholderComponent,
    title: 'Recruitment',
    roles: ['hr'],
  },
  {
    path: '/hr/attendance',
    component: PlaceholderComponent,
    title: 'Attendance',
    roles: ['hr'],
  },
  {
    path: '/hr/leave-management',
    component: PlaceholderComponent,
    title: 'Leave management',
    roles: ['hr'],
  },
  {
    path: '/hr/leave',
    component: PlaceholderComponent,
    title: 'Leave',
    roles: ['hr'],
  },
  {
    path: '/hr/payroll',
    component: PlaceholderComponent,
    title: 'Payroll',
    roles: ['hr'],
  },
  {
    path: '/hr/organization',
    component: PlaceholderComponent,
    title: 'Organization',
    roles: ['hr'],
  },
  {
    path: '/hr/help-desk',
    component: PlaceholderComponent,
    title: 'Help Desk',
    roles: ['hr'],
  },
  {
    path: '/hr/announcements',
    component: PlaceholderComponent,
    title: 'Announcements',
    roles: ['hr'],
  },
  {
    path: '/hr/inbox',
    component: PlaceholderComponent,
    title: 'Inbox',
    roles: ['hr'],
  },
  {
    path: '/hr/settings',
    component: PlaceholderComponent,
    title: 'Settings',
    roles: ['hr'],
  },
  {
    path: '/hr/samples',
    component: SamplePanel,
    title: 'Component Samples',
    roles: ['hr'],
  },

  // Employee Routes
  {
    path: '/employee/home',
    component: PlaceholderComponent,
    title: 'Home',
    roles: ['employee'],
  },
  {
    path: '/employee/profile',
    component: PlaceholderComponent,
    title: 'Profile',
    roles: ['employee'],
  },
  {
    path: '/employee/attendance',
    component: PlaceholderComponent,
    title: 'My Attendance',
    roles: ['employee'],
  },
  {
    path: '/employee/leave',
    component: PlaceholderComponent,
    title: 'Leave',
    roles: ['employee'],
  },
  {
    path: '/employee/payroll',
    component: PlaceholderComponent,
    title: 'Payroll',
    roles: ['employee'],
  },
];