import { useState } from 'react';
import { Badge } from './shared';

const ALL_BOOKINGS = [
  { id: '#BK-0041', tourist: 'Amal Perera',         type: 'Tour', destination: 'Sigiriya Rock',   status: 'Completed', amount: 'LKR 12,500' },
  { id: '#BK-0042', tourist: 'Nimal Silva',          type: 'Taxi', destination: 'CMB → Kandy',     status: 'En Route',  amount: 'LKR 4,200'  },
  { id: '#BK-0043', tourist: 'Sara Fernando',        type: 'Tour', destination: 'Yala Safari',     status: 'Pending',   amount: 'LKR 18,000' },
  { id: '#BK-0044', tourist: 'Kamal Jayawardena',    type: 'Taxi', destination: 'BIA → Colombo',   status: 'Accepted',  amount: 'LKR 3,800'  },
  { id: '#BK-0045', tourist: 'Emma Thompson',        type: 'Tour', destination: 'Ella Train Ride', status: 'Cancelled', amount: 'LKR 9,000'  },
];

const FILTERS = ['All', 'Pending', 'Accepted', 'En Route', 'Completed', 'Cancelled'];

export default function BookingsSection() {
  const [filter, setFilter] = useState('All');
  const visible = filter === 'All' ? ALL_BOOKINGS : ALL_BOOKINGS.filter(b => b.status === filter);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-base font-bold text-gray-800">All Bookings</h2>
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                filter === f
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-gray-200 text-gray-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wider">
              {['ID','Tourist','Type','Destination','Status','Amount'].map((h, i) => (
                <th key={i} className={`px-6 py-3 font-semibold ${h === 'Amount' ? 'text-right' : ''}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {visible.map((b) => (
              <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-mono text-xs text-gray-500">{b.id}</td>
                <td className="px-6 py-4 font-medium text-gray-800">{b.tourist}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${b.type === 'Tour' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                    {b.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">{b.destination}</td>
                <td className="px-6 py-4"><Badge status={b.status} /></td>
                <td className="px-6 py-4 text-right font-semibold text-gray-800">{b.amount}</td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-400 text-sm">No bookings found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
