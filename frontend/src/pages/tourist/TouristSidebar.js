import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  MdDashboard,
  MdMap,
  MdPermContactCalendar,
  MdStar,
  MdNotifications,
  MdHelp,
  MdLogout,
  MdClose,
} from 'react-icons/md';

const NAV_ITEMS = [
  { to: '/dashboard/tourist/overview', label: 'Overview', icon: MdDashboard },
  { to: '/dashboard/tourist/tours', label: 'Browse Tours', icon: MdMap },
  { to: '/dashboard/tourist/bookings', label: 'My Bookings', icon: MdPermContactCalendar },
  { to: '/dashboard/tourist/reviews', label: 'Reviews', icon: MdStar },
  { to: '/dashboard/tourist/notifications', label: 'Notifications', icon: MdNotifications },
  { to: '/dashboard/tourist/support', label: 'Support', icon: MdHelp },
];

export default function TouristSidebar({ open, onClose }) {
  const navigate = useNavigate();
  const [touristName, setTouristName] = useState('Tourist');

  useEffect(() => {
    try {
      const token = localStorage.getItem('waygo_token');
      if (token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));
        setTouristName(payload.name || 'Tourist');
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
      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-72 z-30 flex flex-col
          bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900
          border-r border-slate-700 shadow-2xl lg:shadow-none transition-transform duration-300 ease-out
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between px-6 h-20 border-b border-slate-700 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center font-bold text-white text-xl shadow-lg">
              W
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-none tracking-tight">WayGo</p>
              <p className="text-blue-400 text-xs font-medium mt-0.5 uppercase tracking-wider">Tourist</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <MdClose className="text-xl" />
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="px-2 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Main Menu
          </div>
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group
                 ${isActive
                   ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                   : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                 }`
              }
            >
              <Icon className="text-lg transition-colors" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User Profile & Logout Section */}
        <div className="p-4 border-t border-slate-700 bg-slate-800/50">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-700 border border-slate-600 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {touristName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white text-sm font-semibold truncate">{touristName}</p>
              <p className="text-slate-400 text-xs truncate">Tourist Member</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-slate-300 hover:text-red-400 hover:bg-red-950/50 rounded-xl transition-all text-sm font-medium"
          >
            <MdLogout className="text-lg" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
