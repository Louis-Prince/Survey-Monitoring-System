import { useCallback, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import * as authService from './authService';
import { isTokenExpired } from '../../utils/token';

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
    const result = await authService.login(payload);
  
    const user = {
      email: result.data.email,
      role: result.data.role
    };
  
    setUser(user);
    setToken(result.data.access_token);
  
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', result.data.access_token);
    localStorage.setItem('refresh', result.data.refresh_token);
  
    return result;
  };

  const createPassword = async (payload) => {
    const result = await authService.changePassword(payload, token);
    return result;
  };

  const resetPassword = async (payload) => {
    const result = await authService.resetPassword(payload);
    return result;
  };

  const requestPasswordReset = async (email) => {
    const result = await authService.requestPasswordReset(email);
    return result;
  }

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
  }, []);

  useEffect(() => {
    if (!token) return;
  
    if (isTokenExpired(token)) {
      const id = setTimeout(() => {
        logout();
      }, 0);
  
      return () => clearTimeout(id);
    }
  }, [token, logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        createPassword,
        resetPassword,
        requestPasswordReset
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
