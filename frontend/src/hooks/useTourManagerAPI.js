import { useEffect, useState } from 'react';
import { tourManagerAPI } from '../services/tourManagerAPI';

export const useTourManagerPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const result = await tourManagerAPI.getPackages();
      setPackages(result.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createPackage = async (payload) => {
    try {
      setLoading(true);
      const result = await tourManagerAPI.createPackage(payload);
      if (!result || result.success === false) throw new Error(result?.message || 'Failed to create package');
      if (result?.data) {
        setPackages([result.data, ...packages]);
      }
      setError(null);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePackage = async (packageId, payload) => {
    try {
      setLoading(true);
      const result = await tourManagerAPI.updatePackage(packageId, payload);
      if (!result || result.success === false) throw new Error(result?.message || 'Failed to update package');
      if (result?.data) {
        setPackages(packages.map(p => (p._id === packageId ? result.data : p)));
      }
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePackage = async (packageId) => {
    try {
      setLoading(true);
      const result = await tourManagerAPI.deletePackage(packageId);
      if (!result || result.success === false) throw new Error(result?.message || 'Failed to delete package');
      if (result?.success) {
        setPackages(packages.filter(p => p._id !== packageId));
      }
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  return { packages, loading, error, createPackage, updatePackage, deletePackage, refetch: fetchPackages };
};

export const useTourManagerTours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const result = await tourManagerAPI.getTours();
      setTours(result.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createTour = async (payload) => {
    try {
      setLoading(true);
      const result = await tourManagerAPI.createTour(payload);
      if (!result || result.success === false) throw new Error(result?.message || 'Failed to create tour');
      if (result?.data) {
        setTours([result.data, ...tours]);
      }
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTour = async (tourId, payload) => {
    try {
      setLoading(true);
      const result = await tourManagerAPI.updateTour(tourId, payload);
      if (!result || result.success === false) throw new Error(result?.message || 'Failed to update tour');
      if (result?.data) {
        setTours(tours.map(t => (t._id === tourId ? result.data : t)));
      }
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTour = async (tourId) => {
    try {
      setLoading(true);
      const result = await tourManagerAPI.deleteTour(tourId);
      if (!result || result.success === false) throw new Error(result?.message || 'Failed to delete tour');
      if (result?.success) {
        setTours(tours.filter(t => t._id !== tourId));
      }
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  return { tours, loading, error, createTour, updateTour, deleteTour, refetch: fetchTours };
};

export const useTourManagerQuotes = (status = 'Pending') => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const result = await tourManagerAPI.getQuotes(status);
      setQuotes(result.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateQuote = async (quoteId, payload) => {
    try {
      setLoading(true);
      const result = await tourManagerAPI.updateQuote(quoteId, payload);
      if (result?.data) {
        setQuotes(quotes.map(q => (q._id === quoteId ? result.data : q)));
      }
      setError(null);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      // eslint-disable-next-line react-hooks/exhaustive-deps

    fetchQuotes();
  }, [status]);

  return { quotes, loading, error, updateQuote, refetch: fetchQuotes };
};

export const useTourManagerStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const result = await tourManagerAPI.getStats();
      setStats(result.data || null);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, error, refetch: fetchStats };
};

export const useTourManagerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const result = await tourManagerAPI.getBookings();
      setBookings(result.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const assignDriver = async (bookingId, driverId) => {
    try {
      setLoading(true);
      const result = await tourManagerAPI.assignDriver(bookingId, { driverId });
      if (result?.data) {
        setBookings(bookings.map(b => (b._id === bookingId ? result.data : b)));
      }
      return result;
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

  return { bookings, loading, error, assignDriver, refetch: fetchBookings };
};
