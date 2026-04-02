const API_BASE = 'http://localhost:5001/api';

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('waygo_token')}`
});

const parseJson = async (res) => {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    throw new Error('Invalid response received from server.');
  }
};

const unwrap = (payload) => {
  if (payload && typeof payload === 'object' && 'data' in payload && payload.success !== undefined) {
    return payload.data;
  }
  return payload;
};

const request = async (path, options = {}) => {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...authHeaders(),
      ...(options.headers || {})
    }
  });

  const json = await parseJson(res);
  if (!res.ok) {
    throw new Error(json.message || `Request failed with status ${res.status}`);
  }
  return unwrap(json);
};

export const touristAPI = {
  getProfile: () => request('/tourist/profile'),

  updateProfile: (profileData) => request('/tourist/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData)
  }),

  deleteProfile: () => request('/tourist/profile', {
    method: 'DELETE'
  }),

  getBookings: () => request('/tourist/bookings'),

  createBooking: (bookingData) => request('/tourist/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData)
  }),

  getFleetBookings: () => request('/tourist/fleet-bookings'),

  createFleetBooking: (bookingData) => request('/tourist/fleet-bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData)
  }),

  updateFleetBooking: (bookingId, bookingData) => request(`/tourist/fleet-bookings/${bookingId}`, {
    method: 'PUT',
    body: JSON.stringify(bookingData)
  }),

  cancelFleetBooking: (bookingId) => request(`/tourist/fleet-bookings/${bookingId}/cancel`, {
    method: 'PUT'
  }),

  deleteFleetBooking: (bookingId) => request(`/tourist/fleet-bookings/${bookingId}`, {
    method: 'DELETE'
  }),

  cancelBooking: (bookingId) => request(`/tourist/bookings/${bookingId}/cancel`, {
    method: 'PUT'
  }),

  updateBooking: (bookingId, updatedData) => request(`/tourist/bookings/${bookingId}`, {
    method: 'PUT',
    body: JSON.stringify(updatedData)
  }),

  getTours: () => request('/tourist/tours'),

  getReviews: () => request('/tourist/reviews'),

  createReview: (reviewData) => request('/tourist/reviews', {
    method: 'POST',
    body: JSON.stringify(reviewData)
  }),

  updateReview: (id, reviewData) => request(`/tourist/reviews/${id}`, {
    method: 'PUT',
    body: JSON.stringify(reviewData)
  }),

  deleteReview: (id) => request(`/tourist/reviews/${id}`, {
    method: 'DELETE'
  }),

  // Backward-compatible alias used by old hook signatures.
  submitReview: (bookingId, rating, comment) => request('/tourist/reviews', {
    method: 'POST',
    body: JSON.stringify({
      tourName: bookingId ? `Booking ${bookingId}` : 'General Tour',
      rating,
      text: comment
    })
  }),

  getNotifications: () => request('/tourist/notifications'),

  markNotificationRead: (notificationId) => request(`/tourist/notifications/${notificationId}/read`, {
    method: 'PATCH'
  }),

  markAllNotificationsRead: () => request('/tourist/notifications/read-all', {
    method: 'PATCH'
  }),

  // Placeholder stubs for sections that are still UI-mock based.
  getAvailableDrivers: async () => [],
  getDriverDetails: async () => null,
  contactDriver: async () => ({ success: true })
};