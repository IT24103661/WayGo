import { useState, useEffect, useRef } from 'react';
import { MdCheckCircle, MdHourglassEmpty, MdCancel, MdMoreVert, MdDirectionsCar, MdTour, MdCalendarToday, MdEdit, MdSupportAgent } from 'react-icons/md';
import { useTouristBookings } from '../../../hooks/useTouristAPI';

// Mock fallback just in case
const MOCK_BOOKINGS = [
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
  const { bookings, loading, error, cancelBooking } = useTouristBookings();
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prefer actual API bookings, fallback to MOCK_BOOKINGS
  // In a real app we structure actual API returns differently, mapping may be needed.
  const displayBookings = bookings && bookings.length > 0 ? bookings : MOCK_BOOKINGS;

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
              {loading && <tr><td colSpan="7" className="text-center py-4">Loading bookings...</td></tr>}
              {error && <tr><td colSpan="7" className="text-center py-4 text-red-500">{error}</td></tr>}
              {!loading && !error && displayBookings.map((booking) => {
                const statusStr = booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : 'Pending';
                const StatusIcon = STATUS_ICON[statusStr] || STATUS_ICON['Pending'];
                const isTour = booking.type === 'Tour' || booking.tour;
                
                const dispId = booking._id ? `#BK-${booking._id.substring(booking._id.length - 4)}` : booking.id;
                const dest = booking.tour?.title || booking.destination || 'N/A';
                const typeLabel = isTour ? 'Tour' : 'Taxi';
                const driverName = booking.driver?.name || booking.driver || 'Unassigned';
                const dateRaw = booking.date || new Date().toISOString();
                const formattedDate = booking.id ? booking.date : new Date(dateRaw).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                const amountDisp = booking.amount || 'LKR -';

                return (
                  <tr key={booking._id || booking.id} className="hover:bg-stone-50/80 transition-colors group">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="font-mono text-xs font-bold text-stone-500 bg-stone-100 px-2.5 py-1 rounded-md">
                        {dispId}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isTour ? 'bg-teal-50 text-teal-600 border border-teal-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'}`}>
                          {isTour ? <MdTour className="text-lg" /> : <MdDirectionsCar className="text-lg" />}
                        </div>
                        <div>
                          <p className="font-bold text-stone-800 group-hover:text-emerald-600 transition-colors">{dest}</p>
                          <p className="text-xs font-medium text-stone-500">{typeLabel}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {driverName !== 'Unassigned' ? (
                          <>
                            <img src={`https://ui-avatars.com/api/?name=${driverName}&background=random`} alt="Driver" className="w-6 h-6 rounded-full" />
                            <span className="font-medium text-stone-700">{driverName}</span>
                          </>
                        ) : (
                          <span className="text-sm font-medium text-stone-400 italic">Unassigned</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap font-medium text-stone-500">
                      {formattedDate}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="font-black text-zinc-900 border-b-2 border-transparent group-hover:border-emerald-200 pb-0.5 transition-colors">
                        {amountDisp}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`text-xs px-3.5 py-1.5 rounded-lg font-bold tracking-wide flex items-center gap-1.5 w-fit ${STATUS_BADGE[statusStr] || STATUS_BADGE['Pending']}`}>
                        <StatusIcon className="text-sm" />
                        {statusStr}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right">
                      <div className="flex justify-end items-center relative">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            const currentId = booking._id || booking.id;
                            if (openDropdownId === currentId) {
                              setOpenDropdownId(null);
                            } else {
                              setOpenDropdownId(currentId);
                            }
                          }}
                          className="text-stone-400 hover:text-zinc-900 p-2 rounded-xl hover:bg-stone-100 transition-colors"
                        >
                          <MdMoreVert className="text-xl" />
                        </button>

                        {/* Dropdown Menu */}
                        {openDropdownId === (booking._id || booking.id) && (
                          <div 
                            ref={dropdownRef}
                            className="absolute right-0 top-full mt-1 w-48 bg-white border border-stone-200 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] py-2 z-50 flex flex-col text-left overflow-hidden ring-1 ring-black/5 animate-fade-in-up"
                            style={{ animationDuration: '0.2s' }}
                          >
                            <button 
                              onClick={() => { alert('Modify Booking logic coming soon!'); setOpenDropdownId(null); }}
                              className="w-full px-4 py-2.5 text-sm font-semibold text-stone-600 hover:text-emerald-600 hover:bg-emerald-50 flex items-center gap-2 transition-colors"
                            >
                              <MdEdit className="text-lg" /> Modify Booking
                            </button>
                            
                            <button 
                              onClick={() => { alert('Contact support logic mapping...'); setOpenDropdownId(null); }}
                              className="w-full px-4 py-2.5 text-sm font-semibold text-stone-600 hover:text-blue-600 hover:bg-blue-50 flex items-center gap-2 transition-colors"
                            >
                              <MdSupportAgent className="text-lg" /> Contact Support
                            </button>

                            {(statusStr !== 'Cancelled' && statusStr !== 'Completed' && booking._id) && (
                              <>
                                <div className="h-px bg-stone-100 my-1 w-full relative left-0"></div>
                                <button 
                                  onClick={() => {
                                    cancelBooking(booking._id);
                                    setOpenDropdownId(null);
                                  }}
                                  className="w-full px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                                >
                                  <MdCancel className="text-lg" /> Cancel Booking
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
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