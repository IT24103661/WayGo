import { useState } from 'react';
import { MdPlace, MdDirections, MdAssignment } from 'react-icons/md';
import { useTourManagerStats, useTourManagerBookings } from '../../../hooks/useTourManagerAPI';

export default function ActiveToursMapSection() {
  const { stats } = useTourManagerStats();
  const { bookings, loading, assignDriver } = useTourManagerBookings();
  const [driverAssignments, setDriverAssignments] = useState({});
  const [message, setMessage] = useState('');

  const activeTours = stats?.activeTours ?? 0;
  const totalTours = stats?.totalTours ?? 0;
  const totalBookings = stats?.totalBookings ?? 0;

  const handleDriverIdChange = (bookingId) => (e) => {
    setDriverAssignments(prev => ({ ...prev, [bookingId]: e.target.value }));
  };

  const handleAssignDriver = async (bookingId) => {
    const driverId = driverAssignments[bookingId];
    if (!driverId) {
      setMessage('Please enter a Driver ID first.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    try {
      await assignDriver(bookingId, driverId);
      setDriverAssignments(prev => ({ ...prev, [bookingId]: '' }));
      setMessage('Driver assigned successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to assign driver. Ensure ID is valid and driver is certified.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-[0.3em] text-emerald-700 uppercase">Active Tours</p>
        <h2 className="text-2xl font-bold text-emerald-950">Dispatch & Map Command</h2>
        <p className="text-emerald-700/80">Track multi-day tours, assign drivers, and monitor premium itineraries in real-time.</p>
      </div>

      {message && (
        <div className="bg-emerald-100 text-emerald-800 px-4 py-3 rounded-xl text-sm font-semibold border border-emerald-200">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gradient-to-br from-emerald-100 via-teal-50 to-white rounded-3xl border border-emerald-200 shadow-[0_20px_50px_-40px_rgba(16,185,129,0.35)] p-6 min-h-[320px] flex flex-col justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-900">Live Map</p>
            <p className="text-sm text-emerald-700/70">Map integration placeholder. Overlay routes and live driver pings here.</p>
          </div>
          <div className="flex items-center gap-3 text-emerald-700">
            <MdPlace className="text-xl" />
            Active Fleet Tracking Online
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
            Refresh Dispatch Board
          </button>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold text-emerald-950 mb-4">Pending Assignments</h3>
        {loading ? (
          <p className="text-emerald-700">Loading bookings...</p>
        ) : bookings.filter(b => !b.assignedDriver).length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.filter(b => !b.assignedDriver).map((booking) => (
              <div key={booking._id} className="bg-white rounded-3xl border border-emerald-100 p-6 flex flex-col hover:shadow-lg transition-shadow">
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-bold text-emerald-900">{booking.tourist?.name || 'Tourist'}</h4>
                    <span className="text-xs px-2 py-1 rounded-lg bg-amber-100 text-amber-700">
                      Needs Driver
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3 block truncate">Booking ID: {booking._id}</p>
                  
                  <div className="space-y-1 mb-4 text-sm">
                    <p><span className="font-semibold text-emerald-800">Tour:</span> {booking.tourPackage?.title || 'Custom Route'}</p>
                    <p><span className="font-semibold text-emerald-800">Pickup:</span> {new Date(booking.pickupTime).toLocaleString()}</p>
                    <p className="truncate"><span className="font-semibold text-emerald-800">From:</span> {booking.pickupLocation}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-emerald-50">
                  <label className="text-xs font-semibold text-emerald-800 block mb-2">Assign Certified Driver (ID)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Paste Driver Object ID"
                      value={driverAssignments[booking._id] || ''}
                      onChange={handleDriverIdChange(booking._id)}
                      className="flex-1 px-3 py-2 text-sm border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                    <button 
                      onClick={() => handleAssignDriver(booking._id)}
                      className="bg-emerald-600 text-white p-2 rounded-xl hover:bg-emerald-700 transition"
                      title="Dispatch"
                    >
                      <MdAssignment />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100 text-center">
            <p className="text-emerald-700 font-medium">All tour bookings currently have assigned drivers!</p>
          </div>
        )}
      </div>
    </div>
  );
}
