// API endpoints for Tourist-Driver-TourManager interactions
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const touristAPI = {
  // Bookings (connects Tourist with Driver/TourManager)
  getBookings: () => fetch(`${API_BASE}/bookings/tourist`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('waygo_token')}` }
  }).then(r => r.json()),

  createBooking: (bookingData) => fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('waygo_token')}`
    },
    body: JSON.stringify(bookingData)
  }).then(r => r.json()),

  cancelBooking: (bookingId) => fetch(`${API_BASE}/bookings/${bookingId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('waygo_token')}` }
  }).then(r => r.json()),

  // Tours (from TourManagers)
  getTours: (filters = {}) => fetch(`${API_BASE}/tours?${new URLSearchParams(filters)}`).then(r => r.json()),
  getTourDetails: (tourId) => fetch(`${API_BASE}/tours/${tourId}`).then(r => r.json()),

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
  submitReview: (bookingId, rating, comment) => fetch(`${API_BASE}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('waygo_token')}`
    },
    body: JSON.stringify({ bookingId, rating, comment })
  }).then(r => r.json()),

  getReviews: () => fetch(`${API_BASE}/reviews/tourist`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('waygo_token')}` }
  }).then(r => r.json()),

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