import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [tab, setTab] = useState('student');
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const roleDefaults = {
    admin: { email: 'admin@school.com', password: 'admin123' },
    teacher: { email: 'teacher@school.com', password: 'teacher123' },
    student: { email: 'student@school.com', password: 'student123' }
  };

  const handleTabChange = (role) => {
    setTab(role);
    setForm({ email: '', password: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(`/${user.role}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const roleIcons = { student: '📚', teacher: '👨‍🏫', admin: '⚙️' };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div style={{ fontSize: 48, marginBottom: 8 }}>🏛️</div>
          <h1>Greenfield Academy</h1>
          <p>Sign in to your portal</p>
        </div>

        <div className="login-tab">
          {['student', 'teacher', 'admin'].map(role => (
            <button key={role} onClick={() => handleTabChange(role)} className={`login-tab-btn ${tab === role ? 'active' : ''}`}>
              {roleIcons[role]} {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-16">
            <label>Email Address</label>
            <input
              type="email"
              placeholder={`Enter your ${tab} email`}
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group mb-24">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px 24px', fontSize: 16 }}>
            {loading ? 'Signing in...' : `Sign in as ${tab.charAt(0).toUpperCase() + tab.slice(1)} →`}
          </button>
        </form>

        <div style={{ marginTop: 20, padding: 16, background: 'var(--gray-50)', borderRadius: 10, fontSize: 13, color: 'var(--gray-500)' }}>
          <strong style={{ color: 'var(--navy)' }}>Demo credentials for {tab}:</strong><br />
          Email: <code style={{ background: 'white', padding: '2px 6px', borderRadius: 4 }}>{roleDefaults[tab].email}</code><br />
          Password: <code style={{ background: 'white', padding: '2px 6px', borderRadius: 4 }}>{roleDefaults[tab].password}</code>
        </div>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <p style={{ color: 'var(--gray-500)', fontSize: 14 }}>
            New student? <Link to="/admission" style={{ color: 'var(--gold)', fontWeight: 700 }}>Apply for Admission →</Link>
          </p>
        </div>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Link to="/" style={{ color: 'var(--gray-500)', fontSize: 13 }}>← Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
