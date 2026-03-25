import { useEffect, useState } from 'react';
import { fleetManagerAPI } from '../services/fleetManagerAPI';

export const useFleetVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const result = await fleetManagerAPI.getVehicles();
      setVehicles(result.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return { vehicles, loading, error, refetch: fetchVehicles };
};

export const useFleetMaintenanceAlerts = () => {
  const [serviceDue, setServiceDue] = useState([]);
  const [complianceDue, setComplianceDue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const result = await fleetManagerAPI.getMaintenanceAlerts();
      setServiceDue(result.data?.serviceDue || []);
      setComplianceDue(result.data?.complianceDue || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  return { serviceDue, complianceDue, loading, error, refetch: fetchAlerts };
};
