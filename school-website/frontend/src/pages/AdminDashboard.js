/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useAuth, API } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ totalStudents: 0, totalTeachers: 0, pendingAdmissions: 0, todayPresent: 0 });
  const [users, setUsers] = useState([]);
  const [admissions, setAdmissions] = useState([]);
  const [notices, setNotices] = useState([]);
  const [search, setSearch] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [admissionFilter, setAdmissionFilter] = useState('');
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'student', phone: '' });
  const [newNotice, setNewNotice] = useState({ title: '', content: '', category: 'general', targetAudience: 'all' });

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = () => {
    API.get('/admin/dashboard').then(r => setStats(r.data)).catch(() => {});
    API.get('/admin/users').then(r => setUsers(r.data)).catch(() => {});
    API.get('/admissions').then(r => setAdmissions(r.data.rows || [])).catch(() => {});
    API.get('/notices').then(r => setNotices(r.data)).catch(() => {});
  };

  const createUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) return toast.error('Name, email and password required.');
    try {
      await API.post('/admin/users', newUser);
      toast.success('User created!');
      setShowAddUser(false);
      setNewUser({ name: '', email: '', password: '', role: 'student', phone: '' });
      API.get('/admin/users').then(r => setUsers(r.data)).catch(() => {});
      API.get('/admin/dashboard').then(r => setStats(r.data)).catch(() => {});
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create user.');
    }
  };

  const toggleUser = async (id) => {
    try {
      const res = await API.patch(`/admin/users/${id}/toggle`);
      setUsers(users.map(u => u.id === id ? { ...u, isActive: res.data.isActive } : u));
      toast.success(res.data.message);
    } catch { toast.error('Failed to update user.'); }
  };

  const updateAdmission = async (id, status) => {
    try {
      await API.put(`/admissions/${id}/status`, { status });
      setAdmissions(admissions.map(a => a.id === id ? { ...a, status } : a));
      toast.success(`Application ${status}!`);
    } catch { toast.error('Failed to update.'); }
  };

  const postNotice = async () => {
    try {
      const res = await API.post('/notices', newNotice);
      setNotices([res.data, ...notices]);
      setNewNotice({ title: '', content: '', category: 'general', targetAudience: 'all' });
      toast.success('Notice posted!');
    } catch { toast.error('Failed to post notice.'); }
  };

  const deleteNotice = async (id) => {
    if (!window.confirm('Delete this notice?')) return;
    try {
      await API.delete(`/notices/${id}`);
      setNotices(notices.filter(n => n.id !== id));
      toast.success('Notice deleted.');
    } catch { toast.error('Failed to delete.'); }
  };

  const filteredUsers = users.filter(u =>
    (!userFilter || u.role === userFilter) &&
    (!search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  );

  const filteredAdmissions = admissions.filter(a =>
    (!admissionFilter || a.status === admissionFilter)
  );

  const chartData = [
    { name: 'Students', count: stats.totalStudents },
    { name: 'Teachers', count: stats.totalTeachers },
    { name: 'Present', count: stats.todayPresent },
    { name: 'Pending', count: stats.pendingAdmissions }
  ];

  const navItems = [
    { id: 'overview', icon: '🏠', label: 'Dashboard' },
    { id: 'users', icon: '👥', label: 'Users' },
    { id: 'admissions', icon: '📋', label: 'Admissions' },
    { id: 'notices', icon: '📢', label: 'Notices' }
  ];

  return (
    <div className="dashboard">
      <div className="sidebar">
        <div className="sidebar-logo">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: 28 }}>🏛️</div>
            <div>
              <div style={{ color: 'var(--gold)', fontFamily: 'Playfair Display, serif', fontSize: 14, fontWeight: 700 }}>Greenfield</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>Admin Panel</div>
            </div>
          </div>
        </div>
        <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, var(--crimson), #e74c3c)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 18, fontWeight: 700 }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ color: 'white', fontSize: 13, fontWeight: 600 }}>{user?.name}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>Administrator</div>
            </div>
          </div>
        </div>
        <div className="sidebar-nav">
          <div className="sidebar-section-title">Management</div>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`sidebar-item ${activeTab === item.id ? 'active' : ''}`}>
              <span className="sidebar-item-icon">{item.icon}</span>{item.label}
            </button>
          ))}
          <div className="sidebar-section-title" style={{ marginTop: 16 }}>Account</div>
          <button onClick={logout} className="sidebar-item" style={{ color: '#e74c3c' }}>
            <span className="sidebar-item-icon">🚪</span> Logout
          </button>
        </div>
      </div>

      <div className="main-content">
        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <>
            <div className="page-header">
              <h1>Admin Dashboard ⚙️</h1>
              <p>Complete overview of Greenfield Academy management.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 28 }}>
              {[
                { icon: '📚', num: stats.totalStudents, label: 'Total Students', color: 'var(--teal)', bg: 'rgba(26,188,156,0.1)' },
                { icon: '👨‍🏫', num: stats.totalTeachers, label: 'Total Teachers', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
                { icon: '⏳', num: stats.pendingAdmissions, label: 'Pending Applications', color: 'var(--gold)', bg: 'rgba(232,184,75,0.1)' },
                { icon: '✅', num: stats.todayPresent, label: "Today's Attendance", color: 'var(--crimson)', bg: 'rgba(192,57,43,0.1)' }
              ].map((s, i) => (
                <div key={i} style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid var(--gray-200)', display: 'flex', gap: 16, alignItems: 'center', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>{s.icon}</div>
                  <div>
                    <div style={{ fontSize: 30, fontWeight: 800, color: s.color, fontFamily: 'Playfair Display, serif' }}>{s.num}</div>
                    <div style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 2 }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
              <div className="chart-container">
                <h3 style={{ marginBottom: 20 }}>School Overview Chart</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 13 }} />
                    <YAxis tick={{ fontSize: 13 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="var(--navy)" radius={[8,8,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-container">
                <h3 style={{ marginBottom: 16 }}>Quick Actions</h3>
                {[
                  { label: '➕ Add New User', action: () => { setActiveTab('users'); setShowAddUser(true); }, color: 'var(--teal)' },
                  { label: '📋 Review Applications', action: () => setActiveTab('admissions'), color: 'var(--gold)' },
                  { label: '📢 Post Notice', action: () => setActiveTab('notices'), color: '#8b5cf6' }
                ].map((a, i) => (
                  <button key={i} onClick={a.action} style={{ display: 'block', width: '100%', padding: '14px 20px', border: 'none', borderRadius: 10, background: 'var(--gray-50)', color: 'var(--navy)', fontWeight: 600, fontSize: 14, cursor: 'pointer', textAlign: 'left', marginBottom: 10, fontFamily: 'DM Sans, sans-serif', transition: 'all 0.2s', borderLeft: `4px solid ${a.color}` }}
                    onMouseEnter={e => e.target.style.background = 'var(--gray-100)'}
                    onMouseLeave={e => e.target.style.background = 'var(--gray-50)'}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Recent admissions preview */}
            <div style={{ background: 'white', borderRadius: 20, padding: 24, marginTop: 24, border: '1px solid var(--gray-200)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h3>Recent Admission Applications</h3>
                <button onClick={() => setActiveTab('admissions')} style={{ color: 'var(--gold)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>View All →</button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: 'var(--gray-50)' }}>
                  <tr>{['Applicant', 'Class', 'Date', 'Status', 'Action'].map(h => <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--gray-500)', letterSpacing: 1 }}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {admissions.slice(0, 5).map(a => (
                    <tr key={a.id} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: 14 }}>{a.applicantName}</td>
                      <td style={{ padding: '12px 16px', fontSize: 14, color: 'var(--gray-500)' }}>{a.applyingForClass}</td>
                      <td style={{ padding: '12px 16px', fontSize: 14, color: 'var(--gray-500)' }}>{new Date(a.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: '12px 16px' }}><span className={`badge badge-${a.status}`}>{a.status}</span></td>
                      <td style={{ padding: '12px 16px' }}>
                        {a.status === 'pending' && (
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button onClick={() => updateAdmission(a.id, 'approved')} className="btn-sm btn-success">✓</button>
                            <button onClick={() => updateAdmission(a.id, 'rejected')} className="btn-sm btn-danger">✗</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* USERS */}
        {activeTab === 'users' && (
          <>
            <div className="page-header">
              <h1>👥 User Management</h1>
              <p>Manage all students, teachers, and administrators.</p>
            </div>

            <div style={{ display: 'flex', gap: 16, marginBottom: 24, alignItems: 'center' }}>
              <div className="search-bar" style={{ flex: 1 }}>
                <span>🔍</span>
                <input placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <select value={userFilter} onChange={e => setUserFilter(e.target.value)} style={{ padding: '12px 16px', borderRadius: 10, border: '2px solid var(--gray-200)', fontSize: 14, fontFamily: 'DM Sans, sans-serif', background: 'white', minWidth: 140 }}>
                <option value="">All Roles</option>
                <option value="student">Students</option>
                <option value="teacher">Teachers</option>
                <option value="admin">Admins</option>
              </select>
              <button onClick={() => setShowAddUser(!showAddUser)} className="btn-primary">+ Add User</button>
            </div>

            {showAddUser && (
              <div style={{ background: 'white', borderRadius: 20, padding: 28, border: '1px solid var(--gray-200)', marginBottom: 24, boxShadow: 'var(--shadow-md)', animation: 'fadeInUp 0.3s ease' }}>
                <h3 style={{ marginBottom: 20 }}>Create New User</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} placeholder="Full name" />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input type="email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} placeholder="email@example.com" />
                  </div>
                  <div className="form-group">
                    <label>Password *</label>
                    <input type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} placeholder="Min 6 characters" />
                  </div>
                  <div className="form-group">
                    <label>Role *</label>
                    <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input value={newUser.phone} onChange={e => setNewUser({ ...newUser, phone: e.target.value })} placeholder="+880..." />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                  <button onClick={createUser} className="btn-primary">✓ Create User</button>
                  <button onClick={() => setShowAddUser(false)} className="btn-secondary">Cancel</button>
                </div>
              </div>
            )}

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>ID</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-500)' }}>No users found.</td></tr>
                  ) : (
                    filteredUsers.map(u => (
                      <tr key={u.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 34, height: 34, borderRadius: '50%', background: u.role === 'admin' ? 'linear-gradient(135deg, var(--crimson), #e74c3c)' : u.role === 'teacher' ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : 'linear-gradient(135deg, var(--teal), #16a085)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 13 }}>{u.name[0]}</div>
                            <span style={{ fontWeight: 600 }}>{u.name}</span>
                          </div>
                        </td>
                        <td style={{ color: 'var(--gray-500)', fontSize: 13 }}>{u.email}</td>
                        <td>
                          <span style={{ background: u.role === 'admin' ? 'rgba(192,57,43,0.1)' : u.role === 'teacher' ? 'rgba(59,130,246,0.1)' : 'rgba(26,188,156,0.1)', color: u.role === 'admin' ? 'var(--crimson)' : u.role === 'teacher' ? '#1d4ed8' : 'var(--teal)', padding: '4px 12px', borderRadius: 100, fontSize: 12, fontWeight: 700, textTransform: 'capitalize' }}>{u.role}</span>
                        </td>
                        <td style={{ color: 'var(--gray-500)', fontSize: 13 }}>{u.Student?.studentId || u.Teacher?.teacherId || '—'}</td>
                        <td>
                          <span style={{ width: 8, height: 8, borderRadius: '50%', background: u.isActive ? 'var(--teal)' : 'var(--gray-500)', display: 'inline-block', marginRight: 6 }} />
                          {u.isActive ? 'Active' : 'Inactive'}
                        </td>
                        <td>
                          <button onClick={() => toggleUser(u.id)} className={`btn-sm ${u.isActive ? 'btn-warning' : 'btn-success'}`}>
                            {u.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ADMISSIONS */}
        {activeTab === 'admissions' && (
          <>
            <div className="page-header">
              <h1>📋 Admission Applications</h1>
              <p>Review and manage student admission applications.</p>
            </div>

            <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
              {['', 'pending', 'approved', 'rejected'].map(f => (
                <button key={f} onClick={() => setAdmissionFilter(f)}
                  style={{ padding: '8px 20px', borderRadius: 8, border: '2px solid', borderColor: admissionFilter === f ? 'var(--gold)' : 'var(--gray-200)', background: admissionFilter === f ? 'rgba(232,184,75,0.1)' : 'white', color: admissionFilter === f ? 'var(--gold)' : 'var(--gray-500)', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                  {f ? f.charAt(0).toUpperCase() + f.slice(1) : 'All'} ({f ? admissions.filter(a => a.status === f).length : admissions.length})
                </button>
              ))}
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Applicant</th>
                    <th>Contact</th>
                    <th>Class Applied</th>
                    <th>Parent</th>
                    <th>Applied On</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdmissions.length === 0 ? (
                    <tr><td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-500)' }}>No applications found.</td></tr>
                  ) : (
                    filteredAdmissions.map((a, i) => (
                      <tr key={a.id}>
                        <td style={{ color: 'var(--gray-500)', fontSize: 13 }}>GA-{String(a.id).padStart(5,'0')}</td>
                        <td>
                          <div style={{ fontWeight: 600, fontSize: 14 }}>{a.applicantName}</div>
                          <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{a.gender} • {a.dateOfBirth}</div>
                        </td>
                        <td>
                          <div style={{ fontSize: 13 }}>{a.email}</div>
                          <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{a.phone}</div>
                        </td>
                        <td style={{ fontSize: 14, fontWeight: 600 }}>{a.applyingForClass}</td>
                        <td>
                          <div style={{ fontSize: 13 }}>{a.parentName}</div>
                          <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{a.parentPhone}</div>
                        </td>
                        <td style={{ fontSize: 13, color: 'var(--gray-500)' }}>{new Date(a.createdAt).toLocaleDateString()}</td>
                        <td><span className={`badge badge-${a.status}`}>{a.status}</span></td>
                        <td>
                          {a.status === 'pending' ? (
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button onClick={() => updateAdmission(a.id, 'approved')} className="btn-sm btn-success">✓ Approve</button>
                              <button onClick={() => updateAdmission(a.id, 'rejected')} className="btn-sm btn-danger">✗ Reject</button>
                            </div>
                          ) : (
                            <span style={{ fontSize: 13, color: 'var(--gray-500)', fontStyle: 'italic' }}>Processed</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* NOTICES */}
        {activeTab === 'notices' && (
          <>
            <div className="page-header">
              <h1>📢 Notice Management</h1>
              <p>Post and manage school announcements.</p>
            </div>

            <div style={{ background: 'white', borderRadius: 20, padding: 28, border: '1px solid var(--gray-200)', marginBottom: 28 }}>
              <h3 style={{ marginBottom: 20 }}>Post New Notice</h3>
              <div className="form-grid">
                <div className="form-group full">
                  <label>Title *</label>
                  <input value={newNotice.title} onChange={e => setNewNotice({ ...newNotice, title: e.target.value })} placeholder="Notice title" />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select value={newNotice.category} onChange={e => setNewNotice({ ...newNotice, category: e.target.value })}>
                    {['general','exam','holiday','event','urgent'].map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Target Audience</label>
                  <select value={newNotice.targetAudience} onChange={e => setNewNotice({ ...newNotice, targetAudience: e.target.value })}>
                    {['all','students','teachers','parents'].map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </select>
                </div>
                <div className="form-group full">
                  <label>Content *</label>
                  <textarea value={newNotice.content} onChange={e => setNewNotice({ ...newNotice, content: e.target.value })} placeholder="Notice content..." style={{ minHeight: 100 }} />
                </div>
              </div>
              <button onClick={postNotice} className="btn-primary" style={{ marginTop: 16 }}>📢 Post Notice</button>
            </div>

            <h3 style={{ marginBottom: 16 }}>All Notices ({notices.length})</h3>
            <div style={{ display: 'grid', gap: 14 }}>
              {notices.map(n => (
                <div key={n.id} className={`notice-card ${n.category}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div className="notice-category">{n.category?.toUpperCase()} • {n.targetAudience}</div>
                    <h3 className="notice-title">{n.title}</h3>
                    <p className="notice-content">{n.content}</p>
                    <p className="notice-date">📅 {new Date(n.createdAt).toLocaleDateString()}</p>
                  </div>
                  <button onClick={() => deleteNotice(n.id)} className="btn-sm btn-danger" style={{ marginLeft: 16, flexShrink: 0 }}>🗑️</button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
