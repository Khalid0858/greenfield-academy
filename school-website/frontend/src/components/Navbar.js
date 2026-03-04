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

  // Smooth scroll function for page sections
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

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

          {/* Replacing hash links with buttons for smooth scrolling */}
          <button type="button" className="nav-link" onClick={() => scrollToSection('about')}>About</button>
          <button type="button" className="nav-link" onClick={() => scrollToSection('academics')}>Academics</button>
          <button type="button" className="nav-link" onClick={() => scrollToSection('contact')}>Contact</button>

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