import { MdStar, MdDelete, MdEdit } from 'react-icons/md';

const REVIEWS = [
  { id: 1, tour: 'Sigiriya Rock Tour', rating: 5, text: 'Amazing experience! The guide was knowledgeable and the scenery was breathtaking.', date: 'Mar 10, 2026', helpful: 45 },
  { id: 2, tour: 'Yala Safari', rating: 4, text: 'Great wildlife experience, but the jeep was a bit cramped. Would recommend!', date: 'Feb 28, 2026', helpful: 23 },
  { id: 3, tour: 'Ella Hill Explorer', rating: 5, text: 'Perfect getaway! Loved the tea plantations and the hiking trails.', date: 'Feb 15, 2026', helpful: 67 },
];

export default function ReviewsSection() {
  return (
    <div className="space-y-6">
      {/* Write Review Button */}
      <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white py-3 px-6 rounded-2xl font-semibold transition-all flex items-center justify-center gap-2">
        <MdStar className="text-lg" />
        Write a Review
      </button>

      {/* Reviews List */}
      <div className="space-y-4">
        {REVIEWS.map((review) => (
          <div key={review.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-800">{review.tour}</h3>
                <p className="text-xs text-gray-500 mt-1">{review.date}</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <MdEdit className="text-lg" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <MdDelete className="text-lg" />
                </button>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <MdStar
                  key={i}
                  className={`text-lg ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                />
              ))}
              <span className="text-sm font-semibold text-gray-800 ml-2">{review.rating}.0</span>
            </div>

            {/* Review Text */}
            <p className="text-gray-600 mb-4">{review.text}</p>

            {/* Helpful Count */}
            <button className="text-xs text-gray-500 hover:text-blue-600 font-medium">
              👍 {review.helpful} found this helpful
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}