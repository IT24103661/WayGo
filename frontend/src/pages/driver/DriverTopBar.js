import { MdMenu, MdNotificationsNone, MdSearch } from 'react-icons/md';

export default function DriverTopBar({ title, subtitle, onMenuClick }) {
  return (
    <header className="sticky top-0 z-20 px-6 pt-6">
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-md border border-emerald-200 rounded-2xl px-5 h-16 shadow-[0_20px_50px_-40px_rgba(16,185,129,0.4)]">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl text-emerald-600 hover:bg-emerald-100 hover:text-emerald-800 transition-colors"
          >
            <MdMenu className="text-2xl" />
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-emerald-950 leading-tight">{title}</h1>
            {subtitle && <p className="text-xs sm:text-sm text-emerald-600/80">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden md:flex items-center px-4 py-2 bg-emerald-50 rounded-full w-64 border border-emerald-200 focus-within:border-emerald-400 focus-within:bg-white transition-all">
            <MdSearch className="text-emerald-500 text-xl mr-2" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-sm w-full text-emerald-900 placeholder-emerald-400/80"
            />
          </div>

          <button className="relative p-2.5 rounded-full text-emerald-600 hover:bg-emerald-100 hover:text-emerald-800 transition-colors">
            <MdNotificationsNone className="text-xl" />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </div>
    </header>
  );
}
