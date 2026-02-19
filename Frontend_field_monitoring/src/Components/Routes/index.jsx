import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../Layouts/DashboardLayout';
import Dashboard from '../../Pages/Dashboard/dashboard';
import { Enumerators } from '../../Pages/Enumerators/enumerators';
import EnumeratorDetails from '../../Pages/Enumerators/EnumeratorDetail/enumeratorDetail';
import Login from '../../Pages/Auth/Login/login';
import CreatePassword from '../../Pages/Auth/CreatePassword/createPassword';
import CreateUser from '../../Pages/User_management/CreateUser/CreateUser';
import ForgotPassword from '../../Pages/Auth/ForgotPassword/forgotPassword';
import { SurveyMonitoring } from '../../Pages/Survey_monitoring/surveyMonitoring';
import { SystemAdmin } from '../../Pages/System_admin/systemAdmin';
import ProtectedRoute from './protectedRoute';

export default function Index() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/create-password"
        element={
          <CreatePassword mode="create" title="Create New Password" description="Please create a new password to continue"/>
        }
      />
      <Route path="/reset-password/:uid/:token" 
        element={
          <CreatePassword mode="reset" title="Reset Password" description="Enter a new password for your account"/>
        }
      />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="enumerators" element={<Enumerators />} />
          <Route path="enumerators/:id" element={<EnumeratorDetails />} />
          <Route path="surveys" element={<SurveyMonitoring />} />
          <Route path="system-admin">
            <Route index element={<SystemAdmin />} />
            <Route path="create" element={<CreateUser />} />
            <Route path="edit/:id" element={<CreateUser />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
