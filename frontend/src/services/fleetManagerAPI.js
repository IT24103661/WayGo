const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('waygo_token')}`
});

export const fleetManagerAPI = {
  getVehicles: () => fetch(`${API_BASE}/fleetmanager/vehicles`, {
    headers: authHeaders()
  }).then(r => r.json()),

  getMaintenanceAlerts: () => fetch(`${API_BASE}/fleetmanager/maintenance-alerts`, {
    headers: authHeaders()
  }).then(r => r.json()),
};
