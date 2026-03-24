import { useMemo, useState } from 'react';
import {
  MdCircle,
  MdLocalTaxi,
  MdLocationOn,
  MdAccessTime,
  MdAttachMoney,
  MdMap,
} from 'react-icons/md';

const STATUS_OPTIONS = ['Online', 'Offline', 'On Trip'];

export default function OverviewSection() {
  const [status, setStatus] = useState('Offline');

  const activeRequests = useMemo(
    () => [
      {
        id: 'TX-2041',
        passenger: 'Alice Johnson',
        pickup: 'Colombo Fort Station',
        dropoff: 'Port City Entrance',
        time: 'Today, 2:45 PM',
        fare: 'LKR 2,400'
      },
      {
        id: 'TX-2042',
        passenger: 'Rohan Silva',
        pickup: 'Bambalapitiya',
        dropoff: 'Majestic City',
        time: 'Today, 3:10 PM',
        fare: 'LKR 1,200'
      }
    ],
    []
  );

  const upcomingTours = useMemo(
    () => [
      {
        id: 'TR-901',
        title: 'Sigiriya Sunrise Tour',
        pickup: 'Kandy Railway Station',
        time: 'Tomorrow, 5:30 AM',
        payout: 'LKR 18,000'
      },
      {
        id: 'TR-902',
        title: 'Galle Heritage Loop',
        pickup: 'Hikkaduwa Downtown',
        time: 'Saturday, 7:00 AM',
        payout: 'LKR 22,500'
      }
    ],
    []
  );

  const currentPickup = activeRequests[0]?.pickup || 'No pickup assigned';

  function openMaps(destination) {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  return (
    <div className="space-y-8">
      <section className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-[0_24px_60px_-40px_rgba(34,211,238,0.25)] border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <p className="text-xs font-semibold tracking-[0.3em] text-cyan-600 uppercase">Availability</p>
            <h2 className="text-2xl font-bold text-slate-900 mt-2">Driver Status</h2>
            <p className="text-sm text-slate-500 mt-2">Toggle your availability for incoming rides.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className={`flex items-center gap-2 text-sm font-semibold px-3 py-1 rounded-full border ${status === 'Online' ? 'text-emerald-600 border-emerald-300 bg-emerald-50' : status === 'On Trip' ? 'text-cyan-600 border-cyan-300 bg-cyan-50' : 'text-slate-500 border-slate-200 bg-white'}`}>
              <MdCircle className={`text-[10px] ${status === 'Online' ? 'animate-pulse' : ''}`} />
              {status}
            </span>
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl">
              {STATUS_OPTIONS.map(option => (
                <button
                  key={option}
                  onClick={() => setStatus(option)}
                  className={`px-4 py-2 text-xs font-semibold rounded-2xl transition-all ${
                    status === option
                      ? 'bg-white shadow text-cyan-700'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-[0_20px_50px_-40px_rgba(34,211,238,0.2)] border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-2xl bg-cyan-100 text-cyan-600 flex items-center justify-center">
              <MdLocalTaxi className="text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Active Requests</h3>
              <p className="text-sm text-slate-500">Instant taxi rides near you.</p>
            </div>
          </div>

          <div className="space-y-4">
            {activeRequests.map(request => (
              <div key={request.id} className="border border-slate-200 rounded-2xl p-4 bg-white">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">{request.passenger}</p>
                  <span className="text-xs font-semibold text-cyan-600 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-200">
                    {request.id}
                  </span>
                </div>
                <div className="mt-3 space-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <MdLocationOn className="text-emerald-500" />
                    {request.pickup}
                  </div>
                  <div className="flex items-center gap-2">
                    <MdLocationOn className="text-rose-500" />
                    {request.dropoff}
                  </div>
                  <div className="flex items-center gap-2">
                    <MdAccessTime className="text-slate-400" />
                    {request.time}
                  </div>
                  <div className="flex items-center gap-2">
                    <MdAttachMoney className="text-slate-400" />
                    {request.fare}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-[0_20px_50px_-40px_rgba(20,184,166,0.2)] border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <MdMap className="text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Upcoming Itineraries</h3>
              <p className="text-sm text-slate-500">Pre-booked tour trips.</p>
            </div>
          </div>

          <div className="space-y-4">
            {upcomingTours.map(tour => (
              <div key={tour.id} className="border border-slate-200 rounded-2xl p-4 bg-white">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">{tour.title}</p>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    {tour.id}
                  </span>
                </div>
                <div className="mt-3 space-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <MdLocationOn className="text-emerald-500" />
                    {tour.pickup}
                  </div>
                  <div className="flex items-center gap-2">
                    <MdAccessTime className="text-slate-400" />
                    {tour.time}
                  </div>
                  <div className="flex items-center gap-2">
                    <MdAttachMoney className="text-slate-400" />
                    {tour.payout}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-900 text-white rounded-3xl shadow-[0_24px_60px_-45px_rgba(34,211,238,0.3)] border border-slate-800 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.3em] text-cyan-300 uppercase">Navigation</p>
            <h3 className="text-lg font-bold mt-2">Open Google Maps</h3>
            <p className="text-sm text-slate-400 mt-2">Current pickup pinned for quick access.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-slate-200 bg-slate-800 px-3 py-2 rounded-2xl">
              <MdLocationOn className="text-cyan-300" />
              {currentPickup}
            </div>
            <button
              onClick={() => openMaps(currentPickup)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-cyan-400 text-slate-950 text-sm font-semibold hover:bg-cyan-300 transition-colors"
            >
              <MdMap className="text-lg" />
              Open Maps
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
