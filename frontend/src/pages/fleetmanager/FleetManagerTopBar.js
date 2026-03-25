import { MdMenu } from 'react-icons/md';

export default function FleetManagerTopBar({ title, subtitle, onMenuClick }) {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 h-16 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <MdMenu className="text-xl" />
        </button>
        <div>
          <h1 className="text-base font-bold text-gray-800 leading-none">{title}</h1>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full font-semibold">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse inline-block" />
          Fleet Online
        </span>
      </div>
    </header>
  );
}
