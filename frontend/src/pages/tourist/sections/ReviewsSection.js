import React, { useState, useEffect } from "react";
import { MdStar, MdDelete, MdEdit, MdClose, MdRefresh } from "react-icons/md";
import { touristAPI as api } from "../../../services/touristAPI";

export default function ReviewsSection() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentReview, setCurrentReview] = useState(null);
  const [formData, setFormData] = useState({ tourName: "", rating: 5, text: "" });

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await api.getReviews();
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const openCreateModal = () => {
    setCurrentReview(null);
    setFormData({ tourName: "", rating: 5, text: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (review) => {
    setCurrentReview(review);
    setFormData({ tourName: review.tourName, rating: review.rating, text: review.text });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await api.deleteReview(id);
        fetchReviews();
      } catch (error) {
        console.error("Failed to delete review", error);
        alert("Failed to delete review");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentReview) {
        await api.updateReview(currentReview._id, formData);
      } else {
        await api.createReview(formData);
      }
      setIsModalOpen(false);
      fetchReviews();
    } catch (error) {
      console.error("Failed to save review", error);
      alert("Failed to save review");
    }
  };

  if (loading) return <div className="text-center py-10 text-gray-500">Loading reviews...</div>;

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">My Reviews</h2>
        <button onClick={fetchReviews} className="text-gray-500 hover:text-blue-600 transition-colors">
          <MdRefresh className="text-2xl" />
        </button>
      </div>

      <button
        onClick={openCreateModal}
        className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white py-3 px-6 rounded-2xl font-semibold transition-all flex items-center justify-center gap-2"
      >
        <MdStar className="text-lg" />
        Write a Review
      </button>

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">No reviews found. Write your first review!</div>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-gray-800">{review.tourName}</h3>
                  <p className="text-xs text-gray-500 mt-1">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEditModal(review)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <MdEdit className="text-lg" />
                  </button>
                  <button onClick={() => handleDelete(review._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <MdDelete className="text-lg" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <MdStar
                    key={star}
                    className={`text-lg ${star <= review.rating ? "text-yellow-400" : "text-gray-300"}`}
                  />
                ))}
                <span className="text-sm font-semibold text-gray-800 ml-2">{review.rating}.0</span>
              </div>

              <p className="text-gray-600 mb-4">{review.text}</p>
              <div className="text-xs text-gray-500 font-medium">👍 {review.helpful || 0} found this helpful</div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-800">{currentReview ? "Edit Review" : "Write a Review"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
                <MdClose className="text-xl" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tour/Activity Name</label>
                <input
                  type="text"
                  required
                  value={formData.tourName}
                  onChange={(e) => setFormData({ ...formData, tourName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white"
                  placeholder="e.g. Sigiriya Rock Tour"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <MdStar className={`text-3xl ${star <= formData.rating ? "text-yellow-400" : "text-gray-200"}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                <textarea
                  required
                  rows="4"
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white resize-none"
                  placeholder="Share your experience..."
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-semibold shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
                >
                  {currentReview ? "Update Review" : "Post Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}