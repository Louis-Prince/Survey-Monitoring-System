const API_URL = 'http://127.0.0.1:8000/api';

export const login = async (payload) => {
  const res = await fetch(`${API_URL}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');

  return data;
};

export const changePassword = async (payload, token) => {
  const res = await fetch(`${API_URL}/accounts/change-password/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Password change failed');

  return data;
};

export const resetPassword = async (payload) => {
  const res = await fetch(`${API_URL}/auth/forgot-password/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Password reset failed');

  return data;
};
