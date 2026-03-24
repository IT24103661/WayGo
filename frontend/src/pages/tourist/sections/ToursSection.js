import { MdHourglassEmpty, MdCheckCircle, MdCancel, MdArrowForward } from 'react-icons/md';

const TOURS = [
  {
    id: 1,
    title: 'Sigiriya Rock & Dambulla Cave',
    destination: 'Sigiriya',
    duration: '2 Days',
    price: 'LKR 12,500',
    rating: 4.8,
    reviews: 245,
    image: '🏛️',
    available: 8,
  },
  {
    id: 2,
    title: 'Yala National Park Safari',
    destination: 'Yala',
    duration: '3 Days',
    price: 'LKR 28,000',
    rating: 4.9,
    reviews: 312,
    image: '🦁',
    available: 5,
  },
  {
    id: 3,
    title: 'Ella Hill Country Explorer',
    destination: 'Ella',
    duration: '4 Days',
    price: 'LKR 18,500',
    rating: 4.7,
    reviews: 189,
    image: '🏔️',
    available: 12,
  },
  {
    id: 4,
    title: 'Galle Fort Heritage Walk',
    destination: 'Galle',
    duration: '1 Day',
    price: 'LKR 5,000',
    rating: 4.6,
    reviews: 156,
    image: '🏰',
    available: 20,
  },
];

export default function ToursSection() {
  return (
    <div className="space-y-6">
      {/* Search & Filter */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row gap-3">
        <input 
          type="text" 
          placeholder="Search tours..." 
          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Durations</option>
          <option>1 Day</option>
          <option>2 Days</option>
          <option>3+ Days</option>
        </select>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
          Search
        </button>
      </div>

      {/* Tours Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {TOURS.map((tour) => (
          <div key={tour.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
            {/* Tour Image */}
            <div className="bg-gradient-to-br from-blue-100 to-cyan-100 h-32 flex items-center justify-center text-5xl">
              {tour.image}
            </div>

            {/* Tour Info */}
            <div className="p-4">
              <h3 className="font-bold text-gray-800 line-clamp-2 text-sm mb-2">{tour.title}</h3>
              <p className="text-xs text-gray-500 mb-3">{tour.destination} • {tour.duration}</p>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-3">
                <span className="text-yellow-400">⭐</span>
                <span className="text-sm font-semibold text-gray-800">{tour.rating}</span>
                <span className="text-xs text-gray-400">({tour.reviews})</span>
              </div>

              {/* Price & Availability */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-500">Price per person</p>
                  <p className="font-bold text-blue-600">{tour.price}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Available</p>
                  <p className="font-bold text-emerald-600">{tour.available}</p>
                </div>
              </div>

              {/* Book Button */}
              <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2">
                <span>Book Now</span>
                <MdArrowForward className="text-sm" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}