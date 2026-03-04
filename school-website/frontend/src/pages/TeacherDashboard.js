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
  const [newResult, setNewResult] = useState({ studentId: '', examName: '', subject: '', totalMarks: 100, obtainedMarks: '', examDate: '' });
  const [savingAtt, setSavingAtt] = useState(false);

  // ✅ Fix useEffect: add closing parentheses and dependency array
  useEffect(() => {
    API.get('/attendance/today-summary').then(res => setTodaySummary(res.data)).catch(() => {});
    API.get('/admin/users?role=student').then(res => {
      setStudents(res.data);
      const map = {};
      res.data.forEach(u => { if (u.Student) map[u.Student.id] = 'present'; });
      setAttMap(map);
    }).catch(() => {});
    API.get('/notices').then(res => setNotices(res.data)).catch(() => {});
  }, []); // <-- This empty array was missing

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
      {/* Sidebar */}
      <div className="sidebar">
        {/* Logo and user info */}
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

      {/* Main content */}
      <div className="main-content">
        {/* Overview tab */}
        {activeTab === 'overview' && (
          <>
            {/* Your overview JSX here */}
          </>
        )}

        {/* Attendance tab */}
        {activeTab === 'attendance' && (
          <>
            {/* Your attendance JSX here */}
          </>
        )}

        {/* Results tab */}
        {activeTab === 'results' && (
          <>
            {/* Your results JSX here */}
          </>
        )}

        {/* Notices tab */}
        {activeTab === 'notices' && (
          <>
            {/* Your notices JSX here */}
          </>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;