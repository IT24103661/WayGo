import { useMemo } from 'react';
import { MdLocationOn, MdAccessTime, MdAttachMoney } from 'react-icons/md';

export default function ItinerariesSection() {
  const itineraries = useMemo(
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

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold tracking-[0.3em] text-emerald-600 uppercase">Tour Schedule</p>
        <h2 className="text-2xl font-bold text-emerald-900">Upcoming Itineraries</h2>
        <p className="text-emerald-500">Pre-booked tours scheduled for you.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {itineraries.map(item => (
          <div key={item.id} className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-[0_20px_45px_-35px_rgba(20,184,166,0.2)] border border-emerald-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-emerald-900">{item.title}</p>
                <p className="text-xs text-emerald-400">{item.id}</p>
              </div>
              <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                {item.payout}
              </span>
            </div>

            <div className="mt-5 space-y-2 text-sm text-emerald-600">
              <div className="flex items-center gap-2">
                <MdLocationOn className="text-emerald-500" />
                {item.pickup}
              </div>
              <div className="flex items-center gap-2">
                <MdAccessTime className="text-emerald-400" />
                {item.time}
              </div>
              <div className="flex items-center gap-2">
                <MdAttachMoney className="text-emerald-400" />
                {item.payout}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
