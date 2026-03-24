import { useState, useEffect } from 'react';
import { touristAPI } from '../services/touristAPI';

/**
 * Hook to manage tourist bookings and interactions with drivers/tour managers
 */
export const useTouristBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await touristAPI.getBookings();
      setBookings(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (bookingData) => {
    try {
      setLoading(true);
      const newBooking = await touristAPI.createBooking(bookingData);
      setBookings([...bookings, newBooking]);
      setError(null);
      return newBooking;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      setLoading(true);
      await touristAPI.cancelBooking(bookingId);
      setBookings(bookings.filter(b => b._id !== bookingId));
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return { bookings, loading, error, createBooking, cancelBooking, refetch: fetchBookings };
};

/**
 * Hook to manage tourist tours (from tour managers)
 */
export const useTouristTours = (filters = {}) => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        const data = await touristAPI.getTours(filters);
        setTours(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [filters]);

  return { tours, loading, error };
};

/**
 * Hook to manage available drivers
 */
export const useAvailableDrivers = (location, date) => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDrivers = async () => {
      if (location && date) {
        try {
          setLoading(true);
          const data = await touristAPI.getAvailableDrivers(location, date);
          setDrivers(data);
          setError(null);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDrivers();
  }, [location, date]);

  return { drivers, loading, error };
};

/**
 * Hook to manage reviews (feedback to drivers/tour managers)
 */
export const useTouristReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await touristAPI.getReviews();
      setReviews(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async (bookingId, rating, comment) => {
    try {
      setLoading(true);
      const newReview = await touristAPI.submitReview(bookingId, rating, comment);
      setReviews([...reviews, newReview]);
      setError(null);
      return newReview;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return { reviews, loading, error, submitReview, refetch: fetchReviews };
};

/**
 * Hook to manage notifications from drivers/tour managers
 */
export const useTouristNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await touristAPI.getNotifications();
      setNotifications(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await touristAPI.markNotificationRead(notificationId);
      setNotifications(notifications.map(n => 
        n._id === notificationId ? { ...n, read: true } : n
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  return { notifications, loading, error, markAsRead, refetch: fetchNotifications };
};

/**
 * Hook to contact driver
 */
export const useContactDriver = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async (driverId, message) => {
    try {
      setLoading(true);
      const result = await touristAPI.contactDriver(driverId, message);
      setError(null);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading, error };
};