import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../Layouts/DashboardLayout';
import Dashboard from '../../Pages/Dashboard/dashboard';
import { Enumerators } from '../../Pages/Enumerators/enumerators';
import EnumeratorDetails from '../../Pages/Enumerators/EnumeratorDetail/enumeratorDetail';
import Login from '../../Pages/Auth/Login/login';
import CreatePassword from '../../Pages/Auth/CreatePassword/createPassword';
import CreateUser from '../../Pages/User_management/CreateUser/CreateUser';
import ForgotPassword from '../../Pages/Auth/ForgotPassword/forgotPassword';

export default function Index() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/create-user" element={<CreateUser />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/create-password"
        element={
          <CreatePassword mode="create" title="Create New Password" description="Please create a new password to continue"/>
        }
      />

      <Route path="/forgot-password"
        element={
          <CreatePassword mode="reset" title="Reset Password" description="Enter a new password for your account"/>
        }
      />

      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="enumerators" element={<Enumerators />} />
        <Route path="enumerators/:id" element={<EnumeratorDetails />}
  />
        {/* 
        <Route path="surveys" element={<SurveyMonitoring />} />
        <Route path="analytics" element={<Analytics />} />
        */}
      </Route>
    </Routes>
  );
}
