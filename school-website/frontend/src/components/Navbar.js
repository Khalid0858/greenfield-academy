/* eslint-disable */
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="logo">
          <div className="logo-icon">🏛️</div>
          <div className="logo-text">
            <h2>Greenfield Academy</h2>
            <p>Excellence in Education</p>
          </div>
        </Link>

        <div className="nav-links">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
          <Link to="/#about" className="nav-link">About</Link>
          <Link to="/#academics" className="nav-link">Academics</Link>
          <Link to="/#contact" className="nav-link">Contact</Link>

          {!user ? (
            <>
              <Link to="/admission" className="nav-link" style={{ color: 'var(--gold)' }}>Apply Now</Link>
              <Link to="/login" className="btn-primary" style={{ marginLeft: 8 }}>Login Portal</Link>
            </>
          ) : (
            <>
              <Link to={`/${user.role}`} className="nav-link" style={{ color: 'var(--gold)' }}>
                {user.role === 'student' ? '📚' : user.role === 'teacher' ? '👨‍🏫' : '⚙️'} Dashboard
              </Link>
              <button onClick={handleLogout} className="btn-secondary" style={{ marginLeft: 8 }}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
