import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  MdDashboard,
  MdLocalTaxi,
  MdEventNote,
  MdHelp,
  MdSettings,
  MdLogout,
  MdClose,
} from 'react-icons/md';

const NAV_ITEMS = [
  { to: '/dashboard/driver/overview', label: 'Overview', icon: MdDashboard },
  { to: '/dashboard/driver/requests', label: 'Active Requests', icon: MdLocalTaxi },
  { to: '/dashboard/driver/itineraries', label: 'Upcoming Itineraries', icon: MdEventNote },
  { to: '/dashboard/driver/support', label: 'Support', icon: MdHelp },
  { to: '/dashboard/driver/settings', label: 'Settings', icon: MdSettings },
];

export default function DriverSidebar({ open, onClose }) {
  const navigate = useNavigate();
  const [driverName, setDriverName] = useState('Driver');

  useEffect(() => {
    try {
      const token = localStorage.getItem('waygo_token');
      if (token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));
        setDriverName(payload.name || 'Driver');
      }
    } catch {
      // ignore errors
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem('waygo_token');
    localStorage.removeItem('waygo_role');
    navigate('/login');
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-72 z-30 flex flex-col
          bg-slate-950 border-r border-slate-800 shadow-[0_20px_60px_-30px_rgba(6,182,212,0.25)]
          transition-transform duration-300 ease-out
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        <div className="flex items-center justify-between px-6 h-20 border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-cyan-500 via-sky-400 to-emerald-300 rounded-2xl flex items-center justify-center font-bold text-slate-900 text-xl shadow-lg">
              W
            </div>
            <div>
              <p className="text-slate-100 font-bold text-lg leading-none tracking-tight">WayGo</p>
              <p className="text-cyan-300 text-xs font-semibold mt-0.5 uppercase tracking-[0.2em]">Driver</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <MdClose className="text-xl" />
          </button>
        </div>

        <nav className="flex-1 px-5 py-6 space-y-2 overflow-y-auto custom-scrollbar">
          <div className="px-2 mb-2 text-[11px] font-semibold text-slate-500 uppercase tracking-[0.28em]">
            Main Menu
          </div>
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 group
                 ${isActive
                   ? 'bg-cyan-500/15 text-cyan-200 border border-cyan-500/40 shadow-[0_10px_30px_-20px_rgba(34,211,238,0.7)]'
                   : 'text-slate-300 hover:bg-slate-900 hover:text-cyan-200 border border-transparent'
                 }`
              }
            >
              <Icon className="text-lg transition-colors" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-400 flex items-center justify-center text-slate-900 font-bold text-sm flex-shrink-0">
              {driverName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-slate-100 text-sm font-semibold truncate">{driverName}</p>
              <p className="text-slate-500 text-xs truncate">Driver Partner</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-slate-300 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all text-sm font-semibold"
          >
            <MdLogout className="text-lg" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
