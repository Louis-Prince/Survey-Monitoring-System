import { useState } from 'react';
import { AuthContext } from './AuthContext';
import * as authService from './authService';

const getStoredUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const login = async (payload) => {
    const data = await authService.login(payload);

    setUser(data.user);
    setToken(data.access_token);

    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', data.access_token);

    return data;
  };

  const createPassword = async (payload) => {
    const data = await authService.changePassword(payload, token);
    return { success: true, data };
  };

  const resetPassword = async (payload) => {
    const data = await authService.resetPassword(payload);
    return { success: true, data };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        createPassword,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
