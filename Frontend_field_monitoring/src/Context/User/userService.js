const API_URL = 'http://127.0.0.1:8000/api';

export const getUsers = async (token) => {
  const res = await fetch(`${API_URL}/auth/users/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch users');
  return data;
};

export const getUserById = async (id, token) => {
  const res = await fetch(`${API_URL}/auth/users/${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch user');
  return data;
};

export const createUser = async (payload, token) => {
  const res = await fetch(`${API_URL}/auth/create-user/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create user');
  return data;
};

export const updateUser = async (id, payload, token) => {
  const res = await fetch(`${API_URL}/auth/users/${id}/update/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update user');
  return data;
};
