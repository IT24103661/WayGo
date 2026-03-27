import { MdSearch, MdArrowForward, MdStar, MdLocationOn, MdAccessTime, MdPeople, MdFilterList } from 'react-icons/md';

// Import local images
import imgSigiriya from '../../../assets/images/Sigiriya.jpg';
import imgYala from '../../../assets/images/Yala.jpg';
import imgElla from '../../../assets/images/Ella.jpg';
import imgGalleFort from '../../../assets/images/Galle Fort.jpg';

const TOURS = [
  {
    id: 1,
    title: 'Sigiriya Rock & Dambulla Cave Explorer',
    destination: 'Sigiriya, CP',
    duration: '2 Days',
    price: 'LKR 12,500',
    rating: 4.8,
    reviews: 245,
    image: imgSigiriya,
    available: 8,
    gradient: 'from-orange-500/20 to-rose-500/20',
  },
  {
    id: 2,
    title: 'Yala National Park Safari Adventure',
    destination: 'Yala, SP',
    duration: '3 Days',
    price: 'LKR 28,000',
    rating: 4.9,
    reviews: 312,
    image: imgYala,
    available: 5,
    gradient: 'from-amber-500/20 to-orange-500/20',
  },
  {
    id: 3,
    title: 'Ella Nine Arch Bridge & Hill Country',
    destination: 'Ella, UV',
    duration: '4 Days',
    price: 'LKR 18,500',
    rating: 4.7,
    reviews: 189,
    image: imgElla,
    available: 12,
    gradient: 'from-emerald-500/20 to-teal-500/20',
  },
  {
    id: 4,
    title: 'Galle Fort Heritage Night Walk',
    destination: 'Galle, SP',
    duration: '1 Day',
    price: 'LKR 5,000',
    rating: 4.6,
    reviews: 156,
    image: imgGalleFort,
    available: 20,
    gradient: 'from-emerald-500/20 to-teal-500/20',
  },
];

export default function ToursSection() {
  return (
    <div className="space-y-8 font-sans animate-fade-in-up pb-10">
      
      {/* Header & Filter Area */}
      <div className="bg-white rounded-[2rem] border border-stone-200 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col lg:flex-row gap-4 lg:items-center justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 w-full lg:w-1/2">
          <div className="flex items-center px-5 py-3 bg-stone-50 rounded-2xl border border-stone-200 focus-within:border-emerald-500/50 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all duration-300">
            <MdSearch className="text-stone-400 text-2xl mr-3" />
            <input 
              type="text" 
              placeholder="Where do you want to explore?" 
              className="bg-transparent border-none outline-none text-zinc-900 placeholder-stone-400 font-medium w-full text-lg"
            />
          </div>
        </div>

        <div className="relative z-10 flex gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-48">
            <select className="w-full px-5 py-3.5 bg-stone-50 border border-stone-200 rounded-2xl text-stone-700 font-bold focus:outline-none focus:border-emerald-500/50 appearance-none cursor-pointer hover:bg-stone-100 transition-colors">
              <option>All Durations</option>
              <option>1 Day Quick Trip</option>
              <option>2-3 Days Escape</option>
              <option>4+ Days Adventure</option>
            </select>
          </div>
          <button className="bg-stone-50 hover:bg-stone-100 text-stone-600 p-3.5 rounded-2xl font-bold transition-all border border-stone-200 hover:border-stone-300 hover:text-zinc-900 flex items-center justify-center">
            <MdFilterList className="text-xl" />
          </button>
          <button className="bg-zinc-900 hover:bg-black text-white px-8 py-3.5 rounded-2xl font-black transition-all duration-300 shadow-[0_4px_15px_rgba(15,23,42,0.1)] hover:shadow-[0_8px_20px_rgba(15,23,42,0.2)] whitespace-nowrap hidden sm:block">
            Search
          </button>
        </div>
      </div>

      {/* Tours Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {TOURS.map((tour) => (
          <div key={tour.id} className="group relative bg-white rounded-[2rem] border border-stone-200 overflow-hidden hover:border-emerald-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-500 flex flex-col h-full">
            
            {/* Image Container */}
            <div className="relative h-64 overflow-hidden">
              <div className="absolute inset-0 bg-stone-100 animate-pulse" />
              <img 
                src={tour.image} 
                alt={tour.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out relative z-10"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10 opacity-70" />
              
              {/* Floating Tags */}
              <div className="absolute top-4 left-4 z-20 flex gap-2">
                <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md border border-white/50 shadow-sm rounded-xl text-xs font-black text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                  <MdStar className="text-amber-500 text-base" />
                  {tour.rating}
                </span>
              </div>
              <div className="absolute top-4 right-4 z-20">
                <span className={`px-3 py-1.5 bg-white/90 backdrop-blur-md border border-white/50 shadow-sm rounded-xl text-xs font-black uppercase tracking-wider ${tour.available < 10 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {tour.available} Spots Left
                </span>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-6 relative z-20 flex-1 flex flex-col">
              
              <div className="mb-auto">
                <div className="flex items-center gap-3 text-stone-500 mb-3">
                  <div className="flex items-center gap-1 text-sm font-semibold">
                    <MdLocationOn className="text-rose-500" />
                    {tour.destination}
                  </div>
                  <span className="w-1 h-1 rounded-full bg-stone-300" />
                  <div className="flex items-center gap-1 text-sm font-semibold">
                    <MdAccessTime className="text-emerald-500" />
                    {tour.duration}
                  </div>
                </div>
                
                <h3 className="text-xl font-black text-zinc-900 leading-tight mb-2 group-hover:text-emerald-600 transition-colors">
                  {tour.title}
                </h3>
                <p className="text-stone-500 text-sm font-medium mb-6">
                  Based on {tour.reviews} verified reviews
                </p>
              </div>

              {/* Bottom Row - Price & Action */}
              <div className="flex items-end justify-between pt-6 border-t border-stone-100">
                <div>
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Total Price</p>
                  <p className="text-2xl font-black text-zinc-900">
                    {tour.price}
                  </p>
                </div>
                
                <button className="flex items-center gap-2 bg-stone-50 hover:bg-zinc-900 text-stone-700 hover:text-white px-5 py-3 rounded-xl font-bold transition-all duration-300 border border-stone-200 hover:border-zinc-900">
                  <span>Book</span>
                  <MdArrowForward className="text-lg" />
                </button>
              </div>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
}