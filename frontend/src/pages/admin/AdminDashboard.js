import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminTopBar from './AdminTopBar';
import OverviewSection   from './sections/OverviewSection';
import StaffSection      from './sections/StaffSection';
import AnalyticsSection  from './sections/AnalyticsSection';
import ConfigSection     from './sections/ConfigSection';
import SalaryApprovalsSection from './sections/SalaryApprovalsSection';
import ConflictsSection  from './sections/ConflictsSection';
import useAdminGuard     from './useAdminGuard';

export default function AdminDashboard() {
  useAdminGuard();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const segment = window.location.pathname.split('/').filter(Boolean).pop();
  const PAGE_META = {
    overview:   { title: 'Dashboard Overview',    subtitle: 'Welcome back, System Admin!' },
    staff:      { title: 'Staff Management',      subtitle: 'Manage Tour & Driver Managers' },
    analytics:  { title: 'System Analytics',      subtitle: 'Revenue, users and system health' },
    config:     { title: 'Global Configuration',  subtitle: 'Platform rates and settings' },
    salaries:   { title: 'Salary Approvals',      subtitle: 'Approve pending fleet salary requests' },
    conflicts:  { title: 'Conflict Resolution',   subtitle: 'Refunds and user bans' },
  };
  const meta = PAGE_META[segment] || PAGE_META.overview;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminTopBar
          title={meta.title}
          subtitle={meta.subtitle}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview"   element={<OverviewSection />} />
            <Route path="staff"      element={<StaffSection />} />
            <Route path="analytics"  element={<AnalyticsSection />} />
            <Route path="config"     element={<ConfigSection />} />
            <Route path="salaries"   element={<SalaryApprovalsSection />} />
            <Route path="conflicts"  element={<ConflictsSection />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
