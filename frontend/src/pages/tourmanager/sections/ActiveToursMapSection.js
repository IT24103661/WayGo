import { MdPlace, MdDirections } from 'react-icons/md';
import { useTourManagerStats } from '../../../hooks/useTourManagerAPI';

export default function ActiveToursMapSection() {
  const { stats } = useTourManagerStats();

  const activeTours = stats?.activeTours ?? 0;
  const totalTours = stats?.totalTours ?? 0;
  const totalBookings = stats?.totalBookings ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-[0.3em] text-emerald-700 uppercase">Active Tours</p>
        <h2 className="text-2xl font-bold text-emerald-950">Active Tours Map</h2>
        <p className="text-emerald-700/80">Track multi-day tours and premium itineraries in real-time.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gradient-to-br from-emerald-100 via-teal-50 to-white rounded-3xl border border-emerald-200 shadow-[0_20px_50px_-40px_rgba(16,185,129,0.35)] p-6 min-h-[320px] flex flex-col justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-900">Live Map</p>
            <p className="text-sm text-emerald-700/70">Map integration placeholder. Overlay routes and live driver pings here.</p>
          </div>
          <div className="flex items-center gap-3 text-emerald-700">
            <MdPlace className="text-xl" />
            Kandy • Ella • Yala • Galle
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-emerald-200 shadow-[0_20px_50px_-40px_rgba(16,185,129,0.35)] p-6">
          <p className="text-sm font-semibold text-emerald-900">Tour Command</p>
          <div className="mt-4 space-y-3 text-sm text-emerald-700">
            <div className="flex items-center justify-between">
              <span>Active Tours</span>
              <span className="font-semibold">{activeTours}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Total Tours</span>
              <span className="font-semibold">{totalTours}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Total Bookings</span>
              <span className="font-semibold">{totalBookings}</span>
            </div>
          </div>
          <button className="mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-2xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors">
            <MdDirections className="text-xl" />
            Dispatch Update
          </button>
        </div>
      </div>
    </div>
  );
}
