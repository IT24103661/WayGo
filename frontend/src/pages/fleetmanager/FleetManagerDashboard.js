import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import FleetManagerSidebar from './FleetManagerSidebar';
import FleetManagerTopBar from './FleetManagerTopBar';
import InventorySection from './sections/InventorySection';
import ServiceDueSection from './sections/ServiceDueSection';
import ComplianceAlertsSection from './sections/ComplianceAlertsSection';
import ProfileSection from './sections/ProfileSection';

export default function FleetManagerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const segment = window.location.pathname.split('/').filter(Boolean).pop();
  const PAGE_META = {
    overview: { title: 'Fleet Overview', subtitle: 'Vehicle health, compliance, and service status' },
    inventory: { title: 'Vehicle Inventory', subtitle: 'Track all fleet vehicles' },
    service: { title: 'Service Due', subtitle: 'Maintenance and oil change alerts' },
    compliance: { title: 'Compliance Alerts', subtitle: 'Expiring registration documents' },
    profile: { title: 'Profile', subtitle: 'Manage fleet manager details' },
  };
  const meta = PAGE_META[segment] || PAGE_META.overview;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <FleetManagerSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <FleetManagerTopBar
          title={meta.title}
          subtitle={meta.subtitle}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={
              <div className="grid grid-cols-1 xl:grid-cols-[2fr,1fr] gap-6">
                <InventorySection />
                <div className="space-y-6">
                  <ComplianceAlertsSection />
                  <ServiceDueSection />
                </div>
              </div>
            } />
            <Route path="inventory" element={<InventorySection />} />
            <Route path="service" element={<ServiceDueSection />} />
            <Route path="compliance" element={<ComplianceAlertsSection />} />
            <Route path="profile" element={<ProfileSection />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
