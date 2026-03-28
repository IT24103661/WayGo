import { useState, useCallback } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

export function useDriverAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('waygo_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const getAvailableJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/driver/jobs/available`, {
        headers: getAuthHeaders()
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to fetch available jobs');
      return json.data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getMyJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/driver/jobs/mine`, {
        headers: getAuthHeaders()
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to fetch your jobs');
      return json.data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStatus = async (status) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/driver/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to update status');
      return json;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const acceptJob = async (bookingId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/driver/bookings/${bookingId}/accept`, {
        method: 'PATCH',
        headers: getAuthHeaders()
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to accept job');
      return json;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateJobStatus = async (bookingId, status) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/driver/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to update job status');
      return json;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getAvailableJobs,
    getMyJobs,
    updateStatus,
    acceptJob,
    updateJobStatus
  };
}