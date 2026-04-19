import {
  MdTour,
  MdMap,
  MdTrendingUp,
  MdAutoGraph,
  MdArrowForward,
  MdAccessTime,
  MdTaskAlt,
  MdOutlineCalendarToday,
  MdOutlineTravelExplore
} from 'react-icons/md';
import { useMemo } from 'react';
import { useTourManagerBookings, useTourManagerStats } from '../../../hooks/useTourManagerAPI';

const VALID_BOOKING_STATUSES = ['Pending', 'Accepted', 'En Route', 'Completed', 'Cancelled'];

const toSafeNumber = (value, fallback = 0) => {
  const next = Number(value);
  return Number.isFinite(next) ? next : fallback;
};

const toClampedNumber = (value, min, max, fallback = min) => {
  const next = toSafeNumber(value, fallback);
  return Math.min(max, Math.max(min, next));
};

const normalizeBookingStatus = (status) => {
  const text = String(status || '').trim().toLowerCase();
  if (!text) return 'Pending';

  if (text === 'en route' || text === 'enroute' || text === 'in progress') return 'En Route';
  if (text === 'accepted') return 'Accepted';
  if (text === 'completed') return 'Completed';
  if (text === 'cancelled' || text === 'canceled') return 'Cancelled';
  if (text === 'pending') return 'Pending';

  return VALID_BOOKING_STATUSES.includes(status) ? status : 'Pending';
};

const formatDateLabel = (value) => {
  if (!value) return 'Date not set';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Date not set';
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatTimeLabel = (value) => {
  if (!value) return 'Flexible time';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Flexible time';
  return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
};

const formatCurrency = (value) => `LKR ${Math.round(value).toLocaleString()}`;

export default function OverviewSection() {
  const { stats } = useTourManagerStats();
  const { bookings } = useTourManagerBookings();

  const validatedStats = useMemo(() => {
    return {
      avgRating: toClampedNumber(stats?.avgRating, 0, 5, 0),
      totalReviews: Math.max(0, Math.round(toSafeNumber(stats?.totalReviews, 0))),
      activeTours: Math.max(0, Math.round(toSafeNumber(stats?.activeTours, 0))),
      totalBookings: Math.max(0, Math.round(toSafeNumber(stats?.totalBookings, 0)))
    };
  }, [stats]);

  const validatedBookings = useMemo(() => {
    const allBookings = Array.isArray(bookings) ? bookings : [];
    return allBookings.map((booking) => ({
      ...booking,
      id: booking?._id || booking?.id || `booking-${Math.random().toString(36).slice(2, 8)}`,
      status: normalizeBookingStatus(booking?.status),
      totalPrice: Math.max(0, toSafeNumber(booking?.totalPrice, 0)),
      createdAtMs: new Date(booking?.createdAt || booking?.updatedAt || booking?.date || 0).getTime() || 0,
      dateLabel: formatDateLabel(booking?.date || booking?.startDate || booking?.createdAt),
      timeLabel: formatTimeLabel(booking?.date || booking?.startDate),
      destination: booking?.destination || booking?.tourName || booking?.tour?.title || 'Tour booking',
      travelerName: booking?.touristName || booking?.customerName || booking?.tourist?.fullName || 'Guest traveler'
    }));
  }, [bookings]);

  const metrics = useMemo(() => {
    const allBookings = validatedBookings;

    const completedBookings = allBookings.filter((booking) => booking.status === 'Completed');
    const cancelledBookings = allBookings.filter((booking) => booking.status === 'Cancelled');

    const completedRevenue = completedBookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
    const avgRating = validatedStats.avgRating;

    const onTrackRate = allBookings.length > 0
      ? Math.max(0, Math.round(((allBookings.length - cancelledBookings.length) / allBookings.length) * 100))
      : 100;

    return {
      completedRevenue,
      completedBookings: completedBookings.length,
      avgRating,
      totalBookings: allBookings.length,
      onTrackRate,
      pipeline: {
        pending: allBookings.filter((booking) => booking.status === 'Pending').length,
        accepted: allBookings.filter((booking) => booking.status === 'Accepted').length,
        enRoute: allBookings.filter((booking) => booking.status === 'En Route').length,
        scheduled: allBookings.filter((booking) => ['Accepted', 'En Route', 'Completed'].includes(booking.status)).length
      }
    };
  }, [validatedBookings, validatedStats.avgRating]);

  const cards = [
    {
      label: 'Revenue (Completed)',
      value: formatCurrency(metrics.completedRevenue),
      helper: `${metrics.completedBookings} completed bookings`,
      icon: MdTrendingUp,
      gradient: 'from-emerald-500 to-teal-500',
      shadow: 'shadow-emerald-500/20',
      chip: 'Delivery gain'
    },
    {
      label: 'Total Bookings',
      value: metrics.totalBookings,
      helper: 'All bookings in your tour flow',
      icon: MdAutoGraph,
      gradient: 'from-teal-500 to-cyan-500',
      shadow: 'shadow-teal-500/20',
      chip: `${metrics.pipeline.pending} pending`
    },
    {
      label: 'Avg Tour Rating',
      value: `${metrics.avgRating || 0} / 5`,
      helper: `${validatedStats.totalReviews} review signals`,
      icon: MdTour,
      gradient: 'from-amber-400 to-orange-500',
      shadow: 'shadow-orange-500/20',
      chip: 'Guest quality'
    },
    {
      label: 'Execution Health',
      value: `${metrics.onTrackRate}%`,
      helper: 'Non-cancelled booking ratio',
      icon: MdMap,
      gradient: 'from-lime-500 to-emerald-500',
      shadow: 'shadow-lime-500/20',
      chip: 'Operational trust'
    }
  ];

  const sortedBookings = useMemo(() => {
    return [...validatedBookings].sort((a, b) => b.createdAtMs - a.createdAtMs);
  }, [validatedBookings]);

  const nextPriorityBooking = useMemo(() => {
    const priorityStatus = ['Pending', 'Accepted', 'En Route'];
    return sortedBookings.find((booking) => priorityStatus.includes(booking.status)) || sortedBookings[0] || null;
  }, [sortedBookings]);

  const recentBookings = useMemo(() => sortedBookings.slice(0, 4), [sortedBookings]);

  const completionRate = metrics.totalBookings > 0
    ? Math.round((metrics.completedBookings / metrics.totalBookings) * 100)
    : 0;

  const statusClassName = (status) => {
    if (status === 'Completed') return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
    if (status === 'Cancelled') return 'bg-rose-50 text-rose-700 border border-rose-100';
    if (status === 'En Route') return 'bg-cyan-50 text-cyan-700 border border-cyan-100';
    if (status === 'Accepted') return 'bg-sky-50 text-sky-700 border border-sky-100';
    return 'bg-amber-50 text-amber-700 border border-amber-100';
  };

  return (
    <div className="space-y-8 font-sans animate-fade-in-up pb-10">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 relative bg-white overflow-hidden rounded-[2rem] border border-stone-200 p-8 sm:p-10 lg:p-12 shadow-[0_8px_30px_rgba(0,0,0,0.04)] group">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-100/60 blur-[100px] rounded-full pointer-events-none group-hover:bg-cyan-200/60 transition-colors duration-1000" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-100/60 blur-[100px] rounded-full pointer-events-none group-hover:bg-emerald-200/60 transition-colors duration-1000" />

          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-50 border border-stone-200/80 mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ring-4 ring-emerald-500/20" />
                <span className="text-xs font-bold text-stone-600 tracking-wider uppercase">Manager Command Center</span>
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 text-zinc-900 tracking-tight leading-tight">
                Build smoother <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-emerald-500">tour operations</span>
              </h2>

              <p className="text-stone-500 font-medium max-w-xl text-lg mb-8 leading-relaxed">
                Track booking flow, delivery health, and revenue quality in one live operations dashboard.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 bg-zinc-900 text-white px-6 py-3 rounded-2xl font-bold shadow-[0_8px_20px_rgba(15,23,42,0.2)]">
                <MdTaskAlt className="text-xl" />
                Completion {completionRate}%
              </div>
              <div className="px-6 py-3 rounded-2xl font-bold text-stone-700 bg-white border-2 border-stone-200">
                Active Tours {validatedStats.activeTours}
              </div>
              <div className="px-6 py-3 rounded-2xl font-bold text-emerald-700 bg-emerald-50 border-2 border-emerald-200">
                {formatCurrency(metrics.completedRevenue)}
              </div>
            </div>
          </div>
        </div>

        <div className="relative bg-white overflow-hidden rounded-[2rem] border border-stone-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col">
          <div className="h-48 w-full bg-gradient-to-br from-cyan-600 via-sky-500 to-emerald-500" />
          <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-black/35 to-transparent" />

          <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
            <span className="text-xs font-black text-white uppercase tracking-widest bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/30 shadow-sm">
              Next Focus
            </span>
            <div className="flex items-center gap-1.5 text-zinc-900 text-sm font-bold bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg">
              <MdAccessTime className="text-emerald-600 text-lg" />
              <span>{metrics.pipeline.pending} pending</span>
            </div>
          </div>

          <div className="relative z-10 p-6 flex-1 flex flex-col bg-white -mt-6 rounded-t-[2rem]">
            <div className="mb-auto">
              <h3 className="text-2xl font-black text-zinc-900 leading-tight mb-2 tracking-tight">
                {nextPriorityBooking ? nextPriorityBooking.destination : 'No active bookings'}
              </h3>
              <div className="flex items-center gap-2 text-stone-500">
                <MdOutlineCalendarToday className="text-cyan-600" />
                <span className="text-sm font-semibold">
                  {nextPriorityBooking ? `${nextPriorityBooking.dateLabel} • ${nextPriorityBooking.timeLabel}` : 'Awaiting new requests'}
                </span>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-between group cursor-default hover:border-emerald-200 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                  <MdOutlineTravelExplore className="text-2xl text-cyan-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-900">{nextPriorityBooking ? nextPriorityBooking.travelerName : 'Tourist queue'}</p>
                  <p className="text-xs font-semibold text-emerald-600">{nextPriorityBooking ? nextPriorityBooking.status : 'No priority task'}</p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-white shadow-sm border border-stone-200 flex items-center justify-center text-stone-400 group-hover:text-emerald-600 group-hover:border-emerald-200 transition-colors">
                <MdArrowForward />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="relative bg-white rounded-[1.5rem] border border-stone-200 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-stone-300 transition-all duration-300 group overflow-hidden">
              <div className="relative z-10 flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${card.gradient} shadow-lg ${card.shadow} group-hover:scale-110 transition-transform duration-500`}>
                  <Icon className="text-white text-xl" />
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                  {card.chip}
                </span>
              </div>

              <div className="relative z-10">
                <p className="text-4xl font-black text-zinc-900 mb-1 tracking-tight">{card.value}</p>
                <p className="text-sm text-stone-500 font-bold uppercase tracking-widest">{card.label}</p>
                <p className="text-xs text-stone-500 mt-2">{card.helper}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-stone-200 p-2 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <div className="px-6 py-5 flex items-center justify-between border-b border-stone-100">
            <h3 className="font-bold text-xl text-zinc-900 tracking-tight">Recent Booking Activity</h3>
            <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
              Total {metrics.totalBookings}
            </span>
          </div>

          <div className="p-2 space-y-1">
            {recentBookings.length > 0 ? (
              recentBookings.map((booking) => (
                <div key={booking.id} className="p-4 rounded-2xl hover:bg-stone-50 transition-all duration-300 group cursor-pointer border border-transparent hover:border-stone-200 relative overflow-hidden">
                  <div className="flex items-center gap-5 relative z-10">
                    <div className={`w-1.5 h-12 rounded-full ${booking.status === 'Cancelled' ? 'bg-rose-400' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.45)]'}`} />

                    <div className="flex-1">
                      <p className="font-bold text-zinc-900 text-lg group-hover:text-emerald-600 transition-colors">{booking.destination}</p>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <span className="text-xs font-bold text-stone-600 bg-white border border-stone-200 shadow-sm px-2.5 py-1 rounded-md">
                          {booking.dateLabel} • {booking.timeLabel}
                        </span>
                        <span className="text-xs font-semibold text-stone-500">Traveler: {booking.travelerName}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className={`text-xs px-4 py-2 rounded-xl font-bold tracking-widest uppercase ${statusClassName(booking.status)}`}>
                        {booking.status}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-400 group-hover:text-emerald-600 group-hover:border-emerald-200 transition-colors hidden sm:flex">
                        <MdArrowForward className="text-lg" />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-10 text-center text-sm text-stone-500 font-medium">
                No bookings yet. New bookings will appear here automatically.
              </div>
            )}
          </div>
        </div>

        <div className="bg-zinc-900 rounded-[2rem] border border-stone-800 p-8 flex flex-col justify-center relative overflow-hidden shadow-2xl">
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-emerald-500/20 blur-[80px] rounded-full pointer-events-none" />

          <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/10">
            <MdAutoGraph className="text-white text-2xl" />
          </div>

          <h3 className="font-black text-2xl text-white mb-3 tracking-tight relative z-10">Pipeline Snapshot</h3>
          <p className="text-stone-400 text-sm font-medium mb-8 relative z-10 leading-relaxed">
            Keep pending requests low and maintain completion consistency with fast assignment cycles.
          </p>

          <div className="space-y-3 relative z-10 text-sm font-semibold">
            <div className="w-full bg-white/10 text-white px-4 py-3 rounded-xl border border-white/10 flex items-center justify-between">
              <span>Pending</span>
              <span>{metrics.pipeline.pending}</span>
            </div>
            <div className="w-full bg-white/10 text-white px-4 py-3 rounded-xl border border-white/10 flex items-center justify-between">
              <span>Accepted</span>
              <span>{metrics.pipeline.accepted}</span>
            </div>
            <div className="w-full bg-white/10 text-white px-4 py-3 rounded-xl border border-white/10 flex items-center justify-between">
              <span>En Route</span>
              <span>{metrics.pipeline.enRoute}</span>
            </div>
            <div className="w-full bg-emerald-500 text-zinc-900 px-4 py-3 rounded-xl font-bold flex items-center justify-between">
              <span>Scheduled</span>
              <span>{metrics.pipeline.scheduled}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
