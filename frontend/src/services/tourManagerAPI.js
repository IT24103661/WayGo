const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('waygo_token')}`
});

export const tourManagerAPI = {
  // --- PACKAGES ---
  getPackages: () => fetch(`${API_BASE}/tourmanager/packages`, {
    headers: authHeaders()
  }).then(r => r.json()),

  createPackage: (payload) => fetch(`${API_BASE}/tourmanager/packages`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload)
  }).then(r => r.json()),

  updatePackage: (packageId, payload) => fetch(`${API_BASE}/tourmanager/packages/${packageId}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(payload)
  }).then(r => r.json()),

  deletePackage: (packageId) => fetch(`${API_BASE}/tourmanager/packages/${packageId}`, {
    method: 'DELETE',
    headers: authHeaders()
  }).then(r => r.json()),

  // --- TOURS ---
  getTours: () => fetch(`${API_BASE}/tourmanager/tours`, {
    headers: authHeaders()
  }).then(r => r.json()),

  createTour: (payload) => fetch(`${API_BASE}/tourmanager/tours`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload)
  }).then(r => r.json()),

  updateTour: (tourId, payload) => fetch(`${API_BASE}/tourmanager/tours/${tourId}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(payload)
  }).then(r => r.json()),

  deleteTour: (tourId) => fetch(`${API_BASE}/tourmanager/tours/${tourId}`, {
    method: 'DELETE',
    headers: authHeaders()
  }).then(r => r.json()),

  // --- QUOTES ---
  getQuotes: (status) => {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    return fetch(`${API_BASE}/tourmanager/quotes${query}`, {
      headers: authHeaders()
    }).then(r => r.json());
  },

  updateQuote: (quoteId, payload) => fetch(`${API_BASE}/tourmanager/quotes/${quoteId}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(payload)
  }).then(r => r.json()),

  getStats: () => fetch(`${API_BASE}/tourmanager/stats`, {
    headers: authHeaders()
  }).then(r => r.json()),

  // --- BOOKINGS & DISPATCH ---
  getBookings: () => fetch(`${API_BASE}/tourmanager/bookings`, {
    headers: authHeaders()
  }).then(r => r.json()),

  assignDriver: (bookingId, payload) => fetch(`${API_BASE}/tourmanager/tours/${bookingId}/assign-driver`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(payload)
  }).then(r => r.json()),
};
