import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const displayName = user
    ? user.orgName || (user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.email?.split('@')[0])
    : '';

  const getInitials = () => {
    if (!user) return '?';
    if (user.orgName) return user.orgName.charAt(0).toUpperCase();
    if (user.firstName) return user.firstName.charAt(0).toUpperCase();
    return user.email ? user.email.charAt(0).toUpperCase() : 'U';
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header>
      <div className="navbar-container">
        <Link to={isAuthenticated ? (role === 'organization' ? '/organization-home' : role === 'volunteer' ? '/volunteer-home' : role === 'donor' ? '/donor-home' : '/admin-home') : '/'} className="brand-wrapper">
          <div className="brand-icon">🌱</div>
          <div className="brand-title-group">
            <h1>ZeroHunger</h1>
            <div className="brand-tagline">Food Aid Network • SDG 2</div>
          </div>
        </Link>

        <nav>
          <ul className="nav-links">
            {isAuthenticated ? (
              <>
                {role === 'organization' && (
                  <>
                    <li>
                      <Link to="/organization-home" className={`nav-link ${isActive('/organization-home') ? 'active' : ''}`}>
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link to="/foodaidrequest" className={`nav-link ${isActive('/foodaidrequest') ? 'active' : ''}`}>
                        Request Food Aid
                      </Link>
                    </li>
                    <li>
                      <Link to="/organization-mgmt" className={`nav-link ${isActive('/organization-mgmt') ? 'active' : ''}`}>
                        Manage Requests
                      </Link>
                    </li>
                  </>
                )}

                {role === 'volunteer' && (
                  <>
                    <li>
                      <Link to="/volunteer-home" className={`nav-link ${isActive('/volunteer-home') ? 'active' : ''}`}>
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link to="/volunteer-delivery-accept" className={`nav-link ${isActive('/volunteer-delivery-accept') ? 'active' : ''}`}>
                        Available Deliveries
                      </Link>
                    </li>
                    <li>
                      <Link to="/volunteer-mgmt" className={`nav-link ${isActive('/volunteer-mgmt') ? 'active' : ''}`}>
                        My Deliveries
                      </Link>
                    </li>
                  </>
                )}

                {role === 'donor' && (
                  <>
                    <li>
                      <Link to="/donor-home" className={`nav-link ${isActive('/donor-home') ? 'active' : ''}`}>
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link to="/donor-accept-request" className={`nav-link ${isActive('/donor-accept-request') ? 'active' : ''}`}>
                        Aid Requests & Donate
                      </Link>
                    </li>
                  </>
                )}

                {role === 'admin' && (
                  <>
                    <li>
                      <Link to="/admin-home" className={`nav-link ${isActive('/admin-home') ? 'active' : ''}`}>
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link to="/admin-accept" className={`nav-link ${isActive('/admin-accept') ? 'active' : ''}`}>
                        Pending Approvals
                      </Link>
                    </li>
                    <li>
                      <Link to="/admin-mgmt" className={`nav-link ${isActive('/admin-mgmt') ? 'active' : ''}`}>
                        Admin Management
                      </Link>
                    </li>
                  </>
                )}
              </>
            ) : (
              <>
                <li>
                  <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
                    Home
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        <div className="nav-auth-group">
          {isAuthenticated ? (
            <>
              <div className="user-chip">
                <div className="user-avatar">{getInitials()}</div>
                <span className="user-name">{displayName}</span>
                <span className={`role-badge ${role}`}>{role}</span>
              </div>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Login
              </Link>
              <Link to="/signup" className="btn btn-primary btn-sm">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;