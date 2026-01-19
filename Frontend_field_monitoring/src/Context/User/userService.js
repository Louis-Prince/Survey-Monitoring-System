const API_URL = 'http://127.0.0.1:8000/api';

export const createUser = async (payload, token) => {
  const res = await fetch(`${API_URL}/account/users/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Failed to create user');
  }

  return data;
};
