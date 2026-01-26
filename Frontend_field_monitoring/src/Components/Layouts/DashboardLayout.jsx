import { Outlet } from 'react-router-dom';
import './dashboardLayout.css';
import Navbar from '../Navbar/navbar';
import Sidebar from '../Sidebar/sidebar';

const DashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
