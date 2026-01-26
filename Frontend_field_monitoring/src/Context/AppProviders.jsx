import { AuthProvider } from "./Auth/AuthProvider";
import { UserProvider } from "./User/UserProvider";

const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      <UserProvider>
        {children}
      </UserProvider>
    </AuthProvider>
  );
};

export default AppProviders;
