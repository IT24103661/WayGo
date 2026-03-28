import { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import TourManagerSidebar from './TourManagerSidebar';
import TourManagerTopBar from './TourManagerTopBar';
import OverviewSection from './sections/OverviewSection';
import CreatePackageSection from './sections/CreatePackageSection';
import CustomQuotesSection from './sections/CustomQuotesSection';
import ActiveToursMapSection from './sections/ActiveToursMapSection';
import ManageToursSection from './sections/ManageToursSection';
import TourManagerProfileSection from './sections/TourManagerProfileSection';

export default function TourManagerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const segment = location.pathname.split('/').filter(Boolean).pop();
  const PAGE_META = {
    overview: { title: 'Tour Manager Console', subtitle: 'Curate premium, multi-day journeys' },
    packages: { title: 'Manage Packages', subtitle: 'Design signature experiences' },
    tours: { title: 'Manage Custom Tours', subtitle: 'Detailed standalone itineraries' },
    quotes: { title: 'Pending Custom Quotes', subtitle: 'Review high-value requests' },
    map: { title: 'Active Tours Map', subtitle: 'Monitor premium tours in motion' },
    profile: { title: 'Manager Profile', subtitle: 'Account management and settings' },
  };
  const meta = PAGE_META[segment] || PAGE_META.overview;

  return (
    <div className="relative flex h-screen overflow-hidden bg-[#f4f7f4]" style={{ fontFamily: '"Space Grotesk", "Sora", "Segoe UI", sans-serif' }}>
      <div className="pointer-events-none absolute -top-28 -right-16 h-72 w-72 rounded-full bg-emerald-200/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-teal-200/40 blur-3xl" />

      <div className="relative z-10 flex h-full w-full">
        <TourManagerSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <TourManagerTopBar
            title={meta.title}
            subtitle={meta.subtitle}
            onMenuClick={() => setSidebarOpen(true)}
          />
          <main className="flex-1 overflow-y-auto px-6 pb-10">
            <Routes>
              <Route index element={<Navigate to="overview" replace />} />
              <Route path="overview" element={<OverviewSection />} />
              <Route path="packages" element={<CreatePackageSection />} />
              <Route path="tours" element={<ManageToursSection />} />
              <Route path="quotes" element={<CustomQuotesSection />} />
              <Route path="map" element={<ActiveToursMapSection />} />
              <Route path="profile" element={<TourManagerProfileSection />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
}
