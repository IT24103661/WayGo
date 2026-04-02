import { useEffect, useState } from 'react';
import { MdLocalTaxi, MdDelete, MdEdit, MdCancel } from 'react-icons/md';
import { useTouristFleetBookings } from '../../../hooks/useTouristAPI';

const INITIAL_FORM = {
  pickupLocation: '',
  dropoffLocation: '',
  pickupTime: '',
  totalPrice: ''
};

const CITY_COORDS = {
  colombo: [6.9271, 79.8612],
  negombo: [7.2083, 79.8358],
  kandy: [7.2906, 80.6337],
  galle: [6.0535, 80.221],
  matara: [5.9549, 80.554],
  jaffna: [9.6615, 80.0255],
  anuradhapura: [8.3114, 80.4037],
  trincomalee: [8.5874, 81.2152],
  batticaloa: [7.7102, 81.6924],
  kurunegala: [7.4863, 80.3623],
  ella: [6.8667, 81.0466]
};

const normalizeText = (value) => String(value || '').trim().toLowerCase();

const findKnownCity = (locationText) => {
  const text = normalizeText(locationText);
  return Object.keys(CITY_COORDS).find((city) => text.includes(city)) || null;
};

const estimatePrice = (pickupLocation, dropoffLocation) => {
  const pickup = normalizeText(pickupLocation);
  const dropoff = normalizeText(dropoffLocation);

  if (!pickup || !dropoff) return '';

  if (pickup === dropoff) {
    return '800';
  }

  const pickupCity = findKnownCity(pickup);
  const dropoffCity = findKnownCity(dropoff);

  if (pickupCity && dropoffCity) {
    const [lat1, lon1] = CITY_COORDS[pickupCity];
    const [lat2, lon2] = CITY_COORDS[dropoffCity];
    const approxKm = Math.sqrt((lat1 - lat2) ** 2 + (lon1 - lon2) ** 2) * 111;
    const fare = Math.max(800, 350 + (approxKm * 120));
    return String(Math.round(fare / 50) * 50);
  }

  // Fallback estimate when locations do not match known city names.
  const fare = 1400 + (Math.max(pickup.length, dropoff.length) * 25);
  return String(Math.round(fare / 50) * 50);
};

export default function FleetBookingsSection() {
  const {
    fleetBookings,
    loading,
    error,
    createFleetBooking,
    updateFleetBooking,
    cancelFleetBooking,
    deleteFleetBooking
  } = useTouristFleetBookings();

  const [form, setForm] = useState(INITIAL_FORM);
  const [editingId, setEditingId] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const nextPrice = estimatePrice(form.pickupLocation, form.dropoffLocation);
    if (nextPrice !== form.totalPrice) {
      setForm((prev) => ({ ...prev, totalPrice: nextPrice }));
    }
  }, [form.pickupLocation, form.dropoffLocation, form.totalPrice]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const payload = {
      pickupLocation: form.pickupLocation.trim(),
      dropoffLocation: form.dropoffLocation.trim(),
      pickupTime: form.pickupTime,
      totalPrice: Number(form.totalPrice)
    };

    if (!payload.pickupLocation || !payload.dropoffLocation || !payload.pickupTime || Number.isNaN(payload.totalPrice) || payload.totalPrice <= 0) {
      setMessage('Please fill pickup, dropoff, pickup time and price correctly.');
      return;
    }

    try {
      setSaving(true);
      if (editingId) {
        await updateFleetBooking(editingId, payload);
        setMessage('Fleet booking updated successfully.');
      } else {
        await createFleetBooking(payload);
        setMessage('Fleet booking created and sent to fleet managers.');
      }
      setForm(INITIAL_FORM);
      setEditingId('');
    } catch (err) {
      setMessage(err.message || 'Failed to save fleet booking.');
    } finally {
      setSaving(false);
    }
  };

  const onEdit = (booking) => {
    setEditingId(booking._id);
    setForm({
      pickupLocation: booking.pickupLocation || '',
      dropoffLocation: booking.dropoffLocation || '',
      pickupTime: booking.pickupTime ? new Date(booking.pickupTime).toISOString().slice(0, 16) : '',
      totalPrice: String(booking.totalPrice ?? '')
    });
  };

  const onCancelBooking = async (bookingId) => {
    try {
      await cancelFleetBooking(bookingId);
      setMessage('Fleet booking cancelled successfully.');
    } catch (err) {
      setMessage(err.message || 'Failed to cancel booking.');
    }
  };

  const onDeleteBooking = async (bookingId) => {
    if (!window.confirm('Delete this fleet booking permanently?')) return;

    try {
      await deleteFleetBooking(bookingId);
      setMessage('Fleet booking deleted successfully.');
    } catch (err) {
      setMessage(err.message || 'Failed to delete booking.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-md shadow-emerald-300/70">
          <MdLocalTaxi className="text-lg" />
        </span>
        <h2 className="text-xl font-bold text-zinc-900">Fleet Bookings</h2>
      </div>

      <form onSubmit={onSubmit} className="bg-white rounded-2xl border border-stone-200 p-5 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            value={form.pickupLocation}
            onChange={(e) => setForm((prev) => ({ ...prev, pickupLocation: e.target.value }))}
            placeholder="Pickup location"
            className="px-3 py-2.5 border border-stone-200 rounded-xl"
            required
          />
          <input
            value={form.dropoffLocation}
            onChange={(e) => setForm((prev) => ({ ...prev, dropoffLocation: e.target.value }))}
            placeholder="Dropoff location"
            className="px-3 py-2.5 border border-stone-200 rounded-xl"
            required
          />
          <input
            type="datetime-local"
            value={form.pickupTime}
            onChange={(e) => setForm((prev) => ({ ...prev, pickupTime: e.target.value }))}
            className="px-3 py-2.5 border border-stone-200 rounded-xl"
            required
          />
          <input
            type="number"
            min="0"
            value={form.totalPrice}
            placeholder="Total price (auto-calculated)"
            className="px-3 py-2.5 border border-stone-200 rounded-xl bg-stone-50 text-stone-700"
            readOnly
            required
          />
        </div>

        <p className="text-xs text-stone-500">
          Total price is automatically estimated after entering pickup and dropoff locations.
        </p>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold disabled:opacity-60"
          >
            {saving ? 'Saving...' : (editingId ? 'Update Fleet Booking' : 'Create Fleet Booking')}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId('');
                setForm(INITIAL_FORM);
                setMessage('');
              }}
              className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700"
            >
              Cancel Edit
            </button>
          )}
          {message && <p className="text-sm text-emerald-700 font-semibold">{message}</p>}
        </div>
      </form>

      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-stone-100 text-stone-600 uppercase text-xs">
            <tr>
              <th className="text-left px-4 py-3">Pickup</th>
              <th className="text-left px-4 py-3">Dropoff</th>
              <th className="text-left px-4 py-3">Time</th>
              <th className="text-left px-4 py-3">Driver</th>
              <th className="text-left px-4 py-3">Contact</th>
              <th className="text-left px-4 py-3">Vehicle</th>
              <th className="text-left px-4 py-3">Price</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {loading && (
              <tr><td colSpan={9} className="px-4 py-4 text-stone-500">Loading fleet bookings...</td></tr>
            )}
            {!loading && error && (
              <tr><td colSpan={9} className="px-4 py-4 text-rose-600">{error}</td></tr>
            )}
            {!loading && !error && fleetBookings.length === 0 && (
              <tr><td colSpan={9} className="px-4 py-4 text-stone-500">No fleet bookings yet.</td></tr>
            )}
            {!loading && fleetBookings.map((booking) => (
              <tr key={booking._id}>
                <td className="px-4 py-3">{booking.pickupLocation}</td>
                <td className="px-4 py-3">{booking.dropoffLocation}</td>
                <td className="px-4 py-3">{new Date(booking.pickupTime).toLocaleString()}</td>
                <td className="px-4 py-3">{booking.assignedDriver?.name || '-'}</td>
                <td className="px-4 py-3">{booking.assignedDriver?.phone || '-'}</td>
                <td className="px-4 py-3">
                  {booking.assignedVehicle
                    ? `${booking.assignedVehicle.plateNumber || '-'}${booking.assignedVehicle.make || booking.assignedVehicle.model ? ` - ${booking.assignedVehicle.make || ''} ${booking.assignedVehicle.model || ''}` : ''}`
                    : '-'}
                </td>
                <td className="px-4 py-3">LKR {Number(booking.totalPrice || 0).toLocaleString()}</td>
                <td className="px-4 py-3">{booking.status}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => onEdit(booking)} className="p-1.5 rounded border border-blue-200 text-blue-700 bg-blue-50">
                      <MdEdit />
                    </button>
                    <button onClick={() => onCancelBooking(booking._id)} className="p-1.5 rounded border border-amber-200 text-amber-700 bg-amber-50">
                      <MdCancel />
                    </button>
                    <button onClick={() => onDeleteBooking(booking._id)} className="p-1.5 rounded border border-rose-200 text-rose-700 bg-rose-50">
                      <MdDelete />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
