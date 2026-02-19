import {
  LayoutDashboard,
  ClipboardList,
  Users,
  ShieldCheck,
  BarChart,
  Settings
} from 'lucide-react';

export const SIDEBAR_CONFIG = {
  admin: [
    {
      label: 'Global Overview',
      path: '/dashboard',
      icon: LayoutDashboard
    },
    {
      label: 'Survey Monitoring',
      path: '/dashboard/surveys',
      icon: ClipboardList
    },
    {
      label: 'Enumerators',
      path: '/dashboard/enumerators',
      icon: Users
    },
    // {
    //   label: 'Supervisors',
    //   path: '/dashboard/supervisors',
    //   icon: ShieldCheck
    // },
    // {
    //   label: 'Analytics',
    //   path: '/dashboard/analytics',
    //   icon: BarChart
    // },
    {
      label: 'System Admin',
      path: '/dashboard/system-admin',
      icon: Settings
    }
  ],

  supervisor: [
    {
      label: 'Overview',
      path: '/dashboard',
      icon: LayoutDashboard
    },
    {
      label: 'Assigned Surveys',
      path: '/dashboard/surveys',
      icon: ClipboardList
    }
  ],

  enumerator: [
    {
      label: 'My Surveys',
      path: '/dashboard/surveys',
      icon: ClipboardList
    }
  ]
};
