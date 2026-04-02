const API_BASE = 'http://localhost:5001/api';

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('waygo_token')}`
});

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
