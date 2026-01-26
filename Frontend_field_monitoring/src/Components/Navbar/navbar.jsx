import { Bell } from 'lucide-react';
import './navbar.css';
import { useLocation } from 'react-router-dom';
import { SIDEBAR_CONFIG } from '../../constants/sidebar.js';

const Navbar = () => {
  const location = useLocation();
  const user = { role: 'ADMIN' };

  const menuItems = SIDEBAR_CONFIG[user.role.toLowerCase()] || [];

  const activeItem = menuItems.find(
    item => item.path === location.pathname
  );

  return (
    <header className="navbar">
      <h2 className="navbar-title">{activeItem ? activeItem.label : 'Dashboard'}</h2>
      <div className="navbar-actions">
        <Bell color='#457AF6'/>
      </div>
    </header>
  );
};

export default Navbar;
