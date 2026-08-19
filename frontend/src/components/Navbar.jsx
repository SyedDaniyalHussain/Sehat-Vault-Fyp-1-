import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🛡️</span>
          <span className="brand-text">Sehat Vault</span>
        </Link>
        
        <div className="navbar-links">
          {user ? (
            <>
              <Link to="/dashboard" className={`nav-item ${isActive('/dashboard')}`}>
                Dashboard
              </Link>
              <Link to="/upload" className={`nav-item ${isActive('/upload')}`}>
                Upload Report
              </Link>
              <Link to="/history" className={`nav-item ${isActive('/history')}`}>
                Medical History
              </Link>
              <Link to="/sharing" className={`nav-item ${isActive('/sharing')}`}>
                Share Reports
              </Link>
              <div className="navbar-user-section">
                <span className="navbar-user-welcome">
                  Hi, {user.name}
                </span>
                <button onClick={handleLogout} className="btn-logout">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              {location.pathname !== '/login' && (
                <Link to="/login" className="nav-item">
                  Login
                </Link>
              )}
              {location.pathname !== '/register' && (
                <Link to="/register" className="btn-register-nav">
                  Register
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
