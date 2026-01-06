import { AuthContext } from './AuthContext';
import * as authService from './authService';

export const AuthProvider = ({ children }) => {
  const createPassword = async (payload) => {
    return await authService.createPassword(payload);
  };

  const resetPassword = async (payload) => {
    return await authService.resetPassword(payload);
  };

  return (
    <AuthContext.Provider
      value={{
        createPassword,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
