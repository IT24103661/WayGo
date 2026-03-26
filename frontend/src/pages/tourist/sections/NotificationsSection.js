import { MdNotifications, MdCheckCircle, MdInfo, MdWarning, MdClose } from 'react-icons/md';

const NOTIFICATIONS = [
  { id: 1, type: 'success', title: 'Booking Confirmed!', message: 'Your booking for Sigiriya Rock Tour on Mar 15 is confirmed.', time: '2 hours ago', icon: MdCheckCircle },
  { id: 2, type: 'info', title: 'Driver Assigned', message: 'Ruwan D. has been assigned as your driver for the tour.', time: '1 day ago', icon: MdInfo },
  { id: 3, type: 'warning', title: 'Payment Due', message: 'Please complete payment for booking #BK-0044 before the trip.', time: '2 days ago', icon: MdWarning },
  { id: 4, type: 'success', title: 'Tour Completed', message: 'Thank you for joining the Yala Safari! Share your experience.', time: '5 days ago', icon: MdCheckCircle },
];

const TYPE_BADGE = {
  success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]',
  info: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(59,130,246,0.2)]',
  warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.2)]',
  error: 'bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.2)]',
};

const TYPE_ICON_COLOR = {
  success: 'text-emerald-400',
  info: 'text-emerald-400',
  warning: 'text-amber-400',
  error: 'text-rose-400',
};

export default function NotificationsSection() {
  return (
    <div className="space-y-6 animate-fade-in-up font-sans">
      
      {/* Header & Mark All as Read */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/60 backdrop-blur-xl rounded-2xl p-5 border border-zinc-800 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
            <MdNotifications className="text-xl" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-zinc-100 tracking-tight">Notifications</h2>
            <p className="text-sm text-zinc-400 font-medium">{NOTIFICATIONS.length} unread messages</p>
          </div>
        </div>
        <button className="text-sm bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 shadow-[0_0_15px_rgba(139,92,246,0.25)] hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]">
          Mark all as read
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {NOTIFICATIONS.map((notif) => {
          const Icon = notif.icon;
          return (
            <div 
              key={notif.id} 
              className={`group bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-zinc-800/80 p-5 hover:bg-zinc-800/50 hover:border-violet-500/30 transition-all duration-300 relative overflow-hidden`}
            >
              {/* Subtle hover gradient glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/0 via-violet-500/0 to-fuchsia-500/0 group-hover:from-violet-500/5 group-hover:to-fuchsia-500/5 transition-colors duration-500 pointer-events-none" />

              <div className="flex items-start gap-4 relative z-10">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${TYPE_BADGE[notif.type]} transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className={`text-xl ${TYPE_ICON_COLOR[notif.type]}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-zinc-100 tracking-tight">{notif.title}</h3>
                    <span className="text-xs font-semibold text-zinc-500 group-hover:text-zinc-400 transition-colors whitespace-nowrap">
                      {notif.time}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-400 mt-1.5 leading-relaxed group-hover:text-zinc-300 transition-colors">
                    {notif.message}
                  </p>
                </div>

                {/* Close Button */}
                <button className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-xl flex-shrink-0 transition-all duration-200">
                  <MdClose className="text-lg" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}