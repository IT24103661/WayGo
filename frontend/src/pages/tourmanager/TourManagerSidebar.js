import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { MdDashboard, MdMap, MdLogout, MdClose, MdTour, MdPerson, MdHotel, MdViewKanban, MdInventory2 } from 'react-icons/md';

const NAV_ITEMS = [
  { to: '/dashboard/tourmanager/overview', label: 'Overview', icon: MdDashboard },
  { to: '/dashboard/tourmanager/profile', label: 'Profile Settings', icon: MdPerson },
  { to: '/dashboard/tourmanager/tours', label: 'Manage Tours', icon: MdTour },
  { to: '/dashboard/tourmanager/stay-requests', label: 'Stay Requests', icon: MdHotel },
  { to: '/dashboard/tourmanager/stay-inventory', label: 'Stay Inventory', icon: MdInventory2 },
  { to: '/dashboard/tourmanager/stay-board', label: 'Stay Board', icon: MdViewKanban },
  { to: '/dashboard/tourmanager/map', label: 'Active Tours Map', icon: MdMap },
];

export default function TourManagerSidebar({ open, onClose }) {
  const navigate = useNavigate();
  const [managerName, setManagerName] = useState('Tour Manager');

  useEffect(() => {
    // 1. Instantly load from token for fast render
    try {
      const token = localStorage.getItem('waygo_token');
      if (token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));
        setManagerName(payload.name || 'Tour Manager');
      }
    } catch {
      // ignore
    }

    // 2. Fetch fresh from backend to ensure real-time accuracy and overrides
    const fetchFreshProfile = async () => {
      try {
        const token = localStorage.getItem('waygo_token');
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}/users/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok && data.user?.name) {
          setManagerName(data.user.name);
        }
      } catch (err) {
        // ignore
      }
    };
    
    fetchFreshProfile();

    // Listen for custom profile update events (thrown by the profile section on save)
    const handleProfileUpdate = (e) => {
      if (e.detail?.name) {
        setManagerName(e.detail.name);
      } else {
        fetchFreshProfile(); // fallback re-fetch
      }
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
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
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-72 z-30 flex flex-col
          bg-gradient-to-b from-[#0a1724] via-[#0b1e2f] to-[#091522]
          border-r border-cyan-900/50 shadow-[0_30px_60px_-40px_rgba(8,145,178,0.6)]
          transition-transform duration-300 ease-out
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        <div className="flex items-center justify-between px-6 h-20 border-b border-cyan-900/50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-cyan-400 via-sky-300 to-blue-200 rounded-2xl flex items-center justify-center font-bold text-[#06203a] text-xl shadow-lg">
              W
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-none tracking-tight">WayGo</p>
              <p className="text-cyan-300 text-xs font-semibold mt-0.5 uppercase tracking-[0.2em]">Tour</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-cyan-200 hover:text-white hover:bg-cyan-900/40 rounded-lg transition-colors"
          >
            <MdClose className="text-xl" />
          </button>
        </div>

        <nav className="flex-1 px-5 py-6 space-y-2 overflow-y-auto custom-scrollbar">
          <div className="px-2 mb-2 text-[11px] font-semibold text-cyan-200/70 uppercase tracking-[0.3em]">
            Command Deck
          </div>
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 group
                 ${isActive
                   ? 'bg-cyan-400/20 text-cyan-100 border border-cyan-400/40 shadow-[0_10px_30px_-20px_rgba(8,145,178,0.6)]'
                   : 'text-cyan-100/70 hover:bg-cyan-900/40 hover:text-white border border-transparent'
                 }`
              }
            >
              <Icon className="text-lg transition-colors" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-cyan-900/50 bg-cyan-900/20">
          <div className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-cyan-900/40 border border-cyan-800/60 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-200 flex items-center justify-center text-[#06203a] font-bold text-sm flex-shrink-0">
              {managerName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-cyan-50 text-sm font-semibold truncate">{managerName}</p>
              <p className="text-cyan-200/60 text-xs truncate">Tour Manager</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-cyan-100/80 hover:text-red-300 hover:bg-red-900/20 rounded-xl transition-all text-sm font-semibold"
          >
            <MdLogout className="text-lg" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
