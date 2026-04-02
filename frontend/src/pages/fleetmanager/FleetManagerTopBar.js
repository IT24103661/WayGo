import { MdMenu } from 'react-icons/md';

export default function FleetManagerTopBar({ title, subtitle, onMenuClick }) {
  return (
    <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-cyan-100 px-6 h-16 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 rounded-lg text-cyan-700 hover:bg-cyan-50 transition-colors"
        >
          <MdMenu className="text-xl" />
        </button>
        <div>
          <h1 className="text-base font-bold text-cyan-950 leading-none">{title}</h1>
          {subtitle && <p className="text-xs text-cyan-700/70 mt-0.5">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden sm:flex items-center gap-1.5 text-xs text-cyan-800 bg-cyan-50 px-3 py-1.5 rounded-full font-semibold border border-cyan-200 transition-all duration-200 hover:shadow-[0_8px_18px_-12px_rgba(8,145,178,0.8)]">
          <span className="w-1.5 h-1.5 bg-cyan-600 rounded-full animate-pulse inline-block" />
          Fleet Online
        </span>
      </div>
    </header>
  );
}
