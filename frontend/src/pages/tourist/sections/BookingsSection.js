import { MdCheckCircle, MdHourglassEmpty, MdCancel, MdMoreVert, MdDirectionsCar, MdTour, MdCalendarToday } from 'react-icons/md';

const BOOKINGS = [
  { id: '#BK-0041', type: 'Tour', destination: 'Sigiriya Rock', driver: 'Ruwan D.', date: 'Mar 15, 2026', amount: 'LKR 12,500', status: 'Upcoming' },
  { id: '#BK-0042', type: 'Taxi', destination: 'CMB → Kandy', driver: 'Kamal P.', date: 'Mar 12, 2026', amount: 'LKR 4,200', status: 'Completed' },
  { id: '#BK-0043', type: 'Tour', destination: 'Yala Safari', driver: 'Nilantha S.', date: 'Mar 20, 2026', amount: 'LKR 28,000', status: 'Pending' },
  { id: '#BK-0044', type: 'Taxi', destination: 'BIA → Colombo', driver: 'Pradeep M.', date: 'Mar 10, 2026', amount: 'LKR 3,800', status: 'Completed' },
  { id: '#BK-0045', type: 'Tour', destination: 'Ella Train Ride', driver: 'Unassigned', date: 'Mar 8, 2026', amount: 'LKR 9,000', status: 'Cancelled' },
];

const STATUS_BADGE = {
  'Upcoming': 'bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm',
  'Completed': 'bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm',
  'Pending': 'bg-amber-50 text-amber-600 border border-amber-200 shadow-sm',
  'Cancelled': 'bg-rose-50 text-rose-600 border border-rose-200 shadow-sm',
};

const STATUS_ICON = {
  'Upcoming': MdHourglassEmpty,
  'Completed': MdCheckCircle,
  'Pending': MdHourglassEmpty,
  'Cancelled': MdCancel,
};

export default function BookingsSection() {
  return (
    <div className="space-y-6 font-sans animate-fade-in-up pb-10">
      
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { label: 'Upcoming', value: '2', color: 'blue', icon: MdCalendarToday },
          { label: 'Completed', value: '8', color: 'emerald', icon: MdCheckCircle },
          { label: 'Pending', value: '1', color: 'amber', icon: MdHourglassEmpty },
          { label: 'Cancelled', value: '1', color: 'rose', icon: MdCancel },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="relative bg-white rounded-[1.5rem] border border-stone-200 p-6 flex flex-col justify-between overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
              <div className={`absolute -right-6 -top-6 w-24 h-24 bg-${stat.color}-500/5 blur-[20px] rounded-full pointer-events-none group-hover:bg-${stat.color}-500/10 transition-colors duration-500`} />
              
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className={`w-10 h-10 rounded-xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center border border-${stat.color}-200`}>
                  <Icon className="text-xl" />
                </div>
                <p className={`text-3xl font-black text-zinc-900`}>{stat.value}</p>
              </div>
              <p className="text-xs font-bold text-stone-500 uppercase tracking-widest relative z-10">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* Bookings Table / List */}
      <div className="bg-white rounded-[2rem] border border-stone-200 overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <h3 className="font-bold text-xl text-zinc-900 tracking-tight">Booking History</h3>
          <div className="flex bg-stone-100 rounded-xl p-1 border border-stone-200">
            <button className="px-4 py-1.5 rounded-lg bg-white text-zinc-900 text-xs font-bold shadow-sm border border-stone-200">All</button>
            <button className="px-4 py-1.5 rounded-lg text-stone-500 hover:text-zinc-900 text-xs font-bold transition-colors">Tours</button>
            <button className="px-4 py-1.5 rounded-lg text-stone-500 hover:text-zinc-900 text-xs font-bold transition-colors">Taxises</button>
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-black text-stone-400 uppercase tracking-widest border-b border-stone-100 bg-stone-50/30">
                <th className="px-6 py-4 whitespace-nowrap">ID</th>
                <th className="px-6 py-4 whitespace-nowrap">Type & Dest.</th>
                <th className="px-6 py-4 whitespace-nowrap">Driver</th>
                <th className="px-6 py-4 whitespace-nowrap">Date</th>
                <th className="px-6 py-4 whitespace-nowrap">Amount</th>
                <th className="px-6 py-4 whitespace-nowrap">Status</th>
                <th className="px-6 py-4 text-center whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {BOOKINGS.map((booking) => {
                const StatusIcon = STATUS_ICON[booking.status];
                const isTour = booking.type === 'Tour';
                
                return (
                  <tr key={booking.id} className="hover:bg-stone-50/80 transition-colors group">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="font-mono text-xs font-bold text-stone-500 bg-stone-100 px-2.5 py-1 rounded-md">
                        {booking.id}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isTour ? 'bg-teal-50 text-teal-600 border border-teal-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'}`}>
                          {isTour ? <MdTour className="text-lg" /> : <MdDirectionsCar className="text-lg" />}
                        </div>
                        <div>
                          <p className="font-bold text-stone-800 group-hover:text-emerald-600 transition-colors">{booking.destination}</p>
                          <p className="text-xs font-medium text-stone-500">{booking.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {booking.driver !== 'Unassigned' ? (
                          <>
                            <img src={`https://ui-avatars.com/api/?name=${booking.driver}&background=random`} alt="Driver" className="w-6 h-6 rounded-full" />
                            <span className="font-medium text-stone-700">{booking.driver}</span>
                          </>
                        ) : (
                          <span className="text-sm font-medium text-stone-400 italic">Unassigned</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap font-medium text-stone-500">
                      {booking.date}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="font-black text-zinc-900 border-b-2 border-transparent group-hover:border-emerald-200 pb-0.5 transition-colors">
                        {booking.amount}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`text-xs px-3.5 py-1.5 rounded-lg font-bold tracking-wide flex items-center gap-1.5 w-fit ${STATUS_BADGE[booking.status]}`}>
                        <StatusIcon className="text-sm" />
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center whitespace-nowrap">
                      <button className="text-stone-400 hover:text-zinc-900 p-2 rounded-xl hover:bg-stone-100 transition-colors">
                        <MdMoreVert className="text-xl" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}