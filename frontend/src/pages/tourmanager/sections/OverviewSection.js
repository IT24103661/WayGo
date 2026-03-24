import { MdInsights, MdTour, MdPendingActions, MdMap } from 'react-icons/md';
import { useTourManagerStats } from '../../../hooks/useTourManagerAPI';

export default function OverviewSection() {
  const { stats } = useTourManagerStats();

  const cards = [
    {
      label: 'Total Packages',
      value: stats?.totalTours ?? 0,
      icon: MdTour,
      accent: 'from-emerald-500 to-teal-400'
    },
    {
      label: 'Active Tours',
      value: stats?.activeTours ?? 0,
      icon: MdMap,
      accent: 'from-teal-500 to-cyan-400'
    },
    {
      label: 'Total Bookings',
      value: stats?.totalBookings ?? 0,
      icon: MdInsights,
      accent: 'from-amber-400 to-emerald-400'
    },
    {
      label: 'Pending Quotes',
      value: stats?.pendingQuotes ?? 0,
      icon: MdPendingActions,
      accent: 'from-emerald-600 to-lime-400'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-[0.3em] text-emerald-700 uppercase">Overview</p>
        <h2 className="text-2xl font-bold text-emerald-950">Tour Manager Overview</h2>
        <p className="text-emerald-700/80">Monitor premium tours, quotes, and performance at a glance.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white/90 backdrop-blur-sm rounded-3xl border border-emerald-200 shadow-[0_20px_50px_-40px_rgba(16,185,129,0.3)] p-5">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.accent} text-white flex items-center justify-center shadow-lg`}>
                <Icon className="text-2xl" />
              </div>
              <p className="mt-4 text-sm font-semibold text-emerald-900">{card.label}</p>
              <p className="text-2xl font-bold text-emerald-950 mt-1">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-emerald-200 shadow-[0_20px_50px_-40px_rgba(16,185,129,0.3)] p-6">
          <h3 className="text-lg font-bold text-emerald-950">Next Actions</h3>
          <p className="text-sm text-emerald-700/80 mt-2">Stay ahead with quick actions for premium tours.</p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button className="px-4 py-3 rounded-2xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors">
              Create Package
            </button>
            <button className="px-4 py-3 rounded-2xl border border-emerald-300 text-emerald-700 font-semibold hover:bg-emerald-50 transition-colors">
              Review Quotes
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-100 via-teal-50 to-white rounded-3xl border border-emerald-200 shadow-[0_20px_50px_-40px_rgba(16,185,129,0.3)] p-6">
          <h3 className="text-lg font-bold text-emerald-950">Premium Tour Snapshot</h3>
          <p className="text-sm text-emerald-700/80 mt-2">Highlight of the week: Emerald Highlands Expedition.</p>
          <div className="mt-4 flex items-center justify-between text-sm text-emerald-800">
            <span>Duration</span>
            <span className="font-semibold">4 Days</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm text-emerald-800">
            <span>VIP Guests</span>
            <span className="font-semibold">8</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm text-emerald-800">
            <span>Next Departure</span>
            <span className="font-semibold">Friday 8:00 AM</span>
          </div>
        </div>
      </div>
    </div>
  );
}
