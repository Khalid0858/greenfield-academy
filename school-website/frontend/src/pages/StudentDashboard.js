/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useAuth, API } from '../context/AuthContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [attendance, setAttendance] = useState({ records: [], summary: { total: 0, present: 0, absent: 0, late: 0 } });
  const [results, setResults] = useState([]);
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    API.get('/attendance/my').then(res => setAttendance(res.data)).catch(() => {});
    API.get('/results/my').then(res => setResults(res.data)).catch(() => {});
    API.get('/notices').then(res => setNotices(res.data)).catch(() => {});
  }, []);

  const attData = [
    { name: 'Present', value: attendance.summary.present, color: '#1abc9c' },
    { name: 'Absent', value: attendance.summary.absent, color: '#c0392b' },
    { name: 'Late', value: attendance.summary.late, color: '#e8b84b' }
  ];

  const attendanceRate = attendance.summary.total > 0
    ? Math.round((attendance.summary.present / attendance.summary.total) * 100)
    : 0;

  const navItems = [
    { id: 'overview', icon: '🏠', label: 'Overview' },
    { id: 'attendance', icon: '📊', label: 'Attendance' },
    { id: 'results', icon: '📝', label: 'Exam Results' },
    { id: 'notices', icon: '📢', label: 'Notices' }
  ];

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-logo">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: 28 }}>🏛️</div>
            <div>
              <div style={{ color: 'var(--gold)', fontFamily: 'Playfair Display, serif', fontSize: 14, fontWeight: 700 }}>Greenfield</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>Student Portal</div>
            </div>
          </div>
        </div>

        <div style={{ padding: '16px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, var(--gold), var(--gold-light))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ color: 'white', fontSize: 13, fontWeight: 600 }}>{user?.name}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>{user?.profile?.className || 'Student'}</div>
            </div>
          </div>
        </div>

        <div className="sidebar-nav">
          <div className="sidebar-section-title">Navigation</div>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`sidebar-item ${activeTab === item.id ? 'active' : ''}`}>
              <span className="sidebar-item-icon">{item.icon}</span>
              {item.label}
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
        {activeTab === 'overview' && (
          <>
            <div className="page-header">
              <h1>Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
              <p>Here's your academic overview for today.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 28 }}>
              {[
                { icon: '📊', num: `${attendanceRate}%`, label: 'Attendance Rate', color: 'var(--teal)' },
                { icon: '📝', num: results.length, label: 'Exams Recorded', color: 'var(--gold)' },
                { icon: '🏆', num: results.length > 0 ? Math.max(...results.map(r => Math.round((r.obtainedMarks / r.totalMarks) * 100))) + '%' : '—', label: 'Best Score', color: '#8b5cf6' },
                { icon: '📢', num: notices.length, label: 'New Notices', color: 'var(--crimson)' }
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              {/* Attendance Chart */}
              <div className="chart-container">
                <h3 style={{ marginBottom: 20 }}>Attendance Summary</h3>
                {attendance.summary.total > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={attData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                        {attData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-500)' }}>No attendance data yet</div>
                )}
                <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 12 }}>
                  {attData.map(d => (
                    <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: d.color }} />
                      <span style={{ color: 'var(--gray-500)' }}>{d.name}: {d.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Notices */}
              <div className="chart-container">
                <h3 style={{ marginBottom: 20 }}>Recent Notices</h3>
                {notices.length === 0 ? (
                  <div style={{ color: 'var(--gray-500)', fontSize: 14 }}>No notices available.</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {notices.slice(0, 3).map(n => (
                      <div key={n.id} style={{ padding: '12px 16px', borderLeft: '3px solid var(--gold)', background: 'var(--gray-50)', borderRadius: '0 8px 8px 0' }}>
                        <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--navy)' }}>{n.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 4 }}>{n.category?.toUpperCase()} • {new Date(n.createdAt).toLocaleDateString()}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Profile card */}
            <div style={{ background: 'white', borderRadius: 20, padding: 28, marginTop: 24, border: '1px solid var(--gray-200)', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ marginBottom: 20 }}>My Profile</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
                {[
                  ['Student ID', user?.profile?.studentId || '—'],
                  ['Class', user?.profile?.className || '—'],
                  ['Section', user?.profile?.section || '—'],
                  ['Blood Group', user?.profile?.bloodGroup || '—'],
                  ['Email', user?.email],
                  ['Phone', user?.phone || '—'],
                  ['Admission Date', user?.profile?.admissionDate ? new Date(user?.profile?.admissionDate).toLocaleDateString() : '—'],
                  ['Parent Name', user?.profile?.parentName || '—']
                ].map(([label, val]) => (
                  <div key={label}>
                    <div style={{ fontSize: 12, color: 'var(--gray-500)', fontWeight: 600, marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 14, color: 'var(--navy)', fontWeight: 500 }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'attendance' && (
          <>
            <div className="page-header">
              <h1>📊 My Attendance</h1>
              <p>Track your attendance records and statistics.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 28 }}>
              {[
                { label: 'Total Days', val: attendance.summary.total, color: 'var(--navy)' },
                { label: 'Present', val: attendance.summary.present, color: 'var(--teal)' },
                { label: 'Absent', val: attendance.summary.absent, color: 'var(--crimson)' },
                { label: 'Late', val: attendance.summary.late, color: 'var(--gold)' }
              ].map((s, i) => (
                <div key={i} className="stat-card">
                  <div>
                    <div className="stat-num" style={{ color: s.color }}>{s.val}</div>
                    <div className="stat-label">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: 'white', borderRadius: 20, padding: 24, marginBottom: 24, border: '1px solid var(--gray-200)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontWeight: 600, color: 'var(--navy)' }}>Overall Attendance Rate</span>
                <span style={{ fontWeight: 700, color: attendanceRate >= 75 ? 'var(--teal)' : 'var(--crimson)' }}>{attendanceRate}%</span>
              </div>
              <div className="progress-bar">
                <div className={`progress-fill ${attendanceRate >= 75 ? 'teal' : 'crimson'}`} style={{ width: `${attendanceRate}%` }} />
              </div>
              {attendanceRate < 75 && (
                <p style={{ color: 'var(--crimson)', fontSize: 13, marginTop: 8 }}>⚠️ Your attendance is below the required 75%. Please attend regularly.</p>
              )}
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Subject</th>
                    <th>Status</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.records.length === 0 ? (
                    <tr><td colSpan="4" style={{ textAlign: 'center', color: 'var(--gray-500)', padding: '40px 20px' }}>No attendance records found.</td></tr>
                  ) : (
                    attendance.records.map(r => (
                      <tr key={r.id}>
                        <td>{new Date(r.date).toLocaleDateString()}</td>
                        <td>{r.subject || '—'}</td>
                        <td><span className={`badge badge-${r.status}`}>{r.status}</span></td>
                        <td style={{ color: 'var(--gray-500)' }}>{r.remarks || '—'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === 'results' && (
          <>
            <div className="page-header">
              <h1>📝 Exam Results</h1>
              <p>View all your examination results and grades.</p>
            </div>

            {results.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--gray-500)' }}>
                <div style={{ fontSize: 60 }}>📊</div>
                <h3 style={{ marginTop: 16, color: 'var(--navy)' }}>No Results Yet</h3>
                <p>Your exam results will appear here once published by your teachers.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                {results.map(r => {
                  const pct = Math.round((r.obtainedMarks / r.totalMarks) * 100);
                  const grade = r.grade || (pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : pct >= 50 ? 'D' : 'F');
                  return (
                    <div key={r.id} className="result-card">
                      <div className="result-header">
                        <h3>{r.subject}</h3>
                        <p>{r.examName} • {r.examDate ? new Date(r.examDate).toLocaleDateString() : ''}</p>
                      </div>
                      <div className="result-body">
                        <div className="result-score">
                          <div>
                            <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--navy)' }}>{r.obtainedMarks}/{r.totalMarks}</div>
                            <div style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 4 }}>{pct}% score</div>
                          </div>
                          <div className={`result-grade grade-${grade[0]}`}>{grade}</div>
                        </div>
                        <div className="progress-bar">
                          <div className={`progress-fill ${pct >= 70 ? 'teal' : pct >= 50 ? 'gold' : 'crimson'}`} style={{ width: `${pct}%` }} />
                        </div>
                        {r.remarks && <p style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 10 }}>{r.remarks}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {activeTab === 'notices' && (
          <>
            <div className="page-header">
              <h1>📢 Notices & Announcements</h1>
              <p>Stay updated with school news and important announcements.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {notices.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--gray-500)', padding: '40px 0' }}>No notices at the moment.</div>
              ) : (
                notices.map(n => (
                  <div key={n.id} className={`notice-card ${n.category}`}>
                    <div className="notice-category">{n.category?.toUpperCase()}</div>
                    <h3 className="notice-title">{n.title}</h3>
                    <p className="notice-content">{n.content}</p>
                    <p className="notice-date">📅 {new Date(n.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
