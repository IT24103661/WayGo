const API_BASE = 'http://localhost:5001/api';

const getToken = () => {
  const token = localStorage.getItem('waygo_token') || localStorage.getItem('token');
  if (!token || token === 'null' || token === 'undefined') return null;
  return token;
};

const authHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

const parseJson = async (res) => {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    throw new Error('Invalid response received from server.');
  }
};

const request = async (path, options = {}) => {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...authHeaders(),
      ...(options.headers || {})
    }
  });

  const json = await parseJson(res);
  if (!res.ok) {
    throw new Error(json.message || 'Request failed.');
  }
  return json;
};

export const adminAPI = {
  getSalaryApprovals: (status) => request(`/users/admin/salaries${status ? `?status=${status}` : ''}`),

  updateSalaryStatus: (salaryId, payload) => request(`/users/admin/salaries/${salaryId}/status`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  })
};
