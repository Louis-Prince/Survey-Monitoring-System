import { NavLink } from 'react-router-dom';
import Logo from '../../assets/logo.png';
import SmallLogo from '../../assets/smallLogo.png';
import Profile from '../../assets/profile.png';
import './sidebar.css';
import { SIDEBAR_CONFIG } from '../../constants/sidebar.js';

const Sidebar = () => {
  const user = { role: 'ADMIN' };
  const menuItems = SIDEBAR_CONFIG[user.role.toLowerCase()] || [];

  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img src={Logo} alt="NISR Logo" className="logo-img logo-full"/>
            <img src={SmallLogo} alt="NISR Icon" className="logo-img logo-icon"/>
          </div>
        </div>

        <nav>
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <NavLink key={index} to={item.path} end={item.path === '/dashboard'} className={({ isActive }) =>`sidebar-link ${isActive ? 'active' : ''}`}> 
                <Icon size={20} />
                <span className="link-text">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="footer-profile">
          <img src={Profile} alt="User profile" />
        </div>
      
        <div className="footer-user-info">
          <p className="user-role">{user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()} User </p>
          <p className="user-name">John Doe</p>
        </div>
      </div>

    </aside>
  );
};

export default Sidebar;
