import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { fleetManagerAPI } from '../../services/fleetManagerAPI';
import {
  MdDashboard,
  MdDirectionsCar,
  MdLocalShipping,
  MdAssignment,
  MdBuild,
  MdNotifications,
  MdPayments,
  MdPeople,
  MdPerson,
  MdLogout,
  MdClose,
} from 'react-icons/md';

const NAV_ITEMS = [
  { to: '/dashboard/fleetmanager/overview', label: 'Overview', icon: MdDashboard },
  { to: '/dashboard/fleetmanager/profile', label: 'Profile', icon: MdPerson },
  { to: '/dashboard/fleetmanager/drivers', label: 'Drivers', icon: MdPeople },
  { to: '/dashboard/fleetmanager/salaries', label: 'Driver Salaries', icon: MdPayments },
  { to: '/dashboard/fleetmanager/inventory', label: 'Vehicle Inventory', icon: MdDirectionsCar },
  { to: '/dashboard/fleetmanager/available', label: 'Available Vehicles', icon: MdLocalShipping },
  { to: '/dashboard/fleetmanager/fleetbookings', label: 'Fleet Bookings', icon: MdAssignment },
  { to: '/dashboard/fleetmanager/service', label: 'Service Due', icon: MdBuild },
  { to: '/dashboard/fleetmanager/notifications', label: 'Booking Notifications', icon: MdNotifications },
];

export default function FleetManagerSidebar({ open, onClose }) {
  const navigate = useNavigate();
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const getManagerName = () => {
    try {
      const localUser = localStorage.getItem('user');
      if (localUser) {
        const parsedUser = JSON.parse(localUser);
        if (parsedUser?.name) return parsedUser.name;
      }

      const token = localStorage.getItem('waygo_token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload?.name) return payload.name;
      }

      return 'Fleet Manager';
    } catch {
      return 'Fleet Manager';
    }
  };

  const [managerName, setManagerName] = useState(getManagerName);

  useEffect(() => {
    const syncName = (event) => {
      const nextName = event?.detail?.user?.name || getManagerName();
      setManagerName(nextName || 'Fleet Manager');
    };

    window.addEventListener('userUpdated', syncName);
    window.addEventListener('storage', syncName);

    return () => {
      window.removeEventListener('userUpdated', syncName);
      window.removeEventListener('storage', syncName);
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const fetchUnreadNotifications = async () => {
      try {
        const result = await fleetManagerAPI.getNotifications();
        const items = Array.isArray(result?.data) ? result.data : [];
        const unread = items.filter((item) => !item.isRead && item.type === 'BOOKING_CREATED').length;
        if (mounted) {
          setUnreadNotifications(unread);
        }
      } catch {
        if (mounted) {
          setUnreadNotifications(0);
        }
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchUnreadNotifications();
      }
    };

    fetchUnreadNotifications();
    const interval = window.setInterval(fetchUnreadNotifications, 15000);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      mounted = false;
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  function handleLogout() {
    localStorage.removeItem('waygo_token');
    localStorage.removeItem('waygo_role');
    localStorage.removeItem('user');
    navigate('/login');
  }

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/45 z-20 lg:hidden backdrop-blur-sm" onClick={onClose} />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-72 z-30 flex flex-col
          bg-gradient-to-b from-[#083344] via-[#0b4a5d] to-[#0a2f3b]
          border-r border-cyan-800/40 shadow-[0_30px_80px_-50px_rgba(6,182,212,0.65)] transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        <div className="flex items-center justify-between px-6 h-20 border-b border-cyan-900/60 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-300 via-sky-200 to-teal-200 rounded-xl flex items-center justify-center font-black text-cyan-950 text-base shadow-lg">
              W
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-none">WayGo</p>
              <p className="text-cyan-100 text-[11px] font-semibold uppercase tracking-[0.24em] mt-1">Fleet Manager</p>
            </div>
          </div>
          <button onClick={onClose} className="text-cyan-200/60 hover:text-white lg:hidden transition-colors">
            <MdClose className="text-xl" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-[0.3em] uppercase text-cyan-100/85">Operations</div>
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[15px] leading-5 font-semibold transition-all duration-200
                 ${isActive
                   ? 'bg-cyan-300/20 text-cyan-50 border border-cyan-300/35 shadow-[0_8px_30px_-18px_rgba(6,182,212,0.9)]'
                   : 'text-cyan-100/88 hover:bg-cyan-900/35 hover:text-white border border-transparent'
                 }`
              }
            >
              <Icon className="text-lg flex-shrink-0" />
              <span className="flex-1">{label}</span>
              {to === '/dashboard/fleetmanager/notifications' && unreadNotifications > 0 && (
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
                </span>
              )}
              {to === '/dashboard/fleetmanager/notifications' && unreadNotifications > 0 && (
                <span className="ml-1 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                  {unreadNotifications > 99 ? '99+' : unreadNotifications}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-cyan-900/60 flex-shrink-0 space-y-2 bg-cyan-900/20">
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-cyan-900/40 border border-cyan-700/60 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-300 to-teal-200 flex items-center justify-center text-cyan-950 font-bold text-sm flex-shrink-0 shadow-md">
              {managerName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate leading-tight">{managerName}</p>
              <p className="text-cyan-100/90 text-xs mt-0.5 tracking-wide">Fleet Manager</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-300 hover:bg-red-500/15 hover:text-red-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_20px_-12px_rgba(225,29,72,0.8)]"
          >
            <MdLogout className="text-lg" />
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
}
