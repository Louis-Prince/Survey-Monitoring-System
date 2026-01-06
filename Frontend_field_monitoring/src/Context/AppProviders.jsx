import { AuthProvider } from "./Auth/AuthProvider";


const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
        {children}
    </AuthProvider>
  );
};

export default AppProviders;
