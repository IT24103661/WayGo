import { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import DriverSidebar from './DriverSidebar';
import DriverTopBar from './DriverTopBar';
import OverviewSection from './sections/OverviewSection';
import PendingRequestsSection from './sections/PendingRequestsSection';
import ItinerariesSection from './sections/ItinerariesSection';
import SupportSection from './sections/SupportSection';
import SettingsSection from './sections/SettingsSection';

export default function DriverDashboard() {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const location = useLocation();

	const segment = location.pathname.split('/').filter(Boolean).pop();
	const PAGE_META = {
		overview: { title: 'Driver Dashboard', subtitle: 'Manage your availability and jobs' },
		requests: { title: 'Active Requests', subtitle: 'Taxi rides waiting for acceptance' },
		itineraries: { title: 'Upcoming Itineraries', subtitle: 'Pre-booked tours and schedules' },
		support: { title: 'Support', subtitle: 'Get help and report issues' },
		settings: { title: 'Settings', subtitle: 'Update your driver profile' },
	};
	const meta = PAGE_META[segment] || PAGE_META.overview;

	return (
		<div className="relative flex h-screen overflow-hidden bg-[#f4f7f4]" style={{ fontFamily: '"Space Grotesk", "Sora", "Segoe UI", sans-serif' }}>
			<div className="pointer-events-none absolute -top-28 -right-16 h-72 w-72 rounded-full bg-emerald-200/50 blur-3xl" />
			<div className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-teal-200/40 blur-3xl" />
			<div className="relative z-10 flex h-full w-full">
				<DriverSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

				<div className="flex-1 flex flex-col min-w-0 overflow-hidden">
					<DriverTopBar
						title={meta.title}
						subtitle={meta.subtitle}
						onMenuClick={() => setSidebarOpen(true)}
					/>
					<main className="flex-1 overflow-y-auto px-6 pb-10">
						<Routes>
							<Route index element={<Navigate to="overview" replace />} />
							<Route path="overview" element={<OverviewSection />} />
							<Route path="requests" element={<PendingRequestsSection />} />
							<Route path="itineraries" element={<ItinerariesSection />} />
							<Route path="support" element={<SupportSection />} />
							<Route path="settings" element={<SettingsSection />} />
						</Routes>
					</main>
				</div>
			</div>
		</div>
	);
}
