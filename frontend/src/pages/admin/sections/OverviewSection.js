import { MdAttachMoney, MdLocalTaxi, MdTour, MdPeople } from 'react-icons/md';

/* ─── KPI DATA ─────────────────────────────────────────── */
const KPI = [
  {
    label: 'Total Combined Revenue',
    value: 'LKR 4.82M',
    change: '+12.4% this month',
    up: true,
    icon: MdAttachMoney,
    gradient: 'from-orange-500 to-amber-400',
    bg: 'bg-orange-50',
    text: 'text-orange-600',
  },
  {
    label: 'Active Taxis on Trip',
    value: '38',
    change: '6 idle · 2 maintenance',
    up: true,
    icon: MdLocalTaxi,
    gradient: 'from-blue-500 to-cyan-400',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
  },
  {
    label: 'Ongoing Tours',
    value: '14',
    change: '3 departing today',
    up: true,
    icon: MdTour,
    gradient: 'from-emerald-500 to-teal-400',
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
  },
  {
    label: 'Total Registered Users',
    value: '2,841',
    change: '+38 this week',
    up: true,
    icon: MdPeople,
    gradient: 'from-purple-500 to-violet-400',
    bg: 'bg-purple-50',
    text: 'text-purple-600',
  },
];

/* ─── PIE CHART (SVG) ──────────────────────────────────── */
// Taxi 62% (orange)  Tour 38% (emerald)
const PIE_R = 70;
const PIE_CX = 90;
const PIE_CY = 90;

function polarToXY(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function slicePath(cx, cy, r, startDeg, endDeg) {
  const s = polarToXY(cx, cy, r, startDeg);
  const e = polarToXY(cx, cy, r, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M${cx},${cy} L${s.x},${s.y} A${r},${r} 0 ${large},1 ${e.x},${e.y} Z`;
}

function PieChart() {
  const taxiPct = 62;
  const tourPct = 38;
  const taxiDeg = (taxiPct / 100) * 360;
  return (
    <svg viewBox="0 0 180 180" className="w-44 h-44 drop-shadow-sm">
      <path d={slicePath(PIE_CX, PIE_CY, PIE_R, 0, taxiDeg)} fill="#f97316" />
      <path d={slicePath(PIE_CX, PIE_CY, PIE_R, taxiDeg, 360)} fill="#10b981" />
      {/* donut hole */}
      <circle cx={PIE_CX} cy={PIE_CY} r={38} fill="white" />
      <text x={PIE_CX} y={PIE_CY - 6} textAnchor="middle" className="text-xs" fill="#6b7280" fontSize="11">Split</text>
      <text x={PIE_CX} y={PIE_CY + 10} textAnchor="middle" fill="#1f2937" fontSize="13" fontWeight="700">62/38</text>
    </svg>
  );
}

/* ─── BAR CHART (CSS) ──────────────────────────────────── */
const MONTHS = [
  { m: 'Oct', taxi: 72, tour: 45 },
  { m: 'Nov', taxi: 88, tour: 52 },
  { m: 'Dec', taxi: 95, tour: 80 },
  { m: 'Jan', taxi: 68, tour: 55 },
  { m: 'Feb', taxi: 82, tour: 60 },
  { m: 'Mar', taxi: 91, tour: 70 },
];

function BarChart() {
  return (
    <div className="flex items-end justify-between gap-2 h-36 pt-2">
      {MONTHS.map(({ m, taxi, tour }) => (
        <div key={m} className="flex flex-col items-center gap-1 flex-1">
          <div className="flex items-end gap-0.5 w-full justify-center" style={{ height: '100px' }}>
            <div
              className="bg-orange-400 rounded-t-sm w-3 transition-all"
              style={{ height: `${taxi}%` }}
              title={`Taxi: ${taxi}`}
            />
            <div
              className="bg-emerald-400 rounded-t-sm w-3 transition-all"
              style={{ height: `${tour}%` }}
              title={`Tour: ${tour}`}
            />
          </div>
          <span className="text-xs text-gray-400">{m}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── RECENT ACTIVITY ───────────────────────────────────── */
const ACTIVITY = [
  { date: 'Mar 12, 09:41', type: 'User Registration',   user: 'Emma Thompson',    status: 'Success' },
  { date: 'Mar 12, 09:15', type: 'Booking Confirmed',   user: 'Amal Perera',      status: 'Success' },
  { date: 'Mar 12, 08:57', type: 'Driver Assigned',     user: 'Pradeep Silva',    status: 'Success' },
  { date: 'Mar 12, 08:30', type: 'Refund Requested',    user: 'Sara Fernando',    status: 'Pending' },
  { date: 'Mar 11, 22:10', type: 'Login Failed (x3)',   user: 'unknown@test.com', status: 'Alert'   },
];

const STATUS_STYLE = {
  Success: 'bg-emerald-100 text-emerald-700',
  Pending: 'bg-yellow-100  text-yellow-700',
  Alert:   'bg-red-100     text-red-600',
};

/* ─── MAIN ───────────────────────────────────────────────── */
export default function OverviewSection() {
  return (
    <div className="space-y-6">

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {KPI.map(({ label, value, change, icon: Icon, gradient, bg, text }) => (
          <div key={label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`text-2xl ${text}`} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-400 font-medium truncate">{label}</p>
              <p className="text-2xl font-bold text-gray-800 leading-tight mt-0.5">{value}</p>
              <p className={`text-xs mt-1 font-medium ${text}`}>{change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Pie — Revenue Split */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-sm font-bold text-gray-800 mb-1">Revenue Split</h2>
          <p className="text-xs text-gray-400 mb-4">Taxi income vs. Tour income</p>
          <div className="flex items-center gap-6">
            <PieChart />
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-orange-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-700">Taxi Revenue</p>
                  <p className="text-xs text-gray-400">LKR 2.99M · 62%</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-700">Tour Revenue</p>
                  <p className="text-xs text-gray-400">LKR 1.83M · 38%</p>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-400">Total</p>
                <p className="text-base font-bold text-gray-800">LKR 4.82M</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bar — Monthly Booking Trends */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-sm font-bold text-gray-800 mb-1">Monthly Booking Trends</h2>
          <p className="text-xs text-gray-400 mb-4">Last 6 months — Taxi vs. Tour bookings</p>
          <BarChart />
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-orange-400" />
              <span className="text-xs text-gray-500">Taxi</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400" />
              <span className="text-xs text-gray-500">Tour</span>
            </div>
          </div>
        </div>
      </div>

      {/* RECENT ACTIVITY */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-800">Recent Activity</h2>
          <p className="text-xs text-gray-400 mt-0.5">Last 5 system actions</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wider">
                {['Date & Time', 'Action Type', 'User Involved', 'Status'].map((h) => (
                  <th key={h} className="px-6 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {ACTIVITY.map((a, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 text-gray-400 text-xs font-mono whitespace-nowrap">{a.date}</td>
                  <td className="px-6 py-3 font-medium text-gray-800">{a.type}</td>
                  <td className="px-6 py-3 text-gray-500">{a.user}</td>
                  <td className="px-6 py-3">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${STATUS_STYLE[a.status]}`}>
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
