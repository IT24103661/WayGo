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

  useEffect(() => {
    fetchPackages();
  }, []);

  return { packages, loading, error, createPackage, refetch: fetchPackages };
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
