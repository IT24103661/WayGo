import { MdMenu, MdNotificationsNone, MdSearch } from 'react-icons/md';

export default function TouristTopBar({ title, subtitle, onMenuClick }) {
  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 h-20 flex items-center justify-between flex-shrink-0 transition-all">
      
      {/* Title & Mobile Toggle */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
        >
          <MdMenu className="text-2xl" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-800 leading-tight">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Search Bar (Hidden on mobile for now) */}
        <div className="hidden md:flex items-center px-4 py-2 bg-gray-100 rounded-full w-64 border border-transparent focus-within:border-green-500 focus-within:bg-white transition-all">
          <MdSearch className="text-gray-400 text-xl mr-2" />
          <input 
            type="text" 
            placeholder="Search tours..." 
            className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder-gray-400"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2.5 rounded-full text-gray-500 hover:bg-gray-100 hover:text-green-600 transition-colors">
          <MdNotificationsNone className="text-xl" />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </div>
    </header>
  );
}
