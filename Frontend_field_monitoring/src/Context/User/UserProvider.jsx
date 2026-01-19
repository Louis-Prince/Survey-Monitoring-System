import { UserContext } from './UserContext';
import * as userService from './userService';
import { useContext } from 'react';
import { AuthContext } from '../Auth/AuthContext';

export const UserProvider = ({ children }) => {
  const { token } = useContext(AuthContext);

  const createUser = async (payload) => {
    return await userService.createUser(payload, token);
  };

  return (
    <UserContext.Provider value={{ createUser }}>
      {children}
    </UserContext.Provider>
  );
};
