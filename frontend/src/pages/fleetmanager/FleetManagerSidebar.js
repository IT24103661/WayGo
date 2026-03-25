import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  MdDashboard,
  MdDirectionsCar,
  MdBuild,
  MdWarning,
  MdPerson,
  MdLogout,
  MdClose,
} from 'react-icons/md';

const NAV_ITEMS = [
  { to: '/dashboard/fleetmanager/overview', label: 'Overview', icon: MdDashboard },
  { to: '/dashboard/fleetmanager/inventory', label: 'Vehicle Inventory', icon: MdDirectionsCar },
  { to: '/dashboard/fleetmanager/service', label: 'Service Due', icon: MdBuild },
  { to: '/dashboard/fleetmanager/compliance', label: 'Compliance Alerts', icon: MdWarning },
  { to: '/dashboard/fleetmanager/profile', label: 'Profile', icon: MdPerson },
];

export default function FleetManagerSidebar({ open, onClose }) {
  const navigate = useNavigate();
  const [managerName] = useState(() => {
    try {
      const token = localStorage.getItem('waygo_token');
      if (!token) return 'Fleet Manager';
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.name || 'Fleet Manager';
    } catch {
      return 'Fleet Manager';
    }
  });

  function handleLogout() {
    localStorage.removeItem('waygo_token');
    localStorage.removeItem('waygo_role');
    navigate('/login');
  }

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-64 z-30 flex flex-col
          bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a]
          shadow-2xl transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-black text-white text-sm shadow-lg">
              W
            </div>
            <div>
              <p className="text-white font-bold text-base leading-none">WayGo</p>
              <p className="text-emerald-300 text-xs">Fleet Manager</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white lg:hidden transition-colors">
            <MdClose className="text-xl" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                 ${isActive
                   ? 'bg-emerald-600/30 text-white border border-emerald-500/30'
                   : 'text-slate-400 hover:bg-white/8 hover:text-white'
                 }`
              }
            >
              <Icon className="text-lg flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/10 flex-shrink-0 space-y-1">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 mb-2">
            <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md">
              {managerName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate">{managerName}</p>
              <p className="text-emerald-300 text-xs">Fleet Manager</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/15 hover:text-red-300 transition-all"
          >
            <MdLogout className="text-lg" />
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
}
