// API endpoints for Tourist-Driver-TourManager interactions
const API_BASE = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5001/api';

export const touristAPI = {
  // === Profile Management (CRUD) ===
  getProfile: () => fetch(`${API_BASE}/tourist/profile`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('waygo_token')}` }
  }).then(r => r.json()),

  updateProfile: (profileData) => fetch(`${API_BASE}/tourist/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('waygo_token')}`
    },
    body: JSON.stringify(profileData)
  }).then(r => r.json()),

  deleteProfile: () => fetch(`${API_BASE}/tourist/profile`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('waygo_token')}` }
  }).then(r => r.json()),

  // === Bookings Management (CRUD) ===
  getBookings: () => fetch(`${API_BASE}/tourist/bookings`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('waygo_token')}` }
  }).then(r => r.json()),

  createBooking: (bookingData) => fetch(`${API_BASE}/tourist/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('waygo_token')}`
    },
    body: JSON.stringify(bookingData)
  }).then(async r => {
    if (!r.ok) {
        let errData = {};
        try { errData = await r.json(); } catch(e) {}
        throw new Error(errData.message || errData.error || 'Request failed with status ' + r.status);
    }
    return r.json();
  }),

  cancelBooking: (bookingId) => fetch(`${API_BASE}/tourist/bookings/${bookingId}/cancel`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('waygo_token')}` }
  }).then(r => r.json()),

  updateBooking: (bookingId, updatedData) => fetch(`${API_BASE}/tourist/bookings/${bookingId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('waygo_token')}`
    },
    body: JSON.stringify(updatedData)
  }).then(async r => {
    if (!r.ok) {
        let errData = {};
        try { errData = await r.json(); } catch(e) {}
        throw new Error(errData.message || errData.error || 'Request failed with status ' + r.status);
    }
    return r.json();
  }),


  // === Tours (Available to Tourist) ===
  getTours: () => fetch(`${API_BASE}/tourist/tours`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('waygo_token')}` }
  }).then(r => r.json()),

  // Drivers (for ride bookings & contact)
  getAvailableDrivers: (location, date) => fetch(`${API_BASE}/drivers/available?location=${location}&date=${date}`)
    .then(r => r.json()),
  getDriverDetails: (driverId) => fetch(`${API_BASE}/drivers/${driverId}`)
    .then(r => r.json()),
  contactDriver: (driverId, message) => fetch(`${API_BASE}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('waygo_token')}`
    },
    body: JSON.stringify({ receiverId: driverId, message })
  }).then(r => r.json()),

  // Reviews (feedback to Drivers & TourManagers)
  getReviews: () => fetch(`${API_BASE}/tourist/reviews`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('waygo_token')}` }
  }).then(r => r.json()),

  createReview: (reviewData) => fetch(`${API_BASE}/tourist/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('waygo_token')}`
    },
    body: JSON.stringify(reviewData)
  }).then(async r => {
    if (!r.ok) { let e={}; try{e=await r.json();}catch(x){} throw new Error(e.message||'failed to create review'); }
    return r.json();
  }),

  updateReview: (id, reviewData) => fetch(`${API_BASE}/tourist/reviews/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('waygo_token')}`
    },
    body: JSON.stringify(reviewData)
  }).then(async r => {
    if (!r.ok) { let e={}; try{e=await r.json();}catch(x){} throw new Error(e.message||'failed to update review'); }
    return r.json();
  }),

  deleteReview: (id) => fetch(`${API_BASE}/tourist/reviews/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('waygo_token')}` }
  }).then(async r => {
    if (!r.ok) { let e={}; try{e=await r.json();}catch(x){} throw new Error(e.message||'failed to delete review'); }
    return r.json();
  }),

  // Notifications
  getNotifications: () => fetch(`${API_BASE}/notifications`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('waygo_token')}` }
  }).then(r => r.json()),

  markNotificationRead: (notificationId) => fetch(`${API_BASE}/notifications/${notificationId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('waygo_token')}`
    },
    body: JSON.stringify({ read: true })
  }).then(r => r.json()),
};