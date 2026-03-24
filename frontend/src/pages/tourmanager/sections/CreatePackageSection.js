import { useState } from 'react';
import { MdAddCircle } from 'react-icons/md';
import { useTourManagerPackages } from '../../../hooks/useTourManagerAPI';

export default function CreatePackageSection() {
  const { createPackage, loading } = useTourManagerPackages();
  const [form, setForm] = useState({
    title: '',
    description: '',
    flatPrice: '',
    durationDays: '',
    itineraryStops: '',
    vehicleType: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    try {
      const payload = {
        title: form.title,
        description: form.description,
        flatPrice: Number(form.flatPrice),
        durationDays: Number(form.durationDays),
        itineraryStops: form.itineraryStops.split('•').map((stop) => stop.trim()).filter(Boolean),
        vehicleType: form.vehicleType
      };
      await createPackage(payload);
      setMessage('Package published successfully.');
      setForm({
        title: '',
        description: '',
        flatPrice: '',
        durationDays: '',
        itineraryStops: '',
        vehicleType: ''
      });
    } catch (error) {
      setMessage('Unable to publish package.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-[0.3em] text-emerald-700 uppercase">Create a Package</p>
        <h2 className="text-2xl font-bold text-emerald-950">Design a Signature Tour</h2>
        <p className="text-emerald-700/80">Craft premium, multi-day experiences for high-value travelers.</p>
      </div>

      <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-emerald-200 shadow-[0_20px_50px_-40px_rgba(16,185,129,0.35)] p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-emerald-900 mb-2">Package Title</label>
              <input
                type="text"
                value={form.title}
                onChange={handleChange('title')}
                placeholder="Emerald Highlands Expedition"
                className="w-full px-4 py-2 border border-emerald-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-emerald-900 mb-2">Vehicle Type</label>
              <input
                type="text"
                value={form.vehicleType}
                onChange={handleChange('vehicleType')}
                placeholder="Luxury SUV"
                className="w-full px-4 py-2 border border-emerald-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-emerald-900 mb-2">Flat Price</label>
              <input
                type="number"
                value={form.flatPrice}
                onChange={handleChange('flatPrice')}
                placeholder="120000"
                className="w-full px-4 py-2 border border-emerald-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-emerald-900 mb-2">Duration (Days)</label>
              <input
                type="number"
                value={form.durationDays}
                onChange={handleChange('durationDays')}
                placeholder="4"
                className="w-full px-4 py-2 border border-emerald-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-emerald-900 mb-2">Description</label>
            <textarea
              rows="4"
              value={form.description}
              onChange={handleChange('description')}
              placeholder="Describe the journey, premium services, and exclusivity..."
              className="w-full px-4 py-3 border border-emerald-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-emerald-900 mb-2">Itinerary Stops</label>
            <input
              type="text"
              value={form.itineraryStops}
              onChange={handleChange('itineraryStops')}
              placeholder="Nuwara Eliya • Ella • Yala • Galle"
              className="w-full px-4 py-2 border border-emerald-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
            />
          </div>

          {message && (
            <p className="text-sm font-semibold text-emerald-700">{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-60"
          >
            <MdAddCircle className="text-xl" />
            {loading ? 'Publishing...' : 'Publish Package'}
          </button>
        </form>
      </div>
    </div>
  );
}
