import { UserContext } from './UserContext';
import * as userService from './userService';
import { useContext } from 'react';
import { AuthContext } from '../Auth/AuthContext';

export const UserProvider = ({ children }) => {
  const { token } = useContext(AuthContext);

  return (
    <UserContext.Provider
      value={{
        getUsers: () => userService.getUsers(token),
        getUserById: (id) => userService.getUserById(id, token),
        createUser: (payload) => userService.createUser(payload, token),
        updateUser: (id, payload) => userService.updateUser(id, payload, token),
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
