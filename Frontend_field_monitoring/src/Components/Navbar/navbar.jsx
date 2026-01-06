import { Bell, ChevronDown, LogOut } from 'lucide-react';
import './navbar.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { SIDEBAR_CONFIG } from '../../constants/sidebar.js';
import { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../../Context/Auth/AuthContext.jsx';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const menuItems = SIDEBAR_CONFIG[user?.role?.toLowerCase()] || [];
  const activeItem = menuItems.find(item => item.path === location.pathname);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="navbar">
      <h2 className="navbar-title">
        {activeItem ? activeItem.label : 'Dashboard'}
      </h2>

      <div className="navbar-actions">
        <Bell color="#457AF6" />

        <div className="user-dropdown" ref={dropdownRef}>
          <button
            className="user-dropdown-trigger"
            onClick={() => setOpen(!open)}
          >
            <div className="user-avatar">
              {user?.email?.charAt(0).toUpperCase()}
            </div>

            <ChevronDown
              size={18}
              className={`chevron ${open ? 'rotate' : ''}`}
            />
          </button>

          {open && (
            <div className="user-dropdown-menu">
              <p className="dropdown-email">{user?.email}</p>

              <button className="dropdown-logout" onClick={handleLogout}>
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
