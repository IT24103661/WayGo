import { MdLocalTaxi, MdTour, MdPeople, MdBookmark } from 'react-icons/md';

const STATS = [
  { label: 'Completed Trips', value: '12', icon: MdLocalTaxi, gradient: 'from-blue-500 to-cyan-400', bg: 'bg-blue-50', text: 'text-blue-600' },
  { label: 'Bookings', value: '5', icon: MdBookmark, gradient: 'from-purple-500 to-pink-400', bg: 'bg-purple-50', text: 'text-purple-600' },
  { label: 'Tours Joined', value: '8', icon: MdTour, gradient: 'from-emerald-500 to-teal-400', bg: 'bg-emerald-50', text: 'text-emerald-600' },
  { label: 'Friends Referred', value: '3', icon: MdPeople, gradient: 'from-orange-500 to-amber-400', bg: 'bg-orange-50', text: 'text-orange-600' },
];

const RECENT_BOOKINGS = [
  { id: '#BK-0001', destination: 'Sigiriya Rock', date: 'Mar 15, 2026', status: 'Upcoming', driver: 'Ruwan D.' },
  { id: '#BK-0002', destination: 'Yala Safari', date: 'Mar 20, 2026', status: 'Upcoming', driver: 'Kamal P.' },
  { id: '#BK-0003', destination: 'Ella Hill', date: 'Mar 8, 2026', status: 'Completed', driver: 'Nilantha S.' },
];

export default function OverviewSection() {
  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl shadow-lg overflow-hidden text-white p-8">
        <h2 className="text-3xl font-bold mb-2">Welcome Back! 👋</h2>
        <p className="text-blue-100 mb-4">Ready for your next adventure? Browse tours or manage your bookings.</p>
        <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
          Explore Tours
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4`} style={{
                background: `linear-gradient(135deg, ${stat.gradient.split(' ')[1]}, ${stat.gradient.split(' ')[3]})`
              }}>
                <Icon className="text-white text-2xl" />
              </div>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Bookings & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800">Recent Bookings</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {RECENT_BOOKINGS.map((booking) => (
              <div key={booking.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">{booking.destination}</p>
                    <p className="text-xs text-gray-500 mt-1">{booking.date} • Driver: {booking.driver}</p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                    booking.status === 'Upcoming' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-3">
          <h3 className="font-bold text-gray-800 mb-4">Quick Actions</h3>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition-colors">
            Book a Tour
          </button>
          <button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2.5 rounded-lg font-medium transition-colors">
            Book a Ride
          </button>
          <button className="w-full border border-gray-200 text-gray-700 hover:bg-gray-50 py-2.5 rounded-lg font-medium transition-colors">
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
}