import { useState } from 'react';
import { MdAddCircle, MdDelete, MdEdit, MdTour } from 'react-icons/md';
import { useTourManagerTours } from '../../../hooks/useTourManagerAPI';

export default function ManageToursSection() {
  const { tours, createTour, updateTour, deleteTour, loading } = useTourManagerTours();
  
  const [form, setForm] = useState({
    title: '',
    description: '',
    destination: '',
    durationDays: '',
    price: '',
    maxGroupSize: '',
    includes: '',
    excludes: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  const handleChange = (field) => (event) => {
    let value = event.target.value;

    // Strict typing validations
    if (field === 'title') {
      value = value.replace(/[^a-zA-Z0-9\s-]/g, '');
    } else if (field === 'price' || field === 'durationDays' || field === 'maxGroupSize') {
      value = value.replace(/[^\d]/g, '');
    } else if (field === 'destination') {
      // allow letters, spaces, commas
      value = value.replace(/[^a-zA-Z\s,]/g, '');
    }

    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleEdit = (tour) => {
    setEditingId(tour._id);
    setForm({
      title: tour.title || '',
      description: tour.description || '',
      destination: tour.destination || '',
      durationDays: tour.durationDays || '',
      price: tour.price || '',
      maxGroupSize: tour.maxGroupSize || '',
      includes: tour.includes?.join(' • ') || '',
      excludes: tour.excludes?.join(' • ') || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this custom tour?')) {
      try {
        await deleteTour(id);
        setMessage('Tour deleted successfully.');
      } catch (error) {
        setMessage('Unable to delete tour.');
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    try {
      const payload = {
        title: form.title,
        description: form.description,
        destination: form.destination,
        durationDays: Number(form.durationDays),
        price: Number(form.price),
        maxGroupSize: Number(form.maxGroupSize) || 10,
        includes: (form.includes || '').split('•').map(i => i.trim()).filter(Boolean),
        excludes: (form.excludes || '').split('•').map(e => e.trim()).filter(Boolean)
      };
      
      if (editingId) {
        await updateTour(editingId, payload);
        setMessage('Tour updated successfully.');
      } else {
        await createTour(payload);
        setMessage('Tour created successfully.');
      }
      
      setEditingId(null);
      setForm({
        title: '', description: '', destination: '', durationDays: '', price: '', maxGroupSize: '', includes: '', excludes: ''
      });
    } catch (error) {
      setMessage(error.message || 'Unable to save tour.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-[0.3em] text-emerald-700 uppercase">Manage Tours</p>
        <h2 className="text-2xl font-bold text-emerald-950">{editingId ? 'Edit Custom Tour' : 'Create Custom Tour'}</h2>
        <p className="text-emerald-700/80">Manage standalone custom tours tailored for specific types of travelers.</p>
      </div>

      <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-emerald-200 shadow-[0_20px_50px_-40px_rgba(16,185,129,0.35)] p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-emerald-900 mb-2">Tour Title</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={handleChange('title')}
                placeholder="Serene Beach Getaway"
                className="w-full px-4 py-2 border border-emerald-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-emerald-900 mb-2">Destinations</label>
              <input
                type="text"
                required
                value={form.destination}
                onChange={handleChange('destination')}
                placeholder="South Coast, Sri Lanka"
                className="w-full px-4 py-2 border border-emerald-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-emerald-900 mb-2">Price (LKR)</label>
              <input
                type="number"
                required
                value={form.price}
                onChange={handleChange('price')}
                placeholder="85000"
                className="w-full px-4 py-2 border border-emerald-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-emerald-900 mb-2">Duration (Days)</label>
              <input
                type="number"
                required
                value={form.durationDays}
                onChange={handleChange('durationDays')}
                placeholder="3"
                className="w-full px-4 py-2 border border-emerald-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-emerald-900 mb-2">Max Group Size</label>
              <input
                type="number"
                value={form.maxGroupSize}
                onChange={handleChange('maxGroupSize')}
                placeholder="10"
                className="w-full px-4 py-2 border border-emerald-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-emerald-900 mb-2">Description</label>
            <textarea
              rows="3"
              required
              value={form.description}
              onChange={handleChange('description')}
              placeholder="Highlight the main attractions and vibe of this tour..."
              className="w-full px-4 py-3 border border-emerald-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-emerald-900 mb-2">Included (Separate by •)</label>
              <input
                type="text"
                value={form.includes}
                onChange={handleChange('includes')}
                placeholder="Hotel • Breakfast • Transport"
                className="w-full px-4 py-2 border border-emerald-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-emerald-900 mb-2">Excluded (Separate by •)</label>
              <input
                type="text"
                value={form.excludes}
                onChange={handleChange('excludes')}
                placeholder="Flights • Lunch • Dinner"
                className="w-full px-4 py-2 border border-emerald-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
              />
            </div>
          </div>

          {message && (
            <p className="text-sm font-semibold text-emerald-700">{message}</p>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-60"
            >
              <MdAddCircle className="text-xl" />
              {loading ? 'Saving...' : editingId ? 'Update Tour' : 'Create Tour'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm({
                    title: '', description: '', destination: '', durationDays: '', price: '', maxGroupSize: '', includes: '', excludes: ''
                  });
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-colors"
               >
                 Cancel Edit
               </button>
            )}
          </div>
        </form>
      </div>

      {/* Existing Tours List */}
      <div className="mt-10">
        <h3 className="text-xl font-bold text-emerald-950 mb-6">Existing Tours</h3>
        {tours && tours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tours.map(tour => (
              <div key={tour._id} className="bg-white rounded-3xl shadow-[0_20px_50px_-40px_rgba(16,185,129,0.2)] border border-emerald-100 group flex flex-col hover:-translate-y-1 transition-all duration-300">
                <div className="h-40 bg-emerald-100 rounded-t-3xl overflow-hidden relative">
                  <div className="absolute inset-0 bg-emerald-900/20 group-hover:bg-transparent transition-colors" />
                  <img
                    src={`https://source.unsplash.com/600x400/?srilanka,${encodeURIComponent(tour.destination || tour.title || 'travel')}`}
                    alt={tour.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.src = 'https://source.unsplash.com/600x400/?srilanka,nature'; }}
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md ${tour.isActive ? 'bg-white/80 text-emerald-700' : 'bg-white/80 text-gray-600'}`}>
                      {tour.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <h4 className="text-lg font-bold text-emerald-950 leading-tight mb-2">{tour.title}</h4>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 mb-3 uppercase tracking-wide">
                    <span>{tour.destination}</span>
                    <span>•</span>
                    <span>{tour.durationDays} Days</span>
                  </div>
                  
                  <p className="text-sm text-emerald-900/70 line-clamp-2 mb-4 flex-1">{tour.description}</p>
                  
                  <div className="flex items-end justify-between mb-4 border-t border-emerald-50 pt-4 mt-auto">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-semibold text-emerald-600">Price</p>
                      <p className="text-lg font-bold text-emerald-950">LKR {tour.price.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-emerald-50">
                    <button 
                      onClick={() => handleEdit(tour)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-colors font-semibold text-sm"
                    >
                      <MdEdit /> Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(tour._id)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-semibold text-sm"
                    >
                      <MdDelete /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-emerald-50/50 rounded-3xl p-8 border border-emerald-100 text-center">
            <p className="text-emerald-700 font-medium">No custom tours created yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}