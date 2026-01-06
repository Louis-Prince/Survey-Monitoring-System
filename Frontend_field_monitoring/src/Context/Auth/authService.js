const API_URL = 'http://127.0.0.1:8000/api';

export const login = async (payload) => {
  const res = await fetch(`${API_URL}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const raw = await res.json();
  const success = Array.isArray(raw.success) ? raw.success[0] === true || raw.success[0] === 'True' : raw.success;
  const message = Array.isArray(raw.message) ? raw.message[0] : raw.message;
  const result = { ...raw, success, message };

  if (!res.ok || result.success === false) {
    throw new Error(result.message || 'Login failed');
  }

  return result;
};

export const changePassword = async (payload, token) => {
  const res = await fetch(`${API_URL}/auth/change-password/`, {
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
  const res = await fetch(`${API_URL}/auth/password-reset-confirm/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Password Reset Failed');

  return data;
};

export const requestPasswordReset = async (email) => {
  const res = await fetch(`${API_URL}/auth/forgot-password/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request Password Reset Failed');
  return data;
};