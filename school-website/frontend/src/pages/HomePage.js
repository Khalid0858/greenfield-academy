/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const defaultNotices = [
  'Welcome to Greenfield Academy — Applications open for 2025-26',
  'Annual Sports Day on December 15th — All students must participate',
  'Mid-term examinations scheduled from November 20-30',
  'School closes for Winter Vacation from Dec 25 to Jan 5',
  'Parent-Teacher Meeting: November 30th at 10:00 AM'
];

const NoticeTicker = () => {
  const doubled = [...defaultNotices, ...defaultNotices];
  return (
    <div className="notice-ticker">
      <div className="ticker-inner">
        {doubled.map((n, i) => (
          <span key={i} className="ticker-item">⭐ {n}</span>
        ))}
      </div>
    </div>
  );
};

const HomePage = () => {
  const [counters, setCounters] = useState({ students: 0, teachers: 0, years: 0, rate: 0 });

  useEffect(() => {
    const targets = { students: 1200, teachers: 80, years: 35, rate: 98 };
    const steps = 60;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setCounters({
        students: Math.floor(targets.students * progress),
        teachers: Math.floor(targets.teachers * progress),
        years: Math.floor(targets.years * progress),
        rate: Math.floor(targets.rate * progress)
      });
      if (step >= steps) clearInterval(timer);
    }, 2000 / steps);
    return () => clearInterval(timer);
  }, []);

  const programs = [
    { icon: '🔬', title: 'Science & Technology', desc: 'State-of-the-art labs with cutting-edge equipment for biology, chemistry, and physics.' },
    { icon: '📐', title: 'Mathematics', desc: 'Advanced curriculum with competitive olympiad training and real-world problem solving.' },
    { icon: '🌍', title: 'Humanities & Arts', desc: 'Rich exploration of history, languages, literature, and visual arts.' },
    { icon: '💻', title: 'Computer Science', desc: 'Coding, AI fundamentals, and digital literacy programs for the future.' },
    { icon: '⚽', title: 'Sports & Athletics', desc: 'Professional coaching in 12+ sports with championship-winning teams.' },
    { icon: '🎵', title: 'Music & Performing Arts', desc: 'Orchestra, drama club, and dance programs nurturing artistic expression.' }
  ];

  const notices = [
    { id: 1, title: 'Mid-Term Examination Schedule 2024', category: 'exam', content: 'Mid-term examinations will be held from November 20–30. All students must bring their admit cards.', date: '2024-11-01' },
    { id: 2, title: 'Annual Sports Day — December 15th', category: 'event', content: 'Our Annual Sports Day is scheduled for December 15th. Registration opens December 1st.', date: '2024-11-05' },
    { id: 3, title: 'Winter Vacation Notice', category: 'holiday', content: 'School will remain closed for Winter Vacation from December 25 to January 5, 2025.', date: '2024-11-08' },
    { id: 4, title: 'New Library Books Available', category: 'general', content: 'Over 500 new books have been added to the school library. Students are encouraged to explore.', date: '2024-11-10' }
  ];

  return (
    <div>
      <NoticeTicker />
      <Navbar />

      {/* HERO */}
      <section className="hero">
        <div className="hero-grid" />
        <div className="hero-content">
          <div>
            <div className="hero-badge">🏆 Ranked #1 in the District — 2024</div>
            <h1>Shaping Tomorrow's<br /><span>Leaders</span> Today</h1>
            <p className="hero-sub">
              Greenfield Academy offers world-class education with a perfect blend of academics,
              arts, and athletics — nurturing every student's unique potential since 1989.
            </p>
            <div className="hero-actions">
              <Link to="/admission" className="btn-primary" style={{ fontSize: 16, padding: '14px 32px' }}>Apply for Admission →</Link>
              <Link to="/login" className="btn-secondary" style={{ fontSize: 16, padding: '13px 30px' }}>Student Portal</Link>
            </div>
            <div className="hero-stats">
              <div className="hero-stat"><div className="hero-stat-num">{counters.students}+</div><div className="hero-stat-label">Students Enrolled</div></div>
              <div className="hero-stat"><div className="hero-stat-num">{counters.teachers}+</div><div className="hero-stat-label">Expert Teachers</div></div>
              <div className="hero-stat"><div className="hero-stat-num">{counters.rate}%</div><div className="hero-stat-label">Pass Rate</div></div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-cards">
              <div className="hero-card"><div className="hero-card-icon">🎓</div><h3>Admission Open 2025-26</h3><p>Applications for Classes 6–12 are now open. Apply before December 31st.</p></div>
              <div className="hero-card"><div className="hero-card-icon">📊</div><h3>Attendance Tracking</h3><p>Real-time digital attendance monitoring system.</p></div>
              <div className="hero-card"><div className="hero-card-icon">📝</div><h3>Online Results</h3><p>Instant access to exam results and performance analytics.</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="section" id="about">
        <div className="section-inner">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
            <div>
              <div className="section-tag">About Us</div>
              <h2 className="section-title">35 Years of Academic Excellence</h2>
              <p style={{ color: 'var(--gray-500)', lineHeight: 1.8, fontSize: 15, marginBottom: 32 }}>
                Founded in 1989, Greenfield Academy has been a beacon of quality education,
                producing graduates who lead in every field. Our holistic approach combines
                rigorous academics with character development and creative exploration.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                {[
                  { num: `${counters.years}+`, label: 'Years of Excellence' },
                  { num: '15,000+', label: 'Alumni Worldwide' },
                  { num: '200+', label: 'Awards Won' },
                  { num: '98%', label: 'University Placement' }
                ].map((s, i) => (
                  <div key={i} style={{ textAlign: 'center', background: 'var(--gray-50)', borderRadius: 12, padding: 20, border: '1px solid var(--gray-200)' }}>
                    <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--gold)', fontFamily: 'Playfair Display, serif' }}>{s.num}</div>
                    <div style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: 'linear-gradient(135deg, var(--navy), #1a2a50)', borderRadius: 24, padding: 40, color: 'white' }}>
              <h3 style={{ fontSize: 22, marginBottom: 24, color: 'var(--gold)' }}>Our Vision & Mission</h3>
              {[
                { icon: '🌟', title: 'Vision', text: 'To be a globally recognized institution that nurtures future leaders with integrity and excellence.' },
                { icon: '🎯', title: 'Mission', text: 'Providing quality education through innovative teaching and a supportive environment.' },
                { icon: '💎', title: 'Values', text: 'Integrity, Excellence, Respect, Innovation, and Community — guiding everything we do.' }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
                  <span style={{ fontSize: 28 }}>{item.icon}</span>
                  <div>
                    <h4 style={{ color: 'var(--gold)', marginBottom: 6, fontFamily: 'DM Sans, sans-serif' }}>{item.title}</h4>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 1.7 }}>{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAMS */}
      <section className="section dark-section" id="academics">
        <div className="section-inner">
          <div className="text-center mb-32">
            <div className="section-tag">Our Programs</div>
            <h2 className="section-title">World-Class Curriculum</h2>
          </div>
          <div className="card-grid card-grid-3">
            {programs.map((p, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 32, transition: 'all 0.3s ease', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(-6px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'none'; }}
              >
                <div style={{ fontSize: 40, marginBottom: 16 }}>{p.icon}</div>
                <h3 style={{ color: 'white', fontFamily: 'DM Sans, sans-serif', fontSize: 18, marginBottom: 10 }}>{p.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, lineHeight: 1.7 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PORTALS */}
      <section style={{ background: 'var(--gray-100)', padding: '80px 24px' }}>
        <div className="section-inner">
          <div className="text-center mb-32">
            <div className="section-tag">Digital Campus</div>
            <h2 className="section-title">Everything You Need, Online</h2>
          </div>
          <div className="card-grid card-grid-3">
            {[
              { icon: '📝', title: 'Online Admission', desc: 'Apply for admission online with our streamlined multi-step process. Track your application in real-time.', link: '/admission', cta: 'Apply Now', color: 'gold' },
              { icon: '📊', title: 'Student Portal', desc: 'Access attendance records, exam results, notices, and academic performance from anywhere.', link: '/login', cta: 'Student Login', color: 'teal' },
              { icon: '👨‍🏫', title: 'Teacher Portal', desc: 'Mark attendance, upload results, post notices, and manage your classroom efficiently.', link: '/login', cta: 'Teacher Login', color: 'crimson' }
            ].map((p, i) => (
              <div key={i} className="card">
                <div className={`card-icon ${p.color}`}><span style={{ filter: 'brightness(10)' }}>{p.icon}</span></div>
                <h3>{p.title}</h3>
                <p style={{ marginBottom: 24 }}>{p.desc}</p>
                <Link to={p.link} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>{p.cta} →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NOTICES */}
      <section className="section" style={{ background: 'white' }}>
        <div className="section-inner">
          <div style={{ marginBottom: 32 }}>
            <div className="section-tag">Latest Updates</div>
            <h2 className="section-title">Notices & Announcements</h2>
          </div>
          <div style={{ display: 'grid', gap: 16 }}>
            {notices.map((n, i) => (
              <div key={n.id} className={`notice-card ${n.category}`}>
                <div className="notice-category">{n.category.toUpperCase()}</div>
                <h3 className="notice-title">{n.title}</h3>
                <p className="notice-content">{n.content}</p>
                <p className="notice-date">📅 {n.date}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="section dark-section" id="contact">
        <div className="section-inner">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60 }}>
            <div>
              <div className="section-tag">Get In Touch</div>
              <h2 className="section-title">Contact Us</h2>
              {[
                { icon: '📍', label: 'Address', val: '123 Academy Road, Education District, Dhaka 1212' },
                { icon: '📞', label: 'Phone', val: '+880 1234-567890' },
                { icon: '✉️', label: 'Email', val: 'info@greenfieldacademy.edu.bd' },
                { icon: '⏰', label: 'Office Hours', val: 'Sun–Thu: 8:00 AM – 4:00 PM' }
              ].map((c, i) => (
                <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
                  <span style={{ fontSize: 24 }}>{c.icon}</span>
                  <div>
                    <div style={{ color: 'var(--gold)', fontSize: 13, fontWeight: 700 }}>{c.label}</div>
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, marginTop: 2 }}>{c.val}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 20, padding: 32 }}>
              <h3 style={{ color: 'white', marginBottom: 24, fontFamily: 'DM Sans, sans-serif' }}>Send a Message</h3>
              <input placeholder="Your Name" style={{ marginBottom: 16, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', width: '100%', padding: '12px 16px', borderRadius: 10, fontFamily: 'DM Sans, sans-serif', fontSize: 15 }} />
              <input placeholder="Your Email" style={{ marginBottom: 16, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', width: '100%', padding: '12px 16px', borderRadius: 10, fontFamily: 'DM Sans, sans-serif', fontSize: 15 }} />
              <textarea placeholder="Your message..." rows={4} style={{ marginBottom: 16, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', width: '100%', padding: '12px 16px', borderRadius: 10, fontFamily: 'DM Sans, sans-serif', fontSize: 15, resize: 'vertical' }} />
              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Send Message ✉️</button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-grid">
            <div className="footer-brand">
              <h3>🏛️ Greenfield Academy</h3>
              <p>Shaping the leaders of tomorrow through exceptional education since 1989.</p>
            </div>
            <div className="footer-col">
              <h4>Quick Links</h4>
              <Link to="/">Home</Link>
              <Link to="/#about">About Us</Link>
              <Link to="/#academics">Academics</Link>
            </div>
            <div className="footer-col">
              <h4>Portals</h4>
              <Link to="/admission">Apply Now</Link>
              <Link to="/login">Student Login</Link>
              <Link to="/login">Teacher Login</Link>
            </div>
            <div className="footer-col">
              <h4>Contact</h4>
              <span style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>📞 +880 1234-567890</span>
              <span style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>✉️ info@greenfield.edu.bd</span>
              <span style={{ display: 'block', fontSize: 14 }}>📍 Dhaka, Bangladesh</span>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2024 Greenfield Academy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
