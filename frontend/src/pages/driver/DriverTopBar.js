import { MdMenu, MdNotificationsNone, MdSearch } from 'react-icons/md';

export default function DriverTopBar({ title, subtitle, onMenuClick }) {
  return (
    <header className="sticky top-0 z-20 px-6 pt-6">
      <div className="flex items-center justify-between bg-white/85 backdrop-blur-md border border-slate-200 rounded-2xl px-5 h-16 shadow-[0_20px_50px_-40px_rgba(34,211,238,0.3)]">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-cyan-600 transition-colors"
          >
            <MdMenu className="text-2xl" />
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">{title}</h1>
            {subtitle && <p className="text-xs sm:text-sm text-slate-500">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden md:flex items-center px-4 py-2 bg-slate-100 rounded-full w-64 border border-slate-200 focus-within:border-cyan-400 focus-within:bg-white transition-all">
            <MdSearch className="text-cyan-500 text-xl mr-2" />
            <input
              type="text"
              placeholder="Search rides..."
              className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder-slate-400"
            />
          </div>

          <button className="relative p-2.5 rounded-full text-slate-500 hover:bg-slate-100 hover:text-cyan-600 transition-colors">
            <MdNotificationsNone className="text-xl" />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </div>
    </header>
  );
}
