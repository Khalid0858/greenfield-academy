/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useAuth, API } from '../context/AuthContext';
import toast from 'react-hot-toast';

const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [todaySummary, setTodaySummary] = useState({ total: 0, present: 0, absent: 0, late: 0 });
  const [students, setStudents] = useState([]);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [className, setClassName] = useState('Class 10');
  const [subject, setSubject] = useState('Mathematics');
  const [attMap, setAttMap] = useState({});
  const [notices, setNotices] = useState([]);
  const [newNotice, setNewNotice] = useState({ title: '', content: '', category: 'general' });
  const [results, setResults] = useState([]); // eslint-disable-line no-unused-vars // eslint-disable-line no-unused-vars
  const [newResult, setNewResult] = useState({ studentId: '', examName: '', subject: '', totalMarks: 100, obtainedMarks: '', examDate: '' });
  const [savingAtt, setSavingAtt] = useState(false);

  useEffect(() => {
    API.get('/attendance/today-summary').then(res => setTodaySummary(res.data)).catch(() => {});
    API.get('/admin/users?role=student').then(res => {
      setStudents(res.data);
      const map = {};
      res.data.forEach(u => { if (u.Student) map[u.Student.id] = 'present'; });
      setAttMap(map);
    }).catch(() => {});
    API.get('/notices').then(res => setNotices(res.data)).catch(() => {});
    API.get('/results?limit=20').then(res => setResults(res.data)).catch(() => {});
  }, []);

  const setStatus = (studentId, status) => {
    setAttMap(prev => ({ ...prev, [studentId]: status }));
  };

  const saveAttendance = async () => {
    setSavingAtt(true);
    try {
      const records = Object.entries(attMap).map(([sId, status]) => ({ studentId: parseInt(sId), status }));
      await API.post('/attendance/mark', { records, date: attendanceDate, className, subject });
      toast.success('Attendance saved successfully!');
      API.get('/attendance/today-summary').then(res => setTodaySummary(res.data)).catch(() => {});
    } catch (err) {
      toast.error('Failed to save attendance.');
    } finally {
      setSavingAtt(false);
    }
  };

  const postNotice = async () => {
    if (!newNotice.title || !newNotice.content) return toast.error('Title and content are required.');
    try {
      const res = await API.post('/notices', newNotice);
      setNotices([res.data, ...notices]);
      setNewNotice({ title: '', content: '', category: 'general' });
      toast.success('Notice posted!');
    } catch {
      toast.error('Failed to post notice.');
    }
  };

  const addResult = async () => {
    if (!newResult.studentId || !newResult.examName || !newResult.obtainedMarks) return toast.error('Please fill required fields.');
    try {
      await API.post('/results', newResult);
      toast.success('Result added!');
      setNewResult({ studentId: '', examName: '', subject: '', totalMarks: 100, obtainedMarks: '', examDate: '' });
    } catch {
      toast.error('Failed to add result.');
    }
  };

  const navItems = [
    { id: 'overview', icon: '🏠', label: 'Overview' },
    { id: 'attendance', icon: '✅', label: 'Take Attendance' },
    { id: 'results', icon: '📝', label: 'Upload Results' },
    { id: 'notices', icon: '📢', label: 'Post Notices' }
  ];

  const statusColors = { present: 'var(--teal)', absent: 'var(--crimson)', late: 'var(--gold)', excused: '#8b5cf6' };

  return (
    <div className="dashboard">
      <div className="sidebar">
        <div className="sidebar-logo">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: 28 }}>🏛️</div>
            <div>
              <div style={{ color: 'var(--gold)', fontFamily: 'Playfair Display, serif', fontSize: 14, fontWeight: 700 }}>Greenfield</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>Teacher Portal</div>
            </div>
          </div>
        </div>
        <div style={{ padding: '16px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: 'white', fontWeight: 700 }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ color: 'white', fontSize: 13, fontWeight: 600 }}>{user?.name}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>{user?.profile?.subject || 'Teacher'}</div>
            </div>
          </div>
        </div>
        <div className="sidebar-nav">
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
        {activeTab === 'overview' && (
          <>
            <div className="page-header">
              <h1>Good day, {user?.name?.split(' ')[0]}! 👨‍🏫</h1>
              <p>Here's your classroom summary for today.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 28 }}>
              {[
                { icon: '👥', num: todaySummary.total, label: 'Total Students', color: 'var(--navy)' },
                { icon: '✅', num: todaySummary.present, label: "Today's Present", color: 'var(--teal)' },
                { icon: '❌', num: todaySummary.absent, label: "Today's Absent", color: 'var(--crimson)' },
                { icon: '⏰', num: todaySummary.late, label: 'Late Arrivals', color: 'var(--gold)' }
              ].map((s, i) => (
                <div key={i} className="stat-card">
                  <div className="stat-card-icon">{s.icon}</div>
                  <div>
                    <div className="stat-num" style={{ color: s.color }}>{s.num}</div>
                    <div className="stat-label">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: 'white', borderRadius: 20, padding: 28, border: '1px solid var(--gray-200)', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ marginBottom: 20 }}>Today's Attendance Breakdown</h3>
              {todaySummary.total > 0 ? (
                <div style={{ display: 'flex', gap: 16 }}>
                  {[
                    { label: 'Present', val: todaySummary.present, total: todaySummary.total, color: 'teal' },
                    { label: 'Absent', val: todaySummary.absent, total: todaySummary.total, color: 'crimson' },
                    { label: 'Late', val: todaySummary.late, total: todaySummary.total, color: 'gold' }
                  ].map(b => (
                    <div key={b.label} style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 13, color: 'var(--gray-500)' }}>{b.label}</span>
                        <span style={{ fontWeight: 700, fontSize: 13 }}>{b.val}/{b.total}</span>
                      </div>
                      <div className="progress-bar">
                        <div className={`progress-fill ${b.color}`} style={{ width: `${b.total ? Math.round((b.val / b.total) * 100) : 0}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--gray-500)' }}>No attendance marked yet today. <button onClick={() => setActiveTab('attendance')} style={{ color: 'var(--gold)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>Mark attendance →</button></p>
              )}
            </div>
          </>
        )}

        {activeTab === 'attendance' && (
          <>
            <div className="page-header">
              <h1>✅ Take Attendance</h1>
              <p>Mark student attendance for your class.</p>
            </div>

            <div style={{ background: 'white', borderRadius: 20, padding: 24, marginBottom: 24, border: '1px solid var(--gray-200)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              <div className="form-group">
                <label>Date</label>
                <input type="date" value={attendanceDate} onChange={e => setAttendanceDate(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Class</label>
                <select value={className} onChange={e => setClassName(e.target.value)}>
                  {['Class 6','Class 7','Class 8','Class 9','Class 10','Class 11','Class 12'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Subject</label>
                <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject name" />
              </div>
            </div>

            <div style={{ background: 'white', borderRadius: 20, overflow: 'hidden', border: '1px solid var(--gray-200)', marginBottom: 24 }}>
              <div style={{ background: 'var(--navy)', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ color: 'white', fontFamily: 'DM Sans, sans-serif' }}>Student List — {className}</h3>
                <div style={{ display: 'flex', gap: 8 }}>
                  {Object.keys(statusColors).map(s => (
                    <span key={s} style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: statusColors[s], display: 'inline-block' }} />{s}
                    </span>
                  ))}
                </div>
              </div>

              {students.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--gray-500)' }}>
                  No students found. Add students from the admin panel.
                </div>
              ) : (
                <div className="student-attendance-grid">
                  {students.filter(u => u.Student).map(u => {
                    const sid = u.Student.id;
                    const status = attMap[sid] || 'present';
                    const statuses = ['present', 'absent', 'late', 'excused'];
                    const nextStatus = statuses[(statuses.indexOf(status) + 1) % statuses.length];
                    return (
                      <div
                        key={sid}
                        className={`student-att-card ${status}`}
                        onClick={() => setStatus(sid, nextStatus)}
                        title="Click to cycle status"
                        style={{ borderColor: statusColors[status] }}
                      >
                        <div style={{ fontSize: 28 }}>
                          {status === 'present' ? '✅' : status === 'absent' ? '❌' : status === 'late' ? '⏰' : '📋'}
                        </div>
                        <div className="student-att-name">{u.name.split(' ')[0]}</div>
                        <div style={{ fontSize: 10, color: statusColors[status], fontWeight: 700, marginTop: 2, textTransform: 'uppercase' }}>{status}</div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div style={{ padding: '16px 24px', borderTop: '1px solid var(--gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 14, color: 'var(--gray-500)' }}>
                  Click each student card to toggle status. Saves all at once.
                </div>
                <button onClick={saveAttendance} disabled={savingAtt} className="btn-primary">
                  {savingAtt ? 'Saving...' : '💾 Save Attendance'}
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'results' && (
          <>
            <div className="page-header">
              <h1>📝 Upload Exam Results</h1>
              <p>Add exam scores for your students.</p>
            </div>

            <div style={{ background: 'white', borderRadius: 20, padding: 28, border: '1px solid var(--gray-200)', marginBottom: 24 }}>
              <h3 style={{ marginBottom: 20 }}>Add New Result</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Student *</label>
                  <select value={newResult.studentId} onChange={e => setNewResult({ ...newResult, studentId: e.target.value })}>
                    <option value="">Select student</option>
                    {students.filter(u => u.Student).map(u => <option key={u.Student.id} value={u.Student.id}>{u.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Exam Name *</label>
                  <select value={newResult.examName} onChange={e => setNewResult({ ...newResult, examName: e.target.value })}>
                    <option value="">Select exam</option>
                    {['Mid-Term Exam','Final Exam','Unit Test 1','Unit Test 2','Class Test','Mock Exam'].map(e => <option key={e}>{e}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Subject *</label>
                  <input value={newResult.subject} onChange={e => setNewResult({ ...newResult, subject: e.target.value })} placeholder="e.g. Mathematics" />
                </div>
                <div className="form-group">
                  <label>Exam Date</label>
                  <input type="date" value={newResult.examDate} onChange={e => setNewResult({ ...newResult, examDate: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Total Marks</label>
                  <input type="number" value={newResult.totalMarks} onChange={e => setNewResult({ ...newResult, totalMarks: parseInt(e.target.value) })} />
                </div>
                <div className="form-group">
                  <label>Obtained Marks *</label>
                  <input type="number" value={newResult.obtainedMarks} onChange={e => setNewResult({ ...newResult, obtainedMarks: parseInt(e.target.value) })} placeholder="0" />
                </div>
              </div>
              <button onClick={addResult} className="btn-primary" style={{ marginTop: 20 }}>+ Add Result</button>
            </div>
          </>
        )}

        {activeTab === 'notices' && (
          <>
            <div className="page-header">
              <h1>📢 Post Notices</h1>
              <p>Post announcements for students and parents.</p>
            </div>

            <div style={{ background: 'white', borderRadius: 20, padding: 28, border: '1px solid var(--gray-200)', marginBottom: 24 }}>
              <h3 style={{ marginBottom: 20 }}>New Notice</h3>
              <div className="form-group mb-16">
                <label>Title *</label>
                <input value={newNotice.title} onChange={e => setNewNotice({ ...newNotice, title: e.target.value })} placeholder="Notice title" />
              </div>
              <div className="form-group mb-16">
                <label>Category</label>
                <select value={newNotice.category} onChange={e => setNewNotice({ ...newNotice, category: e.target.value })}>
                  {['general','exam','holiday','event','urgent'].map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </div>
              <div className="form-group mb-24">
                <label>Content *</label>
                <textarea value={newNotice.content} onChange={e => setNewNotice({ ...newNotice, content: e.target.value })} placeholder="Write the notice content..." style={{ minHeight: 120 }} />
              </div>
              <button onClick={postNotice} className="btn-primary">📢 Post Notice</button>
            </div>

            <div>
              <h3 style={{ marginBottom: 16 }}>Recent Notices</h3>
              {notices.map(n => (
                <div key={n.id} className={`notice-card ${n.category}`} style={{ marginBottom: 12 }}>
                  <div className="notice-category">{n.category?.toUpperCase()}</div>
                  <h3 className="notice-title">{n.title}</h3>
                  <p className="notice-content">{n.content}</p>
                  <p className="notice-date">📅 {new Date(n.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
