import { MdCheckCircle, MdHourglassEmpty, MdCancel, MdMoreVert } from 'react-icons/md';

const BOOKINGS = [
  { id: '#BK-0041', type: 'Tour', destination: 'Sigiriya Rock', driver: 'Ruwan D.', date: 'Mar 15, 2026', amount: 'LKR 12,500', status: 'Upcoming' },
  { id: '#BK-0042', type: 'Taxi', destination: 'CMB → Kandy', driver: 'Kamal P.', date: 'Mar 12, 2026', amount: 'LKR 4,200', status: 'Completed' },
  { id: '#BK-0043', type: 'Tour', destination: 'Yala Safari', driver: 'Nilantha S.', date: 'Mar 20, 2026', amount: 'LKR 28,000', status: 'Pending' },
  { id: '#BK-0044', type: 'Taxi', destination: 'BIA → Colombo', driver: 'Pradeep M.', date: 'Mar 10, 2026', amount: 'LKR 3,800', status: 'Completed' },
  { id: '#BK-0045', type: 'Tour', destination: 'Ella Train Ride', driver: 'Unassigned', date: 'Mar 8, 2026', amount: 'LKR 9,000', status: 'Cancelled' },
];

const STATUS_BADGE = {
  'Upcoming': 'bg-blue-100 text-blue-700',
  'Completed': 'bg-emerald-100 text-emerald-700',
  'Pending': 'bg-yellow-100 text-yellow-700',
  'Cancelled': 'bg-red-100 text-red-700',
};

const STATUS_ICON = {
  'Upcoming': MdHourglassEmpty,
  'Completed': MdCheckCircle,
  'Pending': MdHourglassEmpty,
  'Cancelled': MdCancel,
};

export default function BookingsSection() {
  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'Active', value: '2', color: 'blue' },
          { label: 'Completed', value: '8', color: 'emerald' },
          { label: 'Pending', value: '1', color: 'yellow' },
          { label: 'Cancelled', value: '1', color: 'red' },
        ].map((stat) => (
          <div key={stat.label} className={`bg-${stat.color}-50 border border-${stat.color}-100 rounded-lg p-4`}>
            <p className={`text-xs font-semibold text-${stat.color}-600 uppercase`}>{stat.label}</p>
            <p className={`text-2xl font-bold text-${stat.color}-700 mt-1`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-3 font-semibold">ID</th>
                <th className="px-6 py-3 font-semibold">Type</th>
                <th className="px-6 py-3 font-semibold">Destination</th>
                <th className="px-6 py-3 font-semibold">Driver</th>
                <th className="px-6 py-3 font-semibold">Date</th>
                <th className="px-6 py-3 font-semibold">Amount</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {BOOKINGS.map((booking) => {
                const StatusIcon = STATUS_ICON[booking.status];
                return (
                  <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-gray-700">{booking.id}</td>
                    <td className="px-6 py-4 text-gray-600">{booking.type}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">{booking.destination}</td>
                    <td className="px-6 py-4 text-gray-600">{booking.driver}</td>
                    <td className="px-6 py-4 text-gray-600">{booking.date}</td>
                    <td className="px-6 py-4 font-semibold text-blue-600">{booking.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-3 py-1.5 rounded-full font-semibold flex items-center gap-1 w-fit ${STATUS_BADGE[booking.status]}`}>
                        <StatusIcon className="text-xs" />
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100">
                        <MdMoreVert className="text-lg" />
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