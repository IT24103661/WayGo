const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('waygo_token')}`
});

export const tourManagerAPI = {
  getPackages: () => fetch(`${API_BASE}/tourmanager/packages`, {
    headers: authHeaders()
  }).then(r => r.json()),

  createPackage: (payload) => fetch(`${API_BASE}/tourmanager/packages`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload)
  }).then(r => r.json()),

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
};
